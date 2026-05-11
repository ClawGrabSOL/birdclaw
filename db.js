'use strict';

// Tiny better-sqlite3-compatible shim built on sql.js (pure JS, no native build).
// Persists to disk by writing the in-memory db to a file after each transaction
// or after each statement step (debounced).

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

let SQL = null;
let DB = null;
let DB_PATH = null;
let dirty = false;
let saveTimer = null;

function debouncedSave() {
  dirty = true;
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    if (!dirty) return;
    dirty = false;
    try {
      const bytes = Buffer.from(DB.export());
      fs.writeFileSync(DB_PATH + '.tmp', bytes);
      fs.renameSync(DB_PATH + '.tmp', DB_PATH);
    } catch (e) {
      console.error('db save error:', e);
    }
  }, 80);
}

async function open(filePath) {
  if (DB) return api();
  DB_PATH = filePath;
  SQL = await initSqlJs();
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    DB = new SQL.Database(new Uint8Array(data));
  } else {
    DB = new SQL.Database();
  }
  return api();
}

function exec(sql) {
  DB.exec(sql);
  debouncedSave();
}

function pragma(_p) {
  // sql.js does not need WAL / foreign_keys pragmas the same way; no-op.
}

function prepare(sql) {
  // Create a fresh statement on each call; sql.js closes prepared statements
  // whenever DB.exec() runs (e.g. BEGIN/COMMIT), which makes caching fragile.
  return {
    run(...args) {
      const stmt = DB.prepare(sql);
      try {
        stmt.bind(flat(args));
        stmt.step();
        const changes = DB.getRowsModified();
        let lastId = 0;
        try {
          const r = DB.exec('SELECT last_insert_rowid() AS id');
          if (r.length && r[0].values.length) lastId = r[0].values[0][0];
        } catch {}
        debouncedSave();
        return { changes, lastInsertRowid: lastId };
      } finally {
        try { stmt.free(); } catch {}
      }
    },
    get(...args) {
      const stmt = DB.prepare(sql);
      try {
        stmt.bind(flat(args));
        const has = stmt.step();
        return has ? stmt.getAsObject() : undefined;
      } finally {
        try { stmt.free(); } catch {}
      }
    },
    all(...args) {
      const stmt = DB.prepare(sql);
      try {
        stmt.bind(flat(args));
        const out = [];
        while (stmt.step()) out.push(stmt.getAsObject());
        return out;
      } finally {
        try { stmt.free(); } catch {}
      }
    },
  };
}

function flat(args) {
  // Flatten ...args called like prepare(...).run(a, b, c) or prepare(...).all(...arr)
  const out = [];
  for (const a of args) {
    if (Array.isArray(a)) for (const x of a) out.push(normalize(x));
    else out.push(normalize(a));
  }
  return out;
}
function normalize(v) {
  if (v === undefined) return null;
  if (typeof v === 'boolean') return v ? 1 : 0;
  return v;
}

function transaction(fn) {
  return (...args) => {
    DB.exec('BEGIN');
    try {
      const result = fn(...args);
      DB.exec('COMMIT');
      debouncedSave();
      return result;
    } catch (e) {
      DB.exec('ROLLBACK');
      throw e;
    }
  };
}

function api() {
  return { exec, pragma, prepare, transaction };
}

module.exports = { open };
