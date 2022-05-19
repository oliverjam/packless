import { join, extname } from "./deps.js";

let mimes = new Map()
  .set(".css", "text/css")
  .set(".js", "application/js")
  .set(".ico", "image/x-icon");

export function file(dir) {
  return async (path) => {
    let file = await Deno.open(join(dir, path), { read: true });
    let stream = file.readable;
    let ext = extname(path);
    let mime = mimes.get(ext);
    return new Response(stream, {
      headers: {
        "content-type": mime || "text/plain",
      },
    });
  };
}
