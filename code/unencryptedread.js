const mongoclient = require("./mongoclient.js")
const constants = require("./constants.js")

const main = async function () {
  const uc = await mongoclient()

  const database = uc.db(constants.RECORDS_DB);
  const collection = database.collection(constants.RECORDS_COLL)

  var query = { name: "Genevie Rains" };
  var doc = await collection.findOne(query)
  console.log(doc)
  await uc.close()

}

main()