export default function TimelineItem({
  year,
  text,
  isLast,
}: {
  year: string;
  text: string;
  isLast?: boolean;
}) {
  return (
    <div className={`relative pl-6 ${isLast ? "" : "mb-11"}`}>
      <div className="absolute -left-9.5 top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-400 border-2 border-indigo-50" />
      <div className="font-bold text-indigo-600 text-sm mb-1">{year}</div>
      <div className="leading-relaxed">{text}</div>
    </div>
  );
}