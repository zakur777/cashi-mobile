import { useCallback, useState } from 'react';

import { categorySchema } from '../domain/schemas';

interface UseCategoryFormOptions {
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
}

export function useCategoryForm({ initialName = '', onSubmit }: UseCategoryFormOptions) {
  const [name, setName] = useState(initialName);
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const resetName = useCallback((next: string) => {
    setName(next);
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    const parsed = categorySchema.safeParse({ name });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({ name: fieldErrors.name?.[0] });
      return false;
    }

    setSubmitting(true);
    try {
      await onSubmit(parsed.data.name);
      setErrors({});
      return true;
    } finally {
      setSubmitting(false);
    }
  }, [name, onSubmit]);

  return {
    name,
    setName: resetName,
    errors,
    submitting,
    handleSubmit,
  };
}
