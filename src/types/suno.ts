export interface SunoClip {
  id: string; // This will be clip_id
  status: 'streaming' | 'complete' | 'queued' | string;
  title: string;
  tags: string;
  prompt: string; // lyrics
  audio_url: string;
  image_large_url: string;
  duration: number;
  gpt_description_prompt?: string;
}

export interface SunoTask {
  id: string; // This is the task_id from the submit response
  status: 'queued' | 'streaming' | 'complete' | string;
  clips: SunoClip[];
  submit_time: number;
  progress: string;
  fail_reason: string | null;
  gpt_description_prompt?: string; // from creative mode
  prompt?: string; // from custom mode
  tags?: string; // from custom mode
  title?: string; // from custom mode
  make_instrumental?: boolean;
  mv?: string;
  isExpanded?: boolean;
}

export interface FetchResponseData {
  fail_reason: string | null;
  submit_time: number;
  start_time: number;
  finish_time: number;
  progress: string;
  data: {
    tags: string;
    title: string;
    prompt: string;
    status: string;
    clip_id: string;
    duration: number;
    audio_url: string;
    image_large_url: string;
    gpt_description_prompt: string;
  }[];
}