import { CATEGORY_COLORS } from '../src/domain/types';
import { ApiClientError } from '../src/api/errors';
import {
  mapBalanceDtoToDomain,
  mapCategoryDomainToCreateDto,
  mapCategoryDomainToUpdateDto,
  mapCategoryDtoToDomain,
  mapMobileIdToBackendId,
  mapTransactionDomainToCreateDto,
  mapTransactionDomainToUpdateDto,
  mapTransactionDtoToDomain,
} from '../src/api/mappers';

describe('API mappers', () => {
  it('maps category DTOs to domain and preserves type/color', () => {
    expect(
      mapCategoryDtoToDomain({ id: 7, name: 'Transporte', type: 'expense', color: CATEGORY_COLORS.teal }),
    ).toEqual({ id: '7', name: 'Transporte', type: 'expense', color: CATEGORY_COLORS.teal });
  });

  it('maps category domain inputs to create/update DTOs with trimmed names', () => {
    expect(mapCategoryDomainToCreateDto({ name: '  Sueldo  ', type: 'income', color: CATEGORY_COLORS.green })).toEqual({
      name: 'Sueldo',
      type: 'income',
      color: CATEGORY_COLORS.green,
    });
    expect(mapCategoryDomainToUpdateDto({ name: '  Comida  ' })).toEqual({ name: 'Comida' });
  });

  it('maps transaction DTOs to domain with string ids and empty description fallback', () => {
    expect(
      mapTransactionDtoToDomain({
        id: 11,
        amount: 12500,
        type: 'expense',
        description: null,
        date: '2026-05-18T00:00:00.000Z',
        categoryId: 3,
        category: { id: 3, name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime },
      }),
    ).toEqual({
      id: '11',
      amount: 12500,
      type: 'expense',
      description: '',
      date: '2026-05-18T00:00:00.000Z',
      categoryId: '3',
    });
  });

  it('maps transaction domain inputs outbound and omits blank descriptions', () => {
    expect(
      mapTransactionDomainToCreateDto({
        amount: 9000,
        type: 'expense',
        description: '  Café  ',
        date: '2026-05-18',
        categoryId: '4',
      }),
    ).toEqual({ amount: 9000, type: 'expense', description: 'Café', date: '2026-05-18', categoryId: 4 });

    expect(mapTransactionDomainToUpdateDto({ description: '   ', categoryId: '5' })).toEqual({ categoryId: 5 });
  });

  it('omits local-only metadata from transaction create and update DTOs', () => {
    expect(
      mapTransactionDomainToCreateDto({
        amount: 9000,
        type: 'expense',
        description: '  Café  ',
        date: '2026-05-18',
        categoryId: '4',
        photoUri: 'file:///receipt.jpg',
        location: { latitude: -33.44, longitude: -70.65 },
      }),
    ).toEqual({ amount: 9000, type: 'expense', description: 'Café', date: '2026-05-18', categoryId: 4 });

    expect(
      mapTransactionDomainToUpdateDto({
        description: 'Metro',
        categoryId: '5',
        photoUri: 'file:///metro.jpg',
        location: { latitude: -33.45, longitude: -70.66 },
      }),
    ).toEqual({ description: 'Metro', categoryId: 5 });
  });

  it('rejects invalid outbound ids with a typed error', () => {
    expect(() => mapMobileIdToBackendId('abc')).toThrow(ApiClientError);
    expect(() => mapTransactionDomainToCreateDto({ amount: 1, type: 'income', description: '', date: '2026-05-18', categoryId: '-1' })).toThrow(ApiClientError);
  });

  it('maps balance DTOs directly', () => {
    expect(mapBalanceDtoToDomain({ totalIncome: 1000, totalExpense: 250, balance: 750 })).toEqual({
      totalIncome: 1000,
      totalExpense: 250,
      balance: 750,
    });
  });
});
