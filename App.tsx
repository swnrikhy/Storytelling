import React, { useState, useRef, useEffect } from 'react';
import { ThemeType, FullStory, DurationType, Language, SocialMetadata, ThumbnailIdeas, AIModel } from './types';
import { generateStory, generateHooks, rewriteStory, generateSocialMetadata, generateThumbnail } from './services/geminiService';
import { ModuleCard } from './components/ModuleCard';

// Simplified Icons (Thinner strokes for elegance)
const Icons = {
  Hook: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>,
  Context: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
  Problem: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Escalation: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Peak: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.5L6 11l4.4 7 1.6-2.5"></path><path d="M15 13a4 4 0 1 0 0-8h-1"></path></svg>,
  Resolution: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>,
  CTA: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  Ghost: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 10h.01"></path><path d="M15 10h.01"></path><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"></path></svg>,
  Map: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
  Bulb: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line><path d="M12 2a6 6 0 0 0-6 9v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2a6 6 0 0 0-6-9z"></path></svg>,
  Heart: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Briefcase: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
  Sparkles: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"></path></svg>,
  Fire: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.3.7 1.7 1.9 2.8 2.9 3.3z"></path></svg>,
  Lightning: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Scroll: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 0V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2"></path></svg>,
  Sprout: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>,
  Eye: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Column: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V2h4v20"/><path d="M14 22V2h4v20"/><path d="M2 22h20"/><path d="M2 2h20"/></svg>,
  Speaker: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>,
  Stop: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>,
  Rocket: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>,
  Castle: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"></path><path d="M18 11V4H6v7"></path><path d="M15 22v-4a3 3 0 0 0-6 0v4"></path><path d="M22 11h-4a2 2 0 0 0-2-2V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v3a2 2 0 0 0-2 2H2"></path></svg>,
  Image: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  Tag: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
};

