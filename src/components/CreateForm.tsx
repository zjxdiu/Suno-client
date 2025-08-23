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
import { useTranslation } from "react-i18next";

export function CreateForm() {
  const { t } = useTranslation();
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
        showError(t('createForm.toasts.promptRequired'));
        return;
      }
    } else {
      body.prompt = formData.get('prompt') as string;
      body.tags = formData.get('tags') as string;
      body.title = formData.get('title') as string;
      if (!body.tags) {
        showError(t('createForm.toasts.tagsRequired'));
        return;
      }
      if (!body.prompt && !make_instrumental) {
        showError(t('createForm.toasts.lyricsRequired'));
        return;
      }
    }

    if (!baseUrl || !apiKey) {
      showError(t('createForm.toasts.settingsNeeded'));
      return;
    }

    const toastId = showLoading(t('createForm.toasts.submitting'));

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
        showSuccess(t('createForm.toasts.submitSuccess'));
        (event.target as HTMLFormElement).reset();
      } else {
        showError(t('createForm.toasts.submitFailed', { message: result.message || 'Unknown error' }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showError(t('createForm.toasts.errorOccurred', { message }));
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="creative" className="w-full" onValueChange={setMode}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creative">{t('createForm.creativeTab')}</TabsTrigger>
          <TabsTrigger value="custom">{t('createForm.customTab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="creative">
          <Card>
            <CardHeader>
              <CardTitle>{t('createForm.creativeMode.title')}</CardTitle>
              <CardDescription>{t('createForm.creativeMode.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gpt_description_prompt">{t('createForm.creativeMode.promptLabel')}</Label>
                <Textarea id="gpt_description_prompt" name="gpt_description_prompt" placeholder={t('createForm.creativeMode.promptPlaceholder')} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>{t('createForm.customMode.title')}</CardTitle>
              <CardDescription>{t('createForm.customMode.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">{t('createForm.customMode.lyricsLabel')}</Label>
                <Textarea id="prompt" name="prompt" placeholder={t('createForm.customMode.lyricsPlaceholder')} rows={5} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">{t('createForm.customMode.tagsLabel')}</Label>
                <Input id="tags" name="tags" placeholder={t('createForm.customMode.tagsPlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">{t('createForm.customMode.titleLabel')}</Label>
                <Input id="title" name="title" placeholder={t('createForm.customMode.titlePlaceholder')} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <Card className="mt-4">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="mv">{t('createForm.common.modelVersion')}</Label>
              <Select name="mv" defaultValue="chirp-auk">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t('createForm.common.selectModel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chirp-v3-5">Chirp v3.5</SelectItem>
                  <SelectItem value="chirp-auk">Chirp Auk</SelectItem>
                  <SelectItem value="chirp-v4">Chirp v4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="make_instrumental">{t('createForm.common.instrumental')}</Label>
              <Switch id="make_instrumental" name="make_instrumental" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">{t('createForm.common.generate')}</Button>
          </CardFooter>
        </Card>
      </Tabs>
    </form>
  );
}