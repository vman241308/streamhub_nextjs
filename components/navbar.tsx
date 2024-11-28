"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useAuth } from "@/hooks/use-auth";
import { Search } from "@/components/search";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, serverStatus, serverId } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      if (serverStatus.hasData) {
        router.push("/live");
      } else {
        router.push("/setup");
      }
    } else {
      router.push("/");
    }
  };

  const showLiveTV = isAuthenticated && serverStatus.hasData;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-2"
          >
            <span className="font-bold">StreamHub</span>
          </a>
          {showLiveTV && (
            <Link
              href="/live"
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:bg-accent rounded-md px-3 py-2",
                pathname === "/live" && "bg-accent"
              )}
            >
              Live TV
            </Link>
          )}
        </div>

        {showLiveTV && serverId && (
          <div className="flex-1 max-w-xl">
            <Search serverId={serverId} />
          </div>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Logout</span>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
