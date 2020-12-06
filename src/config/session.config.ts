import session from "express-session";
import connectRedis from "connect-redis";
import redis from "redis";
import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  SECRET,
  __prod__,
} from "../constants";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
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
  secret: SECRET,
  resave: false,
  saveUninitialized: false,
});
