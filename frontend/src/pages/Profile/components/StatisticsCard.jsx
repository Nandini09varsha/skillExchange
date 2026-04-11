export default function StatisticsCard({ className = "" }) {
  return (
    <div
      className={`
        bg-white/5 border border-white/10 rounded-3xl p-6
        flex flex-col
        h-full
        backdrop-blur-md
        ${className}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Statistics</h3>
        <span className="text-xs bg-white/10 px-3 py-1 rounded-full">Oct</span>
      </div>

      {/* CONTENT — STRETCHES TO MATCH TASK LIST */}
      <div className="flex flex-col gap-6 flex-1 justify-between">
        {/* PERFORMANCE */}
        <div className="bg-white/5 rounded-2xl p-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Performance</p>
            <p className="text-sm text-gray-400">Based on work</p>
            <span className="text-sm text-gray-300 mt-1 inline-block">
              +21%
            </span>
          </div>

          <div className="flex items-end gap-1 h-12">
            {[12, 20, 16, 26].map((h, i) => (
              <div
                key={i}
                className="bg-yellow-400 w-1.5 rounded"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>

        {/* SUCCESS */}
        <div className="bg-white/5 rounded-2xl p-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Success</p>
            <p className="text-sm text-gray-400">Based on projects</p>
            <span className="text-sm text-gray-300 mt-1 inline-block">
              +42%
            </span>
          </div>

          <div className="flex items-end gap-1 h-12">
            {[14, 22, 18, 28].map((h, i) => (
              <div
                key={i}
                className="bg-green-400 w-1.5 rounded"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>

        {/* INNOVATION */}
        <div className="bg-white/5 rounded-2xl p-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold">Innovation</p>
            <p className="text-sm text-gray-400">Worked ideas</p>
            <span className="text-sm text-gray-300 mt-1 inline-block">
              +12%
            </span>
          </div>

          <div className="flex items-end gap-1 h-12">
            {[10, 18, 14, 22].map((h, i) => (
              <div
                key={i}
                className="bg-blue-400 w-1.5 rounded"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
