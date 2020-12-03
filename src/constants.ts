export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT ?? 4000;

export const DB_NAME = __prod__ ? process.env.DATABASE_NAME : "lireddit";
export const DB_USER = __prod__ ? process.env.DATABASE_USER : "postgres";
export const DB_PASSWORD = __prod__ ? process.env.DATABASE_PASSWORD : "1234";
export const DB_HOST = __prod__ ? process.env.DATABASE_HOST : "127.0.0.1";
