export default function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 border border-slate-200 rounded-2xl hover:-translate-y-1 hover:shadow-xl hover:border-indigo-400 transition-all">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 mb-5" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{desc}</p>
    </div>
  );
}