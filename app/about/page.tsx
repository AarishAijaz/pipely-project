import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SectionHeader from "@/app/components/SectionHeader";
import StatCard from "@/app/components/StatCard";
import ValueCard from "@/app/components/ValueCard";
import TimelineItem from "@/app/components/TimelineItem";
import TeamMemberCard from "@/app/components/TeamMemberCard";

const stats = [
  { value: "12,000+", label: "Teams using Pipely" },
  { value: "180+", label: "Countries served" },
  { value: "$2.4B", label: "Pipeline tracked monthly" },
  { value: "99.98%", label: "Uptime SLA" },
];

const values = [
  { title: "Speed over ceremony", desc: "We ship fast, iterate faster, and don't let process get in the way of progress." },
  { title: "Built with our customers", desc: "Our roadmap is shaped by feedback from the reps and managers who use Pipely daily." },
  { title: "Simplicity is a feature", desc: "If it takes a training session to explain, it's not done yet." },
  { title: "Data you can trust", desc: "Accurate, real-time reporting — no stale dashboards or manual exports." },
];

const timeline = [
  { year: "2021", text: "Pipely founded by a team of ex-sales leaders frustrated with legacy CRMs." },
  { year: "2022", text: "Launched our first automation engine and passed 1,000 customers." },
  { year: "2023", text: "Raised Series A funding to expand our engineering and support teams." },
  { year: "2024", text: "Crossed 10,000 teams and launched native email and Slack integrations." },
  { year: "2026", text: "Introduced AI-powered deal insights, now used by teams in 180+ countries." },
];

const team = [
  { name: "Elena Marsh", role: "CEO & Co-founder" },
  { name: "Tomas Reyes", role: "CTO & Co-founder" },
  { name: "Sarah Kim", role: "VP of Product" },
  { name: "James Okafor", role: "VP of Engineering" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar active="about" />

      <main>
        {/* Hero */}
        <section className="max-w-3xl mx-auto px-8 pt-24 pb-14 text-center">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
            Our Story
          </span>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            We&apos;re building the CRM sales teams{" "}
            <span className="bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
              actually want to use
            </span>
          </h1>
          <p className="text-slate-500 text-lg">
            Founded in 2021, Pipely started with a simple idea: sales software should
            make selling easier, not add more busywork to your day.
          </p>
        </section>

        {/* Stats */}
        <section className="max-w-3xl mx-auto px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </section>

        {/* Mission */}
        <section className="max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our mission</h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              Most CRMs were built for sales managers to track their teams — not for
              reps to actually close deals. We flipped that. Every feature we ship
              starts with one question: does this help a rep close a deal faster today?
            </p>
            <p className="text-slate-500 leading-relaxed">
              That focus has shaped everything from our onboarding flow to our
              automation engine. No bloated dashboards nobody asked for. No setup
              wizards that take a quarter to finish. Just tools that get out of the way.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-sm aspect-[4/3] rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-400 shadow-2xl shadow-indigo-600/35 hover:-translate-y-1.5 transition-transform duration-300" />
          </div>
        </section>

        {/* Values */}
        <section className="bg-slate-50 py-24 px-8">
          <SectionHeader title="What we believe" />
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
            {values.map((v) => (
              <ValueCard key={v.title} {...v} />
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="max-w-3xl mx-auto px-8 py-24">
          <SectionHeader title="Where we've been" />
          <div className="relative pl-8 border-l-2 border-slate-200">
            {timeline.map((item, i) => (
              <TimelineItem key={item.year} {...item} isLast={i === timeline.length - 1} />
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-slate-50 py-24 px-8">
          <SectionHeader title="Meet the leadership team" subtitle="A small team with a lot of experience building sales tools." />
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {team.map((m) => (
              <TeamMemberCard key={m.name} {...m} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-24 px-8 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
          <h2 className="text-4xl font-bold mb-3">Come build the future of sales with us</h2>
          <p className="mb-8 opacity-90 text-lg">We&apos;re always looking for people who care about great products.</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-indigo-600 font-semibold px-8 py-3.5 rounded-lg shadow-xl hover:shadow-2xl transition-all">
              View Open Roles
            </button>
            <button className="bg-transparent text-white font-semibold px-8 py-3.5 rounded-lg border border-white/40 hover:bg-white/10 hover:border-white transition-all">
              Contact Us
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}