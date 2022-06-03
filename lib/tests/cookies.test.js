import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { create } from "../cookies.js";

Deno.test("Can parse a cookie from a request", () => {
  let cookie = create("test");
  let request = new Request("http://example/com");
  request.headers.set("cookie", "test=123");
  let parsed = cookie.read(request.headers.get("cookie"));
  assertEquals(parsed, "123");
});

Deno.test("Can write a value to a cookie with default options", () => {
  let cookie = create("test");
  assertEquals(cookie.write("123"), "test=123; Path=/");
});

Deno.test("Can write a value to a cookie with custom defaults", () => {
  let cookie = create("test", { maxAge: 600 });
  assertEquals(cookie.write("123"), "test=123; Max-Age=600; Path=/");
});

Deno.test("Can change options when writing cookie", () => {
  let cookie = create("test", { maxAge: 600 });
  assertEquals(
    cookie.write("123", { maxAge: 60 }),
    "test=123; Max-Age=60; Path=/"
  );
});
