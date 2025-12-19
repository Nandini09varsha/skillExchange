export default function StatCard({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center h-28 flex flex-col justify-center">
      <h3 className="text-2xl font-bold text-purple-400">{value}</h3>
      <p className="text-sm text-gray-400 mt-1">{title}</p>
    </div>
  );
}
