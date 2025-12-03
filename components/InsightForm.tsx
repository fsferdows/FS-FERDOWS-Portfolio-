// Fix: Provided full implementation for the InsightForm component.
import React, { useState } from 'react';
import { Insight } from '../types';
import { v4 as uuidv4 } from 'uuid';
import Loader from './Loader';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface InsightFormProps {
    insight?: Insight | null;
    onClose: () => void;
    onSubmit: (insight: Insight) => void;
}

const InsightForm: React.FC<InsightFormProps> = ({ insight, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: insight?.title || '',
        content: insight?.content || '',
        tags: insight?.tags || [],
    });
    const [tagInput, setTagInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { playClick } = useSoundEffects();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === ',' || e.key === 'Enter') && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
            }
            setTagInput('');
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(res => setTimeout(res, 1000));
        const newInsight: Insight = {
            id: insight?.id || uuidv4(),
            title: formData.title,
            content: formData.content,
            tags: formData.tags,
            date: insight?.date || new Date().toISOString(),
        };
        onSubmit(newInsight);
        setIsLoading(false);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">{insight ? 'Edit Insight' : 'Add New Insight'}</h2>
            
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Content" required rows={5} className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"></textarea>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-text-secondary mb-1">Tags (comma-separated)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-accent/20 text-accent text-sm px-2 py-1 rounded-full">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="text-accent hover:text-white">&times;</button>
                        </span>
                    ))}
                </div>
                <input type="text" name="tags" id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" placeholder="e.g., LLMs, Ethics, Deep Learning" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={(e) => { playClick(e); onClose(); }} className="px-4 py-2 rounded-md text-text-secondary hover:bg-background-tertiary">Cancel</button>
                <button type="submit" onClick={(e) => playClick(e)} disabled={isLoading} className="px-4 py-2 rounded-md bg-accent text-white font-semibold hover:bg-opacity-80 disabled:bg-opacity-50 flex items-center gap-2">
                    {isLoading ? <Loader size="sm" /> : null}
                    {insight ? 'Save Changes' : 'Add Insight'}
                </button>
            </div>
        </form>
    );
};

export default InsightForm;