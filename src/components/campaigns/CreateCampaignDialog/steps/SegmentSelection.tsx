import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Tags, Filter } from 'lucide-react';

interface SegmentSelectionProps {
  data: any;
  onComplete: (data: any) => void;
}

export function SegmentSelection({ data, onComplete }: SegmentSelectionProps) {
  const [campaignName, setCampaignName] = useState(data.name || '');
  const [selectedSegments, setSelectedSegments] = useState<string[]>(data.segments || []);

  const segments = [
    {
      id: "enterprise",
      name: "Enterprise Customers",
      count: 1250,
      tags: ["Enterprise", "High Value"],
    },
    {
      id: "smb",
      name: "Small Business",
      count: 3420,
      tags: ["SMB", "Growing"],
    },
    {
      id: "recent",
      name: "Recent Signups",
      count: 890,
      tags: ["New", "Trial"],
    },
  ];

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleContinue = () => {
    if (!campaignName.trim() || selectedSegments.length === 0) return;
    onComplete({
      name: campaignName,
      segments: selectedSegments,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          placeholder="Enter campaign name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Target Segments</Label>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="smb">Small Business</SelectItem>
              <SelectItem value="trial">Trial Users</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            {segments.map((segment) => (
              <Button
                key={segment.id}
                variant="outline"
                className={`w-full justify-start gap-4 p-4 h-auto ${
                  selectedSegments.includes(segment.id)
                    ? 'border-primary'
                    : ''
                }`}
                onClick={() => handleSegmentToggle(segment.id)}
              >
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-left space-y-1">
                  <div className="font-medium">{segment.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {segment.count.toLocaleString()} contacts
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {segment.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1"
                      >
                        <Tags className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>
            {selectedSegments.length} segments selected
          </span>
        </div>
        <span>
          Total reach: {selectedSegments.reduce((acc, segId) => {
            const segment = segments.find(s => s.id === segId);
            return acc + (segment?.count || 0);
          }, 0).toLocaleString()} contacts
        </span>
      </div>
    </div>
  );
}