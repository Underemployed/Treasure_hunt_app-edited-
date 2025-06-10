const mongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const state = {
  db: null,
};

module.exports.connect = function (done) {
  // use ur mongodb url and port num in 
  // all routes in player.js
  const url = process.env.DB_URL || "mongodb://localhost:27017";
  // const url = 'mongodb://0.0.0.0:27017/';
  const dbName = "treasurehunt";
  return new Promise(async (resolve, reject) => {
    try {
      const client = await mongoClient.connect(url); // no options needed
      state.db = client.db(dbName);
      done(); // success
    } catch (err) {
      done(err); // forward the error
    }
  });
};



module.exports.get = function () {
  return state.db;
};
