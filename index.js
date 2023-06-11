const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())


console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qygdymi.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const teacherCollection = client.db('allSchool').collection('teacher');
    const allClassCollection = client.db('allSchool').collection('classes');
    const cartCollection = client.db('allSchool').collection('carts');
    const parsonCollection = client.db('allSchool').collection('parson');

    app.get('/teacher', async(req,res)=>{
      const cursor = teacherCollection.find();
      const result = await cursor.toArray()
      res.send(result)

    })
    app.get('/classes', async(req,res)=>{
      const cursor = allClassCollection.find();
      const result = await cursor.toArray()
      res.send(result)

    })
    app.post('/carts',async(req,res)=>{
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result)
    })
    app.get('/carts',async(req,res)=> {
        const email = req.query.email;
        if(!email){
          res.send([]);
        }
        const query = {email: email};
        const result = await cartCollection.find(query).toArray();
        res.send(result);
    })
    app.delete('/carts/:id', async (req,res)=> {
        const id = req.params.id;
        const query = {_id: new ObjectId (id)};
        const result = await cartCollection.deleteOne(query);
        res.send(result)
    })

    app.post('/parson',async (req,res)=> {
      const user = req.body;
      const query= {email: user.email}
      const findUser = await parsonCollection.findOne(query);
      if(findUser){
        return res.send({massage: 'already have a account'})
      }
      const result = await parsonCollection.insertOne(user);
      res.send(result)
    })

    app.get('/parson', async (req,res) => {
      const result = await parsonCollection.find().toArray();
      res.send(result)
    })

    app.patch('/parson/admin/:id',async(req,res)=> {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const updateRole = {
          $set: {
            role: 'admin'
          },
      };

      const result = await parsonCollection.updateOne(filter,updateRole);
      res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





// not a vaild code here
app.get('/', (req, res) => {
  res.send('Hello World!bd')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// assignment-12

// LXFyCPE0ypGYayT9