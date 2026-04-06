import type { Category } from '../types/item';

export function getCategoryLabel(category: Category): string {
  switch (category) {
    case 'auto':
      return 'Авто';
    case 'real_estate':
      return 'Недвижимость';
    case 'electronics':
      return 'Электроника';
    default:
      return 'Без категории';
  }
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('ru-RU')} ₽`;
}