// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});
// config.resolver.assetExts.push(
//   // Adds support for `.db` files for SQLite databases
//   "db"
// );
//adds support for modules using mj/cjs extensions like react-hook-form
config.resolver.assetExts.push("mjs");
config.resolver.assetExts.push("cjs");


module.exports = config;
