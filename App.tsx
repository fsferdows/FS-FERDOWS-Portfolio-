import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Section from './components/Section';
import ProjectCard from './components/ProjectCard';
import PublicationCard from './components/PublicationCard';
import InsightCard from './components/InsightCard';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Toolbox from './components/Toolbox';
import Spotlight from './components/Spotlight';
import { useTheme } from './hooks/useTheme';
import { useStore } from './store/useStore';
import Modal from './components/Modal';
import ProjectForm from './components/ProjectForm';
import ProjectDetails from './components/ProjectDetails';
import PublicationForm from './components/PublicationForm';
import InsightForm from './components/InsightForm';
import { Project, Publication, Insight } from './types';
import ModelViewer from './components/ModelViewer';
import { XIcon, SparklesIcon } from './components/icons';
import { audioManager } from './utils/audioManager';
import { useSoundEffects } from './hooks/useSoundEffects';
import ScrollToTop from './components/ScrollToTop';
import TimeDisplay from './components/TimeDisplay';
import ProjectFilter from './components/ProjectFilter';
import CustomCursor from './components/CustomCursor';
import NoiseOverlay from './components/NoiseOverlay';
import ScrollProgress from './components/ScrollProgress';
import ParallaxBackground from './components/ParallaxBackground';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import Preloader from './components/Preloader';
import CommandPalette from './components/CommandPalette';

type ModalType = 'project' | 'publication' | 'insight' | 'project-details' | null;

const App: React.FC = () => {
    const { theme } = useTheme();
    const { projects, publications, insights, addProject, addPublication, addInsight, modelViewerUrl, closeModelViewer } = useStore();
    const [modalOpen, setModalOpen] = useState<ModalType>(null);
    const [currentItem, setCurrentItem] = useState<Project | Publication | Insight | null>(null);
    const [activeProjectTag, setActiveProjectTag] = useState('All');
    const { playClose } = useSoundEffects();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAudioOnInteraction = () => {
            audioManager.init();
            window.removeEventListener('click', initAudioOnInteraction);
            window.removeEventListener('keydown', initAudioOnInteraction);
        };
        window.addEventListener('click', initAudioOnInteraction);
        window.addEventListener('keydown', initAudioOnInteraction);

        return () => {
            window.removeEventListener('click', initAudioOnInteraction);
            window.removeEventListener('keydown', initAudioOnInteraction);
        };
    }, []);

    const handleOpenModal = (type: ModalType, item: Project | Publication | Insight | null = null) => {
        setCurrentItem(item);
        setModalOpen(type);
    };

    const handleCloseModal = () => {
        setModalOpen(null);
        setCurrentItem(null);
    };
    
    const handleCloseModelViewer = () => {
        playClose();
        closeModelViewer();
    };

    const getModalContent = () => {
        switch (modalOpen) {
            case 'project':
                return <ProjectForm project={currentItem as Project | null} onClose={handleCloseModal} onSubmit={addProject} />;
            case 'project-details':
                return <ProjectDetails project={currentItem as Project} onClose={handleCloseModal} />;
            case 'publication':
                return <PublicationForm publication={currentItem as Publication | null} onClose={handleCloseModal} onSubmit={addPublication} />;
            case 'insight':
                return <InsightForm insight={currentItem as Insight | null} onClose={handleCloseModal} onSubmit={addInsight} />;
            default:
                return null;
        }
    };

    // Derive unique tags from projects
    const allProjectTags = useMemo(() => {
        const tags = new Set<string>();
        projects.forEach(project => {
            project.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [projects]);

    // Filter projects based on active tag
    const filteredProjects = useMemo(() => {
        if (activeProjectTag === 'All') return projects;
        return projects.filter(project => project.tags.includes(activeProjectTag));
    }, [projects, activeProjectTag]);
    
    return (
        <div className={`app ${theme} relative overflow-x-hidden cursor-none`}>
            {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            
            <CustomCursor />
            <NoiseOverlay />
            <ScrollProgress />
            <ParallaxBackground />
            <CommandPalette />

            <Spotlight>
                <div className={`bg-transparent text-text-primary font-sans relative z-10 transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <Header />
                    <main>
                        <Hero />
                        <About />
                        <Experience />
                        
                        <Section id="projects" title="Projects" onAdd={() => handleOpenModal('project')}>
                            <ProjectFilter 
                                tags={allProjectTags} 
                                activeTag={activeProjectTag} 
                                onSelectTag={setActiveProjectTag} 
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[300px]">
                                {filteredProjects.map((project, i) => (
                                    <ProjectCard 
                                        key={project.id} 
                                        project={project} 
                                        staggerIndex={i} 
                                        onViewDetails={(p) => handleOpenModal('project-details', p)}
                                    />
                                ))}
                                {filteredProjects.length === 0 && (
                                    <div className="col-span-full flex flex-col items-center justify-center text-text-secondary py-12 animate-in">
                                        <SparklesIcon size={48} className="mb-4 opacity-50" />
                                        <p className="text-lg">No projects found with the tag "{activeProjectTag}".</p>
                                    </div>
                                )}
                            </div>
                        </Section>

                        <Testimonials />

                        <Section id="publications" title="Publications" onAdd={() => handleOpenModal('publication')}>
                            <div className="space-y-8">
                                {publications.map(pub => (
                                    <PublicationCard key={pub.id} publication={pub} />
                                ))}
                            </div>
                        </Section>

                        <Section id="insights" title="AI Insights" onAdd={() => handleOpenModal('insight')}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {insights.map((insight, i) => (
                                    <InsightCard key={insight.id} insight={insight} staggerIndex={i} />
                                ))}
                            </div>
                        </Section>
                        
                        <Section id="news" title="News">
                            <div className="text-center text-text-secondary">
                                <p>News and updates coming soon!</p>
                            </div>
                        </Section>

                        <Contact />
                    </main>
                    <Footer />
                    
                    <Modal isOpen={!!modalOpen} onClose={handleCloseModal}>
                        {getModalContent()}
                    </Modal>
                    
                    {modelViewerUrl && (
                        <div 
                            className="fixed inset-0 z-50 flex justify-center items-center p-4"
                            data-state={modelViewerUrl ? 'open' : 'closed'}
                        >
                            <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-md" onClick={handleCloseModelViewer} />
                            <div className="modal-content w-full h-full max-w-4xl max-h-[80vh] relative">
                                <ModelViewer modelUrl={modelViewerUrl} />
                            </div>
                             <button
                                onClick={handleCloseModelViewer}
                                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                                aria-label="Close model viewer"
                            >
                                <XIcon size={32} />
                            </button>
                        </div>
                    )}

                </div>
            </Spotlight>
            <ScrollToTop />
            <Toolbox />
            <TimeDisplay />
        </div>
    );
};

export default App;