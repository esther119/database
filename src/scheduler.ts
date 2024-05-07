import cron from "node-cron";

// Define a cron job to fetch data every three hours
cron.schedule("0 */3 * * *", async () => {
  try {
    // Call the /refresh-data endpoint
    const response = await fetch("http://localhost:3000/refresh-data");
    if (response.ok) {
      const data = await response.json();
      // Optionally, you can process the data here
      console.log("Data fetched successfully:", data);
    } else {
      throw new Error("Failed to fetch data from /refresh-data");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
