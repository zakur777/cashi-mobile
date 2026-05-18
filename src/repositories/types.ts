import type {
	Category,
	CategoryInput,
	Transaction,
	TransactionType,
} from "../domain/types";

export type CashiDataSource = "local" | "backend";

export interface CategoryRepository {
	getAll(): Promise<Category[]>;
	create(input: CategoryInput): Promise<Category>;
	update(id: string, input: CategoryInput): Promise<Category>;
	delete(id: string): Promise<void>;
}

export interface TransactionInput {
	amount: number;
	type: TransactionType;
	description: string;
	date: string;
	categoryId: string;
}

export interface TransactionRepository {
	getAll(): Promise<Transaction[]>;
	create(input: TransactionInput): Promise<Transaction>;
	update(id: string, input: TransactionInput): Promise<Transaction>;
	delete(id: string): Promise<void>;
}
