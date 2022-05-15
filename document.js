import { render } from "./deps.js";

let open = /*html*/ `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Packless</title>
    <link rel="stylesheet" href="main.css"/>
  </head>
  <body>`;

let close = `
  </body>
</html>`;

export function document(content_promise, headers_init) {
  let body = new ReadableStream({
    async start(controller) {
      controller.enqueue(open);
      let content = await content_promise;
      controller.enqueue(render(content));
      controller.enqueue(close);
      controller.close();
    },
  });
  let headers = new Headers(headers_init);
  headers.set("content-type", "text/html");
  return new Response(body.pipeThrough(new TextEncoderStream()), {
    status: 200,
    headers,
  });
}
