import {
	CATEGORY_COLORS,
	type Category,
	type CategoryInput,
	type Transaction,
} from "../domain/types";
import { categoriesStorage } from "../storage/categoriesStorage";
import { seedDemoDataIfEmpty } from "../storage/demoSeed";
import { transactionsStorage } from "../storage/transactionsStorage";
import type {
	CategoryRepository,
	TransactionInput,
	TransactionRepository,
} from "./types";

const normalizeCategory = (category: Category): Category => ({
	...category,
	type: category.type ?? "expense",
	color: category.color ?? CATEGORY_COLORS.lime,
});

const buildLocalId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const buildCategory = (input: CategoryInput): Category => ({
	id: buildLocalId(),
	...input,
	name: input.name.trim(),
});

const buildTransaction = (input: TransactionInput): Transaction => ({
	id: buildLocalId(),
	...input,
});

export const localCategoryRepository: CategoryRepository = {
	async getAll() {
		await seedDemoDataIfEmpty();
		const items = await categoriesStorage.getAll();
		return items.map(normalizeCategory);
	},

	async create(input) {
		const current = await categoriesStorage.getAll();
		const created = buildCategory(input);
		await categoriesStorage.saveAll([
			...current.map(normalizeCategory),
			created,
		]);
		return created;
	},

	async update(id, input) {
		const current = (await categoriesStorage.getAll()).map(normalizeCategory);
		const updated = { id, ...input, name: input.name.trim() };
		await categoriesStorage.saveAll(
			current.map((item) => (item.id === id ? updated : item)),
		);
		return updated;
	},

	async delete(id) {
		const current = await categoriesStorage.getAll();
		await categoriesStorage.saveAll(current.filter((item) => item.id !== id));
	},
};

export const localTransactionRepository: TransactionRepository = {
	async getAll() {
		await seedDemoDataIfEmpty();
		return transactionsStorage.getAll();
	},

	async create(input) {
		const current = await transactionsStorage.getAll();
		const created = buildTransaction(input);
		await transactionsStorage.saveAll([...current, created]);
		return created;
	},

	async update(id, input) {
		const current = await transactionsStorage.getAll();
		const updated = { id, ...input };
		await transactionsStorage.saveAll(
			current.map((item) => (item.id === id ? updated : item)),
		);
		return updated;
	},

	async delete(id) {
		const current = await transactionsStorage.getAll();
		await transactionsStorage.saveAll(current.filter((item) => item.id !== id));
	},
};
