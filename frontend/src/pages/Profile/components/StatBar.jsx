export default function StatBar({ label, value }) {
  return (
    <div className="mb-4 backdrop-blur-md">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full">
        <div
          className="h-2 bg-purple-500 rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
