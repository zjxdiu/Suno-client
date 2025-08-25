import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSunoStore, CustomHistoryItem } from "@/store/sunoStore";
import { SunoTask } from "@/types/suno";
import { showLoading, showError, showSuccess, dismissToast } from "@/utils/toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { History } from "lucide-react";
import { PromptHistoryDialog } from "./PromptHistoryDialog";

export function CreateForm() {
  const { t } = useTranslation();
  const { baseUrl, apiKey, addTask, addCreativeHistoryItem, addCustomHistoryItem, creativeHistory, customHistory } = useSunoStore();
  
  const [mode, setMode] = useState('creative');
  const [gptDescriptionPrompt, setGptDescriptionPrompt] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [customTags, setCustomTags] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [makeInstrumental, setMakeInstrumental] = useState(false);
  const [mv, setMv] = useState("chirp-auk");

  const [isCreativeHistoryOpen, setIsCreativeHistoryOpen] = useState(false);
  const [isCustomHistoryOpen, setIsCustomHistoryOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let body: any = { mv, make_instrumental: makeInstrumental };

    if (mode === 'creative') {
      body.gpt_description_prompt = gptDescriptionPrompt;
      if (!body.gpt_description_prompt) {
        showError(t('createForm.toasts.promptRequired'));
        return;
      }
    } else {
      body.prompt = customPrompt;
      body.tags = customTags;
      body.title = customTitle;
      if (!body.tags) {
        showError(t('createForm.toasts.tagsRequired'));
        return;
      }
      if (!body.prompt && !makeInstrumental) {
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

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        showError(t('createForm.toasts.invalidResponse'));
        return;
      }

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
        
        if (mode === 'creative') {
          addCreativeHistoryItem(gptDescriptionPrompt);
          setGptDescriptionPrompt("");
        } else {
          addCustomHistoryItem({ prompt: customPrompt, tags: customTags, title: customTitle });
          setCustomPrompt("");
          setCustomTags("");
          setCustomTitle("");
        }
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

  const handleSelectCreativeHistory = (prompt: string) => {
    setGptDescriptionPrompt(prompt);
    setIsCreativeHistoryOpen(false);
  };

  const handleSelectCustomHistory = (item: CustomHistoryItem) => {
    setCustomPrompt(item.prompt);
    setCustomTags(item.tags);
    setCustomTitle(item.title);
    setIsCustomHistoryOpen(false);
  };

  return (
    <>
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="gpt_description_prompt">{t('createForm.creativeMode.promptLabel')}</Label>
                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsCreativeHistoryOpen(true)} disabled={creativeHistory.length === 0}>
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea id="gpt_description_prompt" name="gpt_description_prompt" placeholder={t('createForm.creativeMode.promptPlaceholder')} value={gptDescriptionPrompt} onChange={(e) => setGptDescriptionPrompt(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="custom">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{t('createForm.customMode.title')}</CardTitle>
                  <CardDescription>{t('createForm.customMode.description')}</CardDescription>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsCustomHistoryOpen(true)} disabled={customHistory.length === 0}>
                  <History className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">{t('createForm.customMode.lyricsLabel')}</Label>
                  <Textarea id="prompt" name="prompt" placeholder={t('createForm.customMode.lyricsPlaceholder')} rows={5} value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">{t('createForm.customMode.tagsLabel')}</Label>
                  <Input id="tags" name="tags" placeholder={t('createForm.customMode.tagsPlaceholder')} value={customTags} onChange={(e) => setCustomTags(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">{t('createForm.customMode.titleLabel')}</Label>
                  <Input id="title" name="title" placeholder={t('createForm.customMode.titlePlaceholder')} value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <Card className="mt-4">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="mv">{t('createForm.common.modelVersion')}</Label>
                <Select name="mv" value={mv} onValueChange={setMv}>
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
                <Switch id="make_instrumental" name="make_instrumental" checked={makeInstrumental} onCheckedChange={setMakeInstrumental} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">{t('createForm.common.generate')}</Button>
            </CardFooter>
          </Card>
        </Tabs>
      </form>

      <PromptHistoryDialog
        isOpen={isCreativeHistoryOpen}
        onOpenChange={setIsCreativeHistoryOpen}
        history={creativeHistory}
        onSelect={handleSelectCreativeHistory}
        mode="creative"
      />
      <PromptHistoryDialog
        isOpen={isCustomHistoryOpen}
        onOpenChange={setIsCustomHistoryOpen}
        history={customHistory}
        onSelect={handleSelectCustomHistory}
        mode="custom"
      />
    </>
  );
}