export default function TaskList() {
  const tasks = [
    {
      id: 1,
      title: "Start the two hours design sprint",
      members: 7,
      progress: 43,
      color: "text-indigo-400",
      ring: "border-indigo-400",
    },
    {
      id: 2,
      title: "Complete the Documentation of Travto app",
      members: 2,
      progress: 76,
      color: "text-yellow-400",
      ring: "border-yellow-400",
    },
    {
      id: 3,
      title: "Do A/B Testing on bench with team members",
      members: 1,
      progress: 32,
      color: "text-red-400",
      ring: "border-red-400",
    },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-14 space-y-4">
      <h3 className="font-semibold text-lg mb-2">Complete Due Tasks</h3>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between bg-white/5 rounded-2xl px-5 py-4"
        >
          {/* LEFT */}
          <div>
            <p className="font-medium">
              {task.id}. {task.title}
            </p>

            {/* Avatars */}
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-gray-400 border-2 border-[#020617]"
                  />
                ))}
              </div>
              <span>+{task.members} members</span>
            </div>
          </div>

          {/* RIGHT – Progress Ring */}
          <div className="relative w-12 h-12">
            <div
              className={`absolute inset-0 rounded-full border-4 border-white/10`}
            />
            <div
              className={`absolute inset-0 rounded-full border-4 ${task.ring}`}
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${
                  50 + task.progress / 2
                }% 0%, 100% 100%, 0% 100%)`,
              }}
            />
            <span
              className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${task.color}`}
            >
              {task.progress}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
