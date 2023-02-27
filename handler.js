import { router, get, post, all, match } from "./lib/router.js";
import * as cookies from "./lib/cookies.js";
import { document } from "./lib/document.js";
import { serve_static } from "./lib/static.js";
import * as home from "./routes/home.jsx";
import * as create from "./routes/create.js";
import * as pack from "./routes/pack.jsx";
import * as missing from "./routes/404.jsx";
import * as failed from "./routes/500.jsx";

export function Server({ model }) {
  return async (request) => {
    let req_time = new Date().toLocaleTimeString();
    let incoming = `${request.method} ${request.url}`;
    console.log(`\n⬆︎ ${req_time} ${incoming}`);

    try {
      let handle = router(
        get(match("/static/:file"), serve_static("public")),
        all(match("*"), sessions),
        get("/", document(home.get)),
        post("/create", create.post),
        get(match("/pack/:id"), document(pack.get)),
        post(match("/pack/:id"), pack.post),
        missing.get
      );

      let response = await handle({ request, model });
      if (request.session_cookie) {
        response.headers.set("set-cookie", request.session_cookie);
      }

      let res_time = new Date().toLocaleTimeString();
      let type = response.headers.get("content-type") || "";
      console.log(`⬇︎ ${res_time} ${incoming} ${response.status} ${type}`);

      return response;
    } catch (error) {
      console.error(error);
      return document(failed.get, error.status || 500)({ request });
    }
  };
}

let one_day = 1000 * 60 * 60 * 24;
let session_cookie = cookies.create("__HOST-session", { maxAge: one_day });

function sessions({ request, model }) {
  let session_id = session_cookie.read(request.headers.get("cookie"));
  if (session_id) {
    request.user = model.get_user_from_session(session_id);
  } else {
    request.user = model.create_user();
    let expires_at = "+1 day";
    let session = model.create_session(expires_at, request.user.id);
    let expires = session.expires_at;
    request.session_cookie = session_cookie.write(session.id, { expires });
  }
}
