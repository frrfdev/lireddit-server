declare module "express-session" {
  interface Session {
    userId: number;
  }
}
declare module "connect-redis";
declare module "redis";
