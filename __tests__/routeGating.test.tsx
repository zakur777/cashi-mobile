import { fireEvent, render, waitFor } from "@testing-library/react-native";
import type { PropsWithChildren, ReactNode } from "react";

import BalanceTab from "../app/(tabs)/balance";
import TabsLayout from "../app/(tabs)/_layout";
import LoginScreen from "../app/index";
import { AuthProvider, type AuthService } from "../src/contexts/AuthContext";
import { useAuth } from "../src/hooks/useAuth";
import type { AuthTokenStorage } from "../src/storage/authTokenStorage";

const mockReplace = jest.fn();
const mockRefreshCategories = jest.fn();
const mockRefreshTransactions = jest.fn();

jest.mock("expo-router", () => {
	const React = require("react");
	const { Text, View } = require("react-native");

	return {
		Redirect: ({ href }: { href: string }) =>
			React.createElement(Text, null, `Redirect:${href}`),
		Tabs: Object.assign(
			({ children }: PropsWithChildren) =>
				React.createElement(View, { testID: "tabs-layout" }, children),
			{ Screen: () => null },
		),
		useFocusEffect: (callback: () => void) => callback(),
		useRouter: () => ({ replace: mockReplace }),
	};
});

jest.mock("../src/components/navigation/CashiTabBar", () => ({
	CashiTabBar: () => null,
}));

jest.mock("../src/hooks/useCategories", () => ({
	useCategories: () => ({ categories: [], refresh: mockRefreshCategories }),
}));

jest.mock("../src/hooks/useTransactions", () => ({
	useTransactions: () => ({
		transactions: [{ id: "tx-1" }],
		totalIncome: 800,
		totalExpense: 250,
		balance: 550,
		primaryExpenseCategory: null,
		loading: false,
		error: null,
		refresh: mockRefreshTransactions,
	}),
}));

const createStorage = (initialToken: string | null): jest.Mocked<AuthTokenStorage> => ({
	load: jest.fn().mockResolvedValue(initialToken),
	save: jest.fn().mockResolvedValue(undefined),
	clear: jest.fn().mockResolvedValue(undefined),
});

const createAuthService = (): jest.Mocked<AuthService> => ({
	login: jest.fn().mockResolvedValue({ token: "login.jwt" }),
	register: jest.fn().mockResolvedValue({ token: "register.jwt" }),
});

function renderWithAuth(children: ReactNode, storage: jest.Mocked<AuthTokenStorage>) {
	return render(
		<AuthProvider storage={storage} authService={createAuthService()}>
			{children}
		</AuthProvider>,
	);
}

function AuthenticatedBalanceHarness() {
	const auth = useAuth();

	if (auth.isInitializing) {
		return null;
	}

	if (!auth.isAuthenticated) {
		return <TabsLayout />;
	}

	return (
		<>
			<TabsLayout />
			<BalanceTab />
		</>
	);
}

describe("route gating", () => {
	beforeEach(() => {
		mockReplace.mockClear();
		mockRefreshCategories.mockClear();
		mockRefreshTransactions.mockClear();
	});

	it("redirects unauthenticated tabs to login after auth initialization", async () => {
		const storage = createStorage(null);
		const screen = renderWithAuth(<TabsLayout />, storage);

		await waitFor(() => expect(screen.getByText("Redirect:/")).toBeTruthy());

		expect(storage.load).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId("tabs-layout")).toBeNull();
	});

	it("redirects login to protected balance when a stored token bootstraps", async () => {
		const storage = createStorage("stored.jwt");
		const screen = renderWithAuth(<LoginScreen />, storage);

		await waitFor(() =>
			expect(screen.getByText("Redirect:/(tabs)/balance")).toBeTruthy(),
		);

		expect(storage.load).toHaveBeenCalledTimes(1);
		expect(screen.queryByText("Ingresar")).toBeNull();
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it("clears the session on logout and removes protected tab access", async () => {
		const storage = createStorage("stored.jwt");
		const screen = renderWithAuth(<AuthenticatedBalanceHarness />, storage);

		await waitFor(() => expect(screen.getByTestId("tabs-layout")).toBeTruthy());
		fireEvent.press(screen.getByText("Cerrar sesión"));

		await waitFor(() => expect(storage.clear).toHaveBeenCalledTimes(1));
		await waitFor(() => expect(screen.getByText("Redirect:/")).toBeTruthy());
		expect(screen.queryByText("Cerrar sesión")).toBeNull();
	});
});
