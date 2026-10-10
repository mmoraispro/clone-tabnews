import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET to /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch(`${webserver.origin}/api/v1/status`);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parseUpdateAt = new Date(responseBody.update_at).toISOString();
      expect(responseBody.update_at).toEqual(parseUpdateAt);

      expect(responseBody.dependencies.database).not.toHaveProperty("version");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
  describe("Privileged user", () => {
    test("With `read:status:all`", async () => {
      const priviledUser = await orchestrator.createUser();
      const activatedPriviledUser =
        await orchestrator.activateUser(priviledUser);
      await orchestrator.addFeaturesToUser(priviledUser, ["read:status:all"]);
      const sessionObject = await orchestrator.createSession(
        activatedPriviledUser,
      );

      const response = await fetch(`${webserver.origin}/api/v1/status`, {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        },
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      const parseUpdateAt = new Date(responseBody.update_at).toISOString();
      expect(responseBody.update_at).toEqual(parseUpdateAt);

      expect(responseBody.dependencies.database.version).toEqual("16.0");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
