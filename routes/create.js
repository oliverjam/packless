import { cuid } from "../uid.js";

export function post() {
  let id = cuid();
  return new Response(null, {
    status: 303,
    headers: {
      location: "/pack/" + id,
    },
  });
}
