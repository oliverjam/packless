import { DB } from "../../deps.js";

let DB_PATH = Deno.env.get("DB_PATH");

let db = new DB(DB_PATH);

let schema = Deno.readTextFileSync("lib/database/schema.sql");
db.execute(schema);

let insert_session = db.prepareQuery(/*sql*/ `
  INSERT INTO sessions (id, user_id) VALUES (:id, :user_id);
`);

export function create_session(user_id) {
  let id = crypto.randomUUID();
  insert_session.execute({ id, user_id });
  return id;
}

let select_session = db.prepareQuery(/*sql*/ `
  SELECT user_id FROM sessions WHERE id = :id
`);

export function get_user_from_session(id) {
  let [user_id] = select_session.one({ id });
  return user_id;
}

let insert_user = db.prepareQuery(/*sql*/ `
  INSERT INTO users (email) VALUES (:email) RETURNING id
`);

export function create_user() {
  let [id] = insert_user.one();
  return id;
}

let select_user = db.prepareQuery(/*sql*/ `
  SELECT id, email, guest FROM users WHERE id = :id
`);

export function get_user(id) {
  return select_user.oneEntry({ id });
}
