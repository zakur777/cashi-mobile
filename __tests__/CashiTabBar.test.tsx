import { render } from "@testing-library/react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { CashiTabBar } from "../src/components/navigation/CashiTabBar";

jest.mock("react-native-safe-area-context", () => ({
	useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const makeProps = (index: number): BottomTabBarProps => {
	const routes = [
		{ key: "index-key", name: "index" },
		{ key: "categories-key", name: "categories" },
		{ key: "balance-key", name: "balance" },
		{ key: "category-detail-key", name: "category/[id]" },
		{ key: "transaction-detail-key", name: "transaction/[id]" },
	];

	return {
		state: {
			stale: false,
			type: "tab",
			key: "tab-state",
			index,
			routeNames: routes.map((route) => route.name),
			routes,
			history: [],
		},
		descriptors: {
			"index-key": { options: { title: "Movimientos" } },
			"categories-key": { options: { title: "Categorías" } },
			"balance-key": { options: { title: "Balance" } },
			"category-detail-key": { options: { title: "Categoría" } },
			"transaction-detail-key": { options: { title: "Movimiento" } },
		},
		navigation: {
			emit: jest.fn(() => ({ defaultPrevented: false })),
			navigate: jest.fn(),
		},
		insets: { top: 0, right: 0, bottom: 0, left: 0 },
	} as unknown as BottomTabBarProps;
};

describe("CashiTabBar", () => {
	it("renders exactly the three approved main tabs", () => {
		const screen = render(<CashiTabBar {...makeProps(0)} />);

		expect(screen.getByText("Movimientos")).toBeTruthy();
		expect(screen.getByText("Categorías")).toBeTruthy();
		expect(screen.getByText("Balance")).toBeTruthy();
		expect(screen.queryByText("Categoría")).toBeNull();
		expect(screen.queryByText("Movimiento")).toBeNull();
	});

	it("hides the tab bar while a detail route is active", () => {
		const screen = render(<CashiTabBar {...makeProps(3)} />);

		expect(screen.queryByText("Movimientos")).toBeNull();
		expect(screen.queryByText("Categorías")).toBeNull();
		expect(screen.queryByText("Balance")).toBeNull();
	});
});
