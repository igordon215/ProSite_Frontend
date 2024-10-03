export interface BlogPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export interface Project {
  id: number;
  title?: string;
  name: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
  createdAt: string;
  updatedAt: string;
  technologies?: string[];
}