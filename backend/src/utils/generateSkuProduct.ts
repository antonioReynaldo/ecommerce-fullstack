import { randomBytes } from 'node:crypto';

export const generateSkuProduct = (nameCategory: string) => {
  const categoriaLimpia = nameCategory
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  const prefijo = categoriaLimpia.slice(0, 3);

  const aleatorio = randomBytes(4).toString('hex').toUpperCase();

  return `${prefijo}-${aleatorio}`;
};
