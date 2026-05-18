import { CATEGORY_COLORS } from "../src/domain/types";
import { ApiClientError } from "../src/api/errors";
import type { CashiApiClient } from "../src/api/client";
import {
	createBackendCategoryRepository,
	createBackendTransactionRepository,
} from "../src/repositories/backendRepositories";

const createMockClient = (): jest.Mocked<CashiApiClient> => ({
	health: jest.fn(),
	getCategories: jest.fn(),
	getCategory: jest.fn(),
	createCategory: jest.fn(),
	updateCategory: jest.fn(),
	deleteCategory: jest.fn(),
	getTransactions: jest.fn(),
	getTransaction: jest.fn(),
	createTransaction: jest.fn(),
	updateTransaction: jest.fn(),
	deleteTransaction: jest.fn(),
	getBalance: jest.fn(),
});

describe("backend repositories", () => {
	it("maps category DTOs for get/create/update and converts ids for delete", async () => {
		const client = createMockClient();
		const repository = createBackendCategoryRepository(client);
		client.getCategories.mockResolvedValueOnce([
			{ id: 4, name: "Comida", type: "expense", color: CATEGORY_COLORS.lime },
		]);
		client.createCategory.mockResolvedValueOnce({
			id: 5,
			name: "Sueldo",
			type: "income",
			color: CATEGORY_COLORS.green,
		});
		client.updateCategory.mockResolvedValueOnce({
			id: 4,
			name: "Super",
			type: "expense",
			color: CATEGORY_COLORS.teal,
		});
		client.deleteCategory.mockResolvedValueOnce({
			id: 4,
			name: "Super",
			type: "expense",
			color: CATEGORY_COLORS.teal,
		});

		await expect(repository.getAll()).resolves.toEqual([
			{ id: "4", name: "Comida", type: "expense", color: CATEGORY_COLORS.lime },
		]);
		await expect(
			repository.create({
				name: "  Sueldo  ",
				type: "income",
				color: CATEGORY_COLORS.green,
			}),
		).resolves.toEqual({
			id: "5",
			name: "Sueldo",
			type: "income",
			color: CATEGORY_COLORS.green,
		});
		expect(client.createCategory).toHaveBeenCalledWith({
			name: "Sueldo",
			type: "income",
			color: CATEGORY_COLORS.green,
		});

		await expect(
			repository.update("4", {
				name: "  Super  ",
				type: "expense",
				color: CATEGORY_COLORS.teal,
			}),
		).resolves.toEqual({
			id: "4",
			name: "Super",
			type: "expense",
			color: CATEGORY_COLORS.teal,
		});
		expect(client.updateCategory).toHaveBeenCalledWith(4, {
			name: "Super",
			type: "expense",
			color: CATEGORY_COLORS.teal,
		});

		await expect(repository.delete("4")).resolves.toBeUndefined();
		expect(client.deleteCategory).toHaveBeenCalledWith(4);
	});

	it("maps transaction DTOs and omits blank outbound descriptions", async () => {
		const client = createMockClient();
		const repository = createBackendTransactionRepository(client);
		const dto = {
			id: 8,
			amount: 1200,
			type: "expense" as const,
			description: null,
			date: "2026-05-18T00:00:00.000Z",
			categoryId: 2,
			category: {
				id: 2,
				name: "Transporte",
				type: "expense" as const,
				color: CATEGORY_COLORS.teal,
			},
		};
		client.getTransactions.mockResolvedValueOnce([dto]);
		client.createTransaction.mockResolvedValueOnce({
			...dto,
			id: 9,
			description: "Taxi",
		});
		client.updateTransaction.mockResolvedValueOnce({
			...dto,
			description: "Metro",
		});
		client.deleteTransaction.mockResolvedValueOnce(dto);

		await expect(repository.getAll()).resolves.toEqual([
			{
				id: "8",
				amount: 1200,
				type: "expense",
				description: "",
				date: "2026-05-18T00:00:00.000Z",
				categoryId: "2",
			},
		]);

		await repository.create({
			amount: 1800,
			type: "expense",
			description: "  Taxi  ",
			date: "2026-05-19",
			categoryId: "2",
		});
		expect(client.createTransaction).toHaveBeenCalledWith({
			amount: 1800,
			type: "expense",
			description: "Taxi",
			date: "2026-05-19",
			categoryId: 2,
		});

		await repository.update("8", {
			amount: 900,
			type: "expense",
			description: "   ",
			date: "2026-05-20",
			categoryId: "2",
		});
		expect(client.updateTransaction).toHaveBeenCalledWith(8, {
			amount: 900,
			type: "expense",
			date: "2026-05-20",
			categoryId: 2,
		});

		await repository.delete("8");
		expect(client.deleteTransaction).toHaveBeenCalledWith(8);
	});

	it("rejects invalid mobile ids before calling the backend and preserves API errors", async () => {
		const client = createMockClient();
		const repository = createBackendTransactionRepository(client);
		const apiError = new ApiClientError({
			kind: "network",
			message: "No se pudo conectar con el servidor",
		});
		client.getTransactions.mockRejectedValueOnce(apiError);

		await expect(
			repository.update("abc", {
				amount: 1,
				type: "income",
				description: "",
				date: "2026-05-18",
				categoryId: "2",
			}),
		).rejects.toThrow(ApiClientError);
		expect(client.updateTransaction).not.toHaveBeenCalled();

		await expect(repository.getAll()).rejects.toBe(apiError);
	});
});
