import { test, expect, type Page } from "@playwright/test";

// Playwright Tests for API Endpoints
test.describe("API Endpoints", () => {
  test("GET /api/issues should return all issues", async ({ request }) => {
    const response = await request.get("http://localhost:3001/api/issues");
    expect(response.status()).toBe(200);
    const issues = await response.json();
    expect(issues).toBeInstanceOf(Array);
  });

  test("GET /api/projects should return all projects", async ({ request }) => {
    const response = await request.get("http://localhost:3001/api/projects");
    expect(response.status()).toBe(200);
    const projects = await response.json();
    expect(projects).toBeInstanceOf(Array);
  });

  test("POST /api/issues/:id should update an issue", async ({ request }) => {
    const sampleUpdate = {
      title: "Updated Issue",
      description: "Updated Description",
    };

    const res = await request.get("http://localhost:3001/api/issues");
    const allIssues = await res.json();

    let _id = allIssues[0]._id;

    const response = await request.post(
      `http://localhost:3001/api/issues/${_id}`,
      {
        data: sampleUpdate,
      }
    );
    expect(response.status()).toBe(200);
    const updatedIssue = await response.json();
    expect(updatedIssue.title).toBe(sampleUpdate.title);
    expect(updatedIssue.description).toBe(sampleUpdate.description);
  });
});
