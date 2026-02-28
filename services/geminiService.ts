import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ThemeType, FullStory, DurationType, Language, SocialMetadata, ThumbnailIdeas, AIModel } from '../types';

const getAIClient = () => {
  const apiKey = localStorage.getItem('gemini_api_key');
  if (!apiKey) {
    throw new Error("API Key not found. Please set your Gemini API Key.");
  }
  return new GoogleGenAI({ apiKey });
};

const storySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the story" },
    theme: { type: Type.STRING, description: "The theme of the story" },
    hook: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the hook." },
        visualPrompt: { type: Type.STRING, description: "A detailed visual prompt for an image/video for this section." },
        metadata: {
          type: Type.OBJECT,
          properties: {
            hookType: { type: Type.STRING, enum: ['Question', 'Shock', 'Confession', 'Warning', 'Curiosity Gap'] },
            emotionalTrigger: { type: Type.STRING, enum: ['Fear', 'Curiosity', 'Empathy', 'Anger', 'Surprise'] },
            patternInterrupt: { type: Type.STRING, description: "A statement that breaks the norm." },
            scrollStopPhrase: { type: Type.STRING, description: "A short, punchy phrase to stop scrolling." },
            audienceTargeting: { type: Type.STRING, description: "Who this story is for (e.g., 'You', 'Parents', 'Travelers')." },
          },
          required: ["hookType", "emotionalTrigger", "patternInterrupt", "scrollStopPhrase", "audienceTargeting"]
        }
      },
      required: ["content", "visualPrompt", "metadata"]
    },
    context: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the context/setup." },
        visualPrompt: { type: Type.STRING, description: "A detailed visual prompt for an image/video for this section." },
        metadata: {
          type: Type.OBJECT,
          properties: {
            characterIntro: { type: Type.STRING },
            situationSummary: { type: Type.STRING },
            timeReference: { type: Type.STRING },
            stakes: { type: Type.STRING },
            setting: { type: Type.STRING },
          },
          required: ["characterIntro", "situationSummary", "timeReference", "stakes", "setting"]
        }
      },
      required: ["content", "visualPrompt", "metadata"]
    },
    problem: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the problem." },
        visualPrompt: { type: Type.STRING, description: "A detailed visual prompt for an image/video for this section." },
        metadata: {
          type: Type.OBJECT,
          properties: {
            coreConflict: { type: Type.STRING },
            internalStruggle: { type: Type.STRING },
            externalObstacle: { type: Type.STRING },
            emotionalTensionLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Extreme'] },
            urgencyIndicator: { type: Type.STRING },
          },
          required: ["coreConflict", "internalStruggle", "externalObstacle", "emotionalTensionLevel", "urgencyIndicator"]
        }
      },
      required: ["content", "visualPrompt", "metadata"]
    },
    escalation: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the escalation." },
        visualPrompt: { type: Type.STRING, description: "A detailed visual prompt for an image/video for this section." },
        metadata: {
          type: Type.OBJECT,
          properties: {
            complicationLayer1: { type: Type.STRING },
            complicationLayer2: { type: Type.STRING },
            unexpectedDevelopment: { type: Type.STRING },
            suspenseTrigger: { type: Type.STRING },
            microCliffhanger: { type: Type.STRING },
          },
          required: ["complicationLayer1", "complicationLayer2", "unexpectedDevelopment", "suspenseTrigger", "microCliffhanger"]
        }
      },
      required: ["content", "visualPrompt", "metadata"]
    },
    peak: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the peak/twist." },
        visualPrompt: { type: Type.STRING, description: "A detailed visual prompt for an image/video for this section." },
        metadata: {
          type: Type.OBJECT,
          properties: {
            plotTwistReveal: { type: Type.STRING },
            truthRealization: { type: Type.STRING },
            turningPoint: { type: Type.STRING },
            decisionMoment: { type: Type.STRING },
            emotionalPeak: { type: Type.STRING },
          },
          required: ["plotTwistReveal", "truthRealization", "turningPoint", "decisionMoment", "emotionalPeak"]
        }
      },
      required: ["content", "visualPrompt", "metadata"]
    },
    resolution: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the resolution." },
        visualPrompt: { type: Type.STRING, description: "A detailed visual prompt for an image/video for this section." },
        metadata: {
          type: Type.OBJECT,
          properties: {
            outcomeSummary: { type: Type.STRING },
            lessonLearned: { type: Type.STRING },
            moralInsight: { type: Type.STRING },
            reflectionStatement: { type: Type.STRING },
            emotionalClosure: { type: Type.STRING },
          },
          required: ["outcomeSummary", "lessonLearned", "moralInsight", "reflectionStatement", "emotionalClosure"]
        }
      },
      required: ["content", "visualPrompt", "metadata"]
    },
    cta: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the CTA." },
        visualPrompt: { type: Type.STRING, description: "A detailed visual prompt for an image/video for this section." },
        metadata: {
          type: Type.OBJECT,
          properties: {
            engagementPrompt: { type: Type.STRING },
            questionPrompt: { type: Type.STRING },
            relatabilityCheck: { type: Type.STRING },
            discussionTrigger: { type: Type.STRING },
            callToReflection: { type: Type.STRING },
          },
          required: ["engagementPrompt", "questionPrompt", "relatabilityCheck", "discussionTrigger", "callToReflection"]
        }
      },
      required: ["content", "visualPrompt", "metadata"]
    }
  },
  required: ["title", "theme", "hook", "context", "problem", "escalation", "peak", "resolution", "cta"]
};

