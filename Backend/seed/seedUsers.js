import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

// Load env from Backend/.env
dotenv.config({ path: "../.env" });

const seedUsers = async () => {
  try {
    await connectDB();
    console.log("🌱 Seeding users...");

    // Clear existing users (DEV ONLY)
    await User.deleteMany({});

    const password = await bcrypt.hash("password123", 10);

    const users = [
      {
        name: "Aman Sharma",
        email: "aman@test.com",
        password,
        collegeName: "KIET Group of Institutions",
        year: "2nd",
        branch: "CSE",
        bio: "Frontend developer who loves teaching React",
        skillsHave: ["React", "JavaScript"],
        skillsWant: ["DSA"],
        skillLevel: "Intermediate",
        availability: "Evenings",
        preferredMode: "Chat",
        credits: 10,
      },
      {
        name: "Neha Verma",
        email: "neha@test.com",
        password,
        collegeName: "KIET Group of Institutions",
        year: "3rd",
        branch: "IT",
        bio: "Strong in problem solving and algorithms",
        skillsHave: ["DSA"],
        skillsWant: ["React"],
        skillLevel: "Beginner",
        availability: "Weekends",
        preferredMode: "Call",
        credits: 8,
      },
      {
        name: "Rohit Singh",
        email: "rohit@test.com",
        password,
        collegeName: "AKTU",
        year: "4th",
        branch: "CSE",
        bio: "Backend enthusiast",
        skillsHave: ["Node.js", "MongoDB"],
        skillsWant: ["System Design"],
        skillLevel: "Intermediate",
        availability: "Evenings",
        preferredMode: "Chat",
        credits: 12,
      },
      {
        name: "Pooja Mehta",
        email: "pooja@test.com",
        password,
        collegeName: "AKGEC",
        year: "2nd",
        branch: "IT",
        bio: "Design-focused learner",
        skillsHave: ["UI/UX"],
        skillsWant: ["React"],
        skillLevel: "Beginner",
        availability: "Weekdays",
        preferredMode: "VC",
        credits: 6,
      },
      {
        name: "Arjun Patel",
        email: "arjun@test.com",
        password,
        collegeName: "KIET Group of Institutions",
        year: "3rd",
        branch: "CSE",
        bio: "Preparing for interviews",
        skillsHave: ["Java", "DSA"],
        skillsWant: ["Web Development"],
        skillLevel: "Advanced",
        availability: "Evenings",
        preferredMode: "Call",
        credits: 15,
      },
    ];

    await User.insertMany(users);

    console.log("✅ Users seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedUsers();
