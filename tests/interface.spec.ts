import { test, expect } from "@playwright/test";

// . it loads and shows the list of issues on page mount
// . it allows filtering issues by project, type, title, priority & assignee

// . it opens the issue details when clicked
// . issue details has title project name description
// . URL route is updated when different issues are opened
// . going to an issue URL directly opens the issue details

// . it allows accepting issue not accepted by anyone
// . it allows rejecting issue assigned to signed in user
// . it doesn't allow accepting issue not assigned to signed in user

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.describe("Issues List Testing", () => {
  test("it loads and shows the list of issues on page mount", async ({
    page,
    request,
  }) => {
    await expect(page).toHaveTitle(/React App/);

    const issueItems = await page.locator(".issue-item");

    const res = await request.get("http://localhost:3001/api/issues");
    const allIssues = await res.json();

    expect(await issueItems.count()).toEqual(allIssues.length);
  });
  test("it allows filtering issues by project, type, title, priority", async ({
    page,
    request,
  }) => {
    await page.goto("http://localhost:3000/");

    const res = await request.get("http://localhost:3001/api/issues");
    const allIssues = await res.json();

    await page.fill(".issue-filter-input", "Bug");
    const allBugIssues = allIssues.filter((issue) => issue.type === "Bug");

    let issueItems = await page.locator(".issue-item");
    expect(await issueItems.count()).toEqual(allBugIssues.length);

    await page.fill(".issue-filter-input", "3");

    const allPriorityIssues = allIssues.filter(
      (issue) => issue.priority === "3"
    );

    issueItems = await page.locator(".issue-item");
    expect(await issueItems.count()).toEqual(allPriorityIssues.length);

    await page.fill(".issue-filter-input", "Updated");
    const allTitledIssues = allIssues.filter((issue) =>
      issue.title.toLowerCase().includes("updated")
    );

    issueItems = await page.locator(".issue-item");
    expect(await issueItems.count()).toEqual(allTitledIssues.length);
  });
});

test.describe("Issue Details Testing", () => {
  test("it opens the issue details when clicked", async ({ page }) => {
    await page.click(".issue-list:first-child");
    const issueDetail = await page.locator(".issue-details-container");
    expect(await issueDetail.isVisible()).toBeTruthy();
  });
  test("issue details has title, project name, and description", async ({
    page,
  }) => {
    await page.click(".issue-list:first-child");
    const title = await page.locator(".issue-details-container .issue-title");
    const projectName = await page.locator(
      ".issue-details-container .issue-project-name"
    );
    const description = await page.locator(
      ".issue-details-container .issue-description"
    );
    expect(await title.isVisible()).toBeTruthy();
    expect(await projectName.isVisible()).toBeTruthy();
    expect(await description.isVisible()).toBeTruthy();
  });
  // test("URL route is updated when different issues are opened", async ({
  //   page,
  // }) => {
  //   await page.click(".issue-list:first-child");
  //   const firstIssueURL = page.url();
  //   await page.click(".issue-list:nth-child(2)");
  //   const secondIssueURL = page.url();
  //   expect(firstIssueURL).not.toEqual(secondIssueURL);
  // });
  // test("going to an issue URL directly opens the issue details", async ({
  //   page,
  // }) => {
  //   await page.goto("http://localhost:3000/issues/1");
  //   const issueDetail = await page.locator(".issue-details-container");
  //   expect(await issueDetail.isVisible()).toBeTruthy();
  // });
});
test.describe("Issue Assignment Testing", () => {
  test("it allows accepting/rejecting issues", async ({ page }) => {
    await page.fill(".issue-filter-input", "Update");
    await page.getByText("Update").click();

    await page.getByText("Accept").click();
    await page.getByText("assigned to");
    
    await page.getByText("Decline").click();
  });
  test("it doesn't allow accepting issue not assigned to signed in user", async ({
    page,
  }) => {
    await page.fill(".issue-filter-input", "Jenna");
    await page.getByText("Jenna").click();
    const acceptButton = page.locator("text=Accept");
    expect(await acceptButton.count()).toBe(0);
  });
});
