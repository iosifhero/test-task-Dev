import { defineStore } from 'pinia';
import type { LngLat } from '@yandex/ymaps3-types';

export const useClickStore = defineStore('clickStore', {
  state: () => {
    const clicks: LngLat[] = [];
    return { clicks };
  },
});
