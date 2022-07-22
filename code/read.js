const mongoclient = require("./mongoencryptedclient.js")
const constants = require("./constants.js")

const main = async function () {
  const uc = await mongoclient()
 
  const database = uc.db(constants.RECORDS_DB);
  const collection = database.collection(constants.RECORDS_COLL)

  var query = {ssn: 374007263};
  var doc = await collection.findOne(query)
  console.log(doc)
  await uc.close()

}

main()