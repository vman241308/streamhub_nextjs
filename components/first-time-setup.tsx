"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { CategoryService } from "@/lib/services/client/CategoryService";
import { ChannelService } from "@/lib/services/client/ChannelService";

interface Task {
  id: string;
  name: string;
  status: "pending" | "loading" | "completed" | "error";
  count?: number;
  error?: string;
  progress?: number;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "categories",
    name: "Loading categories",
    status: "pending",
    progress: 0,
  },
  { id: "channels", name: "Loading channels", status: "pending", progress: 0 },
];

export function FirstTimeSetup() {
  const router = useRouter();
  const { toast } = useToast();
  const { serverId, checkServerStatus } = useAuth();
  const [isComplete, setIsComplete] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }, []);

  const runTask = useCallback(
    async (taskId: string) => {
      if (!serverId) return;

      setCurrentTask(taskId);
      updateTask(taskId, { status: "loading", progress: 0 });

      try {
        if (taskId === "categories") {
          CategoryService.clearCache(serverId);
          updateTask(taskId, { progress: 50 });
          const categories = await CategoryService.getCategories(serverId);
          updateTask(taskId, {
            status: "completed",
            count: categories.length,
            progress: 100,
          });
        } else if (taskId === "channels") {
          ChannelService.clearCache(serverId);
          updateTask(taskId, { progress: 50 });
          const channels = await ChannelService.getChannels(serverId);
          updateTask(taskId, {
            status: "completed",
            count: channels.length,
            progress: 100,
          });
        }
      } catch (error) {
        console.error(`Task ${taskId} failed:`, error);
        updateTask(taskId, {
          status: "error",
          error: error instanceof Error ? error.message : "Task failed",
          progress: 0,
        });
        return false;
      }

      setCurrentTask(null);
      return true;
    },
    [serverId, updateTask]
  );

  const retryTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status !== "error") return;
    await runTask(taskId);
  };

  useEffect(() => {
    if (!serverId) {
      router.push("/");
      return;
    }

    let mounted = true;

    const runTasks = async () => {
      // Run categories task first
      const categoriesSuccess = await runTask("categories");
      if (!mounted) return;

      // Only proceed with channels if categories succeeded
      if (categoriesSuccess) {
        const channelsSuccess = await runTask("channels");
        if (!mounted) return;

        // If both tasks completed successfully
        if (channelsSuccess) {
          setIsComplete(true);
          toast({
            title: "Setup Complete",
            description: "Your streaming library is ready to use",
          });
          // Check server status and redirect
          await checkServerStatus();
          router.push("/live");
        }
      }
    };

    runTasks();

    return () => {
      mounted = false;
    };
  }, [serverId, runTask, router, toast, checkServerStatus]);

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Setting Up Your StreamHub</h2>
        <p className="text-muted-foreground">
          Please wait while we load your content
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="space-y-2">
            <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
              {task.status === "loading" ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : task.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : task.status === "error" ? (
                <XCircle className="h-5 w-5 text-destructive" />
              ) : (
                <div className="h-5 w-5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium">
                  {task.name}
                  {task.count !== undefined && task.status === "completed" && (
                    <span className="text-muted-foreground ml-1">
                      ({task.count})
                    </span>
                  )}
                </p>
                {task.error && (
                  <p className="text-sm text-destructive mt-1">{task.error}</p>
                )}
              </div>
              {task.status === "error" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => retryTask(task.id)}
                  disabled={currentTask !== null}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="sr-only">Retry</span>
                </Button>
              )}
            </div>
            {task.status === "loading" && (
              <Progress value={task.progress} className="h-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
