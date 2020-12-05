// Dependencies
import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import express from "express";
import { PORT, __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";

// Configs
import mikroConfig from "./config/mikro-orm.config";
import apolloConfig from "./config/apollo.config";
import sessionConfig from "./config/session.config";

const main = async () => {
  const conn = await MikroORM.init(mikroConfig);
  await conn.getMigrator().up();

  const app = express();
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: /https:\/\/lireddit-web01.*/,
      // origin: "https://lireddit-web01-293j61npp.vercel.app",
      credentials: true,
    })
  );
  app.use(sessionConfig);

  const apolloServer = new ApolloServer(await apolloConfig(conn));
  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false,
    },
  });

  app.get("/", (_, res) => {
    return res.send("hello");
  });

  app.listen(PORT, () => {
    console.log(`server started on localhost:${PORT}`);
  });
};

main();
