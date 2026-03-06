import { FullStory, HookIdea, SocialMetadata, ShortScriptIdea, ThumbnailIdeas, ThemeType, DurationType, Language, FrameworkType } from '../types';

export const generateStory = async (
  theme: ThemeType, 
  duration: DurationType, 
  language: Language, 
  framework: FrameworkType,
  additionalInfo?: string, 
  writingStyle?: string
): Promise<FullStory> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generateStory', theme, duration, language, framework, additionalInfo, writingStyle }),
  });
  if (!response.ok) throw new Error('Failed to generate story');
  return response.json();
};

export const generateHooks = async (topic: string, theme: string, language: Language): Promise<HookIdea[]> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generateHooks', topic, theme, language }),
  });
  if (!response.ok) throw new Error('Failed to generate hooks');
  return response.json();
};

export const rewriteStory = async (currentStory: FullStory, language: Language): Promise<FullStory> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'rewriteStory', currentStory, language }),
  });
  if (!response.ok) throw new Error('Failed to rewrite story');
  return response.json();
};

export const generateSocialMetadata = async (story: FullStory, language: Language): Promise<SocialMetadata> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generateSocialMetadata', story, language }),
  });
  if (!response.ok) throw new Error('Failed to generate social metadata');
  return response.json();
};

export const generateShortScript = async (story: FullStory, language: Language): Promise<ShortScriptIdea[]> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generateShortScript', story, language }),
  });
  if (!response.ok) throw new Error('Failed to generate short script');
  return response.json();
};

export const generateThumbnail = async (story: FullStory, language: Language): Promise<ThumbnailIdeas> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'generateThumbnail', story, language }),
  });
  if (!response.ok) throw new Error('Failed to generate thumbnail');
  return response.json();
};
