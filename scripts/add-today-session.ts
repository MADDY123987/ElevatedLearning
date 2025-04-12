import { db } from "../server/db";
import { liveSessions } from "../shared/schema";

async function addTodaySession() {
  console.log("🌱 Adding today's live session...");
  
  try {
    // Get today's date
    const today = new Date();
    
    // Add today's session
    const todaySession = {
      title: "Introduction to Web Development",
      description: "Learn the fundamentals of HTML, CSS, and JavaScript to start building your own websites.",
      instructorName: "Elevated",
      duration: 90,
      sessionDate: today,
      meetingId: "1234567890",
      meetingPassword: "123456"
    };
    
    await db.insert(liveSessions).values(todaySession);
    console.log("✅ Today's live session added successfully");
  } catch (error) {
    console.error("❌ Error adding today's live session:", error);
  }
}

addTodaySession()
  .catch(console.error)
  .finally(() => process.exit(0));