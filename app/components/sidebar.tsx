"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/calculator", label: "Calculator" },
  { href: "/charts", label: "Charts" },
  { href: "/real-estate-valuation", label: "Real Estate Valuation" },
  { href: "/methodology", label: "Methodology" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-slate-200 bg-white p-4 print:hidden">
      {links.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-[#EAF2FB] text-[#1C2C6B]"
                : "text-slate-600 hover:bg-slate-100 hover:text-[#1C2C6B]"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
