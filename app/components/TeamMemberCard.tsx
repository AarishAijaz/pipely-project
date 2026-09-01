export default function TeamMemberCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="p-6 rounded-2xl hover:bg-white hover:-translate-y-1 hover:shadow-xl transition-all">
      <div className="w-21 h-21 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 mx-auto mb-4" />
      <div className="font-bold">{name}</div>
      <div className="text-slate-500 text-sm mt-1">{role}</div>
    </div>
  );
}