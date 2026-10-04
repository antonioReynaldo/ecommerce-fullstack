// ejecutar con (pnpm exec tsx pruebas.ts) en la terminal
import 'dotenv/config';
import { prisma } from './src/lib/prisma';
import { generateSkuProduct } from './src/utils/generateSkuProduct';

async function generateSku(idCategory: number) {
  const category = await prisma.category.findUnique({
    where: {
      id: idCategory
    }
  });

  if (!category) return console.log('la categoria no existe');

  const sku = generateSkuProduct(category.name);

  return console.log(sku);
}

await generateSku(500);
