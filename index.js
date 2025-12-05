const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://petPow:BfXW4bFDEVh359kr@cluster0.hc6rogn.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const database = client.db('pawMartProducts');
    const pawMartProducts = database.collection('listings');

    //Post or save to listings to database
    app.post('/listings', async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.createdAt = date;
      console.log(data);

      const result = await pawMartProducts.insertOne(data);
      res.send(result);
    });


    // Get listings from  DB
    app.get('/listings', async(req, res)=>{
      const result =await pawMartProducts.find().toArray();
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Developers");
});

app.listen(port, () => {
  console.log(`Server id running on ${port}`);
});
