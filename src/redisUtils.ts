// redisUtils.ts

import { createClient } from "redis";

export async function fetchDataFromDatabase(): Promise<{ [key: string]: any }> {
  const client = createClient({ url: "redis://localhost:6379" });

  try {
    await client.connect();

    const keys: string[] = await client.keys("*");
    let data: { [key: string]: any } = {};
    for (const key of keys) {
      const type: string = await client.type(key);
      switch (type) {
        case "string":
          const stringValue: string | null = await client.get(key);
          if (stringValue !== null) {
            data[key] = stringValue;
          }
          break;
        case "hash":
          const hashValue: { [field: string]: string } | null =
            await client.hGetAll(key);
          if (hashValue !== null) {
            data[key] = hashValue;
          }
          break;
        default:
          data[key] = `Unsupported type: ${type}`;
          break;
      }
    }
    return data;
  } catch (error) {
    console.error("Failed to fetch data from Redis:", error);
    throw error; // Rethrow the error to be caught by the caller
  } finally {
    await client.disconnect();
  }
}
