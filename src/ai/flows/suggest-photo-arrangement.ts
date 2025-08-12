'use server';

/**
 * @fileOverview AI flow to suggest an arrangement of photos in 3D space based on their features.
 *
 * THIS FLOW IS DEPRECATED AND NOT IN USE.
 * The photo arrangement logic has been moved to the client-side in PhotoGallery.
 *
 * - suggestPhotoArrangement - A function that suggests photo arrangements.
 * - SuggestPhotoArrangementInput - The input type for the suggestPhotoArrangement function.
 * - SuggestPhotoArrangementOutput - The return type for the suggestPhotoArrangement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPhotoArrangementInputSchema = z.object({
  photoUrls: z
    .array(z.string())
    .describe('An array of URLs for the photos to be arranged.'),
  spaceWidth: z.number().describe('The width of the 3D space.'),
  spaceHeight: z.number().describe('The height of the 3D space.'),
  spaceDepth: z.number().describe('The depth of the 3D space.'),
});
export type SuggestPhotoArrangementInput = z.infer<
  typeof SuggestPhotoArrangementInputSchema
>;

const SuggestPhotoArrangementOutputSchema = z.array(
  z.object({
    photoUrl: z.string().describe('The URL of the photo.'),
    x: z.number().describe('The x-coordinate of the photo in 3D space.'),
    y: z.number().describe('The y-coordinate of the photo in 3D space.'),
    z: z.number().describe('The z-coordinate of the photo in 3D space.'),
    rotationY: z.number().optional().describe('The y-rotation of the photo in 3D space (in degrees).'),
  })
);
export type SuggestPhotoArrangementOutput = z.infer<
  typeof SuggestPhotoArrangementOutputSchema
>;

export async function suggestPhotoArrangement(
  input: SuggestPhotoArrangementInput
): Promise<SuggestPhotoArrangementOutput> {
  console.log("suggestPhotoArrangement flow called, but is deprecated.");
  return [];
}
