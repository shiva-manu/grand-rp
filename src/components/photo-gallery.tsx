"use client";

import React, { useState, useTransition } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Controls } from "@/components/controls";
import { PhotoVerse } from "@/components/photo-verse";
import { getArrangementSuggestion } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { X, Wand2 } from "lucide-react";

const initialPhotos: Photo[] = [
  { url: 'https://placehold.co/600x400.png', 'data-ai-hint': "nature landscape" },
  { url: 'https://placehold.co/400x600.png', 'data-ai-hint': "portrait city" },
  { url: 'https://placehold.co/800x600.png', 'data-ai-hint': "abstract texture" },
  { url: 'https://placehold.co/600x600.png', 'data-ai-hint': "food photography" },
  { url: 'https://placehold.co/700x500.png', 'data-ai-hint': "animal pet" },
  { url: 'https://placehold.co/500x700.png', 'data-ai-hint': "architecture building" },
  { url: 'https://placehold.co/900x600.png', 'data-ai-hint': "travel destination" },
  { url: 'https://placehold.co/600x800.png', 'data-ai-hint': "fashion model" },
  { url: 'https://placehold.co/1000x800.png', 'data-ai-hint': "sports action" },
  { url: 'https://placehold.co/800x1000.png', 'data-ai-hint': "product still" },
  { url: 'https://placehold.co/800x800.png', 'data-ai-hint': "black white" },
  { url: 'https://placehold.co/1200x600.png', 'data-ai-hint': "car automotive" },
].map(p => ({ ...p, x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 10, z: (Math.random() - 0.5) * 15, rotationY: (Math.random() - 0.5) * Math.PI }));


export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [backgroundColor, setBackgroundColor] = useState("#222222");
  const [brightness, setBrightness] = useState(1);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [focusedPhoto, setFocusedPhoto] = useState<Photo | null>(null);

  const handleSuggestArrangement = () => {
    startTransition(async () => {
      try {
        const result = await getArrangementSuggestion({
          photoUrls: photos.map((p) => p.url),
          spaceWidth: 20,
          spaceHeight: 20,
          spaceDepth: 20,
        });
        if (result.error) {
          toast({
            title: "AI Arrangement Error",
            description: result.error,
            variant: "destructive",
          });
        } else if (result.data) {
          const newPhotos = result.data.map((p, i) => {
            const oldPhoto = photos.find(op => op.url === p.photoUrl) || photos[i];
            return {
              ...oldPhoto,
              url: p.photoUrl,
              x: p.x,
              y: p.y,
              z: p.z,
              rotationY: p.rotationY ? (p.rotationY * Math.PI) / 180 : oldPhoto.rotationY,
            }
          });
          setPhotos(newPhotos);
          toast({
            title: "AI Arrangement",
            description: "A new photo arrangement has been applied.",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred while suggesting arrangement.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Wand2 className="text-primary" />
            <h1 className="text-xl font-semibold">PhotoVerse 3D</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Controls
            isLoading={isPending}
            onSuggestArrangement={handleSuggestArrangement}
            backgroundColor={backgroundColor}
            onBackgroundColorChange={setBackgroundColor}
            brightness={brightness}
            onBrightnessChange={(value) => setBrightness(value[0])}
          />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="relative w-full h-screen bg-background">
          <PhotoVerse
            photos={photos}
            backgroundColor={backgroundColor}
            brightness={brightness}
            onPhotoClick={(photo) => setFocusedPhoto(photo === focusedPhoto ? null : photo)}
            focusedPhoto={focusedPhoto}
          />
          {focusedPhoto && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-30 text-white hover:text-white hover:bg-white/20"
              onClick={() => setFocusedPhoto(null)}
            >
              <X className="w-6 h-6" />
              <span className="sr-only">Close fullscreen view</span>
            </Button>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
