import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
import cors from "cors";
import { fetchDataFromDatabase } from "./redisUtils";

dotenv.config();

const app = express();
const client = createClient({ url: "redis://localhost:6379" });

app.use(
  cors({
    origin: "http://localhost:3001", // Allow only your React app origin
  })
);

// const client = createClient({
//   password: process.env.REDIS_PASSWORD,
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//   },
// });
client.on("connect", () => console.log("Connected to Redis!"));
client.on("error", (err) => console.log("Redis Client Error", err));

app.use(express.json());

app.post("/data", async (req, res) => {
  const { key, value } = req.body;
  console.log("data val", key, value);
  await client.connect();
  await client.set(key, value);
  await client.disconnect();
  res.send("Data saved to Redis");
});

app.get("/comments", async (req, res) => {
  try {
    const data = await fetchDataFromDatabase(); // Use the function here
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data from Redis:", error);
    res.status(500).send("Failed to retrieve data");
  }
});

app.get("/refresh-data", async (req, res) => {
  try {
    const data = await fetchDataFromDatabase();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch data from Redis:", error);
    res.status(500).send("Failed to retrieve data");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
