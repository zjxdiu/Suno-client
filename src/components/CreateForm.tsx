import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSunoStore } from "@/store/sunoStore";
import { SunoTask } from "@/types/suno";
import { showLoading, showError, showSuccess, dismissToast } from "@/utils/toast";
import { useState } from "react";

export function CreateForm() {
  const { baseUrl, apiKey, addTask } = useSunoStore();
  const [mode, setMode] = useState('creative');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const mv = formData.get('mv') as string;
    const make_instrumental = formData.get('make_instrumental') === 'on';

    let body: any = { mv, make_instrumental };

    if (mode === 'creative') {
      body.gpt_description_prompt = formData.get('gpt_description_prompt') as string;
      if (!body.gpt_description_prompt) {
        showError("Prompt is required for creative mode.");
        return;
      }
    } else {
      body.prompt = formData.get('prompt') as string;
      body.tags = formData.get('tags') as string;
      body.title = formData.get('title') as string;
      if (!body.tags) {
        showError("Tags are required for custom mode.");
        return;
      }
      if (!body.prompt && !make_instrumental) {
        showError("Lyrics are required for custom mode unless it's instrumental.");
        return;
      }
    }

    if (!baseUrl || !apiKey) {
      showError("Please set Base URL and API Key in settings.");
      return;
    }

    const toastId = showLoading("Submitting task...");

    try {
      const response = await fetch(`${baseUrl}/suno/submit/music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok && result.code === 'success') {
        const newTask: SunoTask = {
          id: result.data,
          status: 'queued',
          clips: [],
          submit_time: Date.now() / 1000,
          progress: '0%',
          fail_reason: null,
          ...body,
        };
        addTask(newTask);
        showSuccess("Task submitted successfully!");
        (event.target as HTMLFormElement).reset();
      } else {
        showError(`Failed to submit task: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      showError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="creative" className="w-full" onValueChange={setMode}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creative">Creative</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        <TabsContent value="creative">
          <Card>
            <CardHeader>
              <CardTitle>Creative Mode</CardTitle>
              <CardDescription>Generate music with a simple prompt. AI will handle the rest.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gpt_description_prompt">Prompt</Label>
                <Textarea id="gpt_description_prompt" name="gpt_description_prompt" placeholder="e.g., An epic cinematic trailer score" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Mode</CardTitle>
              <CardDescription>Fine-tune your music with custom lyrics, tags, and title.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Lyrics</Label>
                <Textarea id="prompt" name="prompt" placeholder="[Verse]\n..." rows={5} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" name="tags" placeholder="e.g., 80s pop, synthwave" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="e.g., Midnight Drive" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <Card className="mt-4">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="mv">Model Version</Label>
              <Select name="mv" defaultValue="chirp-auk">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chirp-v3-5">Chirp v3.5</SelectItem>
                  <SelectItem value="chirp-auk">Chirp Auk</SelectItem>
                  <SelectItem value="chirp-v4">Chirp v4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="make_instrumental">Instrumental</Label>
              <Switch id="make_instrumental" name="make_instrumental" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Generate</Button>
          </CardFooter>
        </Card>
      </Tabs>
    </form>
  );
}