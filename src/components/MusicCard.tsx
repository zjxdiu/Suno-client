import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SunoClip } from "@/types/suno";
import { Button } from "./ui/button";
import { Download, Play, Square } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface MusicCardProps {
  clip: SunoClip;
}

export function MusicCard({ clip }: MusicCardProps) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      </CardFooter>
    </Card>
  );
}