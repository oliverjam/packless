import {
  assertThrows,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.139.0/testing/asserts.ts";
import {
  get_user,
  create_user,
  get_user_from_session,
  create_session,
} from "../database/db.js";

Deno.test("DB is empty", () => {
  assertThrows(() => get_user(1), Error, "did not return any rows");
});

Deno.test("Model", async (t) => {
  await t.step("User model", async (t) => {
    let id;
    await t.step("Can create new guest user", () => {
      id = create_user();
      assertEquals(id, 1);
    });
    await t.step("Can select created user", () => {
      let user = get_user(id);
      assertEquals(user.email, null);
      assertEquals(user.guest, 1);
    });
  });

  await t.step("Session model", async (t) => {
    await t.step("Can create new anonymous sessions", () => {
      let expires_at = "+1 day";
      let session1 = create_session(expires_at);
      let session2 = create_session(expires_at);
      assertEquals(session1.id.length, 36);
      assertEquals(session2.id.length, 36);
      assertNotEquals(session1.id, session2.id);
    });
    let id;
    let user_id = 1;
    await t.step("Can create new user session", () => {
      id = create_session("+1 month", user_id).id;
      assertEquals(id.length, 36);
    });
    await t.step("Can get user from session", () => {
      let user = get_user_from_session(id);
      assertEquals(user.id, user_id);
      assertEquals(user.email, null);
      assertEquals(user.guest, 1);
    });
  });
});
