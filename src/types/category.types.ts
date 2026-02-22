import type { LocalizedString } from './kit.types';

export interface Category {
  categoryId: string;
  name: LocalizedString;
  icon: string;
  order: number;
  description?: LocalizedString;
  kitCount: number;
}
