export default function ScoreCard({ className = "" }) {
  return (
    <div
      className={`
        bg-white/5 border border-white/10 rounded-3xl
        flex flex-col items-center justify-center h-70 backdrop-blur-md

        ${className}
      `}
    >
      <div className="w-32 h-32 rounded-full border-10 border-purple-500 flex items-center justify-center text-3xl font-bold">
        70%
      </div>

      <p className="mt-5 text-gray-400 text-sm uppercase tracking-wide">
        Score
      </p>

      <span className="text-purple-400 text-sm mt-1">Fantastic job</span>
    </div>
  );
}
