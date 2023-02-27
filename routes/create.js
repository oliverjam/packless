import { cuid } from "../lib/uid.js";

export function post({ request, model }) {
  let id = cuid();
  model.create_pack(id, request.user.id);
  return new Response(null, {
    status: 303,
    headers: {
      location: "/pack/" + id,
    },
  });
}
