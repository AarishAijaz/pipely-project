export default function ValueCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-7 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-400 transition-all">
      <div className="w-9.5 h-9.5 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 mb-4" />
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{desc}</p>
    </div>
  );
}