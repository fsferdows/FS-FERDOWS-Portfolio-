// Fix: Provided full implementation for the ProjectForm component.
import React, { useState } from 'react';
import { Project } from '../types';
import { v4 as uuidv4 } from 'uuid';
import Loader from './Loader';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface ProjectFormProps {
    project?: Project | null;
    onClose: () => void;
    onSubmit: (project: Project) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Omit<Project, 'id'>>({
        title: project?.title || '',
        description: project?.description || '',
        imageUrl: project?.imageUrl || '',
        tags: project?.tags || [],
        liveUrl: project?.liveUrl || '',
        sourceUrl: project?.sourceUrl || '',
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
        // Simulate API call
        await new Promise(res => setTimeout(res, 1000));
        onSubmit({ ...formData, id: project?.id || uuidv4() });
        setIsLoading(false);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">{project ? 'Edit Project' : 'Add New Project'}</h2>
            
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
            </div>

            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-text-secondary mb-1">Image URL</label>
                <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>

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
                <input type="text" name="tags" id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" placeholder="e.g., React, AI, Next.js" />
            </div>

            <div>
                <label htmlFor="liveUrl" className="block text-sm font-medium text-text-secondary mb-1">Live URL</label>
                <input type="url" name="liveUrl" id="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            
            <div>
                <label htmlFor="sourceUrl" className="block text-sm font-medium text-text-secondary mb-1">Source URL</label>
                <input type="url" name="sourceUrl" id="sourceUrl" value={formData.sourceUrl} onChange={handleChange} className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={(e) => { playClick(e); onClose(); }} className="px-4 py-2 rounded-md text-text-secondary hover:bg-background-tertiary">Cancel</button>
                <button type="submit" onClick={(e) => playClick(e)} disabled={isLoading} className="px-4 py-2 rounded-md bg-accent text-white font-semibold hover:bg-opacity-80 disabled:bg-opacity-50 flex items-center gap-2">
                    {isLoading ? <Loader size="sm" /> : null}
                    {project ? 'Save Changes' : 'Add Project'}
                </button>
            </div>
        </form>
    );
};

export default ProjectForm;