import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { PORT } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

// Configs
import mikroConfig from "./config/mikro-orm.config";

const main = async () => {
  const conn = await MikroORM.init(mikroConfig);
  await conn.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: () => ({
      em: conn.em,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    return res.send("hello");
  });

  app.listen(PORT, () => {
    console.log(`server started on localhost:${PORT}`);
  });
};

main();
