import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri: string = process.env.URI || "";
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

export const getClient = () => client;