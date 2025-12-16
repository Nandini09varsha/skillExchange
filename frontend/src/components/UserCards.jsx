import { motion } from "framer-motion";
import RatingCard from "./RatingCard";

const users = [
  {
    name: "Aarav Mehta",
    profession: "Guitar Mentor",
    img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
  },
  {
    name: "Sara Kapoor",
    profession: "Python Tutor",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136",
  },
];

export default function UserCards() {
  return (
    <section className="relative -mt-120 px-10 hidden lg:block">
      <div className="relative flex justify-end gap-24 items-start">
        {/* LEFT USER — slightly lower */}
        <motion.div className="glass rounded-3xl p-4 translate-y-24 relative z-20">
          <img
            src={users[0].img}
            className="w-64 h-80 object-cover rounded-2xl"
            alt={users[0].name}
          />
          <div className="text-center mt-4">
            <h3 className="font-semibold">{users[0].name}</h3>
            <p className="text-sm text-purple-300">{users[0].profession}</p>
          </div>
        </motion.div>

        {/* RIGHT USER — top aligned */}
        <div className="flex flex-col items-center relative">
          <motion.div className="glass rounded-3xl p-4">
            <img
              src={users[1].img}
              className="w-72 h-96 object-cover rounded-2xl"
              alt={users[1].name}
            />
            <div className="text-center mt-4">
              <h3 className="font-semibold">{users[1].name}</h3>
              <p className="text-sm text-purple-300">{users[1].profession}</p>
            </div>
          </motion.div>

          {/* ⭐ Rating card BELOW right user */}
          <div className="mt-6">
            <RatingCard />
          </div>
        </div>
      </div>
    </section>
  );
}
