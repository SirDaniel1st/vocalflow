import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Volume2 } from 'lucide-react';

interface VoiceCustomizationProps {
  data: any;
  onComplete: (data: any) => void;
}

const voices = [
  {
    id: "sarah",
    name: "Sarah",
    gender: "female",
    accent: "american",
    preview: "/voices/sarah-preview.mp3",
  },
  {
    id: "michael",
    name: "Michael",
    gender: "male",
    accent: "british",
    preview: "/voices/michael-preview.mp3",
  },
  {
    id: "emma",
    name: "Emma",
    gender: "female",
    accent: "australian",
    preview: "/voices/emma-preview.mp3",
  },
];

export function VoiceCustomization({ data, onComplete }: VoiceCustomizationProps) {
  const [selectedVoice, setSelectedVoice] = useState(data.voice.id || '');
  const [tone, setTone] = useState(data.voice.tone || 'professional');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    // In a real app, this would stop any currently playing audio
    setIsPlaying(false);
  };

  const handlePlayPreview = () => {
    // In a real app, this would play the actual audio preview
    setIsPlaying(!isPlaying);
  };

  const handleContinue = () => {
    if (!selectedVoice) return;
    const voice = voices.find(v => v.id === selectedVoice);
    onComplete({
      voice: {
        id: selectedVoice,
        gender: voice?.gender,
        accent: voice?.accent,
        tone,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Select Voice</Label>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <RadioGroup
            value={selectedVoice}
            onValueChange={handleVoiceSelect}
            className="space-y-4"
          >
            {voices.map((voice) => (
              <div
                key={voice.id}
                className="flex items-center justify-between space-x-2 p-2 rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={voice.id} id={voice.id} />
                  <Label htmlFor={voice.id} className="flex items-center gap-4">
                    <span className="font-medium">{voice.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {voice.accent} · {voice.gender}
                    </span>
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPreview}
                  disabled={selectedVoice !== voice.id}
                >
                  {isPlaying && selectedVoice === voice.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <Label>Voice Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="formal">Formal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Volume</Label>
        <div className="flex items-center gap-4">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
          />
          <span className="w-12 text-sm text-muted-foreground">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
}