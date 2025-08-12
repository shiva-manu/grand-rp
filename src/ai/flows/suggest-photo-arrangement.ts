'use server';

/**
 * @fileOverview AI flow to suggest an arrangement of photos in 3D space based on their features.
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
  return suggestPhotoArrangementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPhotoArrangementPrompt',
  input: {schema: SuggestPhotoArrangementInputSchema},
  output: {schema: SuggestPhotoArrangementOutputSchema},
  prompt: `You are an AI assistant that suggests arrangements of photos in a 3D space.

You will receive a list of photo URLs and the dimensions of the 3D space.

Based on the color palettes and aspect ratios of the photos, suggest an arrangement that is visually appealing and harmoniously organized.
Consider avoiding overlapping photos, placing similar color palettes together and using the space dimensions effectively.

Respond with a JSON array of objects, where each object represents a photo and its 3D coordinates, like so:

{
  "photoUrl": "<url>",
  "x": <number>,
  "y": <number>,
  "z": <number>,
  "rotationY": <optional number>
}

Input Photos: {{photoUrls}}
Space Width: {{spaceWidth}}
Space Height: {{spaceHeight}}
Space Depth: {{spaceDepth}}`,
});

const suggestPhotoArrangementFlow = ai.defineFlow(
  {
    name: 'suggestPhotoArrangementFlow',
    inputSchema: SuggestPhotoArrangementInputSchema,
    outputSchema: SuggestPhotoArrangementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
