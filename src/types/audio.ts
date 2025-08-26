export interface Sound {
  id: number;
  name: string;
  url: string;
  duration: number;
  type: 'ambient' | 'effect' | 'meditation' | 'notification';
}

export interface FreesoundResponse {
  id: number;
  name: string;
  duration: number;
  previews: {
    'preview-hq-mp3': string;
    'preview-lq-mp3': string;
  };
}