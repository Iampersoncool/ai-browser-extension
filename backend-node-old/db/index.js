import postgres from 'postgres';

export const sql = postgres(process.env.PG_CONNECTION_STRING, {
  transform: postgres.toCamel,
});

export const queryDb = sql;
