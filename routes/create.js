import { cuid } from "../lib/uid.js";
import { create_pack } from "../lib/database/db.js";

export function post(req) {
  let id = cuid();
  create_pack(id, req.user.id);
  return new Response(null, {
    status: 303,
    headers: {
      location: "/pack/" + id,
    },
  });
}
