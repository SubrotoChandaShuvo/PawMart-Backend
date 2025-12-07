const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();
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

    const database = client.db("pawMartProducts");
    const pawMartProducts = database.collection("listings");
    const orderCollection = database.collection("orders");

    //Post or save to listings to database
    app.post("/listings", async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.createdAt = date;
      // console.log(data);

      const result = await pawMartProducts.insertOne(data);
      res.send(result);
    });

    // Get listings from  DB
    app.get("/listings", async (req, res) => {
      const result = await pawMartProducts.find().toArray();
      res.send(result);
    });

    app.get("/listings/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);

      const query = { _id: new ObjectId(id) };
      const result = await pawMartProducts.findOne(query);
      res.send(result);
    });

    app.get("/listings/category/:category", async (req, res) => {
      const { category } = req.params;
      const query = { category };
      const result = await pawMartProducts.find(query).toArray();
      res.send(result);
    });

    app.get("/my-products", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const result = await pawMartProducts.find(query).toArray();
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const data = req.body;
      const id = req.params;
      const query = { _id: new ObjectId(id) };
      // console.log(data);

      const updateProducts = {
        $set: data,
      };

      const result = await pawMartProducts.updateOne(query, updateProducts);
      res.send(result);
    });

    app.delete('/delete/:id', async(req,res)=>{
      const id = req.params
      const query = { _id: new ObjectId(id) }
      const result = await pawMartProducts.deleteOne(query)
      res.send(result);
    })

    app.post('/orders', async(req, res)=>{
      const data = req.body;
      console.log(data)
      const result = await orderCollection.insertOne(data)
      res.status(201).send(result)
    })

    app.get("/recent", async (req, res) => {
      const result = await pawMartProducts.find().sort({ _id: -1 }).limit(6).toArray();
      console.log(result);
      
      res.status(200).send(result);
    });


    app.get('/orders', async(req,res)=>{
      const result = await orderCollection.find().toArray();
      res.status(201).send(result);
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
  // console.log(c);
});
