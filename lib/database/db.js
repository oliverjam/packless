import { DB } from "../../deps.js";

let DB_PATH = Deno.env.get("DB_PATH");

let db = new DB(DB_PATH);

let schema = Deno.readTextFileSync("lib/database/schema.sql");
db.execute(schema);

let insert_session = db.prepareQuery(/*sql*/ `
  INSERT INTO sessions (id, user_id, expires_at)
  VALUES (:id, :user_id, DATE('now', :expires_at))
  RETURNING id, expires_at
`);

export function create_session(expires_at, user_id) {
  let id = crypto.randomUUID();
  return insert_session.oneEntry({ id, expires_at, user_id });
}

let select_session = db.prepareQuery(/*sql*/ `
  SELECT users.id, users.email, users.guest
  FROM sessions
  JOIN users ON user_id = users.id
  WHERE sessions.id = :id
`);

export function get_user_from_session(id) {
  return select_session.oneEntry({ id });
}

let insert_user = db.prepareQuery(/*sql*/ `
  INSERT INTO users (email) VALUES (:email) RETURNING id, email, guest
`);

export function create_user() {
  return insert_user.oneEntry();
}

let select_user = db.prepareQuery(/*sql*/ `
  SELECT id, email, guest FROM users WHERE id = :id
`);

export function get_user(id) {
  return select_user.oneEntry({ id });
}

let insert_pack = db.prepareQuery(/*sql*/ `
  INSERT INTO packs (id, user_id) VALUES (:id, :user_id)
  RETURNING id
`);

export function create_pack(id, user_id) {
  return insert_pack.oneEntry({ id, user_id });
}

let select_pack = db.prepareQuery(/*sql*/ `
  SELECT user_id, title, created_at
  FROM packs
  WHERE id = :id
`);

export function get_pack(id) {
  return select_pack.oneEntry({ id });
}

let insert_item = db.prepareQuery(/*sql*/ `
  INSERT INTO items (user_id, name, weight)
  VALUES (:user_id, :name, :weight)
  ON CONFLICT(name, user_id)
  DO UPDATE SET id = id
  RETURNING id, name, weight;
`);

let insert_pack_item = db.prepareQuery(/*sql*/ `
  INSERT INTO packs_items (pack_id, item_id, quantity)
  VALUES (:pack_id, :item_id, :quantity)
  ON CONFLICT(pack_id, item_id)
    DO UPDATE SET quantity = quantity + :quantity
  RETURNING quantity
`);

export function add_pack_item({ pack_id, name, user_id, weight, quantity }) {
  console.log({ pack_id, name, user_id, weight, quantity });
  let item_id = insert_item.oneEntry({ name, weight, user_id });
  let item = insert_pack_item.oneEntry({ pack_id, item_id, quantity });
  return { item_id, quantity: item.quantity };
}

let select_pack_items = db.prepareQuery(/*sql*/ `
  SELECT name, weight, quantity
  FROM items
  JOIN packs_items ON id = item_id
  WHERE pack_id = :id
`);

export function get_pack_items(id) {
  return select_pack_items.allEntries({ id });
}

// function parse_dates(obj) {
//   if (obj.created_at) {
//     obj.created_at = new Date(obj.created_at + "Z")
//   }
//   if (obj.expires_at) {
//     obj.expires_at = new Date(obj.expires_at + "Z")
//   }
// }
