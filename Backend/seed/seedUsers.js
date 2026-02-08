import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import connectDB from "../config/db.js";

dotenv.config({ path: "../.env" });

const seedUsers = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding users...");
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
        skillsHave: ["React", "JavaScript"],
        skillsWant: ["DSA"],
        availability: "Evenings",
        preferredMode: "Chat",
        bio: "Frontend developer who loves teaching React",
      },
      {
        name: "Neha Verma",
        email: "neha@test.com",
        password,
        collegeName: "KIET Group of Institutions",
        year: "3rd",
        branch: "IT",
        skillsHave: ["DSA"],
        skillsWant: ["React"],
        availability: "Weekends",
        preferredMode: "Call",
        bio: "Strong in problem solving and algorithms",
      },
      {
        name: "Rohit Singh",
        email: "rohit@test.com",
        password,
        collegeName: "AKGEC",
        year: "4th",
        branch: "CSE",
        skillsHave: ["Node.js", "MongoDB"],
        skillsWant: ["React"],
        availability: "Evenings",
        preferredMode: "VC",
        bio: "Backend enthusiast",
      },
      {
        name: "Pooja Mehta",
        email: "pooja@test.com",
        password,
        collegeName: "AKGEC",
        year: "2nd",
        branch: "IT",
        skillsHave: ["UI/UX"],
        skillsWant: ["React"],
        availability: "Weekdays",
        preferredMode: "VC",
        bio: "Design-focused learner",
      },
      {
        name: "Arjun Patel",
        email: "arjun@test.com",
        password,
        collegeName: "KIET Group of Institutions",
        year: "3rd",
        branch: "CSE",
        skillsHave: ["Java", "DSA"],
        skillsWant: ["Web Development"],
        availability: "Evenings",
        preferredMode: "Call",
        bio: "Preparing for interviews",
      },

      // 🔥 Additional users for better matching

      {
        name: "Simran Kaur",
        email: "simran@test.com",
        password,
        collegeName: "GL Bajaj",
        year: "2nd",
        branch: "CSE",
        skillsHave: ["Web Development"],
        skillsWant: ["DSA"],
        availability: "Evenings",
        preferredMode: "Chat",
        bio: "Exploring full-stack development",
      },
      {
        name: "Kunal Mehta",
        email: "kunal@test.com",
        password,
        collegeName: "GL Bajaj",
        year: "4th",
        branch: "IT",
        skillsHave: ["DSA", "C++"],
        skillsWant: ["React"],
        availability: "Weekends",
        preferredMode: "Call",
        bio: "Competitive programming enthusiast",
      },
      {
        name: "Ananya Gupta",
        email: "ananya@test.com",
        password,
        collegeName: "KIET Group of Institutions",
        year: "1st",
        branch: "CSE",
        skillsHave: ["HTML", "CSS"],
        skillsWant: ["React"],
        availability: "Weekdays",
        preferredMode: "Chat",
        bio: "Just started learning frontend",
      },
      {
        name: "Mohit Jain",
        email: "mohit@test.com",
        password,
        collegeName: "AKGEC",
        year: "3rd",
        branch: "CSE",
        skillsHave: ["React"],
        skillsWant: ["Node.js"],
        availability: "Evenings",
        preferredMode: "VC",
        bio: "Interested in MERN stack",
      },
      {
        name: "Riya Malhotra",
        email: "riya@test.com",
        password,
        collegeName: "GL Bajaj",
        year: "2nd",
        branch: "IT",
        skillsHave: ["Python"],
        skillsWant: ["Web Development"],
        availability: "Weekends",
        preferredMode: "Chat",
        bio: "Python lover exploring web",
      },
    ];

    await User.insertMany(users);

    console.log("✅ Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();
