import { router, get, post, match } from "./lib/router.js";
import * as cookies from "./lib/cookies.js";
import { document } from "./lib/document.js";
import { file } from "./lib/file.js";
import * as home from "./routes/index.jsx";
import * as create from "./routes/create.js";
import * as pack from "./routes/pack.jsx";
import * as missing from "./routes/404.jsx";
import * as failed from "./routes/500.jsx";

let session = cookies.create("__HOST-session", { maxAge: 600 });

export async function handler(request) {
  let req_time = new Date().toLocaleTimeString();
  let incoming = `${request.method} ${request.url}`;
  console.log(`↑ ${req_time} ${incoming}`);

  let session_id = session.read(request.headers.get("cookie"));
  console.log({ session_id });
  try {
    let response = await router(
      get("/", document(home.get)),
      post("/create", create.post),
      get(match("/pack/:id"), document(pack.get)),
      post(match("/pack/:id"), pack.post),
      fallthrough
    )(request);

    let res_time = new Date().toLocaleTimeString();
    let type = response.headers.get("content-type") || "";
    console.log(`↓ ${res_time} ${incoming} ${response.status} ${type}`);

    return response;
  } catch (error) {
    console.error(error);
    return document(failed.get, error.status || 500)(request);
  }
}

let file_handler = file("public");
function fallthrough(req) {
  return file_handler(req).catch(() => document(missing.get, 404)(req));
}
