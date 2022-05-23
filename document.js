import { render } from "./deps.js";

let open = /*html*/ `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Packless</title>
    <link rel="stylesheet" href="/main.css"/>
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
    headers.set("content-type", "text/html");
    return new Response(body.pipeThrough(new TextEncoderStream()), {
      status,
      headers,
    });
  };
