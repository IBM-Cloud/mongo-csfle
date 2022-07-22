const mongoclient = require("./mongoencryptedclient.js")

const main = async function () {
  const uc = await mongoclient()
 
  const database = uc.db("medicalRecords");
  const collection = database.collection("patients")

  var query = {ssn: 374007263};
  var doc = await collection.findOne(query)
  console.log(doc)
  await uc.close()

}

main()