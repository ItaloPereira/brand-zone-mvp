"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  return (
    <header className="px-8 py-6 flex justify-between items-center w-full">
      <div className="flex items-center gap-20">
        <Image src="/logo.svg" alt="Brand Zone" width={140} height={33} />
        <nav className="flex gap-10">
          <Link
            href="/"
            className={`hover:text-primary transition-colors ${pathname === "/"
              ? "font-bold text-primary"
              : "text-muted-foreground"
              }`}
          >
            Home
          </Link>
          <Link
            href="/images"
            className={`hover:text-primary transition-colors ${pathname === "/images"
              ? "font-bold text-primary"
              : "text-muted-foreground"
              }`}
          >
            Images
          </Link>
          <Link
            href="/palettes"
            className={`hover:text-primary transition-colors ${pathname === "/palettes"
              ? "font-bold text-primary"
              : "text-muted-foreground"
              }`}
          >
            Palettes
          </Link>
        </nav>
      </div>

      <UserButton showName />
    </header>
  );
}

export default Header;