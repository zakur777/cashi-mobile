import {
	CATEGORY_COLORS,
	type Category,
	type Transaction,
} from "../src/domain/types";
import { categoriesStorage } from "../src/storage/categoriesStorage";
import { seedDemoDataIfEmpty } from "../src/storage/demoSeed";
import { transactionsStorage } from "../src/storage/transactionsStorage";
import {
	localCategoryRepository,
	localTransactionRepository,
} from "../src/repositories/localRepositories";

jest.mock("../src/storage/categoriesStorage", () => ({
	categoriesStorage: {
		getAll: jest.fn(),
		saveAll: jest.fn(),
	},
}));

jest.mock("../src/storage/transactionsStorage", () => ({
	transactionsStorage: {
		getAll: jest.fn(),
		saveAll: jest.fn(),
	},
}));

jest.mock("../src/storage/demoSeed", () => ({
	seedDemoDataIfEmpty: jest.fn(),
}));

const mockedCategoriesStorage = categoriesStorage as jest.Mocked<
	typeof categoriesStorage
>;
const mockedTransactionsStorage = transactionsStorage as jest.Mocked<
	typeof transactionsStorage
>;
const mockedSeedDemoDataIfEmpty = seedDemoDataIfEmpty as jest.MockedFunction<
	typeof seedDemoDataIfEmpty
>;

describe("local repositories", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedSeedDemoDataIfEmpty.mockResolvedValue(false);
	});

	it("loads categories through demo seed and applies legacy defaults", async () => {
		mockedCategoriesStorage.getAll.mockResolvedValueOnce([
			{ id: "legacy-1", name: "Legacy" } as Category,
		]);

		await expect(localCategoryRepository.getAll()).resolves.toEqual([
			{
				id: "legacy-1",
				name: "Legacy",
				type: "expense",
				color: CATEGORY_COLORS.lime,
			},
		]);
		expect(mockedSeedDemoDataIfEmpty).toHaveBeenCalledTimes(1);
		expect(mockedCategoriesStorage.getAll).toHaveBeenCalledTimes(1);
	});

	it("creates, updates and deletes categories by persisting full lists", async () => {
		const existing: Category = {
			id: "cat-1",
			name: "Comida",
			type: "expense",
			color: CATEGORY_COLORS.lime,
		};
		mockedCategoriesStorage.getAll
			.mockResolvedValueOnce([existing])
			.mockResolvedValueOnce([existing])
			.mockResolvedValueOnce([existing]);
		mockedCategoriesStorage.saveAll.mockResolvedValue();

		const created = await localCategoryRepository.create({
			name: "  Hogar  ",
			type: "expense",
			color: CATEGORY_COLORS.teal,
		});
		expect(created).toMatchObject({
			name: "Hogar",
			type: "expense",
			color: CATEGORY_COLORS.teal,
		});
		expect(mockedCategoriesStorage.saveAll).toHaveBeenLastCalledWith([
			existing,
			created,
		]);

		const updated = await localCategoryRepository.update("cat-1", {
			name: "  Super  ",
			type: "expense",
			color: CATEGORY_COLORS.purple,
		});
		expect(updated).toEqual({
			id: "cat-1",
			name: "Super",
			type: "expense",
			color: CATEGORY_COLORS.purple,
		});
		expect(mockedCategoriesStorage.saveAll).toHaveBeenLastCalledWith([updated]);

		await localCategoryRepository.delete("cat-1");
		expect(mockedCategoriesStorage.saveAll).toHaveBeenLastCalledWith([]);
	});

	it("loads transactions through demo seed", async () => {
		const transaction: Transaction = {
			id: "tx-1",
			amount: 1200,
			type: "expense",
			description: "Taxi",
			date: "2026-05-18",
			categoryId: "cat-1",
		};
		mockedTransactionsStorage.getAll.mockResolvedValueOnce([transaction]);

		await expect(localTransactionRepository.getAll()).resolves.toEqual([
			transaction,
		]);
		expect(mockedSeedDemoDataIfEmpty).toHaveBeenCalledTimes(1);
		expect(mockedTransactionsStorage.getAll).toHaveBeenCalledTimes(1);
	});

	it("creates, updates and deletes transactions by persisting full lists", async () => {
		const existing: Transaction = {
			id: "tx-1",
			amount: 1200,
			type: "expense",
			description: "Taxi",
			date: "2026-05-18",
			categoryId: "cat-1",
		};
		mockedTransactionsStorage.getAll
			.mockResolvedValueOnce([existing])
			.mockResolvedValueOnce([existing])
			.mockResolvedValueOnce([existing]);
		mockedTransactionsStorage.saveAll.mockResolvedValue();

		const created = await localTransactionRepository.create({
			amount: 5000,
			type: "income",
			description: "Bonus",
			date: "2026-05-19",
			categoryId: "cat-2",
		});
		expect(created).toMatchObject({
			amount: 5000,
			type: "income",
			description: "Bonus",
			date: "2026-05-19",
			categoryId: "cat-2",
		});
		expect(mockedTransactionsStorage.saveAll).toHaveBeenLastCalledWith([
			existing,
			created,
		]);

		const updated = await localTransactionRepository.update("tx-1", {
			amount: 1500,
			type: "expense",
			description: "Taxi plus",
			date: "2026-05-20",
			categoryId: "cat-1",
		});
		expect(updated).toEqual({
			id: "tx-1",
			amount: 1500,
			type: "expense",
			description: "Taxi plus",
			date: "2026-05-20",
			categoryId: "cat-1",
		});
		expect(mockedTransactionsStorage.saveAll).toHaveBeenLastCalledWith([
			updated,
		]);

		await localTransactionRepository.delete("tx-1");
		expect(mockedTransactionsStorage.saveAll).toHaveBeenLastCalledWith([]);
	});

	it("creates and updates local transactions with optional metadata", async () => {
		const existing: Transaction = {
			id: "tx-1",
			amount: 1200,
			type: "expense",
			description: "Taxi",
			date: "2026-05-18",
			categoryId: "cat-1",
		};
		mockedTransactionsStorage.getAll
			.mockResolvedValueOnce([existing])
			.mockResolvedValueOnce([existing]);
		mockedTransactionsStorage.saveAll.mockResolvedValue();

		const created = await localTransactionRepository.create({
			amount: 5000,
			type: "expense",
			description: "Super",
			date: "2026-05-21",
			categoryId: "cat-2",
			photoUri: "file:///receipt-super.jpg",
			location: { latitude: -33.44, longitude: -70.65 },
		});
		expect(created).toMatchObject({
			photoUri: "file:///receipt-super.jpg",
			location: { latitude: -33.44, longitude: -70.65 },
		});
		expect(mockedTransactionsStorage.saveAll).toHaveBeenLastCalledWith([
			existing,
			created,
		]);

		const updated = await localTransactionRepository.update("tx-1", {
			amount: 1300,
			type: "expense",
			description: "Taxi editado",
			date: "2026-05-22",
			categoryId: "cat-1",
			photoUri: "file:///receipt-taxi.jpg",
		});
		expect(updated).toEqual({
			id: "tx-1",
			amount: 1300,
			type: "expense",
			description: "Taxi editado",
			date: "2026-05-22",
			categoryId: "cat-1",
			photoUri: "file:///receipt-taxi.jpg",
		});
		expect(mockedTransactionsStorage.saveAll).toHaveBeenLastCalledWith([
			updated,
		]);
	});
});
