import { useSunoStore } from "@/store/sunoStore";
import { TaskCard } from "./TaskCard";
import { useEffect, useCallback } from "react";
import { FetchResponseData, SunoClip } from "@/types/suno";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { showError } from "@/utils/toast";

export function TaskList() {
  const { tasks, baseUrl, apiKey, updateTask, autoCheckInterval } = useSunoStore();

  const fetchTaskStatus = useCallback(async (taskId: string) => {
    if (!baseUrl || !apiKey) {
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/suno/fetch/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      const result = await response.json();

      if (response.ok && result.code === 'success') {
        const data: FetchResponseData = result.data;
        const clips: SunoClip[] = data.data.map(clipData => ({
          id: clipData.clip_id,
          status: clipData.status,
          title: clipData.title,
          tags: clipData.tags,
          prompt: clipData.prompt,
          audio_url: clipData.audio_url,
          image_large_url: clipData.image_large_url,
          duration: clipData.duration,
          gpt_description_prompt: clipData.gpt_description_prompt,
        }));

        const overallStatus = clips.every(c => c.status === 'complete') ? 'complete' :
                              clips.some(c => c.status === 'streaming') ? 'streaming' : 'queued';

        updateTask(taskId, {
          status: overallStatus,
          progress: data.progress,
          clips: clips,
          fail_reason: data.fail_reason,
        });
      } else {
        console.error(`Failed to fetch task ${taskId}:`, result.message);
        updateTask(taskId, { fail_reason: result.message || 'Failed to fetch status' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error fetching task ${taskId}:`, errorMessage);
      updateTask(taskId, { fail_reason: `Network error: ${errorMessage}` });
    }
  }, [baseUrl, apiKey, updateTask]);

  const fetchAllUnfinishedTasks = useCallback(() => {
    if (!baseUrl || !apiKey) {
      showError("Please set Base URL and API Key in settings before refreshing.");
      return;
    }
    const unfinishedTasks = tasks.filter(t => t.status !== 'complete' && !t.fail_reason);
    unfinishedTasks.forEach(task => fetchTaskStatus(task.id));
  }, [tasks, fetchTaskStatus, baseUrl, apiKey]);

  useEffect(() => {
    if (autoCheckInterval > 0) {
      const intervalId = setInterval(() => {
        fetchAllUnfinishedTasks();
      }, autoCheckInterval * 1000);
      return () => clearInterval(intervalId);
    }
  }, [autoCheckInterval, fetchAllUnfinishedTasks]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Task Queue</h2>
        <Button variant="outline" size="icon" onClick={fetchAllUnfinishedTasks}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center text-muted-foreground pt-10">
            <p>No tasks yet.</p>
            <p>Create a new generation task on the left.</p>
          </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}