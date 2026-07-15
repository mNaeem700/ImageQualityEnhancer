export interface EnhancementParams {
  upscale: 1 | 2 | 4 | 8;
  brightness: number; // 0 to 200, default 100
  contrast: number; // 0 to 200, default 100
  saturation: number; // 0 to 200, default 100
  sharpness: number; // 0 to 100, default 0
  denoise: number; // 0 to 100, default 0
  vibrance: number; // 0 to 100, default 0
  hdr: number; // 0 to 100, default 0
  smoothSkin: boolean;
  faceEnhance: boolean;
  colorTemp: number; // -50 to 50, default 0
}

export interface ImageMetadata {
  name: string;
  type: string;
  size: number; // bytes
  width: number;
  height: number;
  aspectRatio: string;
  dpi: number;
  colorProfile: string;
  lastModified: number;
}

export interface AiProfile {
  detectedType: string;
  issues: string[];
  recommendations: string[];
  suggestedSliders: Partial<EnhancementParams>;
  detailedReview: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}
