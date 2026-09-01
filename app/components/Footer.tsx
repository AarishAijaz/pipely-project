import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-18 px-8 pb-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-12">
        <div>
          <div className="font-extrabold text-xl text-white">Pipely</div>
          <p className="text-slate-400 text-sm mt-2">The CRM built for modern sales teams.</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="text-white font-semibold text-sm mb-2">Product</h4>
          <Link href="/#features" className="text-slate-400 text-sm hover:text-white transition-colors">Features</Link>
          <Link href="/#pricing" className="text-slate-400 text-sm hover:text-white transition-colors">Pricing</Link>
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="text-white font-semibold text-sm mb-2">Company</h4>
          <Link href="/about" className="text-slate-400 text-sm hover:text-white transition-colors">About</Link>
          <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Careers</a>
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="text-white font-semibold text-sm mb-2">Legal</h4>
          <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Privacy</a>
          <a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Terms</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-slate-700 pt-6 text-sm text-slate-400">
        © 2026 Pipely, Inc. All rights reserved.
      </div>
    </footer>
  );
}