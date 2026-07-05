import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80svh] items-center overflow-hidden">
      <div
        className="glow left-1/2 top-[-200px] h-[400px] w-[700px] -translate-x-1/2 opacity-[0.15]"
        style={{ background: "var(--gradient-pulse)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px] px-6 py-32 lg:px-12">
        <p className="text-label mb-6">Error 404 — frame not found</p>
        <h1 className="text-display max-w-3xl">
          This cut didn&apos;t make the <span className="text-gradient">final edit.</span>
        </h1>
        <p className="text-lead mt-6 max-w-md">
          The page you&apos;re looking for was moved, renamed, or never rendered.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/">Back to home</Button>
          <Button href="/work" variant="ghost">
            Watch the work instead
          </Button>
        </div>
      </div>
    </div>
  );
}
