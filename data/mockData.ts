

// Fix: Provided full implementation for mock data.
import { Project, Publication, Insight } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Generative Art Engine',
    description: 'An AI-powered engine that creates unique, abstract art based on textual prompts, utilizing diffusion models.',
    tags: ['Generative AI', 'React', 'TypeScript', 'Node.js'],
    imageUrl: 'https://images.unsplash.com/photo-1644911221793-f42cf430e7a2?q=80&w=1932&auto=format&fit=crop',
    liveUrl: '#',
    sourceUrl: '#',
    modelUrl: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
  },
  {
    id: 'proj-2',
    title: 'Ethical AI Framework Analyzer',
    description: 'A tool that analyzes machine learning models for potential bias and provides fairness metrics and explanations.',
    tags: ['Ethical AI', 'Python', 'Flask', 'Data Science'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    sourceUrl: '#',
  },
  {
    id: 'proj-3',
    title: 'Real-time Sentiment Analysis Dashboard',
    description: 'A web dashboard that tracks and visualizes public sentiment on social media for specific topics in real-time.',
    tags: ['NLP', 'React', 'WebSockets', 'Firebase'],
    imageUrl: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=2070&auto=format&fit=crop',
    liveUrl: '#',
  },
];

export const mockPublications: Publication[] = [
  {
    id: 'pub-1',
    title: 'Attention Is All You Need, But For Art',
    authors: ['Fs Ferdows', 'Jane Doe', 'John Smith'],
    journal: 'Conference on Neural Information Processing Systems (NeurIPS)',
    year: 2023,
    pdfUrl: '#',
    summary: 'This paper explores the adaptation of transformer architectures for generative art, demonstrating state-of-the-art results in aesthetic quality and prompt adherence.'
  },
  {
    id: 'pub-2',
    title: 'A Framework for Quantifying Algorithmic Fairness',
    authors: ['Fs Ferdows', 'Alex Chen'],
    journal: 'Journal of Machine Learning Research (JMLR)',
    year: 2022,
    pdfUrl: '#',
    summary: 'We propose a novel, comprehensive framework for evaluating fairness in machine learning models across multiple protected attributes and introduce new metrics for intersectional bias.'
  },
];

export const mockInsights: Insight[] = [
  {
    id: 'ins-1',
    title: 'The Future of Foundation Models',
    content: 'Foundation models are reshaping the AI landscape. Their ability to adapt to numerous tasks with minimal fine-tuning is a paradigm shift...',
    date: '2023-10-26T10:00:00Z',
    tags: ['LLMs', 'Future Tech'],
  },
  {
    id: 'ins-2',
    title: 'Challenges in Building Explainable AI (XAI)',
    content: 'While powerful, many deep learning models operate as black boxes. The field of XAI aims to make their decisions understandable to humans, which is crucial for trust and accountability.',
    date: '2023-09-15T10:00:00Z',
    tags: ['XAI', 'Ethics'],
  },
  {
    id: 'ins-3',
    title: 'The Role of Synthetic Data in Training Robust Models',
    content: 'Synthetic data generation is becoming a key strategy to overcome data scarcity and privacy concerns, enabling the development of more robust and generalized AI systems.',
    date: '2023-08-01T10:00:00Z',
    tags: ['Data Science', 'MLOps'],
  },
];