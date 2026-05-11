'use strict';

// Vercel serverless entry. Wraps the same Express app from ../server.js,
// but skips app.listen() and runs the DB in-memory only.

process.env.BIRDCLAW_SERVERLESS = '1';

const path = require('path');
const { buildApp } = require('../server');

let appPromise = null;

module.exports = async (req, res) => {
  if (!appPromise) appPromise = buildApp();
  const app = await appPromise;
  return app(req, res);
};
