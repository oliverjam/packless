import { render } from "../deps.js";

let open = /*html*/ `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Packless</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="/static/main.css" />
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎒</text></svg>"
    >
  </head>
  <body>`;
// @todo inject auto-reload on save to a script?
let close = `
  </body>
</html>`;

export let document =
  (handler, status = 200, headers_init = {}) =>
  (...args) => {
    let content_promise = handler(...args);
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
    headers.set("content-type", "text/html; charset=UTF-8");
    return new Response(body.pipeThrough(new TextEncoderStream()), {
      status,
      headers,
    });
  };
