import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ThemeType, FullStory, DurationType, Language, SocialMetadata, ThumbnailIdeas, HookIdea, ShortScriptIdea, FrameworkType } from '../types';

const getAI = () => {
  const manualKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
  const key = manualKey || process.env.API_KEY || process.env.GEMINI_API_KEY;
  return new GoogleGenAI({ apiKey: key });
};

const storySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the story" },
    theme: { type: Type.STRING, description: "The theme of the story" },
    framework: { type: Type.STRING, description: "The framework used for the story" },
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
    concepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING, description: "The visual style of the thumbnail (e.g., 'Hyper-Realistic', 'Comic Book', 'Minimalist')." },
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
        required: ["style", "imagePrompt", "textOverlays"]
      },
      description: "3 distinct thumbnail concepts with different styles."
    }
  },
  required: ["concepts"]
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

export const generateStory = async (
  theme: ThemeType, 
  duration: DurationType, 
  language: Language, 
  framework: FrameworkType,
  additionalInfo?: string, 
  writingStyle?: string
): Promise<FullStory> => {
  const ai = getAI();
  const modelName = MODEL_NAME;
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

  let frameworkInstruction = "";
  switch (framework) {
    case FrameworkType.NARRATIVE:
      frameworkInstruction = "FRAMEWORK: Classic Narrative Arc (Hook → Context → Problem → Escalation → Peak → Resolution → CTA). Focus on storytelling and emotional journey.";
      break;
    case FrameworkType.PAS:
      frameworkInstruction = "FRAMEWORK: Problem-Agitate-Solve. Map PAS to the 7 modules: Hook (Attention), Context (Introduce Problem), Problem (Agitate Problem), Escalation (Agitate Further), Peak (Present Solution), Resolution (Results/Proof), CTA (Action).";
      break;
    case FrameworkType.AIDA:
      frameworkInstruction = "FRAMEWORK: AIDA (Attention, Interest, Desire, Action). Map to 7 modules: Hook (Attention), Context (Build Interest), Problem (Identify Need), Escalation (Build Desire), Peak (The Solution), Resolution (Satisfaction), CTA (Action).";
      break;
    case FrameworkType.LISTICLE:
      frameworkInstruction = "FRAMEWORK: Listicle/Top Facts. Map to 7 modules: Hook (Intro/Hook), Context (Fact 1), Problem (Fact 2), Escalation (Fact 3), Peak (Fact 4 - The most shocking), Resolution (Fact 5/Summary), CTA (Engagement).";
      break;
    case FrameworkType.MYTH_BUSTING:
      frameworkInstruction = "FRAMEWORK: Myth-Busting. Map to 7 modules: Hook (The Myth), Context (Why people believe it), Problem (The Flaw in the myth), Escalation (The Evidence), Peak (The Truth revealed), Resolution (Impact of the truth), CTA (Discussion).";
      break;
    case FrameworkType.TUTORIAL:
      frameworkInstruction = "FRAMEWORK: Step-by-Step Tutorial. Map to 7 modules: Hook (The Result), Context (What you need), Problem (Common mistake), Escalation (Step 1-2), Peak (The Secret Step/Key), Resolution (Final Result), CTA (Try it).";
      break;
    case FrameworkType.BEFORE_AFTER:
      frameworkInstruction = "FRAMEWORK: Before & After. Map to 7 modules: Hook (The Result/After), Context (The Starting Point/Before), Problem (The Struggle), Escalation (The Turning Point), Peak (The Transformation), Resolution (The New Reality), CTA (Call to Action).";
      break;
    case FrameworkType.COMPARISON:
      frameworkInstruction = "FRAMEWORK: Comparison/Versus. Map to 7 modules: Hook (The Contenders), Context (Criteria 1), Problem (Criteria 2), Escalation (Criteria 3), Peak (The Winner/Verdict), Resolution (Final Thoughts), CTA (Which do you prefer?).";
      break;
    case FrameworkType.BEHIND_THE_SCENES:
      frameworkInstruction = "FRAMEWORK: Behind the Scenes. Map to 7 modules: Hook (The Finished Product), Context (The Hidden Effort), Problem (The Challenge faced), Escalation (The Process/Secret), Peak (The Breakthrough), Resolution (The Final Result), CTA (Follow for more).";
      break;
    case FrameworkType.WHAT_IF:
      frameworkInstruction = "FRAMEWORK: What If / Speculative. Map to 7 modules: Hook (The Big Question), Context (The Known Reality), Problem (The Divergence Point), Escalation (The Consequences), Peak (The Ultimate Outcome), Resolution (The Lesson/Reflection), CTA (What do you think?).";
      break;
    case FrameworkType.PERSONAL_STORY:
      frameworkInstruction = "FRAMEWORK: Personal Story/Vulnerability. Map to 7 modules: Hook (The Vulnerable Moment), Context (The Background), Problem (The Internal Struggle), Escalation (The Breaking Point), Peak (The Realization), Resolution (The Healing/Growth), CTA (Share your story).";
      break;
  }

  const languageInstruction = language === 'id' 
    ? "IMPORTANT: The narrative content (title, content, etc.) MUST be written in Indonesian (Bahasa Indonesia). The metadata values can be in Indonesian or English, but the main story text must be Indonesian."
    : "The content MUST be written in English.";

  const prompt = `
    Generate a compelling, highly engaging story based on the theme: "${theme}".
    
    ${lengthInstruction}
    ${frameworkInstruction}
    ${languageInstruction}
    
    ${writingStyle ? `Writing Style/Tone: ${writingStyle}` : ''}
    ${additionalInfo ? `Additional Context/Requirements: ${additionalInfo}` : ''}
    
    The story MUST be structured into 7 distinct modules: Hook, Context, Problem, Escalation, Peak, Resolution, and CTA.
    For each module, provide the specific metadata requested in the schema and the actual narrative content (paragraph or sentences) for that section.
    
    Ensure the content flows naturally from one module to the next to form a cohesive story, even while following the specified framework logic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
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
  const ai = getAI();
  const modelName = MODEL_NAME;
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
      model: modelName,
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
  const ai = getAI();
  const modelName = MODEL_NAME;
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
      model: modelName,
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
  const ai = getAI();
  const modelName = MODEL_NAME;
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
      model: modelName,
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
  const ai = getAI();
  const modelName = MODEL_NAME;
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
      model: modelName,
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
  const ai = getAI();
  const modelName = MODEL_NAME;
  const textOverlayInstruction = language === 'id'
    ? "The 'textOverlays' MUST be in Indonesian."
    : "The 'textOverlays' MUST be in English.";

  const prompt = `
    Create 3 distinct YouTube thumbnail concepts for this story, each with a unique visual style.
    
    Story Title: ${story.title}
    Theme: ${story.theme}
    Key Visual: ${story.hook.content.substring(0, 150)}...
    
    Styles to generate:
    1. Hyper-Realistic / Cinematic (High drama, 8k resolution, movie poster feel)
    2. Illustrated / Art (Comic book style, vector art, or digital painting)
    3. Minimalist / Symbolic (Clean, high contrast, focus on a single object or emotion)

    Task for each concept:
    1. 'style': Name the style.
    2. 'imagePrompt': Write a highly detailed prompt for an AI image generator (Midjourney/DALL-E). MUST be in English.
    3. 'textOverlays': Provide 3 options for short, punchy text (2-5 words) to place ON the image.
    
    ${textOverlayInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: "You are a YouTube Thumbnail expert. You know what makes people click.",
          responseMimeType: "application/json",
          responseSchema: thumbnailIdeasSchema,
        },
    });

    const text = response.text;
    if (!text) throw new Error("No thumbnail ideas generated");
    
    const json = JSON.parse(text);
    return json.concepts as ThumbnailIdeas;
  } catch (error) {
    console.error("Gemini API Error (Thumbnail Ideas):", error);
    throw error;
  }
};