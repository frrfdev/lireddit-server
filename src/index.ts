// Dependencies
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { PORT, __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";

// Configs
import mikroConfig from "./config/mikro-orm.config";
import apolloConfig from "./config/apollo.config";
import sessionConfig from "./config/session.config";

const main = async () => {
  const conn = await MikroORM.init(mikroConfig);
  await conn.getMigrator().up();

  const corsConfig = { credentials: true };
  const app = express();
  app.set("trust proxy", 1);
  app.use(sessionConfig);

  const apolloServer = new ApolloServer(await apolloConfig(conn));
  apolloServer.applyMiddleware({ app, cors: corsConfig });

  app.get("/", (_, res) => {
    return res.send("hello");
  });

  app.listen(PORT, () => {
    console.log(`server started on localhost:${PORT}`);
  });
};

main();
