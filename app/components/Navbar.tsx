import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar({ active }: { active: "home" | "about" | "dashboard" }) {
  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-xl text-indigo-600">
          Pipely
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/#features" className="text-slate-900 font-medium text-sm hover:text-indigo-600 transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-slate-900 font-medium text-sm hover:text-indigo-600 transition-colors">
            Pricing
          </Link>
          <Link href="/#testimonials" className="text-slate-900 font-medium text-sm hover:text-indigo-600 transition-colors">
            Customers
          </Link>
        </nav>
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className={
              active === "dashboard"
                ? "text-indigo-600 font-semibold text-sm"
                : "text-slate-500 font-medium text-sm hover:text-indigo-600 transition-colors"
            }
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className={
              active === "about"
                ? "text-indigo-600 font-semibold text-sm"
                : "text-slate-500 font-medium text-sm hover:text-indigo-600 transition-colors"
            }
          >
            About
          </Link>
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5 hover:shadow-xl transition-all"
            >
              Sign In
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}