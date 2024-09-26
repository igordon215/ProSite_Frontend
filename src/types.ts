export interface BlogPost {
  id: number;
  title: string;
  content: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  technologies?: string[];
}