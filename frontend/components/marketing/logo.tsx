import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Milgest — accueil"
    >
      <Image
        src="/Logo.svg"
        alt="Milgest"
        width={200}
        height={60}
        className="h-8 w-auto sm:h-9"
        priority
        unoptimized
      />
    </Link>
  );
}
