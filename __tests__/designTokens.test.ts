import { componentSizes, layout, touchTarget } from "../src/design/tokens";

describe("design tokens", () => {
	it("exposes Android touch target aliases for component polish", () => {
		expect(componentSizes.iconButton).toBe(touchTarget.minHeight);
		expect(componentSizes.inputMinHeight).toBe(52);
	});

	it("exposes shared rhythm aliases for lists and tabs", () => {
		expect(componentSizes.listIcon).toBe(46);
		expect(componentSizes.listRowMinHeight).toBe(72);
		expect(layout.tabBarHeight).toBe(72);
	});
});
