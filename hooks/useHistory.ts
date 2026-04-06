import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

export interface HistoryItem {
  id: number;
  data: string;
  type: string;
  timestamp: number;
}

const DB_NAME = 'qr_history.db';

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    const initDb = async () => {
      const database = await SQLite.openDatabaseAsync(DB_NAME);
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          data TEXT NOT NULL,
          type TEXT,
          timestamp INTEGER NOT NULL
        );
      `);
      setDb(database);
      loadHistory(database);
    };

    initDb();
  }, []);

  const loadHistory = async (database: SQLite.SQLiteDatabase) => {
    const result = await database.getAllAsync<HistoryItem>('SELECT * FROM history ORDER BY timestamp DESC LIMIT 100');
    setHistory(result);
  };

  const addHistoryItem = async (data: string, type: string) => {
    if (!db) return;
    const timestamp = Date.now();
    await db.runAsync('INSERT INTO history (data, type, timestamp) VALUES (?, ?, ?)', [data, type, timestamp]);
    await loadHistory(db);
  };

  return { history, addHistoryItem };
};
