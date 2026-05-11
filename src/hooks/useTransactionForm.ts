import { useCallback, useState } from 'react';

import type { TransactionType } from '../domain/types';
import { transactionSchema } from '../domain/schemas';

interface TransactionFormValues {
  amount: string;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: string;
}

interface UseTransactionFormOptions {
  initialValues: TransactionFormValues;
  onSubmit: (values: {
    amount: number;
    type: TransactionType;
    description: string;
    date: string;
    categoryId: string;
  }) => Promise<void>;
}

interface TransactionFormErrors {
  amount?: string;
  type?: string;
  description?: string;
  date?: string;
  categoryId?: string;
}

export function useTransactionForm({ initialValues, onSubmit }: UseTransactionFormOptions) {
  const [amount, setAmountValue] = useState(initialValues.amount);
  const [type, setTypeValue] = useState<TransactionType>(initialValues.type);
  const [description, setDescriptionValue] = useState(initialValues.description);
  const [date, setDateValue] = useState(initialValues.date);
  const [categoryId, setCategoryIdValue] = useState(initialValues.categoryId);
  const [errors, setErrors] = useState<TransactionFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const setAmount = useCallback((value: string) => {
    setAmountValue(value);
    setErrors((prev) => ({ ...prev, amount: undefined }));
  }, []);

  const setType = useCallback((value: TransactionType) => {
    setTypeValue(value);
    setErrors((prev) => ({ ...prev, type: undefined }));
  }, []);

  const setDescription = useCallback((value: string) => {
    setDescriptionValue(value);
    setErrors((prev) => ({ ...prev, description: undefined }));
  }, []);

  const setDate = useCallback((value: string) => {
    setDateValue(value);
    setErrors((prev) => ({ ...prev, date: undefined }));
  }, []);

  const setCategoryId = useCallback((value: string) => {
    setCategoryIdValue(value);
    setErrors((prev) => ({ ...prev, categoryId: undefined }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const parsed = transactionSchema.safeParse({
      amount,
      type,
      description,
      date,
      categoryId,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        amount: fieldErrors.amount?.[0],
        type: fieldErrors.type?.[0],
        description: fieldErrors.description?.[0],
        date: fieldErrors.date?.[0],
        categoryId: fieldErrors.categoryId?.[0],
      });
      return false;
    }

    setSubmitting(true);
    try {
      await onSubmit(parsed.data);
      setErrors({});
      return true;
    } finally {
      setSubmitting(false);
    }
  }, [amount, categoryId, date, description, onSubmit, type]);

  return {
    amount,
    type,
    description,
    date,
    categoryId,
    errors,
    submitting,
    setAmount,
    setType,
    setDescription,
    setDate,
    setCategoryId,
    handleSubmit,
  };
}
