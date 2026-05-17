import { formatCLP, formatSignedCLP } from '../src/domain/money';

describe('CLP money formatting', () => {
  it('formats Chilean pesos without decimals and with dot thousands', () => {
    expect(formatCLP(1250000)).toBe('$1.250.000');
    expect(formatCLP(65500)).toBe('$65.500');
  });

  it('formats signed transaction amounts by type', () => {
    expect(formatSignedCLP(1250000, 'income')).toBe('+$1.250.000');
    expect(formatSignedCLP(42000, 'expense')).toBe('-$42.000');
  });
});
