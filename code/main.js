const fs = require("fs")
const { MongoClient } = require("mongodb")
const config = require("./config.json")
const password = config.password.value
const uri = config.url.value.replace('$PASSWORD', password)
const cert = Buffer.from(config.cert.value, "base64").toString()
const DBNAME = "members"
const COLL = "mylist"

fs.writeFileSync("cert.pem", cert)

async function main() {

    const doc = {
        "name": "Bob",
        "surname": "The Builder",
        "niNumber": "abc12345",
        "bankAccountNumber": "00245566",
        "userId": 1,
        "joinDate": "2022-07-15"
    }

    const opts = {
        tls: true,
        tlsCAFile: "./cert.pem",
        useUnifiedTopology: true
    }

    const client = new MongoClient(uri, opts);

    console.log("connecting to MongoDB...")
    await client.connect();

    // select DB
    const database = client.db(DBNAME);
    const collection = database.collection(COLL)

    const collections = (await database.listCollections().toArray()).map(e => e.name)
    //console.log(collections)
    if (collections.indexOf(COLL) !== -1) {
        console.log("Collection exists.. dropping")
        //collection exists... drop it
        await collection.drop()
    }

    console.log("inserting data...")

    // insert data
    await collection.insertOne(doc)

    client.close()
}

main();