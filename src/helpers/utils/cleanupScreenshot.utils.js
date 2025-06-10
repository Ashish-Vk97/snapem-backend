const cron = require("node-cron");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");



const Screenshot = require("../../api/screenshots/schemas/screenshot.schema");
const User= require("../../api/users/schemas/user.schema");
const s3 = require("./s3.utils");
const { sendSms } = require("./smsSender");

// Run every day at midnight


 async function runCleanupJob() {
// cron.schedule("0 0 * * *", async () => {
  try {
    console.log("🧹 Running screenshot cleanup cron job...");
    

    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - 30); 
    console.log(cutoffDate, "cutoffDate=====>");

    // 1. Find entries with date strictly older than 30 days
    const oldEntries = await Screenshot.find({ date: { $lt: cutoffDate } });

    if (oldEntries.length === 0) {
      console.log("📦 No screenshot entries older than 30 days to delete.");
      return;
    }

    for (const entry of oldEntries) {
      // Extra safety: skip any invalid date entries
      if (!entry.date || isNaN(new Date(entry.date))) {
        console.warn(`⚠️ Skipping entry with invalid date: ${entry._id}`);
        continue;
      }

      // 2. Delete all screenshots from S3
      for (const screenshot of entry.screenshots) {
        if (screenshot.s3Key) {
          try {
            await s3.send(new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: screenshot.s3Key,
            }));
            console.log(`🗑️ Deleted S3 object: ${screenshot.s3Key}`);
          } catch (err) {
            console.error(`❌ Error deleting S3 object ${screenshot.s3Key}:`, err.message);
          }
        }
      }

      // 3. Remove reference from user's screenshotsList
      await User.updateOne(
        { _id: entry.user },
        { $pull: { screenshotsList: entry._id } }
      );

      // 4. Delete MongoDB screenshot entry
      await Screenshot.deleteOne({ _id: entry._id });
      console.log(`🗃️ Deleted MongoDB screenshot entry: ${entry._id}`);
    }

    console.log("✅ Screenshot cleanup job completed.");
  } catch (err) {
    console.error("💥 Error in screenshot cleanup cron job:", err.message);
  }
// })
 }

 module.exports = {
   runCleanupJob,
 };



