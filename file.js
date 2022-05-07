import { join, extname } from "./deps.js";

let mimes = new Map([
  [".css", "text/css"],
  [".js", "application/js"],
  [".ico", "image/x-icon"],
]);

export async function file(path) {
  let file = await Deno.readFile(join("public", path));
  let ext = extname(path);
  let mime = mimes.get(ext);
  return new Response(file, {
    headers: {
      "content-type": mime || "text/plain",
    },
  });
}
