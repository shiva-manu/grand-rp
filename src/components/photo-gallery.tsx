"use client";

import React, { useState, useTransition } from "react";
import { PhotoVerse } from "@/components/photo-verse";
import { useToast } from "@/hooks/use-toast";
import type { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

const getGridCoords = (index: number, total: number) => {
  const numColumns = 5;
  const colWidth = 5.5;
  const rowHeight = 5.5;

  const numRows = Math.ceil(total / numColumns);
  const row = Math.floor(index / numColumns);
  const col = index % numColumns;

  // Center the grid
  const x = (col - (numColumns - 1) / 2) * colWidth;
  const y = (-(row - (numRows - 1) / 2)) * rowHeight;
  const z = 0;
  
  return { x, y, z };
}

const initialPhotos: Photo[] = photosData.map((p, i) => {
  const { x, y, z } = getGridCoords(i, photosData.length);
  return { ...p, x, y, z, rotationY: 0 };
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
