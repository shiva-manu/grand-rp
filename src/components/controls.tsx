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
};

export function Controls({
  isLoading,
  onSuggestArrangement,
}: ControlsProps) {
  return (
    <div className="p-4 space-y-6">
    </div>
  );
}
