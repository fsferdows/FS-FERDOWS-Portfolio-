// Fix: Provided full implementation for the InsightCard component.
import React, { useState } from 'react';
import { Insight } from '../types';
import { GoogleGenAI } from '@google/genai';
import { BrainCircuitIcon } from './icons';
import Loader from './Loader';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface InsightCardProps {
  insight: Insight;
  staggerIndex?: number;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, staggerIndex = 0 }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playClick, playHover } = useSoundEffects();

  const handleSummarize = async (e: React.MouseEvent<HTMLButtonElement>) => {
    playClick(e);
    setIsSummarizing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Summarize the following text in a single, concise sentence: "${insight.title}. ${insight.content}"`,
      });
      setSummary(response.text);
    } catch (e) {
      console.error(e);
      setError('Failed to summarize.');
    } finally {
      setIsSummarizing(false);
    }
  };


  return (
    <div 
      onMouseEnter={(e) => playHover(e)}
      className="bg-glass-bg backdrop-blur-lg border border-glass-border rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl flex flex-col staggered-child"
      style={{ '--stagger-index': staggerIndex } as React.CSSProperties}
    >
      <div className="p-6 flex-grow">
        <p className="text-sm text-text-secondary mb-2">{new Date(insight.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h3 className="text-lg font-bold text-text-primary mb-3">{insight.title}</h3>
        <p className="text-text-secondary text-base flex-grow">{insight.content}</p>
      </div>
      
      {summary && (
        <div className="px-6 pb-4">
            <p className="text-sm text-accent italic p-3 bg-accent/10 rounded-lg border border-accent/20">
                <strong>AI Summary:</strong> {summary}
            </p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs px-6 pb-4">{error}</p>}
      
      <div className="p-6 pt-0 mt-auto">
         <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-accent/10 text-accent font-semibold rounded-lg hover:bg-accent hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
         >
            {isSummarizing ? <Loader size="sm" /> : <BrainCircuitIcon size={16} />}
            <span>{isSummarizing ? 'Summarizing...' : 'Summarize with AI'}</span>
         </button>
        <div className="flex flex-wrap gap-2 mt-4">
            {insight.tags.map(tag => (
                <span key={tag} className="bg-accent/10 text-accent text-xs font-semibold px-2.5 py-1 rounded-full">
                {tag}
                </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InsightCard;