const hooksSchema: Schema = {
  type: Type.ARRAY,
  items: { type: Type.STRING }
};

const socialMetadataSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    titles: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "5 viral, click-worthy titles." 
    },
    description: { 
      type: Type.STRING, 
      description: "A compelling video description (SEO optimized)." 
    },
    hashtags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "15-20 relevant, high-traffic hashtags, including a mix of trending, niche, and evergreen terms." 
    }
  },
  required: ["titles", "description", "hashtags"]
};

const thumbnailIdeasSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    imagePrompt: { 
      type: Type.STRING, 
      description: "A detailed, descriptive prompt for an AI image generator (Midjourney/DALL-E) to create the thumbnail background. MUST be in English." 
    },
    textOverlays: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "3 short, punchy text phrases (max 5 words) to place on top of the image." 
    }
  },
  required: ["imagePrompt", "textOverlays"]
};

const SYSTEM_INSTRUCTION = `
You are an expert storytelling engine specialized in creating highly engaging video scripts.

Your goal is to maximize audience retention, emotional engagement, curiosity, and shareability based on the specified duration.

Always structure stories using this framework:
Hook → Context → Problem (Conflict) → Escalation → Peak (Twist) → Resolution → CTA.

Rules:
- Start with a strong scroll-stopping hook.
- Match tone and audience precisely.
- Optimize for watch time and viral potential.
- Deliver clear, ready-to-use scripts.

If requested, adjust drama, suspense, pacing, or emotional intensity.
`;

const getModelName = (model: AIModel) => model === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';

