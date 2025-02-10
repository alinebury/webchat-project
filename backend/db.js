import { MongoClient } from 'mongodb'

const client = new MongoClient("mongodb+srv://alinedl77:123@clusterstudy.7fcdf.mongodb.net/?retryWrites=true&w=majority&appName=ClusterStudy");

let collectionDocuments;

try {
  await client.connect();
  
  const db = client.db("ChatWebSockets");
  collectionDocuments = db.collection("documents");
  
  console.log("Connected to MongoDB!");
} catch (error) {
  console.error(error);
}


export {
  collectionDocuments
}
