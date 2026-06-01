import type { SceneInfo } from '../types/audio';
import { assetPath } from '../lib/assetPath';

export const scenes: SceneInfo[] = [
  {
    id: 'rain_focus',
    name: '\u96e8\u58f0\u4e13\u6ce8',
    description: '\u7ec6\u5bc6\u7a33\u5b9a\uff0c\u9002\u5408\u4f4e\u8bed\u3001\u952e\u76d8\u548c\u7ffb\u4e66\u58f0',
    audioPath: assetPath('/audio/rain-focus.mp3'),
  },
  {
    id: 'cafe_murmur',
    name: '\u5496\u5561\u9986\u4f4e\u8bed',
    description: '\u67d4\u548c\u4eba\u58f0\u6c1b\u56f4\uff0c\u5f31\u5316\u7a81\u5140\u4ea4\u8c08',
    audioPath: assetPath('/audio/cafe-murmur.mp3'),
  },
  {
    id: 'ocean_low',
    name: '\u6d77\u6d0b\u4f4e\u9891',
    description: '\u4f4e\u9891\u8212\u7f13\uff0c\u9002\u5408\u8f66\u6d41\u548c\u7a7a\u8c03\u8f70\u9e23',
    audioPath: assetPath('/audio/ocean-low.mp3'),
  },
  {
    id: 'forest_breeze',
    name: '\u68ee\u6797\u8f7b\u98ce',
    description: '\u6e05\u6de1\u81ea\u7136\uff0c\u9002\u5408\u5b89\u9759\u73af\u5883\u8fdb\u5165\u72b6\u6001',
    audioPath: assetPath('/audio/forest-breeze.mp3'),
  },
  {
    id: 'deep_focus',
    name: '\u6df1\u5ea6\u4e13\u6ce8',
    description: '\u8fde\u7eed\u5e73\u7a33\uff0c\u9002\u5408\u957f\u65f6\u95f4\u5b66\u4e60\u548c\u5199\u4f5c',
    audioPath: assetPath('/audio/deep-focus.mp3'),
  },
];

export function getSceneById(id: string): SceneInfo | undefined {
  return scenes.find((scene) => scene.id === id);
}
