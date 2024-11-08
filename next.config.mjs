import cron from 'node-cron';
import fetch from 'node-fetch';

const setupCronJob = () => {
  cron.schedule("00 00 * * *", async () => {
  console.log("Token resetting at: 23:59");

  try {
    const response = await fetch("http://clearhealth.care/api/reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(process.env.VALIDATION_API_KEY),
    });

    const text = await response.text();
    try {
      const result = JSON.parse(text);
      console.log(result.message);
    } catch (error) {
      console.error("Failed to parse JSON response:", text);
    }
  } catch (error) {
    console.error("Failed to reset token usage via API:", error);
  }
});
};
setupCronJob();


