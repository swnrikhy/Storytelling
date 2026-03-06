export type Language = 'en' | 'id';

export enum ModelType {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3.1-pro-preview',
}

export enum ThemeType {
  HORROR = 'Horror',
  ADVENTURE = 'Adventure/Travel',
  ENTREPRENEUR = 'Business/Storytelling',
  CURIOSITY = 'Curiosity/Unique Facts',
  ROMANCE = 'Romance/Drama',
  THRILLER = 'Thriller/Mystery',
  COMEDY = 'Comedy/Slice of Life',
  HISTORY = 'History/Geopolitics',
  SELF_IMPROVEMENT = 'Self Improvement/Psychology',
  TRUE_CRIME = 'True Crime/Investigation',
  MYTHOLOGY = 'Mythology/Folklore',
  SCI_FI = 'Sci-Fi/Futurism',
  FANTASY = 'Fantasy/Magic'
}

export enum DurationType {
  SHORT = 'Short Form (< 60s)',
  MEDIUM = 'Standard (1-3 min)',
  LONG = 'Long Form (10+ min)'
}

export enum FrameworkType {
  NARRATIVE = 'Narrative Arc',
  PAS = 'Problem-Agitate-Solve',
  AIDA = 'Attention-Interest-Desire-Action',
  LISTICLE = 'Listicle/Top Facts',
  MYTH_BUSTING = 'Myth-Busting',
  TUTORIAL = 'Step-by-Step Tutorial',
  BEFORE_AFTER = 'Before & After',
  COMPARISON = 'Comparison/Versus',
  BEHIND_THE_SCENES = 'Behind the Scenes',
  WHAT_IF = 'What If / Speculative',
  PERSONAL_STORY = 'Personal Story/Vulnerability'
}

export interface StoryModule<T> {
  metadata: T;
  content: string; // The actual narrative text for this section
  visualPrompt: string; // A descriptive prompt for a visual/image for this section
}

export interface HookMetadata {
  hookType: 'Question' | 'Shock' | 'Confession' | 'Warning' | 'Curiosity Gap';
  emotionalTrigger: 'Fear' | 'Curiosity' | 'Empathy' | 'Anger' | 'Surprise';
  patternInterrupt: string;
  scrollStopPhrase: string;
  audienceTargeting: string;
}

export interface ContextMetadata {
  characterIntro: string;
  situationSummary: string;
  timeReference: string;
  stakes: string;
  setting: string;
}

export interface ProblemMetadata {
  coreConflict: string;
  internalStruggle: string;
  externalObstacle: string;
  emotionalTensionLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  urgencyIndicator: string;
}

export interface EscalationMetadata {
  complicationLayer1: string;
  complicationLayer2: string;
  unexpectedDevelopment: string;
  suspenseTrigger: string;
  microCliffhanger: string;
}

export interface PeakMetadata {
  plotTwistReveal: string;
  truthRealization: string;
  turningPoint: string;
  decisionMoment: string;
  emotionalPeak: string;
}

export interface ResolutionMetadata {
  outcomeSummary: string;
  lessonLearned: string;
  moralInsight: string;
  reflectionStatement: string;
  emotionalClosure: string;
}

export interface CTAMetadata {
  engagementPrompt: string;
  questionPrompt: string;
  relatabilityCheck: string;
  discussionTrigger: string;
  callToReflection: string;
}

export interface HookIdea {
  text: string;
  translation?: string;
}

export interface FullStory {
  title: string;
  theme: ThemeType;
  framework: FrameworkType;
  hook: StoryModule<HookMetadata>;
  context: StoryModule<ContextMetadata>;
  problem: StoryModule<ProblemMetadata>;
  escalation: StoryModule<EscalationMetadata>;
  peak: StoryModule<PeakMetadata>;
  resolution: StoryModule<ResolutionMetadata>;
  cta: StoryModule<CTAMetadata>;
}

export interface ShortScriptIdea {
  style: string;
  hookType: string;
  script: string;
}

export interface SocialMetadata {
  titles: string[];
  description: string;
  hashtags: string[];
}

export interface ThumbnailIdeas {
  imagePrompt: string;
  textOverlays: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  story: FullStory;
  socialMetadata: SocialMetadata | null;
  thumbnailIdeas: ThumbnailIdeas | null;
  shortScripts: ShortScriptIdea[];
}