import type { NoiseTypeInfo } from '../types/audio';

export const noiseTypes: NoiseTypeInfo[] = [
  { id: 'quiet', label: '\u5b89\u9759\u73af\u5883', description: '\u5f53\u524d\u73af\u5883\u6bd4\u8f83\u5b89\u9759' },
  { id: 'speech', label: '\u4eba\u58f0\u804a\u5929 / \u4f4e\u8bed', description: '\u9644\u8fd1\u6709\u4eba\u4ea4\u8c08\u6216\u4f4e\u58f0\u8ba8\u8bba' },
  { id: 'typing', label: '\u952e\u76d8 / \u6572\u51fb\u58f0', description: '\u952e\u76d8\u3001\u9f20\u6807\u6216\u6e05\u8106\u6572\u51fb\u58f0' },
  { id: 'fan', label: '\u7a7a\u8c03 / \u98ce\u6247\u6301\u7eed\u58f0', description: '\u7a33\u5b9a\u6301\u7eed\u7684\u8bbe\u5907\u8fd0\u8f6c\u58f0' },
  { id: 'traffic', label: '\u4ea4\u901a / \u4f4e\u9891\u8f70\u9e23', description: '\u8f66\u8f86\u3001\u5730\u94c1\u6216\u8fdc\u5904\u673a\u68b0\u4f4e\u9891\u58f0' },
  { id: 'sudden', label: '\u7a81\u53d1\u566a\u97f3', description: '\u77ed\u65f6\u95f4\u51fa\u73b0\u7684\u660e\u663e\u58f0\u54cd' },
  { id: 'unknown', label: '\u6df7\u5408\u73af\u5883\u58f0', description: '\u591a\u79cd\u58f0\u97f3\u6df7\u5408\u7684\u73af\u5883' },
];

export function getNoiseTypeLabel(id: string): string {
  return noiseTypes.find((noise) => noise.id === id)?.label || '\u672a\u77e5\u58f0\u97f3';
}
