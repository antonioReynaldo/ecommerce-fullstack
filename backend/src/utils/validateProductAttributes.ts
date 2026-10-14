import { AppError } from '../errors/AppError.js';

type CategoryAttributeDefinition = {
  id: number;
  name: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  required: boolean;
  options: string[];
};

type AttributeInput = {
  categoryAttributeId: number;
  value: string;
};

export const validateProductAttributes = (
  categoryAttributes: CategoryAttributeDefinition[],
  attributes: AttributeInput[],
  checkRequired: boolean
) => {
  const usedIds = new Set<number>();

  for (const attribute of attributes) {
    // El atributo debe pertenecer a la categoría
    const definition = categoryAttributes.find((item) => item.id === attribute.categoryAttributeId);

    if (!definition) {
      throw AppError.badRequest(`El atributo ${attribute.categoryAttributeId} no pertenece a la categoria`);
    }

    // No se puede repetir el mismo atributo
    if (usedIds.has(definition.id)) {
      throw AppError.badRequest(`El atributo "${definition.name}" esta repetido`);
    }

    usedIds.add(definition.id);

    // El valor debe encajar con el type del atributo
    if (definition.type === 'NUMBER' && !Number.isFinite(Number(attribute.value))) {
      throw AppError.badRequest(`"${definition.name}" debe ser un numero`);
    }

    if (definition.type === 'BOOLEAN' && attribute.value !== 'true' && attribute.value !== 'false') {
      throw AppError.badRequest(`"${definition.name}" debe ser true o false`);
    }

    if (definition.type === 'SELECT' && !definition.options.includes(attribute.value)) {
      throw AppError.badRequest(`"${definition.name}" debe ser una de estas opciones: ${definition.options.join(', ')}`);
    }
  }

  // Deben venir todos los obligatorios (solo se exige al crear)
  if (checkRequired) {
    for (const definition of categoryAttributes) {
      if (definition.required && !usedIds.has(definition.id)) {
        throw AppError.badRequest(`El atributo "${definition.name}" es obligatorio`);
      }
    }
  }
};
