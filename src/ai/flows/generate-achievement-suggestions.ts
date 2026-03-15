'use server';
/**
 * @fileOverview This file provides an AI-powered tool to generate suggestions for professional achievements.
 *
 * - generateAchievementSuggestions - A function that handles the generation of achievement suggestions.
 * - GenerateAchievementSuggestionsInput - The input type for the function.
 * - GenerateAchievementSuggestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAchievementSuggestionsInputSchema = z.object({
  currentAchievement: z
    .string()
    .optional()
    .describe("The user's current draft of the achievement or experience."),
  major: z.string().optional().describe("The user's academic major."),
  bio: z.string().optional().describe("The user's profile biography."),
});
export type GenerateAchievementSuggestionsInput = z.infer<
  typeof GenerateAchievementSuggestionsInputSchema
>;

const GenerateAchievementSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of 3-5 generated suggestions for the achievement.'),
});
export type GenerateAchievementSuggestionsOutput = z.infer<
  typeof GenerateAchievementSuggestionsOutputSchema
>;

export async function generateAchievementSuggestions(
  input: GenerateAchievementSuggestionsInput
): Promise<GenerateAchievementSuggestionsOutput> {
  return generateAchievementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAchievementSuggestionsPrompt',
  input: {schema: GenerateAchievementSuggestionsInputSchema},
  output: {schema: GenerateAchievementSuggestionsOutputSchema},
  prompt: `You are an AI assistant that helps students and recent graduates write compelling descriptions of their achievements and experiences for a job-seeking platform.

Generate 3 unique and concise suggestions based on the provided information. The goal is to turn a simple statement into a powerful achievement that showcases skills and impact. Use action verbs and quantify results where possible.

{{#if currentAchievement}}
Here is the user's current draft: """{{{currentAchievement}}}"""
{{/if}}

{{#if major}}
The user's major is: {{{major}}}
{{/if}}

{{#if bio}}
The user's bio is: """{{{bio}}}"""
{{/if}}

The tone should be professional, confident, and action-oriented. Provide the suggestions in a JSON array format.`,
});

const generateAchievementSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateAchievementSuggestionsFlow',
    inputSchema: GenerateAchievementSuggestionsInputSchema,
    outputSchema: GenerateAchievementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
