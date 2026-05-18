import { act, renderHook, waitFor } from "@testing-library/react-native";

import type { Category, Transaction } from "../src/domain/types";
import { useTransactions } from "../src/hooks/useTransactions";
import type { TransactionRepository } from "../src/repositories";
import { transactionsStorage } from "../src/storage/transactionsStorage";

jest.mock("../src/storage/transactionsStorage", () => ({
	transactionsStorage: {
		getAll: jest.fn(),
		saveAll: jest.fn(),
	},
}));

jest.mock("../src/storage/categoriesStorage", () => ({
	categoriesStorage: {
		getAll: jest.fn(),
		saveAll: jest.fn(),
	},
}));

jest.mock("../src/storage/demoSeed", () => ({
	seedDemoDataIfEmpty: jest.fn().mockResolvedValue(false),
}));

const mockedTransactionsStorage = transactionsStorage as jest.Mocked<
	typeof transactionsStorage
>;

describe("useTransactions", () => {
	const categories: Category[] = [
		{ id: "cat-1", name: "Salario", type: "income", color: "#85C79A" },
		{ id: "cat-2", name: "Comida", type: "expense", color: "#EDF7BD" },
		{ id: "cat-3", name: "Transporte", type: "expense", color: "#4E8D9C" },
	];

	beforeEach(() => {
		jest.clearAllMocks();
		delete process.env.EXPO_PUBLIC_CASHI_API_BASE_URL;
		delete process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE;
	});

	it("loads transactions and exposes category name for display", async () => {
		const seed: Transaction[] = [
			{
				id: "tx-1",
				amount: 1500,
				type: "income",
				description: "Sueldo",
				date: "2026-05-11",
				categoryId: "cat-1",
			},
		];
		mockedTransactionsStorage.getAll.mockResolvedValueOnce(seed);

		const { result } = renderHook(() => useTransactions({ categories }));

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.transactions).toEqual(seed);
		expect(result.current.transactionsWithCategory[0].categoryName).toBe(
			"Salario",
		);
	});

	it("creates, updates and deletes a transaction while persisting", async () => {
		mockedTransactionsStorage.getAll
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([
				{
					id: expect.any(String) as unknown as string,
					amount: 350,
					type: "expense",
					description: "Supermercado",
					date: "2026-05-12",
					categoryId: "cat-2",
				},
			])
			.mockResolvedValueOnce([
				{
					id: expect.any(String) as unknown as string,
					amount: 370,
					type: "expense",
					description: "Supermercado extra",
					date: "2026-05-13",
					categoryId: "cat-2",
				},
			]);
		mockedTransactionsStorage.saveAll.mockResolvedValue();

		const { result } = renderHook(() => useTransactions({ categories }));
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.createTransaction({
				amount: 350,
				type: "expense",
				description: "Supermercado",
				date: "2026-05-12",
				categoryId: "cat-2",
			});
		});

		expect(result.current.transactions).toHaveLength(1);
		const createdId = result.current.transactions[0].id;

		await act(async () => {
			await result.current.updateTransaction(createdId, {
				amount: 370,
				type: "expense",
				description: "Supermercado extra",
				date: "2026-05-13",
				categoryId: "cat-2",
			});
		});

		expect(result.current.transactions[0].amount).toBe(370);
		expect(result.current.transactions[0].description).toBe(
			"Supermercado extra",
		);

		await act(async () => {
			await result.current.deleteTransaction(createdId);
		});

		expect(result.current.transactions).toEqual([]);
		expect(mockedTransactionsStorage.saveAll).toHaveBeenCalledTimes(3);
	});

	it("returns fallback category name when relation is missing", async () => {
		mockedTransactionsStorage.getAll.mockResolvedValueOnce([
			{
				id: "tx-7",
				amount: 90,
				type: "expense",
				description: "Peaje",
				date: "2026-05-10",
				categoryId: "cat-404",
			},
		]);

		const { result } = renderHook(() => useTransactions({ categories }));
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.transactionsWithCategory[0].categoryName).toBe(
			"Sin categoría",
		);
	});

	it("computes balance summary from income and expense transactions", async () => {
		mockedTransactionsStorage.getAll.mockResolvedValueOnce([
			{
				id: "tx-11",
				amount: 2000,
				type: "income",
				description: "Sueldo",
				date: "2026-05-01",
				categoryId: "cat-1",
			},
			{
				id: "tx-12",
				amount: 350,
				type: "expense",
				description: "Super",
				date: "2026-05-03",
				categoryId: "cat-2",
			},
			{
				id: "tx-13",
				amount: 150,
				type: "expense",
				description: "Taxi",
				date: "2026-05-04",
				categoryId: "cat-2",
			},
		]);

		const { result } = renderHook(() => useTransactions({ categories }));
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.totalIncome).toBe(2000);
		expect(result.current.totalExpense).toBe(500);
		expect(result.current.balance).toBe(1500);
	});

	it("returns the expense category with the highest spend", async () => {
		mockedTransactionsStorage.getAll.mockResolvedValueOnce([
			{
				id: "tx-food",
				amount: 42000,
				type: "expense",
				description: "Supermercado",
				date: "2026-05-15",
				categoryId: "cat-2",
			},
			{
				id: "tx-transport",
				amount: 11500,
				type: "expense",
				description: "Transporte semanal",
				date: "2026-05-14",
				categoryId: "cat-3",
			},
			{
				id: "tx-income",
				amount: 1250000,
				type: "income",
				description: "Sueldo mensual",
				date: "2026-05-01",
				categoryId: "cat-1",
			},
		]);

		const { result } = renderHook(() => useTransactions({ categories }));
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.primaryExpenseCategory).toEqual({
			id: "cat-2",
			name: "Comida",
			color: "#EDF7BD",
			amount: 42000,
		});
	});

	it("uses an injected repository and preserves derived balance/category projection", async () => {
		const repositoryTransactions: Transaction[] = [
			{
				id: "repo-income",
				amount: 1000,
				type: "income",
				description: "Sueldo",
				date: "2026-05-01",
				categoryId: "cat-1",
			},
			{
				id: "repo-expense",
				amount: 250,
				type: "expense",
				description: "Cena",
				date: "2026-05-02",
				categoryId: "cat-2",
			},
		];
		const repository: jest.Mocked<TransactionRepository> = {
			getAll: jest.fn().mockResolvedValue(repositoryTransactions),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		};

		const { result } = renderHook(() =>
			useTransactions({ categories, repository }),
		);
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.transactions).toEqual(repositoryTransactions);
		expect(result.current.transactionsWithCategory[1].categoryName).toBe(
			"Comida",
		);
		expect(result.current.totalIncome).toBe(1000);
		expect(result.current.totalExpense).toBe(250);
		expect(result.current.balance).toBe(750);
		expect(mockedTransactionsStorage.getAll).not.toHaveBeenCalled();
	});

	it("sets an error instead of crashing when backend source has no base URL", async () => {
		const { result } = renderHook(() =>
			useTransactions({ categories, dataSource: "backend" }),
		);

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.error).toBe(
			"La conexión con el backend no está configurada correctamente.",
		);
		expect(result.current.transactions).toEqual([]);
	});

	it("sets save and delete errors for repository mutation failures", async () => {
		const repository: jest.Mocked<TransactionRepository> = {
			getAll: jest.fn().mockResolvedValue([]),
			create: jest.fn().mockRejectedValue(new Error("create failed")),
			update: jest.fn(),
			delete: jest.fn().mockRejectedValue(new Error("delete failed")),
		};

		const { result } = renderHook(() =>
			useTransactions({ categories, repository }),
		);
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await expect(
				result.current.createTransaction({
					amount: 350,
					type: "expense",
					description: "Supermercado",
					date: "2026-05-12",
					categoryId: "cat-2",
				}),
			).rejects.toThrow("create failed");
		});
		expect(result.current.error).toBe(
			"No se pudo guardar la transacción. Intentá nuevamente.",
		);

		await act(async () => {
			await expect(result.current.deleteTransaction("tx-1")).rejects.toThrow(
				"delete failed",
			);
		});
		expect(result.current.error).toBe(
			"No se pudo eliminar la transacción. Intentá nuevamente.",
		);
	});
});
