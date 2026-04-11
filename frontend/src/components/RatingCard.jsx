export default function RatingCard() {
  return (
    <div
      className="glass rounded-2xl px-6 py-4 flex items-center gap-4
                    w-70"
    >
      {/* Avatar */}
      <img
        src="https://images.unsplash.com/photo-1544717305-2782549b5136"
        alt="Instructor"
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Info */}
      <div>
        <p className="text-white font-semibold leading-tight">Fariya Islam</p>
        <p className="text-sm text-gray-400">Python Instructor</p>

        {/* Stars */}
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-yellow-400 text-sm">
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
