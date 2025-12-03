

// Fix: Provided full implementation for application types.
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  liveUrl?: string;
  sourceUrl?: string;
  modelUrl?: string;
}

export interface Publication {
  id: string;
  title:string;
  authors: string[];
  journal: string;
  year: number;
  pdfUrl: string;
  summary: string;
}

export interface Insight {
    id: string;
    title: string;
    content: string;
    date: string;
    tags: string[];
}