import { ApiClientError } from "../src/api/errors";
import { resolveCashiDataSource } from "../src/repositories/dataSource";

describe("data source resolver", () => {
	const originalEnv = process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE;

	afterEach(() => {
		jest.resetModules();
		jest.dontMock("expo-constants");
		if (originalEnv === undefined) {
			delete process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE;
		} else {
			process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE = originalEnv;
		}
	});

	it("uses explicit input before environment and defaults to local when blank", () => {
		process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE = "backend";

		expect(resolveCashiDataSource({ dataSource: "local" })).toBe("local");
		expect(resolveCashiDataSource({ dataSource: "   " })).toBe("local");
	});

	it("reads environment before falling back to local", () => {
		process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE = "backend";
		expect(resolveCashiDataSource()).toBe("backend");

		delete process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE;
		expect(resolveCashiDataSource()).toBe("local");
	});

	it("reads expo extra when environment is absent", () => {
		delete process.env.EXPO_PUBLIC_CASHI_DATA_SOURCE;

		jest.isolateModules(() => {
			jest.doMock("expo-constants", () => ({
				__esModule: true,
				default: { expoConfig: { extra: { cashiDataSource: "backend" } } },
			}));
			const { resolveCashiDataSource: resolveWithExpoExtra } =
				require("../src/repositories/dataSource") as typeof import("../src/repositories/dataSource");

			expect(resolveWithExpoExtra()).toBe("backend");
		});
	});

	it("rejects invalid values with typed config errors", () => {
		expect(() => resolveCashiDataSource({ dataSource: "LOCAL" })).toThrow(
			ApiClientError,
		);
		expect(() => resolveCashiDataSource({ dataSource: "remote" })).toThrow(
			ApiClientError,
		);
	});
});
