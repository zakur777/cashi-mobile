import { useCallback, useEffect, useMemo, useState } from "react";

import { getUserFacingErrorMessage } from "../api/userFacingErrors";
import { createDefaultCashiApiClient } from "../api/client";
import { useOptionalAuth } from "../contexts/AuthContext";
import {
	CATEGORY_COLORS,
	type Category,
	type BalanceSummary,
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

function calculateClientBalance(transactions: Transaction[]): BalanceSummary {
	const totalIncome = transactions.reduce(
		(acc, transaction) => transaction.type === "income" ? acc + transaction.amount : acc,
		0,
	);
	const totalExpense = transactions.reduce(
		(acc, transaction) => transaction.type === "expense" ? acc + transaction.amount : acc,
		0,
	);

	return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
}

export function useTransactions({
	categories = [],
	repository,
	dataSource,
}: UseTransactionsOptions = {}) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [serverBalance, setServerBalance] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const auth = useOptionalAuth();

	const getRepository = useCallback(() => {
		if (repository) {
			return repository;
		}

		const resolvedSource = auth?.token ? "backend" : resolveCashiDataSource({ dataSource });
		return resolvedSource === "backend"
			? createBackendTransactionRepository(createDefaultCashiApiClient(undefined, auth?.token))
			: localTransactionRepository;
	}, [auth?.token, dataSource, repository]);

	const refresh = useCallback(async () => {
		setLoading(true);
		try {
			const activeRepository = getRepository();
			const items = await activeRepository.getAll();
			const shouldUseRepositoryBalance = repository !== undefined || auth?.token !== undefined || resolveCashiDataSource({ dataSource }) === "backend";
			const balanceSummary = shouldUseRepositoryBalance
				? await activeRepository.getBalance()
				: calculateClientBalance(items);
			setTransactions(items);
			setServerBalance(balanceSummary);
			setError(null);
		} catch (cause) {
			setError(
				getUserFacingErrorMessage(
					cause,
					"No se pudieron cargar las transacciones. Intentá nuevamente.",
				),
			);
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
				setError(
					getUserFacingErrorMessage(
						cause,
						"No se pudo guardar la transacción. Intentá nuevamente.",
					),
				);
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
				setError(
					getUserFacingErrorMessage(
						cause,
						"No se pudo guardar la transacción. Intentá nuevamente.",
					),
				);
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
				setError(
					getUserFacingErrorMessage(
						cause,
						"No se pudo eliminar la transacción. Intentá nuevamente.",
					),
				);
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

	const { primaryExpenseCategory } =
		useMemo(() => {
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
		totalIncome: serverBalance.totalIncome,
		totalExpense: serverBalance.totalExpense,
		balance: serverBalance.balance,
		primaryExpenseCategory,
		refresh,
		createTransaction,
		updateTransaction,
		deleteTransaction,
	};
}
