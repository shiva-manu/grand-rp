"use client";

import React, { useState, useTransition } from "react";
import { PhotoVerse } from "@/components/photo-verse";
import { useToast } from "@/hooks/use-toast";
import type { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const photosData = [
  { url: '/photos/1.png', 'data-ai-hint': "couple smiling" },
  { url: '/photos/2.png', 'data-ai-hint': "wedding rings" },
  { url: '/photos/3.png', 'data-ai-hint': "heart shape" },
  { url: '/photos/4.png', 'data-ai-hint': "love letter" },
  { url: '/photos/5.png', 'data-ai-hint': "sunset romance" },
  { url: '/photos/6.png', 'data-ai-hint': "holding hands" },
  { url: '/photos/7.png', 'data-ai-hint': "rose petals" },
  { url: '/photos/8.png', 'data-ai-hint': "romantic dinner" },
  { url: '/photos/9.png', 'data-ai-hint': "love lock" },
  { url: '/photos/10.png', 'data-ai-hint': "valentine gift" },
  { url: '/photos/11.png', 'data-ai-hint': "cupid arrow" },
  { url: '/photos/12.png', 'data-ai-hint': "chocolate box" },
  { url: '/photos/13.png', 'data-ai-hint': "paris eiffel" },
  { url: '/photos/14.png', 'data-ai-hint': "beach walk" },
  { url: '/photos/15.png', 'data-ai-hint': "picnic blanket" },
];

const getCircleCoords = (index: number, total: number) => {
  const radius = 15;
  const angle = (index / total) * 2 * Math.PI;

  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = 0; 
  const rotationY = -angle + Math.PI / 2;
  
  return { x, y, z, rotationY };
}

const initialPhotos: Photo[] = photosData.map((p, i) => {
  const { x, y, z, rotationY } = getCircleCoords(i, photosData.length);
  return { ...p, x, y, z, rotationY };
});


export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [focusedPhoto, setFocusedPhoto] = useState<Photo | null>(null);

  return (
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
  );
}
