const express = require("express");
const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
// const client = createClient({ url: "redis://localhost:6379" });

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
client.on("connect", () => console.log("Connected to Redis!"));
client.on("error", (err) => console.log("Redis Client Error", err));

async function fetchData() {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  // Fetch all keys - use with caution
  const keys = await client.keys("*");
  console.log(keys);

  // Fetch values for each key
  for (const key of keys) {
    const value = await client.get(key);
    console.log(`Key: ${key}, Value: ${value}`);
  }

  await client.disconnect();
}

fetchData();

// app.use(express.json());

// app.post("/data", async (req, res) => {
//   const { key, value } = req.body;
//   console.log("data val", key, value);
//   await client.connect();
//   await client.set(key, value);
//   await client.disconnect();
//   res.send("Data saved to Redis");
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
