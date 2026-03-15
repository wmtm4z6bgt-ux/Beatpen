'use server';
/**
 * @fileOverview This file provides an AI-powered tool to generate profile bio suggestions.
 *
 * - generateProfileBioSuggestions - A function that handles the generation of profile bio suggestions.
 * - GenerateProfileBioSuggestionsInput - The input type for the generateProfileBioSuggestions function.
 * - GenerateProfileBioSuggestionsOutput - The return type for the generateProfileBioSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProfileBioSuggestionsInputSchema = z.object({
  currentBio: z
    .string()
    .optional()
    .describe('The user\'s current profile biography, if any.'),
  interests: z
    .array(z.string())
    .optional()
    .describe('A list of the user\'s interests or skills.'),
  tone: z
    .string()
    .optional()
    .describe('The desired tone for the bio suggestions (e.g., "professional", "enthusiastic", "formal").'),
});
export type GenerateProfileBioSuggestionsInput = z.infer<
  typeof GenerateProfileBioSuggestionsInputSchema
>;

const GenerateProfileBioSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of generated profile bio suggestions.'),
});
export type GenerateProfileBioSuggestionsOutput = z.infer<
  typeof GenerateProfileBioSuggestionsOutputSchema
>;

export async function generateProfileBioSuggestions(
  input: GenerateProfileBioSuggestionsInput
): Promise<GenerateProfileBioSuggestionsOutput> {
  return generateProfileBioSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProfileBioSuggestionsPrompt',
  input: {schema: GenerateProfileBioSuggestionsInputSchema},
  output: {schema: GenerateProfileBioSuggestionsOutputSchema},
  prompt: `You are an AI assistant that helps students and recent graduates create professional and engaging profile biographies for a job-seeking platform.

Generate 3-5 unique and concise profile bio suggestions based on the provided information.

Focus on highlighting skills, studies, and career aspirations. The bio should be suitable for attracting recruiters.

{{#if currentBio}}
Here is the user's current bio: """{{{currentBio}}}"""
{{/if}}

{{#if interests}}
Here are some of the user's skills/interests: {{{interests.join ", "}}}
{{/if}}

{{#if tone}}
The desired tone for the suggestions is: {{{tone}}}
{{else}}
The tone should be professional and confident.
{{/if}}

Provide the suggestions in a JSON array format.`,
});

const generateProfileBioSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateProfileBioSuggestionsFlow',
    inputSchema: GenerateProfileBioSuggestionsInputSchema,
    outputSchema: GenerateProfileBioSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
