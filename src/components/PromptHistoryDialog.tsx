import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { CustomHistoryItem } from "@/store/sunoStore";

type CreativeHistory = string[];
type CustomHistory = CustomHistoryItem[];

interface PromptHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  history: CreativeHistory | CustomHistory;
  onSelect: (item: any) => void;
  mode: 'creative' | 'custom';
}

export function PromptHistoryDialog({ isOpen, onOpenChange, history, onSelect, mode }: PromptHistoryDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('promptHistory.title')}</DialogTitle>
          <DialogDescription>{t('promptHistory.description')}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          {history.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>{t('promptHistory.empty')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mode === 'creative' && (history as CreativeHistory).map((prompt, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <p className="text-sm flex-1 break-words">{prompt}</p>
                    <Button size="sm" onClick={() => onSelect(prompt)}>{t('promptHistory.use')}</Button>
                  </CardContent>
                </Card>
              ))}
              {mode === 'custom' && (history as CustomHistory).map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{item.title || t('promptHistory.noTitle')}</CardTitle>
                    <CardDescription className="break-words">{item.tags}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-start justify-between gap-4 pt-0">
                    <p className="text-sm text-muted-foreground flex-1 break-words">{item.prompt || t('promptHistory.noLyrics')}</p>
                    <Button size="sm" onClick={() => onSelect(item)}>{t('promptHistory.use')}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}