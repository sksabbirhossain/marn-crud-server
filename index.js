const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

//database connection
const url = "mongodb://localhost:27017";
const clint = new MongoClient(url);
async function dbConnect() {
  try {
    await clint.connect();
    console.log("Database connection successfull");
  } catch (error) {
    console.log("something worng!!!");
  }
}
dbConnect();

const users = clint.db("crud").collection("user");
//get the usres
app.get("/all-users", async (req, res) => {
  try {
    const query = {};
    const result = users.find(query);
    const allUser = await result.toArray();
    res.send({
      success: true,
      allUser,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// create user
app.post("/add-user", async (req, res) => {
  try {
    const createUser = await users.insertOne(req.body);
    res.send({
      success: true,
      createUser,
    });
  } catch (err) {
    console.log("erro");
  }
});

// update user
// get the user
app.get("/user/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const userDetails = await users.findOne({ _id: ObjectId(id) });
    res.send({
      success: true,
      data: userDetails,
    });
  } catch {
    res.send({
      success: false,
      message: "something went worng!",
    });
  }
});

// update the user
app.patch("/user/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await users.updateOne(
      { _id: ObjectId(id) },
      { $set: req.body }
    );
    if (user.matchedCount) {
      res.send({
        success: true,
        message: "update successfull",
      });
    } else {
      res.send({
        success: false,
        message: "something went worng!",
      });
    }
  } catch {
    res.send({
      success: false,
      message: "something went worng!",
    });
  }
});

// delete user
app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await users.deleteOne({ _id: ObjectId(id) });
    if (result.deletedCount) {
      res.send({
        success: true,
        message: "User Delete successfull",
      });
    } else {
      res.send({
        success: false,
        message: "user not deleted",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      message: "something worng",
    });
  }
});

//listening
app.listen("5000", () => {
  console.log("listen post 5000");
});
