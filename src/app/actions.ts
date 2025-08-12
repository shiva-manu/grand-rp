"use server";

import { suggestPhotoArrangement } from "@/ai/flows/suggest-photo-arrangement";
import type { SuggestPhotoArrangementInput } from "@/ai/flows/suggest-photo-arrangement";

export async function getArrangementSuggestion(input: SuggestPhotoArrangementInput) {
  try {
    const data = await suggestPhotoArrangement(input);
    return { data };
  } catch (e: any) {
    console.error(e);
    return { error: e.message || "Failed to get suggestions." };
  }
}
