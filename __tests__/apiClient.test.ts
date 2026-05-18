import { ApiClientError } from '../src/api/errors';
import { createCashiApiClient } from '../src/api/client';
import { CATEGORY_COLORS } from '../src/domain/types';

const jsonResponse = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockResolvedValue(body),
});

const rejectedJsonResponse = (status: number) => ({
  ok: status >= 200 && status < 300,
  status,
  json: jest.fn().mockRejectedValue(new Error('bad json')),
});

describe('Cashi API client', () => {
  it('constructs GET requests without double slashes', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse(200, { status: 'ok' }));
    const client = createCashiApiClient({ baseUrl: 'http://10.0.2.2:3000/', fetchImpl });

    await expect(client.health()).resolves.toEqual({ status: 'ok' });

    expect(fetchImpl).toHaveBeenCalledWith('http://10.0.2.2:3000/health', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  });

  it('constructs category CRUD requests with JSON bodies where needed', async () => {
    const category = { id: 1, name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime };
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse(200, category));
    const client = createCashiApiClient({ baseUrl: 'https://api.cashi.test', fetchImpl });

    await client.getCategory(1);
    await client.createCategory({ name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime });
    await client.updateCategory(1, { color: CATEGORY_COLORS.purple });
    await client.deleteCategory(1);

    expect(fetchImpl).toHaveBeenNthCalledWith(1, 'https://api.cashi.test/categories/1', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    expect(fetchImpl).toHaveBeenNthCalledWith(2, 'https://api.cashi.test/categories', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Comida', type: 'expense', color: CATEGORY_COLORS.lime }),
    });
    expect(fetchImpl).toHaveBeenNthCalledWith(3, 'https://api.cashi.test/categories/1', {
      method: 'PATCH',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ color: CATEGORY_COLORS.purple }),
    });
    expect(fetchImpl).toHaveBeenNthCalledWith(4, 'https://api.cashi.test/categories/1', {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
  });

  it('constructs transaction CRUD and balance requests', async () => {
    const transaction = {
      id: 2,
      amount: 500,
      type: 'expense',
      description: 'Taxi',
      date: '2026-05-18T00:00:00.000Z',
      categoryId: 1,
      category: { id: 1, name: 'Transporte', type: 'expense', color: CATEGORY_COLORS.teal },
    };
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(jsonResponse(200, [transaction]))
      .mockResolvedValueOnce(jsonResponse(201, transaction))
      .mockResolvedValueOnce(jsonResponse(200, transaction))
      .mockResolvedValueOnce(jsonResponse(200, transaction))
      .mockResolvedValueOnce(jsonResponse(200, { totalIncome: 1000, totalExpense: 500, balance: 500 }));
    const client = createCashiApiClient({ baseUrl: 'https://api.cashi.test', fetchImpl });

    await client.getTransactions();
    await client.createTransaction({ amount: 500, type: 'expense', description: 'Taxi', date: '2026-05-18', categoryId: 1 });
    await client.updateTransaction(2, { description: 'Taxi app' });
    await client.deleteTransaction(2);
    await expect(client.getBalance()).resolves.toEqual({ totalIncome: 1000, totalExpense: 500, balance: 500 });

    expect(fetchImpl.mock.calls.map(([url, init]) => [url, init.method])).toEqual([
      ['https://api.cashi.test/transactions', 'GET'],
      ['https://api.cashi.test/transactions', 'POST'],
      ['https://api.cashi.test/transactions/2', 'PATCH'],
      ['https://api.cashi.test/transactions/2', 'DELETE'],
      ['https://api.cashi.test/transactions/balance', 'GET'],
    ]);
  });

  it.each([
    [400, 'bad_request'],
    [404, 'not_found'],
    [409, 'conflict'],
    [422, 'unprocessable_entity'],
    [500, 'server_error'],
    [418, 'unknown_http_error'],
  ])('normalizes HTTP %i responses', async (status, code) => {
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse(status, { error: 'Backend said no' }));
    const client = createCashiApiClient({ baseUrl: 'https://api.cashi.test', fetchImpl });

    await expect(client.getCategories()).rejects.toMatchObject({
      error: { kind: 'http', status, code, details: { error: 'Backend said no' } },
    });
  });

  it('normalizes network and parse failures', async () => {
    const networkClient = createCashiApiClient({
      baseUrl: 'https://api.cashi.test',
      fetchImpl: jest.fn().mockRejectedValue(new Error('offline')),
    });

    await expect(networkClient.health()).rejects.toMatchObject({ error: { kind: 'network' } });

    const parseClient = createCashiApiClient({
      baseUrl: 'https://api.cashi.test',
      fetchImpl: jest.fn().mockResolvedValue(rejectedJsonResponse(200)),
    });

    await expect(parseClient.health()).rejects.toBeInstanceOf(ApiClientError);
    await expect(parseClient.health()).rejects.toMatchObject({ error: { kind: 'parse' } });
  });
});
