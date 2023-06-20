import { test, expect } from "@playwright/test";

test.describe("counter", () => {
    test.beforeEach(async ({ page }) => {
        page.goto("/counter");
    });

    test("increment", async ({ page }) => {
        const btn = page.getByRole("button", { name: "Increment (+)" });
        const view = page.getByTitle("count");
        await btn.click();
        await expect(view).toHaveText("1");
    });

    test("decrement", async ({ page }) => {
        const btn = page.getByRole("button", { name: "Decrement (-)" });
        const view = page.getByTitle("count");
        await btn.click();
        await expect(view).toHaveText("-1");
    });

    test("reset", async ({ page }) => {
        const btn = page.getByRole("button", { name: "Reset (R)" });
        const view = page.getByTitle("count");
        await btn.click();
        await expect(view).toHaveText("0");
    });
});
