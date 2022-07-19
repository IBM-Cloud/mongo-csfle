// make-data-key.js
const mongoclient = require ('./mongoclient')
const fs = require("fs")
const VAULT_DB = "encryption"
const VAULT_COLL = "__keyVault"
const KEY_ALT_NAME = "demo-data-key"
const { ClientEncryption } = require("mongodb-client-encryption")


async function main() {

  //create db connection
  const client = await mongoclient()

  const localMasterKey = fs.readFileSync("./master-key.txt")
  //console.log(localMasterKey.length)
 
  const encryption = new ClientEncryption(client, {
    keyVaultNamespace: `${VAULT_DB}.${VAULT_COLL}`,
    kmsProviders:  {
      local: {
        key: localMasterKey
      }
    }
  })
  
  //ensure unique index on Key vault
  try {
    await client
      .db(VAULT_DB)
      .collection(VAULT_COLL)
      .createIndex("keyAltNames", {
        unique: true,
        partialFilterExpression: {
          keyAltNames: {
            $exists: true
          }
        }
      })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  console.log("index created!")

  // create a data key
  let dataKey = await client
    .db(VAULT_DB)
    .collection(VAULT_COLL)
    .findOne({ keyAltNames: { $in: [KEY_ALT_NAME] } })

  if (dataKey === null) {
    dataKey = await encryption.createDataKey("local", {
      keyAltNames: [KEY_ALT_NAME]
    })
  }

  console.log("Base64 data key. Copy and paste this into clients.js\t", dataKey)

  client.close()
}

main().catch(console.dir)