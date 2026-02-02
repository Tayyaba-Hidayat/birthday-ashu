
export enum AppTab {
  IMAGEN = 'imagen',
  VEO = 'veo',
  LIVE = 'live',
  EDIT = 'edit'
}

export interface GeneratedAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
