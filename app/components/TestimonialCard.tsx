export default function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all">
      <p className="mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10.5 h-10.5 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600" />
        <div>
          <div className="font-semibold text-sm">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
    </div>
  );
}