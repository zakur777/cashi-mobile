import { CATEGORY_COLORS } from "../src/domain/types";
import { categorySchema, transactionSchema } from "../src/domain/schemas";

describe("categorySchema", () => {
	it("rejects empty name", () => {
		const result = categorySchema.safeParse({ name: "   " });
		expect(result.success).toBe(false);
	});

	it("rejects missing category type and color", () => {
		const result = categorySchema.safeParse({ name: "Comida" });
		expect(result.success).toBe(false);
	});

	it("accepts valid metadata", () => {
		const result = categorySchema.safeParse({
			name: "Comida",
			type: "expense",
			color: CATEGORY_COLORS.lime,
		});
		expect(result.success).toBe(true);
	});

	it("offers an expanded visible color palette", () => {
		expect(Object.values(CATEGORY_COLORS)).toHaveLength(12);
		expect(
			categorySchema.safeParse({
				name: "Salud",
				type: "expense",
				color: CATEGORY_COLORS.coral,
			}).success,
		).toBe(true);
		expect(
			categorySchema.safeParse({
				name: "Viajes",
				type: "expense",
				color: CATEGORY_COLORS.sky,
			}).success,
		).toBe(true);
	});
});

describe("transactionSchema", () => {
	it("rejects amount <= 0", () => {
		const result = transactionSchema.safeParse({
			amount: 0,
			type: "expense",
			description: "Cafe",
			date: "2026-05-11",
			categoryId: "cat-1",
		});
		expect(result.success).toBe(false);
	});

	it("accepts valid payload", () => {
		const result = transactionSchema.safeParse({
			amount: "1200",
			type: "income",
			description: "Sueldo",
			date: "2026-05-11",
			categoryId: "cat-2",
		});
		expect(result.success).toBe(true);
	});

	it("accepts optional photo and location metadata", () => {
		const result = transactionSchema.safeParse({
			amount: "4200",
			type: "expense",
			description: "Supermercado",
			date: "2026-05-21",
			categoryId: "cat-3",
			photoUri: "file:///receipt.jpg",
			location: { latitude: -33.4489, longitude: -70.6693 },
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.photoUri).toBe("file:///receipt.jpg");
			expect(result.data.location).toEqual({
				latitude: -33.4489,
				longitude: -70.6693,
			});
		}
	});

	it("keeps metadata-free transactions valid for legacy records", () => {
		const result = transactionSchema.safeParse({
			amount: 800,
			type: "income",
			description: "Reintegro",
			date: "2026-05-21",
			categoryId: "cat-4",
		});

		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.photoUri).toBeUndefined();
			expect(result.data.location).toBeUndefined();
		}
	});
});
