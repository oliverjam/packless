import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { router, get, post, all, match } from "../router.js";

let handle = router(
  get("/", () => "home"),
  post("/submit", () => "post"),
  get(match("/thing/:id"), ({ params }) => params.id),
  all("/all", () => "all"),
  () => "fallthrough"
);

Deno.test("router handles basic GET", () => {
  let request = new Request("http://example.com/", { method: "GET" });
  let res = handle({ request });
  assertEquals(res, "home");
});

Deno.test("router handles basic POST", () => {
  let request = new Request("http://example.com/submit", { method: "POST" });
  let res = handle({ request });
  assertEquals(res, "post");
});

Deno.test("router handles GET with param", () => {
  let request = new Request("http://example.com/thing/27", { method: "GET" });
  let res = handle({ request });
  assertEquals(res, "27");
});

Deno.test("router can handle any method", () => {
  let request = new Request("http://example.com/all", { method: "PUT" });
  let res = handle({ request });
  assertEquals(res, "all");
});

Deno.test("router handles unmatched routes with fallthrough", () => {
  let request = new Request("http://example.com/unknown", { method: "GET" });
  let res = handle({ request });
  assertEquals(res, "fallthrough");
});
