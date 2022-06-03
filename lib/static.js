import { join, extname } from "../deps.js";

let mimes = new Map()
  .set(".css", "text/css; charset=UTF-8")
  .set(".js", "application/js")
  .set(".ico", "image/x-icon");

export function serve_static(dir) {
  return async (_request, params) => {
    if (params.file) {
      let file = await Deno.open(join(dir, params.file), { read: true });
      if (file) {
        let stream = file.readable;
        let ext = extname(params.file);
        let mime = mimes.get(ext);
        return new Response(stream, {
          headers: {
            "content-type": mime || "text/plain",
          },
        });
      }
    }
  };
}
