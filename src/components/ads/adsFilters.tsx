import { useState } from 'react';
import type { Category } from '../../types/item';

type AdsFiltersProps = {
  selectedCategories?: Category[];
  onlyNeedsRevision?: boolean;
  onCategoryChange: (category: Category) => void;
  onNeedsRevisionChange: (value: boolean) => void;
  onReset: () => void;
};

function AdsFilters({
  selectedCategories = [],
  onlyNeedsRevision = false,
  onCategoryChange,
  onNeedsRevisionChange,
  onReset,
}: AdsFiltersProps) {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  return (
    <aside className="ads-filters-sidebar">
      <div className="ads-filters">
        <h3 className="ads-filters__title">Фильтры</h3>

        <div className="ads-filters__block">
          <div className="ads-filters__row">
            <div className="ads-filters__label">Категория</div>

            <button
              type="button"
              className={`ads-filters__arrow-button ${isCategoriesOpen ? 'is-open' : ''}`}
              onClick={() => setIsCategoriesOpen((prev) => !prev)}
              aria-label="Свернуть или развернуть категории"
            >
              <span className="ads-filters__arrow">⌃</span>
            </button>
          </div>

          <div className={`ads-filters__categories ${isCategoriesOpen ? 'is-open' : ''}`}>
            <label className="ads-filters__checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes('auto')}
                onChange={() => onCategoryChange('auto')}
              />
              <span>Авто</span>
            </label>

            <label className="ads-filters__checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes('electronics')}
                onChange={() => onCategoryChange('electronics')}
              />
              <span>Электроника</span>
            </label>

            <label className="ads-filters__checkbox">
              <input
                type="checkbox"
                checked={selectedCategories.includes('real_estate')}
                onChange={() => onCategoryChange('real_estate')}
              />
              <span>Недвижимость</span>
            </label>
          </div>
        </div>

        <div className="ads-filters__divider" />

        <div className="ads-filters__switch-row">
          <div className="ads-filters__switch-text">Только требующие доработок</div>

          <label className="ads-toggle">
            <input
              type="checkbox"
              checked={onlyNeedsRevision}
              onChange={(e) => onNeedsRevisionChange(e.target.checked)}
            />
            <span className="ads-toggle__slider" />
          </label>
        </div>
      </div>

      <button type="button" className="ads-filters__reset" onClick={onReset}>
        Сбросить фильтры
      </button>
    </aside>
  );
}

export default AdsFilters;