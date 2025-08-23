import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SunoClip } from "@/types/suno";
import { Button } from "./ui/button";
import { Download, Play, Square, MoreVertical, BookText, ExternalLink } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface MusicCardProps {
  clip: SunoClip;
}

export function MusicCard({ clip }: MusicCardProps) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);

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

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-square w-full relative">
            <img src={clip.image_large_url || '/placeholder.svg'} alt={clip.title} className="object-cover w-full h-full rounded-t-md" />
            <div className="absolute bottom-2 right-2">
              <Badge variant={clip.status === 'complete' ? 'success' : 'default'}>{clip.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <CardTitle className="text-base font-semibold truncate">{clip.title}</CardTitle>
          <p className="text-sm text-muted-foreground truncate">{clip.tags}</p>
          <audio ref={audioRef} src={clip.audio_url} onEnded={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handlePlayPause}>
                  {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isPlaying ? t('musicCard.stop') : t('musicCard.play')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm text-muted-foreground">
            {clip.duration > 0 ? `${Math.floor(clip.duration / 60)}:${String(Math.round(clip.duration % 60)).padStart(2, '0')}` : '--:--'}
          </span>
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
        </CardFooter>
      </Card>

      <Dialog open={isLyricsOpen} onOpenChange={setIsLyricsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('musicCard.lyricsDialog.title')}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-72 w-full rounded-md border p-4">
            <p className="whitespace-pre-wrap text-sm">{clip.prompt || t('musicCard.lyricsDialog.noLyrics')}</p>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" onClick={() => setIsLyricsOpen(false)}>
              {t('musicCard.lyricsDialog.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}