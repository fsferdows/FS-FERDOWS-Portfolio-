// Fix: Provided full implementation for the PublicationForm component.
import React, { useState } from 'react';
import { Publication } from '../types';
import { v4 as uuidv4 } from 'uuid';
import Loader from './Loader';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface PublicationFormProps {
    publication?: Publication | null;
    onClose: () => void;
    onSubmit: (publication: Publication) => void;
}

const PublicationForm: React.FC<PublicationFormProps> = ({ publication, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: publication?.title || '',
        authors: publication?.authors.join(', ') || '',
        journal: publication?.journal || '',
        year: publication?.year || new Date().getFullYear(),
        pdfUrl: publication?.pdfUrl || '',
        summary: publication?.summary || '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { playClick } = useSoundEffects();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(res => setTimeout(res, 1000));
        const newPublication: Publication = {
            id: publication?.id || uuidv4(),
            title: formData.title,
            authors: formData.authors.split(',').map(a => a.trim()),
            journal: formData.journal,
            year: Number(formData.year),
            pdfUrl: formData.pdfUrl,
            summary: formData.summary,
        };
        onSubmit(newPublication);
        setIsLoading(false);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary">{publication ? 'Edit Publication' : 'Add New Publication'}</h2>
            
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            <input type="text" name="authors" value={formData.authors} onChange={handleChange} placeholder="Authors (comma-separated)" required className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            <input type="text" name="journal" value={formData.journal} onChange={handleChange} placeholder="Journal / Conference" required className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="Year" required className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            <input type="url" name="pdfUrl" value={formData.pdfUrl} onChange={handleChange} placeholder="PDF URL" required className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
            <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Summary" required rows={4} className="w-full bg-background-secondary border border-background-tertiary rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"></textarea>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={(e) => { playClick(e); onClose(); }} className="px-4 py-2 rounded-md text-text-secondary hover:bg-background-tertiary">Cancel</button>
                <button type="submit" onClick={(e) => playClick(e)} disabled={isLoading} className="px-4 py-2 rounded-md bg-accent text-white font-semibold hover:bg-opacity-80 disabled:bg-opacity-50 flex items-center gap-2">
                    {isLoading ? <Loader size="sm" /> : null}
                    {publication ? 'Save Changes' : 'Add Publication'}
                </button>
            </div>
        </form>
    );
};

export default PublicationForm;