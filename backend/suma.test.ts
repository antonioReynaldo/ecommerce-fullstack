import { describe, it, expect } from 'vitest';

function sumar(a: number, b: number) {
  return a + b;
}

describe('sumar', () => {
  it('debe sumar 2 + 2 = 4', () => {
    const resultado = sumar(2, 2);
    expect(resultado).toBe(4);
  });

  it('debería sumar números negativos', () => {
    const resultado = sumar(-1, -1);
    expect(resultado).toBe(-2);
  });

  it('test a propósito mal (para ver un fallo)', () => {
    const resultado = sumar(2, 2);
    expect(resultado).toBe(5);
  });
});
