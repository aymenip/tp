import { MongoClient, ObjectId } from "mongodb";

module.exports = async (req, res) => {
  let mongoClient, db, collection;
  try {
    let username = "benhassinedr";
    let password = "IshblcMPDX6uxW7x";
    let uri = `mongodb+srv://${username}:${password}@cluster0.35hscsg.mongodb.net/?retryWrites=true&w=majority`;
    mongoClient = new MongoClient(uri);
    console.log("Connecting to MongoDB Atlas cluster...");
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB Atlas!");

    // go to serverless db
    db = mongoClient.db("serverless");
    collection = db.collection("users");
  } catch (error) {
    res.status(404);
    console.error("Connection to MongoDB Atlas failed!", error);
  }

  if (req.method == "GET") {
    const user = await collection.findOne({
      _id: new ObjectId(req.query.userid),
    });
    console.log(req.body.userid, user, new ObjectId(req.body.userid));
    res.status(200).json(user);
  } else if (req.method == "POST") {
    try {
      //create user document
      const userDocument = {
        name: req.body.fullname,
        birthdate: new Date(2000, 12, 27),
        address: { street: "Aflou 03001", city: "Aflou", state: "AF" },
      };

      await collection.insertOne(userDocument);

      res.status(204).json({
        message: "done",
      });
    } catch (error) {
      res.status(404);
      console.error("Connection to MongoDB Atlas failed!", error);
    } finally {
      await mongoClient.close();
    }
  }
};
