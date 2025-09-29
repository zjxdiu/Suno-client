import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSunoStore } from "@/store/sunoStore";
import { Settings, Upload, Download } from "lucide-react";
import { useState, useRef } from "react";
import { MadeWithDyad } from "./made-with-dyad";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { showSuccess, showError } from "@/utils/toast";

export function SettingsDialog() {
  const { t, i18n } = useTranslation();
  const { 
    baseUrl, apiKey, autoCheckInterval, autoRename,
    setBaseUrl, setApiKey, setAutoCheckInterval, setAutoRename, importState 
  } = useSunoStore();
  
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localInterval, setLocalInterval] = useState(autoCheckInterval);
  const [localAutoRename, setLocalAutoRename] = useState(autoRename);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setBaseUrl(localBaseUrl);
    setApiKey(localApiKey);
    setAutoCheckInterval(localInterval);
    setAutoRename(localAutoRename);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleExport = () => {
    const state = useSunoStore.getState();
    const dataToExport = {
      baseUrl: state.baseUrl,
      apiKey: state.apiKey,
      tasks: state.tasks,
      autoCheckInterval: state.autoCheckInterval,
      autoRename: state.autoRename,
      creativeHistory: state.creativeHistory,
      customHistory: state.customHistory,
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suno-client-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSuccess(t('settings.toasts.exportSuccess'));
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Invalid file content');
        }
        const importedState = JSON.parse(text);
        
        if (
          typeof importedState.baseUrl === 'undefined' ||
          typeof importedState.apiKey === 'undefined' ||
          !Array.isArray(importedState.tasks)
        ) {
          throw new Error('Invalid file format');
        }

        importState(importedState);
        
        setLocalBaseUrl(importedState.baseUrl || '');
        setLocalApiKey(importedState.apiKey || '');
        setLocalInterval(importedState.autoCheckInterval || 5);
        setLocalAutoRename(importedState.autoRename || false);

        showSuccess(t('settings.toasts.importSuccess'));
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        showError(t('settings.toasts.importFailed'));
        console.error("Import failed:", error);
      }
    };
    reader.onerror = () => {
      showError(t('settings.toasts.importFailed'));
    };
    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('settings.title')}</DialogTitle>
          <DialogDescription>
            {t('settings.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="base-url" className="text-right">
              {t('settings.baseUrl')}
            </Label>
            <Input
              id="base-url"
              value={localBaseUrl}
              onChange={(e) => setLocalBaseUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://your-proxy-url.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              {t('settings.apiKey')}
            </Label>
            <Input
              id="api-key"
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="col-span-3"
              placeholder="Bearer Token"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interval" className="text-right">
              {t('settings.autoCheck')}
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Slider
                id="interval"
                min={0}
                max={30}
                step={1}
                value={[localInterval]}
                onValueChange={(value) => setLocalInterval(value[0])}
              />
              <span>{localInterval}s</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              {t('settings.language')}
            </Label>
            <div className="col-span-3">
              <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">简体中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auto-rename" className="text-right">
              {t('settings.autoRename')}
            </Label>
            <div className="col-span-3">
              <Switch
                id="auto-rename"
                checked={localAutoRename}
                onCheckedChange={setLocalAutoRename}
              />
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4 pt-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{t('settings.dataManagement')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('settings.dataManagementDescription')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImportClick} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {t('settings.importData')}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="application/json"
              className="hidden"
            />
            <Button variant="outline" onClick={handleExport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              {t('settings.exportAllData')}
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <MadeWithDyad />
          <DialogTrigger asChild>
            <Button type="submit" onClick={handleSave}>{t('settings.save')}</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}