const EC= require("./mongoencryptedclient")


const doc= 
{
  "name": "Jon Doe",
  "ssn": 241014209,
  "bloodType": "AB+",
  "medicalRecords": [
     {
     "weight": 180,
     "bloodPressure": "120/80"
     }
  ],
  "insurance": {
     "provider": "MaestCare",
     "policyNumber": 123142
  }
}

const main = async function () {
  const ec = await EC()

  const database = ec.db("medicalRecords");
  const collection = database.collection("patients")

  console.log("inserting data...")

  // insert data
  await collection.insertOne(doc)
  console.log("data insterted!")

  await ec.close()

}

main()