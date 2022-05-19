import { document } from "./document.js";
import { file } from "./file.js";
import * as Index from "./routes/index.jsx";
import * as Missing from "./routes/404.jsx";
import * as Failed from "./routes/500.jsx";

let file_handler = file("public");

export async function handler(request) {
  let time = new Date().toLocaleTimeString();
  let { method, url } = request;
  console.log(`${time} ${method} ${url}`);

  try {
    let { pathname } = new URL(url);
    let route = `${method} ${pathname}`;
    switch (route) {
      case "GET /":
        return document(Index.get(request));
      case "POST /":
        return await Index.post(request);
      default:
        return await file_handler(pathname).catch(() =>
          document(Missing.get(request), 404)
        );
    }
  } catch (error) {
    console.error(error);
    return document(await Failed.get(request), error.status || 500);
  }
}
