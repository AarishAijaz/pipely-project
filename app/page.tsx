import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import SectionHeader from "@/app/components/SectionHeader";
import FeatureCard from "@/app/components/FeatureCard";
import TestimonialCard from "@/app/components/TestimonialCard";
import PricingCard from "@/app/components/PricingCard";

const features = [
  { title: "Pipeline Management", desc: "Drag-and-drop deals through custom stages, with automatic activity tracking." },
  { title: "Smart Follow-ups", desc: "Never miss a lead — automated reminders based on deal activity and stage." },
  { title: "Team Analytics", desc: "See win rates, rep performance, and forecast accuracy in real time." },
  { title: "Email Sync", desc: "Two-way sync with Gmail and Outlook — every email logged automatically." },
  { title: "Custom Workflows", desc: "Automate task creation, lead assignment, and stage changes with rules." },
  { title: "Integrations", desc: "Connect Slack, Zapier, Stripe, and 50+ other tools out of the box." },
];

const testimonials = [
  { quote: "We cut our average deal cycle by three weeks after switching. The automation alone paid for itself.", name: "Dana Whitfield", role: "VP Sales, Northwind" },
  { quote: "Finally a CRM our reps actually want to use. Setup took an afternoon, not a quarter.", name: "Marcus Ibe", role: "Sales Director, Vertex" },
  { quote: "The pipeline visibility changed how we forecast. Leadership finally trusts the numbers.", name: "Dan White", role: "CRO, Solace" },
];

const plans = [
  { plan: "Starter", price: "$0", desc: "For individuals getting started", cta: "Start Free" },
  { plan: "Growth", price: "$29", desc: "For growing sales teams", cta: "Start Free Trial", featured: true },
  { plan: "Enterprise", price: "Custom", desc: "For large organizations", cta: "Contact Sales" },
];

export default function LandingPage() {
  return (
    <>
      <Navbar active="home" />

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-8 pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
              New: AI Deal Insights
            </span>
            <h1 className="text-5xl font-bold leading-tight mb-6 bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent">
              The CRM that helps your{" "}
              <span className="bg-gradient-to-br from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                sales team
              </span>{" "}
              close faster
            </h1>
            <p className="text-slate-500 text-lg mb-8 max-w-md">
              Track leads, automate follow-ups, and get a clear view of your pipeline —
              all in one place built for growing teams.
            </p>
            <div className="flex gap-4 mb-4">
              <button className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-lg shadow-lg shadow-indigo-600/35 hover:-translate-y-0.5 hover:shadow-xl transition-all">
                Start Free Trial
              </button>
              <button className="bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-lg border border-slate-200 hover:-translate-y-0.5 hover:border-indigo-600 transition-all">
                Watch Demo
              </button>
            </div>
            <p className="text-slate-500 text-sm">No credit card required · 14-day free trial</p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden hover:-translate-y-1.5 transition-transform duration-300">
              <div className="flex gap-1.5 px-4 py-3.5 border-b border-slate-200 bg-slate-50">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              </div>
              <div className="p-7 flex flex-col gap-4">
                <div className="h-3.5 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-90" style={{ width: "80%" }} />
                <div className="h-3.5 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-90" style={{ width: "60%" }} />
                <div className="h-3.5 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-90" style={{ width: "90%" }} />
                <div className="h-3.5 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-400 opacity-90" style={{ width: "45%" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Logos */}
        <section className="text-center px-8 py-10 bg-slate-50 text-slate-500 text-sm">
          <p>Trusted by fast-growing teams at</p>
          <div className="flex justify-center gap-12 mt-5 flex-wrap font-bold text-slate-400">
            <span>Northwind</span>
            <span>Vertex</span>
            <span>Solace</span>
            <span>Brightloop</span>
            <span>Cascade</span>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-6xl mx-auto px-8 py-24">
          <SectionHeader title="Everything your sales team needs" subtitle="Built to remove busywork, not add to it." />
          <div className="grid md:grid-cols-3 gap-7">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-slate-50 py-24 px-8">
          <SectionHeader title="Loved by sales teams everywhere" />
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-7">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-6xl mx-auto px-8 py-24">
          <SectionHeader title="Simple, transparent pricing" subtitle="Start free. Upgrade when your team grows." />
          <div className="grid md:grid-cols-3 gap-7">
            {plans.map((p) => (
              <PricingCard key={p.plan} {...p} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-24 px-8 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
          <h2 className="text-4xl font-bold mb-3">Ready to grow your pipeline?</h2>
          <p className="mb-8 opacity-90 text-lg">Join thousands of teams closing more deals with Pipely.</p>
          <button className="bg-white text-indigo-600 font-semibold px-8 py-3.5 rounded-lg shadow-xl hover:shadow-2xl transition-all">
            Start Your Free Trial
          </button>
        </section>
      </main>

      <Footer />
    </>
  );
}