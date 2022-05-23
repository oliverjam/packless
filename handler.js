import { document } from "./document.js";
import { file } from "./file.js";
import { router, get, post, match } from "./router.js";
import * as home from "./routes/index.jsx";
import * as create from "./routes/create.js";
import * as pack from "./routes/pack.jsx";
import * as missing from "./routes/404.jsx";
import * as failed from "./routes/500.jsx";

export function handler(request) {
  let time = new Date().toLocaleTimeString();
  console.log(`${time} ${request.method} ${request.url}`);

  try {
    return router(
      get("/", document(home.get)),
      post("/create", create.post),
      get(match("/pack/:id"), document(pack.get)),
      fallthrough
    )(request);
  } catch (error) {
    console.error(error);
    return document(failed.get, error.status || 500)(request);
  }
}

let file_handler = file("public");
function fallthrough(req) {
  return file_handler(req).catch(() => document(missing.get, 404)(req));
}