// Localized Strings Map
const translations = {
  en: {
    heroTitle: "Craft Viral Stories",
    heroSubtitle: "Generate psychologically structured narratives optimized for engagement. Select a theme, add context, and let AI build your story arc.",
    selectTheme: "Select Theme",
    scrollMore: "Scroll for more →",
    targetDuration: "Target Duration",
    specificIdeas: "Specific Ideas (Optional)",
    sparkIdeas: "Spark Ideas",
    placeholder: "e.g., A story about a lost watch in Paris... or leave empty for a random story.",
    generatingHooks: "Generating...",
    structuring: "Structuring Narrative...",
    generateStory: "Generate Story",
    generatedHooksTitle: "Generated Hooks",
    useThis: "Use This",
    failedHooks: "Failed to generate hooks.",
    failedStory: "Failed to generate story. Please try again.",
    failedRewrite: "Failed to rewrite story. Please try again.",
    intensifyDrama: "Intensify Drama",
    copyAll: "Copy All",
    copySuccess: "Story copied to clipboard!",
    readAloud: "Read Aloud",
    stopReading: "Stop Reading",
    modules: {
      hook: "The Hook",
      context: "Context & Setup",
      problem: "The Problem",
      escalation: "Escalation",
      peak: "Peak / Twist",
      resolution: "Resolution",
      cta: "Call to Action"
    },
    themes: {
      [ThemeType.HISTORY]: "Deep dives into history, geopolitics, and past events.",
      [ThemeType.SELF_IMPROVEMENT]: "Growth, psychology, productivity, and mindset.",
      [ThemeType.TRUE_CRIME]: "Investigations, mysteries, and criminal cases.",
      [ThemeType.MYTHOLOGY]: "Legends, folklore, gods, and ancient myths.",
      [ThemeType.HORROR]: "Spooky, suspenseful, and chilling narratives.",
      [ThemeType.ADVENTURE]: "Epic journeys, travel logs, and discoveries.",
      [ThemeType.ENTREPRENEUR]: "Business lessons, startup struggles, and success.",
      [ThemeType.CURIOSITY]: "Did you know? Unique facts and obscure history.",
      [ThemeType.ROMANCE]: "Emotional connections, drama, and relationships.",
      [ThemeType.COMEDY]: "Lighthearted, funny, everyday situations.",
      [ThemeType.SCI_FI]: "Futuristic worlds, advanced tech, and space exploration.",
      [ThemeType.FANTASY]: "Magic, mythical creatures, and supernatural elements."
    },
    durations: {
      [DurationType.SHORT]: "< 60s (TikTok/Reels)",
      [DurationType.MEDIUM]: "1-3 mins (YouTube)",
      [DurationType.LONG]: "8+ mins (Deep Dive)"
    },
    themeNames: {
      [ThemeType.HISTORY]: "History & Geo",
      [ThemeType.SELF_IMPROVEMENT]: "Self Growth",
      [ThemeType.TRUE_CRIME]: "True Crime",
      [ThemeType.MYTHOLOGY]: "Mythology",
      [ThemeType.HORROR]: "Horror",
      [ThemeType.ADVENTURE]: "Adventure",
      [ThemeType.ENTREPRENEUR]: "Business",
      [ThemeType.CURIOSITY]: "Curiosity",
      [ThemeType.ROMANCE]: "Romance",
      [ThemeType.COMEDY]: "Comedy",
      [ThemeType.SCI_FI]: "Sci-Fi",
      [ThemeType.FANTASY]: "Fantasy"
    },
    distributionKit: "Distribution Kit",
    generateMetadata: "Generate Metadata",
    generatingMetadata: "Generating...",
    generateThumbnail: "Generate Concepts",
    generatingThumbnail: "Ideating...",
    socialMetadata: "Social Metadata",
    thumbnail: "Thumbnail Concepts",
    promptCopied: "Prompt Copied!"
  },
  id: {
    heroTitle: "Buat Cerita Viral",
    heroSubtitle: "Hasilkan narasi terstruktur secara psikologis untuk interaksi maksimal. Pilih tema, tambah konteks, dan biarkan AI menyusun cerita Anda.",
    selectTheme: "Pilih Tema",
    scrollMore: "Geser untuk melihat →",
    targetDuration: "Durasi Target",
    specificIdeas: "Ide Spesifik (Opsional)",
    sparkIdeas: "Cari Ide",
    placeholder: "Cth: Cerita tentang jam tangan yang hilang di Bali... atau biarkan kosong untuk cerita acak.",
    generatingHooks: "Membuat...",
    structuring: "Menyusun Narasi...",
    generateStory: "Buat Cerita",
    generatedHooksTitle: "Ide Pancingan (Hooks)",
    useThis: "Gunakan",
    failedHooks: "Gagal membuat ide hooks.",
    failedStory: "Gagal membuat cerita. Silakan coba lagi.",
    failedRewrite: "Gagal menulis ulang cerita. Silakan coba lagi.",
    intensifyDrama: "Tingkatkan Drama",
    copyAll: "Salin Semua",
    copySuccess: "Cerita berhasil disalin!",
    readAloud: "Baca Cerita",
    stopReading: "Berhenti Membaca",
    modules: {
      hook: "Pancingan (Hook)",
      context: "Konteks & Pengaturan",
      problem: "Masalah Utama",
      escalation: "Eskalasi Konflik",
      peak: "Puncak / Plot Twist",
      resolution: "Resolusi",
      cta: "Ajakan Bertindak (CTA)"
    },
    themes: {
      [ThemeType.HISTORY]: "Pembahasan sejarah, geopolitik, dan peristiwa masa lalu.",
      [ThemeType.SELF_IMPROVEMENT]: "Pengembangan diri, psikologi, dan pola pikir.",
      [ThemeType.TRUE_CRIME]: "Investigasi, misteri, dan kasus kriminal nyata.",
      [ThemeType.MYTHOLOGY]: "Legenda, cerita rakyat, dan mitos kuno.",
      [ThemeType.HORROR]: "Narasi seram, menegangkan, dan mengerikan.",
      [ThemeType.ADVENTURE]: "Perjalanan epik, catatan perjalanan, dan penemuan.",
      [ThemeType.ENTREPRENEUR]: "Pelajaran bisnis, perjuangan startup, dan sukses.",
      [ThemeType.CURIOSITY]: "Tahukah Anda? Fakta unik dan sejarah langka.",
      [ThemeType.ROMANCE]: "Koneksi emosional, drama, dan hubungan.",
      [ThemeType.COMEDY]: "Ringan, lucu, situasi sehari-hari.",
      [ThemeType.SCI_FI]: "Dunia futuristik, teknologi canggih, dan luar angkasa.",
      [ThemeType.FANTASY]: "Sihir, makhluk mitos, dan elemen supranatural."
    },
    durations: {
      [DurationType.SHORT]: "< 60s (TikTok/Reels/Shorts)",
      [DurationType.MEDIUM]: "1-3 mnt (YouTube Standar)",
      [DurationType.LONG]: "8+ mnt (Pembahasan Mendalam)"
    },
    themeNames: {
      [ThemeType.HISTORY]: "Sejarah & Geo",
      [ThemeType.SELF_IMPROVEMENT]: "Self Growth",
      [ThemeType.TRUE_CRIME]: "Kriminal",
      [ThemeType.MYTHOLOGY]: "Mitologi",
      [ThemeType.HORROR]: "Horor",
      [ThemeType.ADVENTURE]: "Petualangan",
      [ThemeType.ENTREPRENEUR]: "Bisnis",
      [ThemeType.CURIOSITY]: "Fakta Unik",
      [ThemeType.ROMANCE]: "Romansa",
      [ThemeType.COMEDY]: "Komedi",
      [ThemeType.SCI_FI]: "Sci-Fi",
      [ThemeType.FANTASY]: "Fantasi"
    },
    distributionKit: "Kit Distribusi",
    generateMetadata: "Buat Metadata",
    generatingMetadata: "Memproses...",
    generateThumbnail: "Buat Konsep",
    generatingThumbnail: "Berpikir...",
    socialMetadata: "Metadata Sosial",
    thumbnail: "Konsep Thumbnail",
    promptCopied: "Prompt Disalin!"
  }
};

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [aiModel, setAiModel] = useState<AIModel>('flash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(ThemeType.HISTORY);
  const [selectedDuration, setSelectedDuration] = useState<DurationType>(DurationType.SHORT);
  const [additionalContext, setAdditionalContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);
  const [story, setStory] = useState<FullStory | null>(null);
  const [isReading, setIsReading] = useState(false);
  
  // New States for Metadata & Thumbnail
  const [socialMetadata, setSocialMetadata] = useState<SocialMetadata | null>(null);
  const [thumbnailIdeas, setThumbnailIdeas] = useState<ThumbnailIdeas | null>(null);
  const [isGeneratingMetadata, setIsGeneratingMetadata] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  
  // BYOK State
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(true); // Default true to prevent flash
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  
  // Refs
  const resultRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLElement>(null);
  const distributionRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  // Check API Key on mount
  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    if (!key) {
      setIsApiKeySet(false);
      setShowApiKeyModal(true);
    } else {
      setIsApiKeySet(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('gemini_api_key', apiKeyInput.trim());
      setIsApiKeySet(true);
      setShowApiKeyModal(false);
      setApiKeyInput('');
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setIsApiKeySet(false);
    setApiKeyInput('');
  };

  const handleOpenApiKeyModal = () => {
    setShowApiKeyModal(true);
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setStory(null);
    setSocialMetadata(null);
    setThumbnailIdeas(null);
    try {
      const result = await generateStory(selectedTheme, selectedDuration, language, additionalContext, aiModel);
      setStory(result);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      alert(t.failedStory);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!story) return;
    setIsRewriting(true);
    try {
      const result = await rewriteStory(story, language, aiModel);
      setStory(result);
    } catch (error) {
      alert(t.failedRewrite);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleGenerateHooks = async () => {
    setIsGeneratingHooks(true);
    try {
      const hooks = await generateHooks(additionalContext, selectedTheme, language, aiModel);
      setGeneratedHooks(hooks);
    } catch (error) {
      alert(t.failedHooks);
    } finally {
      setIsGeneratingHooks(false);
    }
  };

  const handleGenerateMetadata = async () => {
    if (!story) return;
    setIsGeneratingMetadata(true);
    try {
      const metadata = await generateSocialMetadata(story, language, aiModel);
      setSocialMetadata(metadata);
      setTimeout(() => {
        distributionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Failed to generate metadata");
    } finally {
      setIsGeneratingMetadata(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!story) return;
    setIsGeneratingThumbnail(true);
    try {
      const ideas = await generateThumbnail(story, language, aiModel);
      setThumbnailIdeas(ideas);
      setTimeout(() => {
        distributionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Failed to generate thumbnail ideas");
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };
  
  const handleCopyPrompt = () => {
    if (!thumbnailIdeas) return;
    navigator.clipboard.writeText(thumbnailIdeas.imagePrompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const updateModuleContent = (moduleName: 'hook' | 'context' | 'problem' | 'escalation' | 'peak' | 'resolution' | 'cta', newContent: string) => {
    setStory((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [moduleName]: {
          ...prev[moduleName],
          content: newContent
        }
      };
    });
  };

  const copyToClipboard = () => {
    if (!story) return;
    const text = [
      story.title.toUpperCase(),
      `Theme: ${story.theme}`,
      '',
      `--- ${t.modules.hook.toUpperCase()} ---`,
      story.hook.content,
      `[Visual: ${story.hook.visualPrompt}]`,
      '',
      `--- ${t.modules.context.toUpperCase()} ---`,
      story.context.content,
      `[Visual: ${story.context.visualPrompt}]`,
      '',
      `--- ${t.modules.problem.toUpperCase()} ---`,
      story.problem.content,
      `[Visual: ${story.problem.visualPrompt}]`,
      '',
      `--- ${t.modules.escalation.toUpperCase()} ---`,
      story.escalation.content,
      `[Visual: ${story.escalation.visualPrompt}]`,
      '',
      `--- ${t.modules.peak.toUpperCase()} ---`,
      story.peak.content,
      `[Visual: ${story.peak.visualPrompt}]`,
      '',
      `--- ${t.modules.resolution.toUpperCase()} ---`,
      story.resolution.content,
      `[Visual: ${story.resolution.visualPrompt}]`,
      '',
      `--- ${t.modules.cta.toUpperCase()} ---`,
      story.cta.content,
      `[Visual: ${story.cta.visualPrompt}]`
    ].join('\n');
    
    navigator.clipboard.writeText(text);
    alert(t.copySuccess);
  };

  const handleReadAloud = () => {
    if (!story) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const sections = [
      story.hook.content,
      story.context.content,
      story.problem.content,
      story.escalation.content,
      story.peak.content,
      story.resolution.content,
      story.cta.content
    ];

    // Cancel any current speech
    window.speechSynthesis.cancel();

    // Create utterances for each section to ensure smooth playback
    sections.forEach((text, index) => {
      if (!text) return;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'id' ? 'id-ID' : 'en-US';
      utterance.rate = 1.0;
      
      // When the last section finishes, reset the state
      if (index === sections.length - 1) {
        utterance.onend = () => setIsReading(false);
        utterance.onerror = (e) => {
          console.error("Speech error:", e);
          setIsReading(false);
        };
      }
      
      window.speechSynthesis.speak(utterance);
    });

    setIsReading(true);
  };

  const handleThemeSelect = (type: ThemeType) => {
    setSelectedTheme(type);
    // Smooth scroll to duration section after a short delay
    setTimeout(() => {
        durationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const getDurationLabel = (type: DurationType) => {
    if (type === DurationType.SHORT) return language === 'id' ? 'Video Pendek' : 'Short Form';
    if (type === DurationType.MEDIUM) return language === 'id' ? 'Video Standar' : 'Standard';
    if (type === DurationType.LONG) return language === 'id' ? 'Video Panjang' : 'Long Form';
    return '';
  };

  const themeList = [
    { type: ThemeType.HISTORY, icon: Icons.Scroll },
    { type: ThemeType.SELF_IMPROVEMENT, icon: Icons.Sprout },
    { type: ThemeType.TRUE_CRIME, icon: Icons.Eye },
    { type: ThemeType.MYTHOLOGY, icon: Icons.Column },
    { type: ThemeType.ENTREPRENEUR, icon: Icons.Briefcase },
    { type: ThemeType.HORROR, icon: Icons.Ghost },
    { type: ThemeType.ADVENTURE, icon: Icons.Map },
    { type: ThemeType.CURIOSITY, icon: Icons.Bulb },
    { type: ThemeType.ROMANCE, icon: Icons.Heart },
    { type: ThemeType.COMEDY, icon: Icons.Sparkles },
    { type: ThemeType.SCI_FI, icon: Icons.Rocket },
    { type: ThemeType.FANTASY, icon: Icons.Castle },
  ];

  // Sort theme list alphabetically based on the displayed name (localized)
  const sortedThemeList = [...themeList].sort((a, b) => {
    const nameA = t.themeNames[a.type];
    const nameB = t.themeNames[b.type];
    return nameA.localeCompare(nameB);
  });
  
  // Find current theme details for display
  const currentThemeItem = themeList.find(t => t.type === selectedTheme);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans pb-20 selection:bg-zinc-700 selection:text-white">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center min-h-[4rem]">
          <h1 className="text-lg font-medium tracking-tight text-white">
            Generative Content
          </h1>
          <div className="flex items-center gap-3">
            {/* API Key Button */}
            <button
              onClick={handleOpenApiKeyModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                isApiKeySet 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' 
                  : 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400 hover:bg-indigo-600/30'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
              {isApiKeySet ? 'API Key' : 'Set API Key'}
            </button>
            
            <div className="flex flex-col gap-1.5 items-end">
              {/* Language Toggle */}
              <div className="flex bg-zinc-900 rounded-md p-1 border border-zinc-800">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${language === 'en' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${language === 'id' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  ID
                </button>
              </div>
              
              {/* AI Model Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center justify-center w-full bg-zinc-900 rounded-md p-1 border border-zinc-800 text-zinc-400 hover:text-white transition-all group"
                  title="Select AI Model"
                >
                  <div className="flex items-center gap-2 px-2 py-1">
                    {aiModel === 'flash' ? (
                      <span className="text-amber-400 flex items-center gap-1.5 text-xs font-medium">
                        {Icons.Lightning} Flash
                      </span>
                    ) : (
                      <span className="text-indigo-400 flex items-center gap-1.5 text-xs font-medium">
                        {Icons.Sparkles} Pro
                      </span>
                    )}
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </button>
                
                {showModelDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowModelDropdown(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-zinc-900 border border-zinc-800 rounded-md shadow-xl overflow-hidden z-50">
                      <button
                        onClick={() => { setAiModel('flash'); setShowModelDropdown(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${aiModel === 'flash' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
                      >
                        <span className="text-amber-400">{Icons.Lightning}</span>
                        <div>
                          <div className="font-medium">Gemini Flash</div>
                          <div className="text-xs opacity-70">Fast & efficient</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setAiModel('pro'); setShowModelDropdown(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${aiModel === 'pro' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
                      >
                        <span className="text-indigo-400">{Icons.Sparkles}</span>
                        <div>
                          <div className="font-medium">Gemini Pro</div>
                          <div className="text-xs opacity-70">Advanced reasoning</div>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-32">
        
        {/* Intro Section */}
        <section className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-white tracking-tight">
            {t.heroTitle}
          </h2>
          <p className="text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
        </section>

        {/* Theme Selection - Dropdown */}
        <section className="mb-8">
          <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3 ml-1">
            {t.selectTheme}
          </label>
          
          <div className="relative mb-6">
            <select
              value={selectedTheme}
              onChange={(e) => handleThemeSelect(e.target.value as ThemeType)}
              className="w-full bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-lg px-4 py-3.5 appearance-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all outline-none text-base font-medium cursor-pointer shadow-sm hover:border-zinc-700"
            >
              {sortedThemeList.map((item) => (
                <option key={item.type} value={item.type} className="bg-zinc-900 text-zinc-200">
                  {t.themeNames[item.type]}
                </option>
              ))}
            </select>
            {/* Custom Icon for Dropdown */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          {/* Selected Theme Details Preview */}
          {currentThemeItem && (
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4 flex items-center gap-4 animate-fadeIn">
              <div className="p-2.5 bg-zinc-800 text-zinc-300 rounded-md">
                {currentThemeItem.icon}
              </div>
              <div>
                <h4 className="font-medium text-zinc-200 text-sm">{t.themeNames[selectedTheme]}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">{t.themes[selectedTheme]}</p>
              </div>
            </div>
          )}
        </section>

        {/* Duration Selection */}
        <section ref={durationRef} className="mb-10 scroll-mt-24">
            <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3 ml-1">
              {t.targetDuration}
            </label>
            
            <div className="flex overflow-x-auto gap-3 pb-2 -mx-6 px-6 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
              {[
                { type: DurationType.SHORT, label: "Short", icon: "S" },
                { type: DurationType.MEDIUM, label: "Standard", icon: "M" },
                { type: DurationType.LONG, label: "Long", icon: "L" },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedDuration(item.type)}
                  className={`
                    flex-1 min-w-[140px] flex flex-col items-center justify-center gap-1 p-3.5 rounded-lg border transition-all snap-center h-full
                    ${selectedDuration === item.type
                      ? 'bg-zinc-100 border-zinc-100 text-zinc-900 shadow-lg shadow-zinc-900/20'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 hover:border-zinc-700'
                    }
                  `}
                >
                  <span className={`text-sm font-bold`}>
                    {getDurationLabel(item.type)}
                  </span>
                  <span className="text-[10px] opacity-70 font-medium text-center">
                    {t.durations[item.type]}
                  </span>
                </button>
              ))}
            </div>
        </section>

        {/* Input Section */}
        <section className="mb-12">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3 ml-1">
              <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500">
                {t.specificIdeas}
              </label>
              <button 
                onClick={handleGenerateHooks}
                disabled={isGeneratingHooks}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md
                  ${isGeneratingHooks 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0'
                  }
                `}
              >
                {isGeneratingHooks ? (
                  <>
                    <div className="h-3 w-3 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin"></div>
                    {t.generatingHooks}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"></path></svg>
                    {t.sparkIdeas}
                  </>
                )}
              </button>
            </div>
            <textarea
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-zinc-200 focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600 transition-all outline-none resize-none h-32 text-sm leading-relaxed placeholder-zinc-600 hover:border-zinc-700"
              placeholder={t.placeholder}
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
            />
            
            {/* Generated Hooks Display */}
            {generatedHooks.length > 0 && (
              <div className="mt-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800 animate-fadeIn">
                <h4 className="text-xs font-medium uppercase text-zinc-500 mb-3 tracking-wider">{t.generatedHooksTitle}</h4>
                <div className="space-y-2">
                  {generatedHooks.map((hook, index) => (
                    <div 
                      key={index}
                      onClick={() => setAdditionalContext(hook)}
                      className="p-3 rounded-md border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800 cursor-pointer transition-all text-sm text-zinc-400 hover:text-zinc-200 flex items-start gap-3 group"
                    >
                      <span className="text-zinc-600 font-mono text-xs mt-0.5">{index + 1}</span>
                      <span className="flex-1">{hook}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full py-4 rounded-lg font-medium text-sm tracking-wide shadow-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.99]
              ${isLoading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                : 'bg-white text-black hover:bg-zinc-200'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin"></div>
                {t.structuring}
              </>
            ) : (
              t.generateStory
            )}
          </button>
        </section>

        {/* Results Section */}
        {story && (
          <div ref={resultRef} className="animate-fade-in-up pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-zinc-800">
               <div className="flex-1">
                  <span className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide">{story.theme}</span>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white leading-tight">{story.title}</h2>
               </div>
               
               <div className="flex flex-wrap gap-2 mt-6 md:mt-0 justify-end w-full md:w-auto">
                  <button
                    onClick={handleReadAloud}
                    className={`flex items-center justify-center gap-2 text-xs font-medium transition-all px-4 py-2.5 rounded-md border w-full md:w-auto
                      ${isReading 
                        ? 'border-zinc-500 bg-zinc-800 text-white' 
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                      }`}
                  >
                    {isReading ? Icons.Stop : Icons.Speaker}
                    {isReading ? t.stopReading : t.readAloud}
                  </button>

                  <button
                    onClick={handleRewrite}
                    disabled={isRewriting}
                    className={`flex items-center justify-center gap-2 text-xs font-medium transition-all px-4 py-2.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 w-full md:w-auto ${isRewriting ? 'opacity-50' : ''}`}
                  >
                    {isRewriting ? (
                      <div className="h-3 w-3 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        {t.intensifyDrama}
                      </>
                    )}
                  </button>

                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-900 bg-zinc-100 hover:bg-white transition-all px-4 py-2.5 rounded-md w-full md:w-auto"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    {t.copyAll}
                  </button>
               </div>
            </div>

            <div className="space-y-6 mb-16">
              <ModuleCard 
                number={1}
                title={t.modules.hook}
                icon={Icons.Hook}
                content={story.hook.content}
                visualPrompt={story.hook.visualPrompt}
                metadata={story.hook.metadata as any}
                colorClass="border-zinc-800"
                onSave={(val) => updateModuleContent('hook', val)}
              />
              <ModuleCard 
                number={2}
                title={t.modules.context}
                icon={Icons.Context}
                content={story.context.content}
                visualPrompt={story.context.visualPrompt}
                metadata={story.context.metadata as any}
                colorClass="border-zinc-800"
                onSave={(val) => updateModuleContent('context', val)}
              />
              <ModuleCard 
                number={3}
                title={t.modules.problem} 
                icon={Icons.Problem}
                content={story.problem.content}
                visualPrompt={story.problem.visualPrompt}
                metadata={story.problem.metadata as any}
                colorClass="border-zinc-800"
                onSave={(val) => updateModuleContent('problem', val)}
              />
              <ModuleCard 
                number={4}
                title={t.modules.escalation}
                icon={Icons.Escalation}
                content={story.escalation.content}
                visualPrompt={story.escalation.visualPrompt}
                metadata={story.escalation.metadata as any}
                colorClass="border-zinc-800"
                onSave={(val) => updateModuleContent('escalation', val)}
              />
              <ModuleCard 
                number={5}
                title={t.modules.peak} 
                icon={Icons.Peak}
                content={story.peak.content}
                visualPrompt={story.peak.visualPrompt}
                metadata={story.peak.metadata as any}
                colorClass="border-zinc-800"
                onSave={(val) => updateModuleContent('peak', val)}
              />
              <ModuleCard 
                number={6}
                title={t.modules.resolution} 
                icon={Icons.Resolution}
                content={story.resolution.content}
                visualPrompt={story.resolution.visualPrompt}
                metadata={story.resolution.metadata as any}
                colorClass="border-zinc-800"
                onSave={(val) => updateModuleContent('resolution', val)}
              />
              <ModuleCard 
                number={7}
                title={t.modules.cta} 
                icon={Icons.CTA}
                content={story.cta.content}
                visualPrompt={story.cta.visualPrompt}
                metadata={story.cta.metadata as any}
                colorClass="border-zinc-800"
                onSave={(val) => updateModuleContent('cta', val)}
              />
            </div>

            {/* Distribution Kit Section */}
            <div ref={distributionRef} className="pt-8 border-t border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-zinc-500">{Icons.Briefcase}</span>
                <h2 className="text-lg font-semibold uppercase tracking-wide text-zinc-200">{t.distributionKit}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Social Metadata Column */}
                <div className="bg-zinc-900/50 rounded-lg p-5 border border-zinc-800 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                       {Icons.Tag} {t.socialMetadata}
                     </h3>
                     <button
                        onClick={handleGenerateMetadata}
                        disabled={isGeneratingMetadata}
                        className={`text-xs px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white transition-colors disabled:opacity-50`}
                     >
                       {isGeneratingMetadata ? t.generatingMetadata : t.generateMetadata}
                     </button>
                  </div>
                  
                  {socialMetadata ? (
                    <div className="space-y-5 animate-fadeIn text-sm">
                      <div>
                        <span className="text-xs uppercase text-zinc-500 font-bold block mb-2">Possible Titles</span>
                        <ul className="list-disc pl-4 space-y-1 text-zinc-300">
                          {socialMetadata.titles.map((title, i) => (
                            <li key={i}>{title}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-zinc-500 font-bold block mb-2">Description</span>
                        <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{socialMetadata.description}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase text-zinc-500 font-bold block mb-2">Hashtags</span>
                        <div className="flex flex-wrap gap-2">
                          {socialMetadata.hashtags.map((tag, i) => (
                            <span key={i} className="text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded text-xs">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                     <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm py-12 border border-dashed border-zinc-800 rounded">
                        Generate metadata to see options.
                     </div>
                  )}
                </div>

                {/* Thumbnail Column */}
                <div className="bg-zinc-900/50 rounded-lg p-5 border border-zinc-800 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                       {Icons.Image} {t.thumbnail}
                     </h3>
                     <button
                        onClick={handleGenerateThumbnail}
                        disabled={isGeneratingThumbnail}
                        className={`text-xs px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white transition-colors disabled:opacity-50`}
                     >
                       {isGeneratingThumbnail ? t.generatingThumbnail : t.generateThumbnail}
                     </button>
                  </div>

                  {thumbnailIdeas ? (
                    <div className="animate-fadeIn mt-2 text-sm space-y-5">
                       <div>
                          <div className="flex justify-between items-end mb-2">
                             <span className="text-xs uppercase text-zinc-500 font-bold">Image Prompt</span>
                             <button 
                                onClick={handleCopyPrompt}
                                className={`text-[10px] px-2 py-1 rounded transition-colors ${promptCopied ? 'bg-green-900/50 text-green-200' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
                             >
                                {promptCopied ? t.promptCopied : "Copy Prompt"}
                             </button>
                          </div>
                          <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-zinc-400 text-xs leading-relaxed italic">
                             {thumbnailIdeas.imagePrompt}
                          </div>
                       </div>
                       
                       <div>
                          <span className="text-xs uppercase text-zinc-500 font-bold block mb-2">Text Overlay Ideas</span>
                          <div className="flex flex-col gap-2">
                             {thumbnailIdeas.textOverlays.map((text, i) => (
                                <div key={i} className="px-3 py-2 bg-zinc-800/50 rounded border border-zinc-700/50 text-zinc-200 font-bold text-center tracking-tight shadow-sm">
                                   "{text}"
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  ) : (
                     <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm py-12 border border-dashed border-zinc-800 rounded">
                        {isGeneratingThumbnail ? (
                           <div className="flex flex-col items-center gap-3">
                             <div className="h-5 w-5 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin"></div>
                             <span>{t.generatingThumbnail}</span>
                           </div>
                        ) : "Generate to get prompt & text ideas."}
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Key Popup Overlay */}
        {showApiKeyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative">
              
              {isApiKeySet && (
                <button 
                  onClick={() => setShowApiKeyModal(false)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              )}

              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {isApiKeySet ? 'Manage API Key' : 'API Key Required'}
              </h2>
              <p className="text-zinc-400 mb-6 leading-relaxed text-sm">
                To use Narrative Nexus, enter your Google Gemini API key. 
                <br/>
                <span className="text-xs opacity-70 mt-2 block">Your key is stored locally in your browser and is never sent to our servers.</span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline mt-2 inline-block">Get your free API key here</a>.
              </p>
              
              <div className="text-left mb-6">
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSaveApiKey}
                  disabled={!apiKeyInput.trim()}
                  className="w-full bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Save API Key
                </button>
                
                {isApiKeySet && (
                  <button
                    onClick={handleRemoveApiKey}
                    className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Remove Current Key
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;