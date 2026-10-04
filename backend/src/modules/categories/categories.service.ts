import type {
  CreateCategoryType,
  CategoryUpdateType,
  CategoryQueryType,
  CreateCategoryAttributeType,
  UpdateCategoryAttributesType
} from './categories.schema.js';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../errors/AppError.js';
import type { CategoryMapType, ObjectCategory } from '../../types/typesCategory.js';
import { Prisma } from '../../generated/prisma/client.js';
import { generateKey } from '../../utils/generateKey.js';

// Helper: evita repetir findUnique + notFound en cada método
const getCategoryOrThrow = async (idCategory: number) => {
  const category = await prisma.category.findUnique({ where: { id: idCategory } });

  if (!category) throw AppError.notFound('La categoría no existe');

  return category;
};

// Helper: busca el atributo y valida que pertenezca a la categoría.
// Un solo mensaje para ambos casos: no revela si el atributo existe en otra categoría.
const getAttributeOrThrow = async (idCategory: number, idAttribute: number) => {
  const attribute = await prisma.categoryAttribute.findUnique({ where: { id: idAttribute } });

  if (!attribute || attribute.categoryId !== idCategory) {
    throw AppError.notFound('El atributo no existe en esta categoría');
  }

  return attribute;
};

export const categoriesService = {
  // Crear categoria
  async createCategory(dataCategory: CreateCategoryType) {
    if (dataCategory.parentId !== undefined && dataCategory.parentId !== null) {
      const parentExists = await prisma.category.findUnique({ where: { id: dataCategory.parentId } });

      if (!parentExists) throw AppError.badRequest('La categoría padre especificada no existe');
    }

    const conflict = await prisma.category.findFirst({
      where: {
        name: dataCategory.name,
        parentId: dataCategory.parentId ?? null
      }
    });

    if (conflict) throw AppError.conflict('Ya existe una categoría con este nombre bajo el mismo padre');

    return prisma.category.create({
      data: {
        name: dataCategory.name,
        description: dataCategory.description ?? null,
        parentId: dataCategory.parentId ?? null
      }
    });
  },

  // Categorias visibles (ninguno de sus ancestros está desactivado)
  async getVisibleCategories() {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

    const mapCategories = new Map<number, (typeof categories)[number]>();

    for (const category of categories) {
      mapCategories.set(category.id, category);
    }

    const isVisible = (idCategory: number): boolean => {
      let current: number | null = idCategory;

      while (current !== null) {
        const fila = mapCategories.get(current);

        if (!fila) return false;
        if (!fila.isActive) return false;

        current = fila.parentId;
      }

      return true;
    };

    return categories.filter((category) => isVisible(category.id));
  },

  // Categorias en arbol
  async getCategoriesTree() {
    const categories = await categoriesService.getVisibleCategories();

    const mapCategories = new Map<number, ObjectCategory>();
    const categoryTree: ObjectCategory[] = [];

    for (const category of categories) {
      mapCategories.set(category.id, { id: category.id, name: category.name, children: [] });
    }

    for (const category of categories) {
      const node = mapCategories.get(category.id);

      if (!node) continue;

      if (category.parentId === null) {
        categoryTree.push(node);
      } else {
        const father = mapCategories.get(category.parentId);

        if (father) {
          father.children.push(node);
        }
      }
    }

    return categoryTree;
  },

  // Todas las categorias (activas e inactivas), paginadas
  async getCategoriesAll(filters: CategoryQueryType) {
    const { isActive, search, page, limit } = filters;

    const where: Prisma.CategoryWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...(search !== undefined && { name: { contains: search, mode: 'insensitive' } })
    };

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'asc' },
        select: { id: true, name: true, description: true, imageUrl: true, isActive: true, parentId: true }
      }),
      prisma.category.count({ where })
    ]);

    return {
      data: categories,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  },

  // Migas de pan (raíz → categoría actual)
  async getCategoryBreadcrumb(idCategory: number) {
    const categories = await categoriesService.getVisibleCategories();
    const mapCategories = new Map<number, CategoryMapType>();

    for (const category of categories) {
      mapCategories.set(category.id, { id: category.id, name: category.name, parentId: category.parentId });
    }

    const categoryBreadcrumb: CategoryMapType[] = [];
    let current: number | null = idCategory;

    while (current !== null) {
      const fila = mapCategories.get(current);

      if (!fila) throw AppError.notFound('La categoría no existe');

      categoryBreadcrumb.push(fila);

      current = fila.parentId;
    }

    return categoryBreadcrumb.reverse();
  },

  // Una sola categoria
  async getCategoryById(idCategory: number) {
    const category = await prisma.category.findUnique({
      where: { id: idCategory },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        imageUrl: true,
        parentId: true
      }
    });

    if (!category) throw AppError.notFound('La categoría no existe');

    return category;
  },

  // Actualizar categoria
  async updateCategory(idCategory: number, dataCategory: CategoryUpdateType) {
    const { name, description, parentId } = dataCategory;

    const category = await getCategoryOrThrow(idCategory);

    // Validar padre + evitar ciclos con UNA sola query
    if (parentId !== undefined && parentId !== null) {
      const all = await prisma.category.findMany({ select: { id: true, parentId: true } });
      const parents = new Map<number, number | null>(all.map((c): [number, number | null] => [c.id, c.parentId]));

      if (!parents.has(parentId)) throw AppError.badRequest('La categoría padre especificada no existe');

      for (let current: number | null = parentId; current !== null; current = parents.get(current) ?? null) {
        if (current === category.id) throw AppError.conflict('La jerarquía de la categoría no es válida');
      }
    }

    // Evitar duplicados bajo el mismo padre
    if (name !== undefined || parentId !== undefined) {
      const siblingConflict = await prisma.category.findFirst({
        where: {
          parentId: parentId !== undefined ? parentId : category.parentId,
          name: name ?? category.name,
          id: { not: category.id }
        },
        select: { id: true }
      });

      if (siblingConflict) {
        throw AppError.conflict('Ya existe una categoría con ese nombre bajo el mismo padre');
      }
    }

    return prisma.category.update({
      where: { id: category.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(parentId !== undefined && { parentId })
      },
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
        isActive: true
      }
    });
  },

  // Activar o desactivar categoria
  async updateStatusCategory(idCategory: number, status: boolean) {
    const category = await getCategoryOrThrow(idCategory);

    return prisma.category.update({
      where: { id: category.id },
      data: { isActive: status },
      select: { isActive: true }
    });
  },

  // Actualizar imageUrl
  async updateCategoryImageUrl(idCategory: number, imageUrl: string | null) {
    const category = await getCategoryOrThrow(idCategory);

    return prisma.category.update({
      where: { id: category.id },
      data: { imageUrl },
      select: { id: true, imageUrl: true }
    });
  },

  // Eliminar categoria
  async deleteCategory(idCategory: number) {
    const category = await getCategoryOrThrow(idCategory);

    const [subcategories, products] = await Promise.all([
      prisma.category.count({ where: { parentId: category.id } }),
      prisma.product.count({ where: { categoryId: category.id } })
    ]);

    if (subcategories > 0) throw AppError.conflict('No se puede eliminar esta categoría, tiene subcategorías');
    if (products > 0) throw AppError.conflict('No se puede eliminar esta categoría, tiene productos');

    await prisma.category.delete({ where: { id: category.id } });
  },

  // Crear atributo de la categoria
  async createCategoryAttribute(idCategory: number, dataAttribute: CreateCategoryAttributeType) {
    const category = await getCategoryOrThrow(idCategory);

    const key = generateKey(dataAttribute.name);

    if (!key) throw AppError.badRequest('El nombre del atributo debe contener letras o números');

    const keyConflict = await prisma.categoryAttribute.findFirst({
      where: { categoryId: category.id, key },
      select: { id: true }
    });

    if (keyConflict) throw AppError.conflict('Ya existe un atributo con ese nombre en esta categoría');

    return prisma.categoryAttribute.create({
      data: {
        name: dataAttribute.name,
        key,
        type: dataAttribute.type,
        required: dataAttribute.required ?? false,
        options: dataAttribute.options ?? [],
        categoryId: category.id
      }
    });
  },

  // Atributos de la categoria
  async getCategoryAttributes(idCategory: number) {
    const category = await getCategoryOrThrow(idCategory);

    return prisma.categoryAttribute.findMany({
      where: { categoryId: category.id },
      orderBy: { id: 'asc' }
    });
  },

  // Actualizar atributo de la categoria
  async updateCategoryAttribute(idCategory: number, idAttribute: number, dataAttribute: UpdateCategoryAttributesType) {
    const category = await getCategoryOrThrow(idCategory);
    const attribute = await getAttributeOrThrow(category.id, idAttribute);

    const { name, required, type, options } = dataAttribute;

    // No cambiar el tipo si ya hay productos con valores guardados
    if (type !== undefined && type !== attribute.type) {
      const inUse = await prisma.productAttributeValue.findFirst({
        where: { categoryAttributeId: attribute.id },
        select: { id: true }
      });

      if (inUse) throw AppError.conflict('No se puede cambiar el tipo, hay productos que ya usan este atributo');
    }

    // Consistencia type <-> options
    const effectiveType = type ?? attribute.type;

    if (effectiveType !== 'SELECT' && options !== undefined && options.length > 0) {
      throw AppError.badRequest('Solo los atributos de tipo SELECT admiten opciones');
    }

    const effectiveOptions = effectiveType === 'SELECT' ? (options ?? attribute.options) : [];

    if (effectiveType === 'SELECT' && effectiveOptions.length === 0) {
      throw AppError.badRequest('Un atributo de tipo SELECT requiere al menos una opción');
    }

    if (effectiveType === 'SELECT' && options !== undefined) {
      const removed = attribute.options.filter((option) => !options.includes(option));

      if (removed.length > 0) {
        const inUse = await prisma.productAttributeValue.findFirst({
          where: { categoryAttributeId: attribute.id, value: { in: removed } },
          select: { id: true }
        });

        if (inUse) throw AppError.conflict('No se puede quitar una opción que ya usan productos');
      }
    }

    // La key NO se regenera al renombrar: es el identificador estable del atributo
    const dataToUpdate: Prisma.CategoryAttributeUpdateInput = {
      ...(name !== undefined && { name }),
      ...(required !== undefined && { required }),
      ...(type !== undefined && { type }),
      options: effectiveOptions
    };

    return prisma.categoryAttribute.update({
      where: { id: attribute.id },
      data: dataToUpdate
    });
  },

  // Eliminar atributo de la categoria
  async deleteCategoryAttribute(idCategory: number, idAttribute: number) {
    const category = await getCategoryOrThrow(idCategory);
    const attribute = await getAttributeOrThrow(category.id, idAttribute);

    const inUse = await prisma.productAttributeValue.count({
      where: { categoryAttributeId: attribute.id }
    });

    if (inUse > 0) throw AppError.conflict('No se puede eliminar este atributo, hay productos que lo están usando');

    await prisma.categoryAttribute.delete({ where: { id: attribute.id } });
  }
};
