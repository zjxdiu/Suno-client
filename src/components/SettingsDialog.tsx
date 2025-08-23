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

export function SettingsDialog() {
  const { baseUrl, apiKey, autoCheckInterval, setBaseUrl, setApiKey, setAutoCheckInterval } = useSunoStore();
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localInterval, setLocalInterval] = useState(autoCheckInterval);

  const handleSave = () => {
    setBaseUrl(localBaseUrl);
    setApiKey(localApiKey);
    setAutoCheckInterval(localInterval);
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
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Suno API settings here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="base-url" className="text-right">
              Base URL
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
              API Key
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
              Auto-check
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
        </div>
        <DialogFooter className="sm:justify-between">
          <MadeWithDyad />
          <DialogTrigger asChild>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}