const express = require("express");

// Purpose: pulls ScoreBoard 



// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


// This section will help you get a list of all the records.
recordRoutes.route("/users").get(function (req, res) {
  let db_connect = dbo.getDb("CardGame");
  db_connect
    .collection("ScoreBoard")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      const results = res.json(result);
      db_connect.close();
      return results;
    });


});

// This section will help you get a single record by id
recordRoutes.route("/users/:id").get(function (req, res) {
  let db_connect = dbo.getDb("CardGame");
  let myquery = { userId: parseInt(req.params.id) };
  db_connect
    .collection("Scoreboard")
    .findOne(myquery, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you create a new record.
recordRoutes.route("/users/add").post(function (req, response) {
  let db_connect = dbo.getDb("CardGame");
  let myobj = {
    name: req.body.person_name,
    position: req.body.person_position,
    level: req.body.person_level,
  };
  db_connect.collection("Users").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb("CardGame");
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      person_name: req.body.person_name,
      person_position: req.body.person_position,
      person_level: req.body.person_level,
    },
  };
  db_connect
    .collection("ScoreBoard")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb("CardGame");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("ScoreBoard").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = recordRoutes;