import type { NoiseType, SceneType } from '../types/audio';

/**
 * 噪音类型到推荐声场的映射规则
 * 第一版使用规则引擎
 */
const recommendationMap: Record<NoiseType, SceneType> = {
  speech: 'rain_focus',
  typing: 'rain_focus',
  fan: 'ocean_low',
  traffic: 'ocean_low',
  sudden: 'deep_focus',
  quiet: 'forest_breeze',
  unknown: 'deep_focus',
};

export function getRecommendedScene(noiseType: NoiseType): SceneType {
  return recommendationMap[noiseType];
}
