import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Variable, Wand2, Play, Info } from 'lucide-react';

interface MessagePersonalizationProps {
  data: any;
  onComplete: (data: any) => void;
}

const personalizationTokens = [
  { token: "{FirstName}", description: "Contact's first name" },
  { token: "{LastName}", description: "Contact's last name" },
  { token: "{Company}", description: "Contact's company name" },
  { token: "{AppointmentDate}", description: "Scheduled appointment date" },
  { token: "{CustomField1}", description: "Custom field 1" },
  { token: "{CustomField2}", description: "Custom field 2" },
];

export function MessagePersonalization({ data, onComplete }: MessagePersonalizationProps) {
  const [script, setScript] = useState(data.message.script || '');
  const [isPlaying, setIsPlaying] = useState(false);

  const insertToken = (token: string) => {
    setScript(prev => prev + token);
  };

  const handlePreview = () => {
    setIsPlaying(!isPlaying);
  };

  const handleContinue = () => {
    if (!script.trim()) return;
    
    // Extract used tokens
    const usedTokens = personalizationTokens
      .filter(({ token }) => script.includes(token))
      .map(({ token }) => token);

    onComplete({
      message: {
        script,
        personalization: usedTokens,
      },
    });
  };

  const characterCount = script.length;
  const maxCharacters = 500;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Message Script</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handlePreview}
            >
              {isPlaying ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Stop Preview
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Preview
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" />
              AI Suggestions
            </Button>
          </div>
        </div>

        <Textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter your message script here..."
          className="min-h-[200px]"
        />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Variable className="h-4 w-4" />
            <span>
              {personalizationTokens.filter(({ token }) => script.includes(token)).length} tokens used
            </span>
          </div>
          <span className={characterCount > maxCharacters ? "text-destructive" : ""}>
            {characterCount}/{maxCharacters} characters
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label>Available Tokens</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to insert into your message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ScrollArea className="h-[100px]">
          <div className="flex flex-wrap gap-2">
            {personalizationTokens.map(({ token, description }) => (
              <TooltipProvider key={token}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => insertToken(token)}
                    >
                      <Variable className="mr-1 h-3 w-3" />
                      {token}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
         <boltAction type="file" filePath="src/components/campaigns/CreateCampaignDialog/steps/MessagePersonalization.tsx">        </ScrollArea>
      </div>

      <div className="space-y-2">
        <Label>Example Preview</Label>
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {script
              .replace(/{FirstName}/g, "John")
              .replace(/{LastName}/g, "Smith")
              .replace(/{Company}/g, "Acme Corp")
              .replace(/{AppointmentDate}/g, "next Tuesday")
              .replace(/{CustomField1}/g, "Value 1")
              .replace(/{CustomField2}/g, "Value 2")}
          </p>
        </div>
      </div>
    </div>
  );
}