export default function ProgressRing({ value }) {
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-2xl p-6
                    flex flex-col items-center justify-center"
    >
      <div
        className="w-24 h-24 rounded-full border-8 border-purple-500
                      flex items-center justify-center text-xl font-bold"
      >
        {value}%
      </div>
      <p className="text-sm text-gray-400 mt-2">Skill Score</p>
    </div>
  );
}
