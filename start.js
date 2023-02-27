import { serve, DB } from "./deps.js";
import { Server } from "./handler.js";
import { Model } from "./lib/database/db.js";

let db = new DB("db.sqlite");
let model = Model(db);
let handler = Server({ model });

serve(handler);
