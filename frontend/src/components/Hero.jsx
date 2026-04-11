"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// You will need a placeholder image for the profile picture
// For this example, I'm using a generic path. Replace with your actual image path.
const PROFILE_IMAGE_URL = "/placeholder-profile.jpg";

// Component for the Star Rating
const StarRating = ({ count }) => {
  const stars = [];
  // Use a full star for count, and an empty (faded) star for the remainder up to 5
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        className={`text-xl ${
          i < count ? "text-yellow-400" : "text-gray-500 opacity-50"
        }`}
      >
        ★
      </span>
    );
  }
  return <div className="flex space-x-0.5">{stars}</div>;
};

// Component for the Instructor/Rating Card with Glassmorphism
const InstructorCard = ({ name, title, imageUrl, rating }) => (
  // Glassmorphism effect: backdrop-filter blur and semi-transparent background
  <div className="flex items-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg max-w-xs absolute bottom-10 left-1/2 transform -translate-x-1/2 lg:relative lg:bottom-0 lg:left-0 lg:translate-x-0">
    {/* Profile Image (Icon) */}
    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white/50">
      <img
        src={imageUrl}
        alt={`${name} profile`}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Info and Rating */}
    <div className="flex flex-col">
      <p className="text-white font-semibold text-base leading-tight">{name}</p>
      <p className="text-gray-300 text-sm leading-tight mb-1">{title}</p>
      <StarRating count={rating} />
    </div>
  </div>
);

export default function Hero() {
  return (
    <section className="relative px-10 py-24 overflow-hidden">
      {/* glow */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-purple-500/30 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-pink-500/30 blur-[120px]" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-purple-400 text-xl mb-4">
            ● Skill Exchange Platform
          </p>

          <h1 className="text-6xl xl:text-6xl font-bold leading-tight">
            Empower Your Learning <br />
            Journey With <span className="text-purple-400">SkillSwap</span>
          </h1>

          <p className="text-gray-300 mt-6 max-w-lg text-xl">
            Learn new skills by exchanging what you already know. <br />
            Connect,teach, and grow together.
          </p>

          <div className="flex gap-5 mt-10">
            <div className="transition-transform duration-300 hover:scale-110">
              <Button className="bg-purple-600 px-8 py-7 hover:bg-purple-700">
                Join Now
              </Button>
            </div>

            <div className="transition-transform duration-300 hover:scale-110">
              <Button
                variant="outline"
                className="border-white/20 px-8 py-7 hover:bg-white/10"
              >
                Explore Skills
              </Button>
            </div>
          </div>

          <div className="flex gap-10 mt-12 text-sm text-gray-400">
            <div>
              <b className="text-white text-xl">250+</b> Skills
            </div>
            <div>
              <b className="text-white text-xl">10k+</b> Learners
            </div>
            <div>
              <b className="text-white text-xl">1k+</b> Tutors
            </div>
          </div>
        </motion.div>

        {/* RIGHT - Image/Card Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-96 flex items-center justify-center lg:justify-end"
        >
          {/* Placeholder for the main boy and girl images (if you add them later) */}
          {/* For now, this is just a container for the rating card */}

          {/* INSTRUCTOR/RATING CARD (Positioned on the main image/right column) */}
          <InstructorCard
            name="Fariya Islam"
            title="Python Instructor"
            imageUrl={PROFILE_IMAGE_URL}
            rating={4} // Example rating out of 5
          />
        </motion.div>
      </div>
    </section>
  );
}
