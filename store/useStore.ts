// Fix: Provided full implementation for the Zustand state management store.
// FIX: Changed default import to named import for 'create' to align with zustand v4+, which fixes the "not callable" error.
import { create } from 'zustand';
import { Project, Publication, Insight } from '../types';
import { mockProjects, mockPublications, mockInsights } from '../data/mockData';

interface AppState {
  projects: Project[];
  publications: Publication[];
  insights: Insight[];
  addProject: (project: Project) => void;
  addPublication: (publication: Publication) => void;
  addInsight: (insight: Insight) => void;
  modelViewerUrl: string | null;
  openModelViewer: (url: string) => void;
  closeModelViewer: () => void;
}

export const useStore = create<AppState>((set) => ({
  projects: mockProjects,
  publications: mockPublications,
  insights: mockInsights,
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),
  addPublication: (publication) =>
    set((state) => ({
      publications: [publication, ...state.publications],
    })),
  addInsight: (insight) =>
    set((state) => ({
      insights: [insight, ...state.insights],
    })),
  modelViewerUrl: null,
  openModelViewer: (url) => set({ modelViewerUrl: url }),
  closeModelViewer: () => set({ modelViewerUrl: null }),
}));