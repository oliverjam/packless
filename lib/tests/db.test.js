import {
  assertThrows,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { DB } from "../../deps.js";
import { Model } from "../database/db.js";

// in-memory ephemeral DB for testing
let db = new DB();
let model = Model(db);

Deno.test("DB is empty", () => {
  assertThrows(() => model.get_user(1), Error, "did not return any rows");
});

Deno.test("Model", async (t) => {
  let user_id;
  await t.step("User model", async (t) => {
    await t.step("Can create new guest user", () => {
      user_id = model.create_user().id;
      assertEquals(user_id, 1);
    });
    await t.step("Can select created user", () => {
      let user = model.get_user(user_id);
      assertEquals(user.email, null);
      assertEquals(user.guest, 1);
    });
  });

  await t.step("Session model", async (t) => {
    await t.step("Can create new anonymous sessions", () => {
      let expires_at = "+1 day";
      let session1 = model.create_session(expires_at);
      let session2 = model.create_session(expires_at);
      assertEquals(session1.id.length, 36);
      assertEquals(session2.id.length, 36);
      assertNotEquals(session1.id, session2.id);
    });
    let id;
    await t.step("Can create new user session", () => {
      id = model.create_session("+1 month", user_id).id;
      assertEquals(id.length, 36);
    });
    await t.step("Can get user from session", () => {
      let user = model.get_user_from_session(id);
      assertEquals(user.id, user_id);
      assertEquals(user.email, null);
      assertEquals(user.guest, 1);
    });
  });

  await t.step("Pack model", async (t) => {
    let pack_id = "123";
    let user_id = 1;
    let pack;
    await t.step("Can create new pack", () => {
      pack = model.create_pack(pack_id, user_id);
      assertEquals(pack.id, pack_id);
    });

    await t.step("Can add items to pack", () => {
      let item = model.add_pack_item({
        pack_id,
        name: "stove",
        weight: 100,
        user_id,
        quantity: 1,
      });
      assertEquals(item.id, 1);
    });

    await t.step("Can select created pack", () => {
      let new_pack = model.get_pack(pack_id);
      assertEquals(new_pack.user_id, user_id);
      assertEquals(new_pack.title, "Your pack");
    });
  });
});
