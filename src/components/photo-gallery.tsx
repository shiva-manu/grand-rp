"use client";

import React, { useState, useTransition, useMemo } from "react";
import { PhotoVerse } from "@/components/photo-verse";
import { useToast } from "@/hooks/use-toast";
import type { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const photosData = [
  { url: 'https://ik.imagekit.io/pbk0y1kt4/New%20Folder/Screenshot_2025-08-06-02-43-29-10_389ebf390bfc3991306aed56e489afee.jpg?updatedAt=1754980285736.jpg', 'data-ai-hint': "love couple" },
  { url: 'https://ik.imagekit.io/pbk0y1kt4/New%20Folder/Screenshot_20250807-050112.jpg?updatedAt=1754980862003', 'data-ai-hint': "couple hug" },
  { url: 'https://ik.imagekit.io/pbk0y1kt4/New%20Folder/Screenshot_20250810-143402.jpg?updatedAt=1754980850351', 'data-ai-hint': "couple smile" },
  { url: 'https://ik.imagekit.io/pbk0y1kt4/New%20Folder/Screenshot_20250730-012837.jpg?updatedAt=1754980837083', 'data-ai-hint': "couple celebrate" },
  { url: 'https://ik.imagekit.io/pbk0y1kt4/New%20Folder/Screenshot_20250730-012633.jpg?updatedAt=1754980822889', 'data-ai-hint': "couple photo" },
  { url: 'https://ik.imagekit.io/pbk0y1kt4/New%20Folder/Screenshot_20250721-093335.jpg?updatedAt=1754980808860', 'data-ai-hint': "couple nature" },
];

const getCircleCoords = (index: number, total: number) => {
  const radius = 24;
  const angle = (index / total) * 2 * Math.PI;

  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = 0; 
  const rotationY = -angle + Math.PI / 2;
  
  return { x, y, z, rotationY };
}

export function PhotoGallery() {
  const initialPhotos: Photo[] = useMemo(() => {
    // Remove duplicates by URL
    const uniquePhotosData = photosData.filter((photo, index, self) =>
        index === self.findIndex((p) => (
            p.url === photo.url
        ))
    );
    return uniquePhotosData.map((p, i) => {
      const { x, y, z, rotationY } = getCircleCoords(i, uniquePhotosData.length);
      return { ...p, x, y, z, rotationY, photoUrl: p.url };
    });
  }, []);

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
