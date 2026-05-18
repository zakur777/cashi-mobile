import { useCallback, useEffect, useMemo, useState } from "react";

import {
	CATEGORY_COLORS,
	type Category,
	type Transaction,
} from "../domain/types";
import {
	createBackendTransactionRepository,
	localTransactionRepository,
	resolveCashiDataSource,
	type CashiDataSource,
	type TransactionInput,
	type TransactionRepository,
} from "../repositories";

interface UseTransactionsOptions {
	categories?: Category[];
	repository?: TransactionRepository;
	dataSource?: CashiDataSource;
}

export function useTransactions({
	categories = [],
	repository,
	dataSource,
}: UseTransactionsOptions = {}) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const getRepository = useCallback(() => {
		if (repository) {
			return repository;
		}

		const resolvedSource = resolveCashiDataSource({ dataSource });
		return resolvedSource === "backend"
			? createBackendTransactionRepository()
			: localTransactionRepository;
	}, [dataSource, repository]);

	const refresh = useCallback(async () => {
		setLoading(true);
		try {
			const items = await getRepository().getAll();
			setTransactions(items);
			setError(null);
		} catch {
			setError("No se pudieron cargar las transacciones");
		} finally {
			setLoading(false);
		}
	}, [getRepository]);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const createTransaction = useCallback(
		async (input: TransactionInput) => {
			try {
				const created = await getRepository().create(input);
				setTransactions((current) => [...current, created]);
				setError(null);
			} catch (cause) {
				setError("No se pudo guardar la transacción");
				throw cause;
			}
		},
		[getRepository],
	);

	const updateTransaction = useCallback(
		async (id: string, input: TransactionInput) => {
			try {
				const updated = await getRepository().update(id, input);
				setTransactions((current) =>
					current.map((item) => (item.id === id ? updated : item)),
				);
				setError(null);
			} catch (cause) {
				setError("No se pudo guardar la transacción");
				throw cause;
			}
		},
		[getRepository],
	);

	const deleteTransaction = useCallback(
		async (id: string) => {
			try {
				await getRepository().delete(id);
				setTransactions((current) => current.filter((item) => item.id !== id));
				setError(null);
			} catch (cause) {
				setError("No se pudo eliminar la transacción");
				throw cause;
			}
		},
		[getRepository],
	);

	const transactionsWithCategory = useMemo(
		() =>
			transactions.map((transaction) => {
				const category = categories.find(
					(item) => item.id === transaction.categoryId,
				);

				return {
					...transaction,
					categoryName: category?.name ?? "Sin categoría",
					categoryColor: category?.color ?? CATEGORY_COLORS.lime,
				};
			}),
		[categories, transactions],
	);

	const { totalIncome, totalExpense, balance, primaryExpenseCategory } =
		useMemo(() => {
			const income = transactions.reduce((acc, transaction) => {
				if (transaction.type !== "income") {
					return acc;
				}

				return acc + transaction.amount;
			}, 0);

			const expense = transactions.reduce((acc, transaction) => {
				if (transaction.type !== "expense") {
					return acc;
				}

				return acc + transaction.amount;
			}, 0);

			const expenseByCategory = transactions.reduce<Record<string, number>>(
				(acc, transaction) => {
					if (transaction.type !== "expense") {
						return acc;
					}

					acc[transaction.categoryId] =
						(acc[transaction.categoryId] ?? 0) + transaction.amount;
					return acc;
				},
				{},
			);

			const [primaryCategoryId, primaryAmount] =
				Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0] ?? [];
			const primaryCategory = categories.find(
				(category) => category.id === primaryCategoryId,
			);

			return {
				totalIncome: income,
				totalExpense: expense,
				balance: income - expense,
				primaryExpenseCategory:
					primaryCategoryId && primaryAmount
						? {
								id: primaryCategoryId,
								name: primaryCategory?.name ?? "Sin categoría",
								color: primaryCategory?.color ?? CATEGORY_COLORS.lime,
								amount: primaryAmount,
							}
						: null,
			};
		}, [categories, transactions]);

	return {
		transactions,
		transactionsWithCategory,
		loading,
		error,
		totalIncome,
		totalExpense,
		balance,
		primaryExpenseCategory,
		refresh,
		createTransaction,
		updateTransaction,
		deleteTransaction,
	};
}
