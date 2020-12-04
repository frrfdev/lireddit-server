import session from "express-session";
import connectRedis from "connect-redis";
import redis from "redis";
import { __prod__ } from "../constants";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

export default session({
  name: "qid",
  store: new RedisStore({
    client: redisClient,
    disableTouch: true,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    httpOnly: true,
    secure: __prod__,
    sameSite: "lax",
  },
  secret: "asdasodpaksospk3235236",
  resave: false,
  saveUninitialized: false,
});