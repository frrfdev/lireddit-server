import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";

export interface ICustomRequest extends Request {
  session: any;
}

export interface MyContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: ICustomRequest;
  res: Response;
}
