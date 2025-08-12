"use client";

import React, { useState, useTransition } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { PhotoVerse } from "@/components/photo-verse";
import { getArrangementSuggestion } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { X, Wand2 } from "lucide-react";

const photosData = [
  { url: 'https://placehold.co/600x400.png', 'data-ai-hint': "couple smiling" },
  { url: 'https://placehold.co/400x600.png', 'data-ai-hint': "wedding rings" },
  { url: 'https://placehold.co/800x600.png', 'data-ai-hint': "heart shape" },
  { url: 'https://placehold.co/600x600.png', 'data-ai-hint': "love letter" },
  { url: 'https://placehold.co/700x500.png', 'data-ai-hint': "sunset romance" },
  { url: 'https://placehold.co/500x700.png', 'data-ai-hint': "holding hands" },
  { url: 'https://placehold.co/900x600.png', 'data-ai-hint': "rose petals" },
  { url: 'https://placehold.co/600x800.png', 'data-ai-hint': "romantic dinner" },
  { url: 'https://placehold.co/1000x800.png', 'data-ai-hint': "love lock" },
  { url: 'https://placehold.co/800x1000.png', 'data-ai-hint': "valentine gift" },
  { url: 'https://placehold.co/800x800.png', 'data-ai-hint': "cupid arrow" },
  { url: 'https://placehold.co/1200x600.png', 'data-ai-hint': "chocolate box" },
  { url: 'https://placehold.co/600x400.png', 'data-ai-hint': "paris eiffel" },
  { url: 'https://placehold.co/400x600.png', 'data-ai-hint': "beach walk" },
  { url: 'https://placehold.co/800x600.png', 'data-ai-hint': "picnic blanket" },
];

const getSphericalCoords = (index: number, total: number, radius: number) => {
  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);
  
  return { x, y, z };
}

const initialPhotos: Photo[] = photosData.map((p, i) => {
  const radius = 10;
  const { x, y, z } = getSphericalCoords(i, photosData.length, radius);
  
  // Orient the photo to face the center
  const rotationY = Math.atan2(x, z);
  
  return { ...p, x, y, z, rotationY };
});


export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
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
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="relative w-full h-screen bg-background">
          <PhotoVerse
            photos={photos}
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
