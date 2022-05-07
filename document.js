import { render } from "./deps.js";

let head = /*html*/ `<head>
    <meta charset="utf-8" />
    <title>Packless</title>
    <link rel="stylesheet" href="main.css"/>
  </head>`;

export function send(
  content_promise,
  status = 200,
  headers = { "content-type": "text/html; charset='utf-8'" }
) {
  let body = new ReadableStream({
    async start(controller) {
      controller.enqueue(/*html*/ `<!doctype html>
<html>
  ${head}
  <body>
    `);
      let content = await content_promise;
      controller.enqueue(render(content));
      controller.enqueue(/*html*/ `
  </body>
</html>
      `);
      controller.close();
    },
  });
  return new Response(body.pipeThrough(new TextEncoderStream()), {
    status,
    headers,
  });
}
