"use client";

import dynamic from "next/dynamic";
import { Providers } from "./providers";

const DynamicContent = dynamic(() => import("./MainContent"), {
  ssr: false,
  loading: () => (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      <p className="text-2xl">Loading wallet...</p>
    </main>
  ),
});

export default function Home() {
  return (
    <Providers>
      <DynamicContent />
    </Providers>
  );
}