import { serve, render } from "./deps.js";
import { file } from "./file.js";
import * as Index from "./routes/index.jsx";
import * as Not_Found from "./routes/404.jsx";

async function handler(request) {
  let time = new Date().toLocaleTimeString();
  let { method, url } = request;
  console.log(`${time} ${method} ${url}`);

  let { pathname } = new URL(url);
  let route = `${method} ${pathname}`;
  switch (route) {
    case "GET /":
      return send(Index.get(request));
    case "POST /":
      return send(Index.get(request));
    default:
      return await file(pathname).catch(() =>
        send(Not_Found.get(request), 404)
      );
  }
}

function send(
  node,
  status = 200,
  headers = { "content-type": "text/html; charset='utf-8'" }
) {
  return new Response(render(node), { status, headers });
}

serve(handler);
