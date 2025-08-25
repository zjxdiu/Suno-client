import { SunoClip } from "@/types/suno";
import { Button } from "./ui/button";
import { Download, Play, Square, MoreVertical, BookText, ExternalLink, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { showSuccess } from "@/utils/toast";

interface MusicBarProps {
  clip: SunoClip;
}

export function MusicBar({ clip }: MusicBarProps) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(clip.duration || 0);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = clip.audio_url;
    link.download = `${clip.title || 'suno_music'}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '--:--';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const handleCopyLyrics = () => {
    if (clip.prompt) {
      navigator.clipboard.writeText(clip.prompt);
      showSuccess(t('musicCard.lyricsDialog.copied'));
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 p-2 rounded-lg border bg-card text-card-foreground">
        <img src={clip.image_large_url || '/placeholder.svg'} alt={clip.title} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
        
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <p className="text-sm text-muted-foreground truncate" title={clip.tags}>{clip.tags || t('musicCard.noTags')}</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePlayPause}>
              {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(currentTime)}</span>
              <Progress value={progress} className="h-2" />
              <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleDownload} disabled={clip.status !== 'complete'}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('musicCard.download')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsLyricsOpen(true)}>
                <BookText className="mr-2 h-4 w-4" />
                <span>{t('musicCard.actions.viewLyrics')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={clip.audio_url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>{t('musicCard.actions.openAudio')}</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={clip.image_large_url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>{t('musicCard.actions.openImage')}</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <audio 
          ref={audioRef} 
          src={clip.audio_url} 
          onEnded={() => setIsPlaying(false)} 
          onPlay={() => setIsPlaying(true)} 
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>

      <Dialog open={isLyricsOpen} onOpenChange={setIsLyricsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('musicCard.lyricsDialog.title')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            <p className="whitespace-pre-wrap text-sm">{clip.prompt || t('musicCard.lyricsDialog.noLyrics')}</p>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleCopyLyrics} disabled={!clip.prompt}>
              <Copy className="mr-2 h-4 w-4" />
              {t('musicCard.lyricsDialog.copy')}
            </Button>
            <Button type="button" onClick={() => setIsLyricsOpen(false)}>
              {t('musicCard.lyricsDialog.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}