import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SunoTask } from "@/types/suno";
import { MusicCard } from "./MusicCard";
import { Badge } from "./ui/badge";
import { useTranslation } from "react-i18next";
import { TaskActions } from "./TaskActions";

interface TaskCardProps {
  task: SunoTask;
}

export function TaskCard({ task }: TaskCardProps) {
  const { t } = useTranslation();
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {task.title || task.gpt_description_prompt || t('taskCard.customTaskTitle')}
            </CardTitle>
            <CardDescription className="truncate">
              {t('taskCard.taskId', { id: task.id })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge variant={getStatusBadgeVariant(task.status)}>{task.status}</Badge>
            <TaskActions task={task} />
          </div>
        </div>
      </CardHeader>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {task.clips.map(clip => (
            <MusicCard key={clip.id} clip={clip} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}