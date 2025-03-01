import { queryDb } from './index.js';

export async function runMigrations() {
  return queryDb`
    CREATE TABLE IF NOT EXISTS revisions(
    id SERIAL PRIMARY KEY,
    original_text TEXT NOT NULL,
    response_text TEXT NOT NULL,

    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES revisions(id) ON DELETE CASCADE
  )
`;
}
