import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import { CalculatorProvider } from "@/app/context/calculator-context";
import { Sidebar } from "@/app/components/sidebar";
import { PdfButton } from "@/app/components/pdf-button";

export const metadata: Metadata = {
  title: "Centered Care ROI Calculator",
  description: "Calculate the return on investment for Centered Care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full flex flex-col">
        <CalculatorProvider>
          {/* Top brand bar */}
          <div className="h-3 w-full bg-[#5287C2] print:hidden" />

          <div className="flex flex-1">
            <Sidebar />

            <main className="flex flex-col flex-1 min-h-0 bg-[#F5F7FA] p-4 md:p-5 overflow-auto">
              {/* Header */}
              <div className="mb-3 flex shrink-0 items-center gap-4 print:hidden">
                <Image
                  src="/cc_logo.png"
                  alt="Centered Care"
                  width={200}
                  height={40}
                  priority
                />
                <h1 className="text-3xl font-bold tracking-tight text-[#1C2C6B]">
                  ROI Calculator
                </h1>
                <div className="ml-auto">
                  <PdfButton />
                </div>
              </div>

              <div className="flex-1 min-h-0">
                {children}
              </div>
            </main>
          </div>
        </CalculatorProvider>
      </body>
    </html>
  );
}
