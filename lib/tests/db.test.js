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
      let id1 = create_session();
      let id2 = create_session();
      assertEquals(id1.length, 36);
      assertEquals(id2.length, 36);
      assertNotEquals(id1, id2);
    });
    let id;
    await t.step("Can create new user session", () => {
      id = create_session(1);
      assertEquals(id.length, 36);
    });
    await t.step("Can get user from session", () => {
      let user = get_user_from_session(id);
      assertEquals(user.id, 1);
      assertEquals(user.email, null);
      assertEquals(user.guest, 1);
    });
  });
});
