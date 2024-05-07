// 1. Create client to connect to redis database
// 2. We create/call the api to fetch the data

import { createClient } from "redis";
export async function createRedisClient() {
  let client = createClient({ url: "redis://localhost:6379" });
  await client.connect();
  console.log("client connected");
  const setResult = await client.set("myKey", "Hello");
  console.log(setResult); // "OK"
  const getResult = await client.get("myKey");
  console.log(getResult);
  await client.disconnect();
}

createRedisClient();
