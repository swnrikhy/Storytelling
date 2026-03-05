import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ThemeType, FullStory, DurationType, Language, SocialMetadata, ThumbnailIdeas, HookIdea, ShortScriptIdea } from '../types';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

const storySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the story" },
    theme: { type: Type.STRING, description: "The theme of the story" },
    hook: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the hook." },
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
      required: ["content", "metadata"]
    },
    context: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the context/setup." },
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
      required: ["content", "metadata"]
    },
    problem: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the problem." },
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
      required: ["content", "metadata"]
    },
    escalation: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the escalation." },
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
      required: ["content", "metadata"]
    },
    peak: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the peak/twist." },
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
      required: ["content", "metadata"]
    },
    resolution: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the resolution." },
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
      required: ["content", "metadata"]
    },
    cta: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.STRING, description: "The narrative text for the CTA." },
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
      required: ["content", "metadata"]
    }
  },
  required: ["title", "theme", "hook", "context", "problem", "escalation", "peak", "resolution", "cta"]
};

const hooksSchema: Schema = {
  type: Type.ARRAY,
  items: { 
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: "The hook text in the target language." },
      translation: { type: Type.STRING, description: "The Indonesian translation of the hook (only if target language is English)." }
    },
    required: ["text"]
  }
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

const shortScriptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    scripts: { 
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING, description: "The style of this script (e.g., Dramatic, Educational, Fast-paced)." },
          hookType: { type: Type.STRING, description: "The type of hook used (e.g., Question, Shocking Fact, Direct Address)." },
          script: { type: Type.STRING, description: "The actual narrative text, to the point, no stage directions." }
        },
        required: ["style", "hookType", "script"]
      },
      description: "3 different versions of a 20-40s script."
    }
  },
  required: ["scripts"]
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

const MODEL_NAME = "gemini-3-flash-preview";

export const generateStory = async (theme: ThemeType, duration: DurationType, language: Language, additionalInfo?: string, writingStyle?: string): Promise<FullStory> => {
  let lengthInstruction = "";
  switch (duration) {
    case DurationType.SHORT:
      lengthInstruction = "STRICT LENGTH CONSTRAINT: Target a concise narrative of 150-200 words total. Content must be punchy, fast-paced, and devoid of fluff. Ideal for TikTok/Reels/Shorts (under 60s).";
      break;
    case DurationType.MEDIUM:
      lengthInstruction = "LENGTH CONSTRAINT: Target a narrative of 400-600 words total. Allow for moderate detail, character feelings, and setting the scene. Ideal for standard YouTube videos or Vlogs (1-3 mins).";
      break;
    case DurationType.LONG:
      lengthInstruction = "LENGTH CONSTRAINT: Target a comprehensive narrative of 1800+ words total. Provide extensive sensory details, deep character development, complex dialogue scenes, and thorough exploration of the conflict and resolution. Ideal for In-depth Video Essays, Documentaries, or Extended Storytime (10+ mins).";
      break;
  }

  const languageInstruction = language === 'id' 
    ? "IMPORTANT: The narrative content (title, content, etc.) MUST be written in Indonesian (Bahasa Indonesia). The metadata values can be in Indonesian or English, but the main story text must be Indonesian."
    : "The content MUST be written in English.";

  const prompt = `
    Generate a compelling, highly engaging story based on the theme: "${theme}".
    
    ${lengthInstruction}
    ${languageInstruction}
    
    ${writingStyle ? `Writing Style/Tone: ${writingStyle}` : ''}
    ${additionalInfo ? `Additional Context/Requirements: ${additionalInfo}` : ''}
    
    The story MUST be structured into 7 distinct modules: Hook, Context, Problem, Escalation, Peak, Resolution, and CTA.
    For each module, provide the specific metadata requested in the schema and the actual narrative content (paragraph or sentences) for that section.
    
    Ensure the content flows naturally from one module to the next to form a cohesive story.
  `;

  try {
    const response = await ai.models.generateContent({
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

export const generateHooks = async (topic: string, theme: string, language: Language): Promise<HookIdea[]> => {
  const languageInstruction = language === 'id' 
    ? "OUTPUT MUST BE IN INDONESIAN (BAHASA INDONESIA). No translation needed."
    : "OUTPUT MUST BE IN ENGLISH. For each hook, also provide an Indonesian translation in the 'translation' field.";

  const prompt = `
    Generate 5 scroll-stopping hooks for this topic: "${topic || theme}".
    Theme: ${theme}.
    ${languageInstruction}
    
    Use curiosity, emotional triggers, and pattern interrupts.
    Make them feel native to TikTok storytelling.
    
    Return a JSON array of objects with 'text' and 'translation' fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: hooksSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text generated");

    return JSON.parse(text) as HookIdea[];
  } catch (error) {
    console.error("Gemini API Error (Hooks):", error);
    throw error;
  }
};

export const rewriteStory = async (currentStory: FullStory, language: Language): Promise<FullStory> => {
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
    const response = await ai.models.generateContent({
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
    console.error("Gemini API Error (Rewrite):", error);
    throw error;
  }
};

export const generateSocialMetadata = async (story: FullStory, language: Language): Promise<SocialMetadata> => {
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
    3. 15-20 High-traffic Hashtags: a mix of trending, niche, and evergreen hashtags. IMPORTANT: DO NOT include the '#' symbol in the hashtag strings, just the words.

    ${languageInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
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

export const generateShortScript = async (story: FullStory, language: Language): Promise<ShortScriptIdea[]> => {
  const languageInstruction = language === 'id' 
    ? "OUTPUT MUST BE IN INDONESIAN (BAHASA INDONESIA)."
    : "OUTPUT MUST BE IN ENGLISH.";

  const prompt = `
    Create 3 different high-energy, punchy scripts optimized for a 20-40 second short-form video (TikTok/Reels/Shorts) based on this story.
    
    Story Title: ${story.title}
    Full Narrative: ${story.hook.content} ${story.context.content} ${story.problem.content} ${story.resolution.content}
    
    Guidelines for the 3 versions:
    1. Version 1: Dramatic & Suspenseful. Use a "Shock" or "Warning" hook.
    2. Version 2: Educational/Curiosity. Use a "Did you know?" or "Question" hook.
    3. Version 3: Fast-paced/Direct. Start with a "Confession" or "Direct Address" (e.g., "Stop scrolling if you...").
    
    General Rules:
    - Each script must be "to the point" - ONLY the narrative text that will be spoken.
    - No stage directions, no [Visuals], no [Music].
    - Focus on the hook, the core conflict, and the twist.
    - End with a strong Call to Action.
    - The total reading time for each must be between 20 and 40 seconds.
    - Do not change the core facts of the story.

    ${languageInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: "You are a Viral Video Scriptwriter. You know how to keep people watching with punchy, narrative-only scripts.",
        responseMimeType: "application/json",
        responseSchema: shortScriptSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No scripts generated");
    
    const json = JSON.parse(text);
    return json.scripts as ShortScriptIdea[];
  } catch (error) {
    console.error("Gemini API Error (Short Script):", error);
    throw error;
  }
};

export const generateThumbnail = async (story: FullStory, language: Language): Promise<ThumbnailIdeas> => {
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
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
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