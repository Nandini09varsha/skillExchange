import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ResultCard({ user }) {
  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:scale-105 transition-all">
      <CardHeader>
        <div className="flex items-center gap-4">
          <img
            src={
              user.profileImage ||
              "https://ui-avatars.com/api/?name=" + user.name
            }
            alt="profile"
            className="w-14 h-14 rounded-full object-cover border border-white/20"
          />

          <div>
            <CardTitle>{user.name}</CardTitle>
            <p className="text-sm text-gray-400">{user.branch}</p>

            {/* ⭐ Rating */}
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg">
                  {i < (user.rating || 0) ? "★" : "☆"}
                </span>
              ))}
              <span className="text-gray-400 text-sm ml-2">
                ({user.rating || 0})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Skills Offered */}
        <div>
          <p className="text-sm text-purple-300">Teaches:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skillsOffered?.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-purple-600/30 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mt-4">
          <p className="text-sm text-blue-300">Wants to Learn:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.skillsWanted?.length > 0 ? (
              user.skillsWanted.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-blue-600/30 rounded-full"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-xs">Not specified</span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm text-gray-400">
        <span>Sessions Taught: {user.sessionsTaught}</span>

        <button
          onClick={() => console.log("Connect clicked for:", user._id)}
          className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 
            hover:scale-105 hover:shadow-lg 
            rounded-lg text-white text-sm transition-all duration-200"
        >
          Connect 💬
        </button>
      </CardFooter>
    </Card>
  );
}
