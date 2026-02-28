import React, { useState, useEffect } from 'react';

interface ModuleCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  visualPrompt: string;
  metadata: Record<string, string>;
  colorClass: string;
  number: number;
  onSave: (newContent: string) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ title, icon, content, visualPrompt, metadata, colorClass, number, onSave }) => {
  const [showMetadata, setShowMetadata] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const [isCopied, setIsCopied] = useState(false);

  // Sync state with props when content changes
  useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const handleSave = () => {
    onSave(editableContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableContent(content);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatKey = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="group relative">
      <div className="flex gap-4">
        {/* Number Indicator - Minimalist Line */}
        <div className="flex flex-col items-center">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-400 border border-zinc-700">
            {number}
          </div>
          <div className="w-px h-full bg-zinc-800 my-2 group-last:hidden"></div>
        </div>

        <div className="flex-1 pb-8">
          <div className="bg-zinc-900/50 rounded-lg p-5 border border-zinc-800 hover:border-zinc-700 transition-colors">
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-zinc-500">{icon}</span>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-300">{title}</h3>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={handleCopy}
                  className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1"
                  title="Copy"
                >
                  {isCopied ? "Copied" : "Copy"}
                </button>
                
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1"
                  >
                    Edit
                  </button>
                )}
                <button 
                  onClick={() => setShowMetadata(!showMetadata)}
                  className="text-xs text-zinc-500 hover:text-white transition-colors px-2 py-1"
                >
                  {showMetadata ? 'Hide Info' : 'Info'}
                </button>
              </div>
            </div>

            {/* Content Area */}
            {isEditing ? (
              <div className="mb-4 animate-fadeIn">
                <textarea
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="w-full bg-zinc-950 text-zinc-200 border border-zinc-700 rounded-md p-3 min-h-[140px] focus:ring-1 focus:ring-zinc-500 focus:border-zinc-500 outline-none font-serif text-base leading-relaxed resize-y"
                  placeholder="Edit content..."
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button 
                    onClick={handleCancel}
                    className="px-3 py-1.5 rounded text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-white text-black hover:bg-zinc-200 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="font-serif text-base leading-relaxed text-zinc-300 whitespace-pre-wrap mb-6">
                  {content}
                </div>
                
                {/* Visual Storyboard Prompt */}
                <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-md p-3 mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                      Visual Storyboard
                    </span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(visualPrompt);
                        // Simple feedback could be added here if needed
                      }}
                      className="text-[9px] uppercase tracking-tighter text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      Copy Prompt
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 italic leading-relaxed">
                    {visualPrompt}
                  </p>
                </div>
              </>
            )}

            {/* Metadata Section */}
            {showMetadata && (
              <div className="mt-6 pt-4 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 animate-fadeIn">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key}>
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">
                      {formatKey(key)}
                    </span>
                    <span className="block text-xs font-medium text-zinc-300">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};