type AdsToolbarProps = {
  searchValue: string;
  sortValue: string;
  viewMode: 'grid' | 'list';
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (value: 'grid' | 'list') => void;
};

function AdsToolbar({
  searchValue,
  sortValue,
  viewMode,
  onSearchChange,
  onSortChange,
  onViewModeChange,
}: AdsToolbarProps) {
  return (
    <div className="ads-toolbar">
      <div className="ads-search-wrap">
        <input
          className="ads-search"
          type="text"
          placeholder="Найти объявление..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <span className="ads-search-icon">⌕</span>
      </div>

      <div className="ads-toolbar__right">
        <button
          type="button"
          className={`ads-layout-button ${viewMode === 'grid' ? 'is-active' : ''}`}
          aria-label="Сетка"
          onClick={() => onViewModeChange('grid')}
        >
          <svg viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.4" />
            <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>

        <button
          type="button"
          className={`ads-layout-button ${viewMode === 'list' ? 'is-active' : ''}`}
          aria-label="Список"
          onClick={() => onViewModeChange('list')}
        >
          <svg viewBox="0 0 16 16" fill="none">
            <line x1="4" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.4" />
            <line x1="4" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.4" />
            <line x1="4" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="2" cy="4" r="1" fill="currentColor" />
            <circle cx="2" cy="8" r="1" fill="currentColor" />
            <circle cx="2" cy="12" r="1" fill="currentColor" />
          </svg>
        </button>

        <select
          className="ads-sort"
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="createdAt-desc">По новизне (сначала новые)</option>
          <option value="createdAt-asc">По новизне (сначала старые)</option>
          <option value="title-asc">По названию (А → Я)</option>
          <option value="title-desc">По названию (Я → А)</option>
        </select>
      </div>
    </div>
  );
}

export default AdsToolbar;