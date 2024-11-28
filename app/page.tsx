"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Login } from "@/components/login";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, serverStatus } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    if (serverStatus.isChecking) return;

    if (serverStatus.error) {
      router.push("/setup");
      return;
    }

    if (serverStatus.hasData) {
      router.push("/live");
    } else {
      router.push("/setup");
    }
  }, [isAuthenticated, serverStatus, router]);

  if (isAuthenticated && serverStatus.isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">Checking server status...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
        Live TV StreamHub
      </h1>
      <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 mx-auto">
        Your personal streaming library for all your favorite content
      </p>
      <Login />
    </div>
  );
}
