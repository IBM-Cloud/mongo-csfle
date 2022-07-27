const mongodb = require("mongodb")
const { Binary } = mongodb


module.exports = function (dataKey = null) {
  if (dataKey === null) {
    throw new Error(
      "dataKey is a required argument. Ensure you've defined it in clients.js"
    )
  }
  return {
    "medicalRecords.patients": {
      bsonType: "object",
      // specify the encryptMetadata key at the root level of the JSON Schema.
      // As a result, all encrypted fields defined in the properties field of the
      // schema will inherit this encryption key unless specifically overwritten.
      encryptMetadata: {
        keyId: [new Binary(Buffer.from(dataKey, "base64"), 4)]
      },
      properties: {
        insurance: {
          bsonType: "object",
          properties: {
            // The insurance.policyNumber field is embedded inside the insurance
            // field and represents the patient's policy number.
            // This policy number is a distinct and sensitive field. 
            policyNumber: {
              encrypt: {
                bsonType: "int",
                algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
              }
            }
          }
        },
        // The medicalRecords field is an array that contains a set of medical record documents. 
        // Each medical record document represents a separate visit and specifies information
        // about the patient at that that time, such as their blood pressure, weight, and heart rate.
        // This field is sensitive and should be encrypted.
        medicalRecords: {
          encrypt: {
            bsonType: "array",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
          }
        },
        // The bloodType field represents the patient's blood type.
        // This field is sensitive and should be encrypted. 
        bloodType: {
          encrypt: {
            bsonType: "string",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
          }
        },
        // The ssn field represents the patient's 
        // social security number. This field is 
        // sensitive and should be encrypted.
        ssn: {
          encrypt: {
            bsonType: "int",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
          }
        }
      }
    }
  }
}