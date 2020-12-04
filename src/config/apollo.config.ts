import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { HelloResolver } from "../resolvers/hello";
import { PostResolver } from "../resolvers/post";
import { UserResolver } from "../resolvers/user";
import { buildSchema } from "type-graphql";
import { MyContext } from "src/types";
import { ApolloServerExpressConfig } from "apollo-server-express";

export default async (
  conn: MikroORM<IDatabaseDriver<Connection>>
): Promise<ApolloServerExpressConfig> => {
  return {
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }: MyContext): MyContext => ({
      em: conn.em,
      req,
      res,
    }),
  };
};
