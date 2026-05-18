export type TransactionType = "income" | "expense";

export const CATEGORY_COLORS = {
	purple: "#281C59",
	teal: "#4E8D9C",
	green: "#85C79A",
	lime: "#EDF7BD",
	coral: "#FF8A7A",
	amber: "#FFD166",
	sky: "#7DD3FC",
	mint: "#A7F3D0",
	lavender: "#C9C4FF",
	pink: "#F9A8D4",
	orange: "#FDBA74",
	blue: "#60A5FA",
} as const;

export type CategoryColor =
	(typeof CATEGORY_COLORS)[keyof typeof CATEGORY_COLORS];

export interface Category {
	id: string;
	name: string;
	type: TransactionType;
	color: CategoryColor;
}

export interface CategoryInput {
	name: string;
	type: TransactionType;
	color: CategoryColor;
}

export interface Transaction {
	id: string;
	amount: number;
	type: TransactionType;
	description: string;
	date: string;
	categoryId: string;
}

export interface BalanceSummary {
	totalIncome: number;
	totalExpense: number;
	balance: number;
}
