import session from "express-session";
import connectRedis from "connect-redis";
import redis from "redis";
import { __prod__ } from "../constants";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: __prod__ ? "ec2-54-156-252-144.compute-1.amazonaws.com" : "",
  port: __prod__ ? 22459 : 6379,
  password: "p2246769a1fc0ac8aed4701672c222a64f8b8336ea0d773ecc63a4982155c0788",
});

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
