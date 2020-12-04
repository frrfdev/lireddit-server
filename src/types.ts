import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
}