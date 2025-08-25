import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SunoTask } from "@/types/suno";
import { MusicBar } from "./MusicBar";
import { Badge } from "./ui/badge";
import { useTranslation } from "react-i18next";
import { TaskActions } from "./TaskActions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useSunoStore } from "@/store/sunoStore";
import { ChevronDown } from "lucide-react";

interface TaskCardProps {
  task: SunoTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const { t } = useTranslation();
  const { toggleTaskExpansion } = useSunoStore();
  const progressValue = parseInt(task.progress.replace('%', ''));

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'complete':
        return 'success';
      case 'streaming':
        return 'default';
      case 'queued':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  return (
    <Collapsible
      open={task.isExpanded}
      onOpenChange={() => toggleTaskExpansion(task.id)}
    >
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors rounded-t-lg">
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${task.isExpanded ? 'rotate-180' : ''}`} />
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {task.title || task.gpt_description_prompt || t('taskCard.customTaskTitle')}
                  </CardTitle>
                  <CardDescription className="truncate">
                    {t('taskCard.taskId', { id: task.id })}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
                <div onClick={(e) => e.stopPropagation()}>
                  <TaskActions task={task} />
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            {task.fail_reason && (
              <div className="text-destructive text-sm mb-4">
                <strong>{t('taskCard.error', { reason: '' })}</strong> {task.fail_reason}
              </div>
            )}
            {task.status !== 'complete' && !task.fail_reason && (
              <div className="mb-4">
                <Progress value={progressValue} className="w-full" />
                <p className="text-sm text-muted-foreground text-center mt-1">{task.progress}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {task.clips.map(clip => (
                <MusicBar key={clip.id} clip={clip} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}