import {
  assertEquals,
  assertMatch,
} from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { document } from "../document.js";

Deno.test("document module renders sync content", async () => {
  let content = <h1>Hello</h1>;
  let response = document(content, 200, { "X-Test": "test header" });
  assertEquals(response instanceof Response, true);
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("content-type"), "text/html");
  assertEquals(response.headers.get("X-Test"), "test header");
  let body = await response.text();
  assertMatch(body, /<!doctype html>/, "Should respond with an HTML doc");
  assertMatch(body, /<h1>Hello<\/h1>/, "Should include content");
});

Deno.test("document module renders async content", async () => {
  let content = Promise.resolve(<h1>Hello</h1>);
  let response = document(content);
  assertEquals(response instanceof Response, true);
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("content-type"), "text/html");
  let reader = response.body.getReader();
  let { value: first_chunk, done } = await reader.read();
  assertEquals(done, false, "Should respond with start of HTML immediately");
  let start = new TextDecoder().decode(first_chunk);
  assertMatch(start, /<!doctype html>/, "Should respond with an HTML doc");
  assertMatch(start, /<head>/, "Should respond with an HTML doc");
  let { value: second_chunk } = await reader.read();
  let mid = new TextDecoder().decode(second_chunk);
  assertMatch(mid, /<h1>Hello<\/h1>/, "Should eventually send async content");
  let { value: third_chunk } = await reader.read();
  let end = new TextDecoder().decode(third_chunk);
  assertMatch(end, /<\/html>/, "Should finish HTML document");
});
