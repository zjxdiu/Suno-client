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
import { Settings } from "lucide-react";
import { useState } from "react";
import { MadeWithDyad } from "./made-with-dyad";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";

export function SettingsDialog() {
  const { t, i18n } = useTranslation();
  const { 
    baseUrl, apiKey, autoCheckInterval, autoRename,
    setBaseUrl, setApiKey, setAutoCheckInterval, setAutoRename 
  } = useSunoStore();
  
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localInterval, setLocalInterval] = useState(autoCheckInterval);
  const [localAutoRename, setLocalAutoRename] = useState(autoRename);

  const handleSave = () => {
    setBaseUrl(localBaseUrl);
    setApiKey(localApiKey);
    setAutoCheckInterval(localInterval);
    setAutoRename(localAutoRename);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
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