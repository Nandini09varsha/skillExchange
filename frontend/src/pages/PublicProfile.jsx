import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [id]);
const requestSession = async () => {
  try {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("http://localhost:5000/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
     body: JSON.stringify({
  requesterId: loggedUser.id,
  tutorId: user._id,
  skill: user.skillsOffered?.[0] || "General",
  mode: "Chat"
})
    });

    const data = await res.json();

    alert("Session request sent!");
    console.log(data);

  } catch (err) {
    console.error(err);
  }
};
  if (!user) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b141a] text-white p-10">
      <div className="max-w-4xl mx-auto bg-[#202c33] p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0)}
          </div>

          <div>
            <h1 className="text-3xl font-semibold">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    {i < Math.round(user.avgRating || 0) ? "★" : "☆"}
                  </span>
                ))}
              </div>

              <span className="text-sm text-gray-400">
                {user.avgRating || 0} Rating
              </span>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Skills Offered</h2>
          <div className="flex flex-wrap gap-3">
            {user.skillsOffered?.length > 0 ? (
              user.skillsOffered.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#005c4b] px-4 py-2 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No skills added yet</p>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <p className="text-gray-300">{user.bio || "No bio added yet."}</p>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>

          {user.reviews && user.reviews.length > 0 ? (
            user.reviews.map((review, index) => (
              <div key={index} className="bg-[#2a3942] p-4 rounded-lg mb-3">
                <p className="text-yellow-400">⭐ {review.rating}</p>
                <p className="text-gray-300 mt-1">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No reviews yet.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/chat/${user._id}`)}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg"
          >
            Message
          </button>
<button
  onClick={requestSession}
  className="bg-[#00a884] hover:bg-[#019875] px-6 py-2 rounded-lg"
>
  Request Session
</button>
        </div>
      </div>
    </div>
  );
}