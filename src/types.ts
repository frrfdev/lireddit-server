import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import * as Express from "express";

export interface MyContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Express.Request & { session: { userId: number } };
  res: Express.Response;
}
