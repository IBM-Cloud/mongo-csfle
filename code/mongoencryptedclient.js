const fs = require("fs")
const localMasterKey = fs.readFileSync("./master-key.txt")
const mongodb = require("mongodb")
const { MongoClient } = mongodb

const config = require("./config.json");
const password = config.password.value
const uri = config.url.value.replace('$PASSWORD', password)
const cert = Buffer.from(config.cert.value, "base64").toString()
fs.writeFileSync("cert.pem", cert)
const schemamap = require("./schemamap.js")
const VAULT_DB = "encryption"
const VAULT_COLL = "__keyVault"

module.exports = async function () {

  //read the file with the keyid
  const keyid = fs.readFileSync("keyid.txt").toString()

  // now create the schema Map for an encrypted client
  const sm = schemamap(keyid)


  // create a connection to the database
  const opts =
  {
    tls: true,
    tlsCAFile: "./cert.pem",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    monitorCommands: true,
    autoEncryption: {
       // The key vault collection contains the data key that the client uses to encrypt and decrypt fields.
       keyVaultNamespace: `${VAULT_DB}.${VAULT_COLL}`,
       // The client expects a key management system to store and provide the application's master encryption key.
       // For now, we will use a local master key, so they use the local KMS provider.
       kmsProviders: {
        local: {
          key: localMasterKey
        }
      },
       // The JSON Schema that we have defined doesn't explicitly specify the collection to which it applies.
       // To assign the schema, they map it to the medicalRecords.patients collection namespace
       schemaMap:sm
    }
  }

  const ec = new MongoClient(uri, opts)
  await ec.connect()

  console.log("Connected!")

  return ec
}