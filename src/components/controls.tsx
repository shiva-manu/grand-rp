"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

type ControlsProps = {
  isLoading: boolean;
  onSuggestArrangement: () => void;
  backgroundColor: string;
  onBackgroundColorChange: (color: string) => void;
  brightness: number;
  onBrightnessChange: (value: number[]) => void;
};

export function Controls({
  isLoading,
  onSuggestArrangement,
  backgroundColor,
  onBackgroundColorChange,
  brightness,
  onBrightnessChange,
}: ControlsProps) {
  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Assistant</CardTitle>
          <CardDescription>Let AI find the best layout for your photos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onSuggestArrangement} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Suggest Arrangement
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scene Settings</CardTitle>
          <CardDescription>Customize the look of your 3D gallery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bg-color">Background Color</Label>
            <div className="relative">
              <input
                id="bg-color"
                type="color"
                value={backgroundColor}
                onChange={(e) => onBackgroundColorChange(e.target.value)}
                className="absolute w-full h-full opacity-0 cursor-pointer"
                aria-label="Background color picker"
              />
              <div
                className="w-full h-10 rounded-md border border-input"
                style={{ backgroundColor: backgroundColor }}
                aria-hidden="true"
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="brightness">Brightness</Label>
            <Slider
              id="brightness"
              min={0}
              max={2}
              step={0.1}
              value={[brightness]}
              onValueChange={onBrightnessChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
