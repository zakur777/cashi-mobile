import { act, renderHook, waitFor } from "@testing-library/react-native";

import { CATEGORY_COLORS, type Category } from "../src/domain/types";
import { useCategories } from "../src/hooks/useCategories";
import type { CategoryRepository } from "../src/repositories";
import { categoriesStorage } from "../src/storage/categoriesStorage";

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
	seedDemoDataIfEmpty: jest.fn().mockResolvedValue(false),
}));

const mockedCategoriesStorage = categoriesStorage as jest.Mocked<
	typeof categoriesStorage
>;

describe("useCategories", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		delete process.env.EXPO_PUBLIC_CASHI_API_BASE_URL;
		delete process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE;
	});

	it("loads categories on mount", async () => {
		mockedCategoriesStorage.getAll.mockResolvedValueOnce([
			{ id: "1", name: "Comida", type: "expense", color: CATEGORY_COLORS.lime },
		]);

		const { result } = renderHook(() => useCategories());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.categories).toEqual([
			{ id: "1", name: "Comida", type: "expense", color: CATEGORY_COLORS.lime },
		]);
		expect(result.current.error).toBeNull();
	});

	it("applies safe defaults for legacy categories", async () => {
		mockedCategoriesStorage.getAll.mockResolvedValueOnce([
			{ id: "legacy-1", name: "Legacy" } as never,
		]);

		const { result } = renderHook(() => useCategories());

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.categories).toEqual([
			{
				id: "legacy-1",
				name: "Legacy",
				type: "expense",
				color: CATEGORY_COLORS.lime,
			},
		]);
	});

	it("creates a category and persists the new list", async () => {
		mockedCategoriesStorage.getAll
			.mockResolvedValueOnce([])
			.mockResolvedValueOnce([]);
		mockedCategoriesStorage.saveAll.mockResolvedValueOnce();

		const { result } = renderHook(() => useCategories());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.createCategory({
				name: "Hogar",
				type: "expense",
				color: CATEGORY_COLORS.teal,
			});
		});

		expect(result.current.categories).toHaveLength(1);
		expect(result.current.categories[0].name).toBe("Hogar");
		expect(result.current.categories[0].type).toBe("expense");
		expect(result.current.categories[0].color).toBe(CATEGORY_COLORS.teal);
		expect(mockedCategoriesStorage.saveAll).toHaveBeenCalledTimes(1);
	});

	it("updates and deletes an existing category", async () => {
		mockedCategoriesStorage.getAll
			.mockResolvedValueOnce([
				{
					id: "1",
					name: "Comida",
					type: "expense",
					color: CATEGORY_COLORS.lime,
				},
			])
			.mockResolvedValueOnce([
				{
					id: "1",
					name: "Comida",
					type: "expense",
					color: CATEGORY_COLORS.lime,
				},
			])
			.mockResolvedValueOnce([
				{
					id: "1",
					name: "Supermercado",
					type: "expense",
					color: CATEGORY_COLORS.lime,
				},
			]);
		mockedCategoriesStorage.saveAll.mockResolvedValue();

		const { result } = renderHook(() => useCategories());
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await result.current.updateCategory("1", {
				name: "Supermercado",
				type: "expense",
				color: CATEGORY_COLORS.lime,
			});
		});

		expect(result.current.categories).toEqual([
			{
				id: "1",
				name: "Supermercado",
				type: "expense",
				color: CATEGORY_COLORS.lime,
			},
		]);

		await act(async () => {
			await result.current.deleteCategory("1");
		});

		expect(result.current.categories).toEqual([]);
		expect(mockedCategoriesStorage.saveAll).toHaveBeenCalledTimes(2);
	});

	it("uses an injected repository instead of local storage", async () => {
		const repositoryCategory: Category = {
			id: "repo-1",
			name: "Backend opt-in",
			type: "income",
			color: CATEGORY_COLORS.green,
		};
		const repository: jest.Mocked<CategoryRepository> = {
			getAll: jest.fn().mockResolvedValue([repositoryCategory]),
			create: jest.fn().mockResolvedValue(repositoryCategory),
			update: jest.fn(),
			delete: jest.fn(),
		};

		const { result } = renderHook(() => useCategories({ repository }));
		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.categories).toEqual([repositoryCategory]);
		expect(repository.getAll).toHaveBeenCalledTimes(1);
		expect(mockedCategoriesStorage.getAll).not.toHaveBeenCalled();
	});

	it("sets an error instead of crashing when backend source has no base URL", async () => {
		const { result } = renderHook(() =>
			useCategories({ dataSource: "backend" }),
		);

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.error).toBe("No se pudieron cargar las categorías");
		expect(result.current.categories).toEqual([]);
	});

	it("sets save and delete errors for repository mutation failures", async () => {
		const repository: jest.Mocked<CategoryRepository> = {
			getAll: jest.fn().mockResolvedValue([]),
			create: jest.fn().mockRejectedValue(new Error("create failed")),
			update: jest.fn(),
			delete: jest.fn().mockRejectedValue(new Error("delete failed")),
		};

		const { result } = renderHook(() => useCategories({ repository }));
		await waitFor(() => expect(result.current.loading).toBe(false));

		await act(async () => {
			await expect(
				result.current.createCategory({
					name: "Hogar",
					type: "expense",
					color: CATEGORY_COLORS.teal,
				}),
			).rejects.toThrow("create failed");
		});
		expect(result.current.error).toBe("No se pudo guardar la categoría");

		await act(async () => {
			await expect(result.current.deleteCategory("cat-1")).rejects.toThrow(
				"delete failed",
			);
		});
		expect(result.current.error).toBe("No se pudo eliminar la categoría");
	});
});
