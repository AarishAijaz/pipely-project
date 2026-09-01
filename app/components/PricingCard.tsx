export default function PricingCard({
  plan,
  price,
  desc,
  cta,
  featured,
}: {
  plan: string;
  price: string;
  desc: string;
  cta: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative border rounded-2xl p-9 text-center hover:-translate-y-1 hover:shadow-xl transition-all ${
        featured
          ? "border-2 border-indigo-600 scale-[1.03] shadow-2xl shadow-indigo-600/20"
          : "border-slate-200"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white text-xs font-semibold px-3.5 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <h3 className="text-lg font-semibold">{plan}</h3>
      <div className="text-4xl font-extrabold my-4">
        {price}
        {price !== "Custom" && <span className="text-base text-slate-500 font-normal">/mo</span>}
      </div>
      <p className="text-slate-500 text-sm mb-7">{desc}</p>
      <button
        className={`w-full font-semibold px-5 py-2.5 rounded-lg transition-all ${
          featured
            ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30"
            : "bg-white text-slate-900 border border-slate-200"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}