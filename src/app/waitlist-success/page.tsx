import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex justify-center items-center my-6">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Logo />
          <p className="font-semibold text-2xl">Dayblog</p>
        </Link>
      </header>
      <main className="flex-1 p-6">
        <section className="mt-14 sm:mt-40">
          <h1 className="font-semibold text-center text-3xl sm:text-5xl max-w-lg mx-auto pb-1 text-gradient">
            Thank you for joining the waitlist!
          </h1>
          <p className="text-center text-neutral-400 mt-4 sm:mt-6">
            Dayblog is coming to you soon, keep your inbox open for updates!
          </p>
        </section>
      </main>
      <div className="absolute bottom-32 w-full">
        <footer className="flex justify-center">
          <nav className="flex flex-col gap-2">
            <p className="text-2xl font-semibold text-gradient text-center">
              Dayblog
            </p>
            <p className="text-xs text-center text-neutral-500">
              All rights reserved. © 2024
            </p>
          </nav>
        </footer>
      </div>
    </div>
  );
}
