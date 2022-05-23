import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { router, get, post, match } from "../router.js";

let handle = router(
  get("/", () => "home"),
  post("/submit", () => "post"),
  get(match("/thing/:id"), (req, params) => params.id),
  () => "fallthrough"
);

Deno.test("router handles basic GET", () => {
  let req = new Request("http://example.com/", { method: "GET" });
  let res = handle(req);
  assertEquals(res, "home");
});

Deno.test("router handles basic POST", () => {
  let req = new Request("http://example.com/submit", { method: "POST" });
  let res = handle(req);
  assertEquals(res, "post");
});

Deno.test("router handles GET with param", () => {
  let req = new Request("http://example.com/thing/27", { method: "GET" });
  let res = handle(req);
  assertEquals(res, "27");
});

Deno.test("router handles unmatched routes with fallthrough", () => {
  let req = new Request("http://example.com/unknown", { method: "GET" });
  let res = handle(req);
  assertEquals(res, "fallthrough");
});
