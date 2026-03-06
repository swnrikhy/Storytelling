import { GoogleGenAI, Type, Schema } from "@google/genai";

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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, ...data } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    let response;
    switch (action) {
      case 'generateStory':
        response = await handleGenerateStory(ai, data);
        break;
      case 'generateHooks':
        response = await handleGenerateHooks(ai, data);
        break;
      case 'rewriteStory':
        response = await handleRewriteStory(ai, data);
        break;
      case 'generateSocialMetadata':
        response = await handleGenerateSocialMetadata(ai, data);
        break;
      case 'generateShortScript':
        response = await handleGenerateShortScript(ai, data);
        break;
      case 'generateThumbnail':
        response = await handleGenerateThumbnail(ai, data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}

async function handleGenerateStory(ai: any, data: any) {
  const { theme, duration, language, framework, additionalInfo, writingStyle } = data;
  let lengthInstruction = "";
  switch (duration) {
    case 'SHORT': lengthInstruction = "STRICT LENGTH CONSTRAINT: Target a concise narrative of 150-200 words total."; break;
    case 'MEDIUM': lengthInstruction = "LENGTH CONSTRAINT: Target a narrative of 400-600 words total."; break;
    case 'LONG': lengthInstruction = "LENGTH CONSTRAINT: Target a comprehensive narrative of 1800+ words total."; break;
  }

  let frameworkInstruction = "";
  switch (framework) {
    case 'NARRATIVE': frameworkInstruction = "FRAMEWORK: Classic Narrative Arc."; break;
    case 'PAS': frameworkInstruction = "FRAMEWORK: Problem-Agitate-Solve."; break;
    case 'AIDA': frameworkInstruction = "FRAMEWORK: AIDA."; break;
    case 'LISTICLE': frameworkInstruction = "FRAMEWORK: Listicle/Top Facts."; break;
    case 'MYTH_BUSTING': frameworkInstruction = "FRAMEWORK: Myth-Busting."; break;
    case 'TUTORIAL': frameworkInstruction = "FRAMEWORK: Step-by-Step Tutorial."; break;
    case 'BEFORE_AFTER': frameworkInstruction = "FRAMEWORK: Before & After."; break;
    case 'COMPARISON': frameworkInstruction = "FRAMEWORK: Comparison/Versus."; break;
    case 'BEHIND_THE_SCENES': frameworkInstruction = "FRAMEWORK: Behind the Scenes."; break;
    case 'WHAT_IF': frameworkInstruction = "FRAMEWORK: What If / Speculative."; break;
    case 'PERSONAL_STORY': frameworkInstruction = "FRAMEWORK: Personal Story/Vulnerability."; break;
  }

  const prompt = `Generate a story based on theme: "${theme}". ${lengthInstruction} ${frameworkInstruction}`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: storySchema,
    }
  });
  return JSON.parse(response.text);
}

async function handleGenerateHooks(ai: any, data: any) {
  const { topic, theme, language } = data;
  const prompt = `Generate 5 scroll-stopping hooks for this topic: "${topic || theme}". Theme: ${theme}.`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: hooksSchema,
    }
  });
  return JSON.parse(response.text);
}

async function handleRewriteStory(ai: any, data: any) {
  const { currentStory, language } = data;
  const prompt = `Rewrite the following script to increase emotional tension, stakes, and dramatic impact. Original Story JSON: ${JSON.stringify(currentStory)}`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: storySchema,
    }
  });
  return JSON.parse(response.text);
}

async function handleGenerateSocialMetadata(ai: any, data: any) {
  const { story, language } = data;
  const prompt = `Based on the following story, generate viral social media assets. Story Title: ${story.title}.`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: "You are a Social Media Manager expert in SEO and Virality.",
      responseMimeType: "application/json",
      responseSchema: socialMetadataSchema,
    }
  });
  return JSON.parse(response.text);
}

async function handleGenerateShortScript(ai: any, data: any) {
  const { story, language } = data;
  const prompt = `Create 3 different high-energy, punchy scripts optimized for a 20-40 second short-form video based on this story. Story Title: ${story.title}.`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: "You are a Viral Video Scriptwriter.",
      responseMimeType: "application/json",
      responseSchema: shortScriptSchema,
    }
  });
  return JSON.parse(response.text);
}

async function handleGenerateThumbnail(ai: any, data: any) {
  const { story, language } = data;
  const prompt = `Create 3 distinct YouTube thumbnail concepts for this story. Story Title: ${story.title}.`;
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      systemInstruction: "You are a YouTube Thumbnail expert.",
      responseMimeType: "application/json",
      responseSchema: thumbnailIdeasSchema,
    }
  });
  return JSON.parse(response.text);
}
