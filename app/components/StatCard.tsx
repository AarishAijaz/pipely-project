export default function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-6 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="text-3xl font-extrabold text-indigo-600">{value}</div>
      <div className="text-slate-500 text-sm mt-1">{label}</div>
    </div>
  );
}