export const generateStory = async (theme: ThemeType, duration: DurationType, language: Language, additionalInfo?: string, aiModel: AIModel = 'flash'): Promise<FullStory> => {
  let lengthInstruction = "";
  switch (duration) {
    case DurationType.SHORT:
      lengthInstruction = "STRICT LENGTH CONSTRAINT: Target a concise narrative of 150-200 words total. Content must be punchy, fast-paced, and devoid of fluff. Ideal for TikTok/Reels/Shorts (under 60s).";
      break;
    case DurationType.MEDIUM:
      lengthInstruction = "LENGTH CONSTRAINT: Target a narrative of 400-600 words total. Allow for moderate detail, character feelings, and setting the scene. Ideal for standard YouTube videos or Vlogs (1-3 mins).";
      break;
    case DurationType.LONG:
      lengthInstruction = "LENGTH CONSTRAINT: Target a comprehensive narrative of 1500+ words total. Provide extensive sensory details, deep character development, complex dialogue scenes, and thorough exploration of the conflict and resolution. Ideal for In-depth Video Essays, Documentaries, or Extended Storytime (8+ mins).";
      break;
  }

  const languageInstruction = language === 'id' 
    ? "IMPORTANT: The narrative content (title, content, etc.) MUST be written in Indonesian (Bahasa Indonesia). The metadata values can be in Indonesian or English, but the main story text must be Indonesian."
    : "The content MUST be written in English.";

  const prompt = `
    Generate a compelling, highly engaging story based on the theme: "${theme}".
    
    ${lengthInstruction}
    ${languageInstruction}
    
    ${additionalInfo ? `Additional Context/Requirements: ${additionalInfo}` : ''}
    
    The story MUST be structured into 7 distinct modules: Hook, Context, Problem, Escalation, Peak, Resolution, and CTA.
    For each module, provide:
    1. 'content': The actual narrative text (paragraph or sentences).
    2. 'visualPrompt': A detailed visual prompt for an image/video for this section (in English).
    3. 'metadata': The specific metadata requested in the schema.
    
    Ensure the content flows naturally from one module to the next to form a cohesive story.
  `;

  try {
    const response = await getAIClient().models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: storySchema,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text generated");
    
    return JSON.parse(text) as FullStory;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateHooks = async (topic: string, theme: string, language: Language, aiModel: AIModel = 'flash'): Promise<string[]> => {
  const languageInstruction = language === 'id' 
    ? "OUTPUT MUST BE IN INDONESIAN (BAHASA INDONESIA)."
    : "OUTPUT MUST BE IN ENGLISH.";

  const prompt = `
    Generate 5 scroll-stopping hooks for this topic: "${topic || theme}".
    Theme: ${theme}.
    ${languageInstruction}
    
    Use curiosity, emotional triggers, and pattern interrupts.
    Make them feel native to TikTok storytelling.
    
    Return a JSON array of strings, where each string is a unique hook.
  `;

  try {
    const response = await getAIClient().models.generateContent({
      model: getModelName(aiModel),
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: hooksSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text generated");

    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini API Error (Hooks):", error);
    throw error;
  }
};

export const rewriteStory = async (currentStory: FullStory, language: Language, aiModel: AIModel = 'flash'): Promise<FullStory> => {
  const languageInstruction = language === 'id' 
    ? "Maintain the story in INDONESIAN (BAHASA INDONESIA)."
    : "Maintain the story in ENGLISH.";

  const prompt = `
    Rewrite the following script to increase emotional tension, stakes, and dramatic impact without making it unrealistic.
    
    ${languageInstruction}
    Maintain the EXACT same 7-module structure and schema. 
    Maintain the approximate length/format of the original story (Short/Medium/Long).
    Update both the content and the metadata to reflect the higher intensity.

    Original Story JSON:
    ${JSON.stringify(currentStory)}
  `;

  try {
    const response = await getAIClient().models.generateContent({
      model: getModelName(aiModel),
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: storySchema,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text generated");
    
    return JSON.parse(text) as FullStory;
  } catch (error) {
    console.error("Gemini API Error (Rewrite):", error);
    throw error;
  }
};

export const generateSocialMetadata = async (story: FullStory, language: Language, aiModel: AIModel = 'flash'): Promise<SocialMetadata> => {
  const languageInstruction = language === 'id' 
    ? "OUTPUT MUST BE IN INDONESIAN (BAHASA INDONESIA)."
    : "OUTPUT MUST BE IN ENGLISH.";

  const prompt = `
    Based on the following story, generate viral social media assets.
    
    Story Title: ${story.title}
    Theme: ${story.theme}
    Hook: ${story.hook.content}
    Plot Summary: ${story.context.content} -> ${story.problem.content} -> ${story.resolution.content}
    
    Tasks:
    1. 5 Clickbait/Viral Titles (Short, punchy, curiosity-inducing).
    2. A YouTube/TikTok Description (Engaging, SEO-friendly, includes a question for engagement).
    3. 15-20 High-traffic Hashtags: a mix of trending, niche, and evergreen hashtags.

    ${languageInstruction}
  `;

  try {
    const response = await getAIClient().models.generateContent({
      model: getModelName(aiModel),
      contents: prompt,
      config: {
        systemInstruction: "You are a Social Media Manager expert in SEO and Virality.",
        responseMimeType: "application/json",
        responseSchema: socialMetadataSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No metadata generated");
    
    return JSON.parse(text) as SocialMetadata;
  } catch (error) {
    console.error("Gemini API Error (Social Metadata):", error);
    throw error;
  }
};

export const generateThumbnail = async (story: FullStory, language: Language, aiModel: AIModel = 'flash'): Promise<ThumbnailIdeas> => {
  const textOverlayInstruction = language === 'id'
    ? "The 'textOverlays' MUST be in Indonesian."
    : "The 'textOverlays' MUST be in English.";

  const prompt = `
    Create a concept for a high-click-through rate (CTR) YouTube thumbnail for this story.
    
    Story Title: ${story.title}
    Theme: ${story.theme}
    Key Visual: ${story.hook.content.substring(0, 150)}...
    
    Task:
    1. 'imagePrompt': Write a highly detailed, descriptive image generation prompt (in English) that I can paste into Midjourney, DALL-E 3, or Stable Diffusion. It should specify lighting, composition (e.g., close-up, wide shot), style (e.g., photorealistic, cinematic, illustrated), and key subjects. It must be dramatic and emotional.
    2. 'textOverlays': Provide 3 options for short, punchy text to place ON the thumbnail image. These should be 2-5 words max, highly curiosity-inducing.
    
    ${textOverlayInstruction}
  `;

  try {
    const response = await getAIClient().models.generateContent({
        model: getModelName(aiModel),
        contents: prompt,
        config: {
          systemInstruction: "You are a YouTube Thumbnail expert. You know what makes people click.",
          responseMimeType: "application/json",
          responseSchema: thumbnailIdeasSchema,
        },
    });

    const text = response.text;
    if (!text) throw new Error("No thumbnail ideas generated");
    
    return JSON.parse(text) as ThumbnailIdeas;
  } catch (error) {
    console.error("Gemini API Error (Thumbnail Ideas):", error);
    throw error;
  }
};