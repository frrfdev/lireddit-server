import { MikroORM } from "@mikro-orm/core";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER, __prod__ } from "../constants";
import { Post } from "../entities/Post";
import path from "path";
import { User } from "../entities/User";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
    disableForeignKeys: false,
  },
  entities: [Post, User],
  dbName: DB_NAME,
  type: "postgresql",
  debug: !__prod__,
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: 5432,
} as Parameters<typeof MikroORM.init>[0];
