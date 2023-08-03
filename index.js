const express = require('express');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nucgrat.mongodb.net/?retryWrites=true&w=majority`;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nucgrat.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const taskCollection = client.db('todoDB').collection('allTasks')

        // Get all tasks api
        app.get('/all-tasks', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result)
        })

        // Get One task api
        app.get('task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.findOne(query)
            res.send(result)
        })

        // Create a new task api
        app.post('/tasks/new', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask)
            res.send(result)
        })

        // Delete a task api
        app.delete('task/delete/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const result = await taskCollection.deleteOne(filter)
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Task Manger is running!')
})

app.listen(port, () => {
    console.log(`Task manager is with port ${port}`)
})