import { test, expect } from "@playwright/test";

test.describe("Todo List", () => {
    test.beforeEach(async ({ page }) => {
        page.goto("/todo");
    });

    test("add", async ({ page }) => {
        const input = page.getByPlaceholder("Task Title");
        await input.fill("Playwright");
        await page.getByRole("button", { name: "Add" }).click();
        const todos = page.locator("css=.task").first();
        await expect(todos).toHaveText("Playwright");
    });

    test("remove", async ({ page }) => {
        const todo = page.locator("css=.task").first();
        await todo.getByLabel("remove").click();
        expect(await page.locator("css=.task").all()).toHaveLength(4);
    });

    test("tabs filter", async ({ page }) => {
        const pending = page.getByRole("button", { name: "Pending" });
        const completed = page.getByRole("button", { name: "Completed" });

        const todo = page.locator("css=.task").first();
        await todo.getByLabel("pending").click();

        expect(await page.locator("css=.task").all()).toHaveLength(4);
        await completed.click();
        expect(await page.locator("css=.task").all()).toHaveLength(1);

        await page.locator("css=.task").first().getByLabel("completed").click();
        await pending.click();
        expect(await page.locator("css=.task").all()).toHaveLength(5);
    });
});
