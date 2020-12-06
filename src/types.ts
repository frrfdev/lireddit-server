import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import * as Express from "express";

// declare module "express-session" {
//   interface Session {
//     userId: number;
//   }
// }

export interface MyContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Express.Request;
  res: Express.Response;
}
