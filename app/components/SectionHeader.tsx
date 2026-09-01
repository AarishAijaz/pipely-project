export default function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-xl mx-auto mb-14">
      <h2 className="text-4xl font-bold mb-3">{title}</h2>
      {subtitle && <p className="text-slate-500 text-lg">{subtitle}</p>}
    </div>
  );
}