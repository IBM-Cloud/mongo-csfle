const EC= require("./mongoencryptedclient")
const fs = require("fs")
const constants = require("./constants.js")

const getRecords = function() {
  //read in the text file with all the records (which are strings), split by newline and then turn each line into a json object
  return fs.readFileSync("./records.txt").toString().split("\n").map(function (str) {
    return JSON.parse(str)
  })

} 

const main = async function () {
  const docs = getRecords()
  //console.log(docs)

  const ec = await EC()

  const database = ec.db(constants.RECORDS_DB);
  const collection = database.collection(constants.RECORDS_COLL)

 //create an index
 try {
  await collection.createIndex("ssn")
  await collection.createIndex("insurance.policyNumber")
} catch (e) {
  console.error(e)
  process.exit(1)
}

console.log("indexes created!")

  console.log("inserting data...")

  // insert data
  await collection.insertMany(docs)
  console.log("data insterted!")

  await ec.close()

}

main()