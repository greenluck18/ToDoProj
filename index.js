var bodyParser = require('body-parser')
const { MongoClient, ObjectId } = require('mongodb')
var express = require('express')
// var http = require('http');
// const fs = require("fs");
var path = require('path');

var app = express();
app.set('view engine', 'ejs');
app.use('/static', express.static('public'))
app.use('/static', express.static('scripts'))
app.use(bodyParser.json());

async function addTask(body) {
    const uri = "mongodb+srv://greenLuck:Liberty02112703@cluster0.md1qx.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    var response = ''
    try {
        await client.connect();
        response = await addTaskMongo(client, {
            name: body.name,
            done: "false",
            delete: "false"
        })
    }
    catch (err) {
        console.error(err);
    } finally {
        await client.close();
        return response
    }

}

async function updateTask(body) {
    const uri = "mongodb+srv://greenLuck:Liberty02112703@cluster0.md1qx.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    var response = ''
    try {
        await client.connect();
        console.log(body)
        response = await updateListingById(client, body)
    }
    catch (err) {
        console.error(err);
    } finally {
        await client.close();
        return response
    }

}

async function deleteTask(body) {
    const uri = "mongodb+srv://greenLuck:Liberty02112703@cluster0.md1qx.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    var response = ''
    try {
        await client.connect();
        console.log(body)
        response = await deleteListingById(client, body)
    }
    catch (err) {
        console.error(err);
    } finally {
        await client.close();
        return response
    }
}

async function clearAllDeletedTask() {
    const uri = "mongodb+srv://greenLuck:Liberty02112703@cluster0.md1qx.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    var response = ''
    try {
        await client.connect();
        response = await clearLists(client)
    }
    catch (err) {
        console.error(err);
    } finally {
        await client.close();
        return response
    }
}

async function getTasks(body) {
    const uri = "mongodb+srv://greenLuck:Liberty02112703@cluster0.md1qx.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    var response = ''
    try {
        await client.connect();
        response = await getActiveTasksMongo(client)
    }
    catch (err) {
        console.error(err);
    } finally {
        await client.close();
        return response
    }

}
async function getActiveTasksMongo(client, newListing) {

    var findLine = await client.db("ToDo").collection("ToDoList").find({
        delete: "false"
    })
    findLine = await findLine.toArray()
    return findLine
}
async function getCompletedTasksMongo(client, newListing) {

    var findLine = await client.db("ToDo").collection("ToDoList").find({
        done: "true",
        delete: "false"
    })
    findLine = await findLine.toArray()
    return findLine
}
async function clearLists(client) {
    const result = await client.db("ToDo").collection("ToDoList").deleteMany({ delete: "true" });
    console.log(`${result.deletedCount} documents was/were deleted`);
    return result
}

async function updateListingById(client, updateListing) {
    console.log(updateListing)
    const result = await client.db("ToDo").collection("ToDoList").updateOne({ _id: ObjectId(updateListing._id) }, { $set: { done: updateListing.done, delete: updateListing.delete } });
    console.log(`${result.matchedCount} document(s) matched the query criteria `);
    console.log(`${result.modifiedCount} documents was/were updated`);
    return result
}

async function deleteListingById(client, deleteListing) {
    console.log(deleteListing)
    const result = await client.db("ToDo").collection("ToDoList").updateOne({ _id: ObjectId(deleteListing._id) }, { $set: { done: deleteListing.done, delete: "true" } });
    console.log(`${result.matchedCount} document(s) matched the query criteria `);
    console.log(`${result.modifiedCount} documents was/were deleted`);
}

async function addTaskMongo(client, newListing) {
    const result = await client.db("ToDo").collection("ToDoList").insertOne(newListing);
    console.log(`New listing creating with the following id: ${result.insertedId}`);
    const findLine = await client.db("ToDo").collection("ToDoList").findOne({ name: newListing.name })
    return findLine
}



app.get('/', async function (req, res) {
    // var s = await hello();
    // res.render("todo.ejs")
     res.sendFile(__dirname + "/index.html")
})

app.get('/toDo', async function (req, res) {
    res.send(await getTasks())
})

app.post('/toDo', async function (req, res) {
    // res.send(req.body)
    res.send(await addTask(req.body))
})

app.post('/toDotest', async function (req, res) {
    // res.send(req.body)
    res.send(await updateTask(req.body))
})

app.post('/toDoDel', async function (req, res) {
    // res.send(req.body)
    res.send(await deleteTask(req.body))
})

app.post('/toDoClearAll', async function (req, res) {
    // res.send(req.body)
    res.send(await clearAllDeletedTask())
})

// addTaskMnogo().catch(console.error);


app.listen(8081);



