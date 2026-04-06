import { useEffect, useState } from 'react';
import { getItems } from '../api/itemsApi';
import type { Category, Item } from '../types/item';
import Loader from '../components/common/loader';
import ErrorMessage from '../components/common/errorMessage';
import AdCard from '../components/ads/adCard';
import AdRow from '../components/ads/adRow';
import AdsToolbar from '../components/ads/adsToolbar';
import AdsFilters from '../components/ads/adsFilters';
import AdsPagination from '../components/ads/adsPagination';
import '../App.css';

const PAGE_SIZE = 10;

function AdsListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] = useState('createdAt-desc');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [onlyNeedsRevision, setOnlyNeedsRevision] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function loadItems() {
      try {
        setLoading(true);
        setError('');

        const [sortColumn, sortDirection] = sortValue.split('-') as [
          'title' | 'createdAt',
          'asc' | 'desc'
        ];

        const data = await getItems({
          q: searchValue.trim() || undefined,
          limit: PAGE_SIZE,
          skip: (currentPage - 1) * PAGE_SIZE,
          needsRevision: onlyNeedsRevision,
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          sortColumn,
          sortDirection,
        });

        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [searchValue, sortValue, selectedCategories, onlyNeedsRevision, currentPage]);

  function handleCategoryChange(category: Category) {
    setCurrentPage(1);

    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }

      return [...prev, category];
    });
  }

  function handleSearchChange(value: string) {
    setCurrentPage(1);
    setSearchValue(value);
  }

  function handleSortChange(value: string) {
    setCurrentPage(1);
    setSortValue(value);
  }

  function handleNeedsRevisionChange(value: boolean) {
    setCurrentPage(1);
    setOnlyNeedsRevision(value);
  }

  function handleResetFilters() {
    setCurrentPage(1);
    setSearchValue('');
    setSortValue('createdAt-desc');
    setSelectedCategories([]);
    setOnlyNeedsRevision(false);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="ads-page">
      <header className="ads-page__header">
        <h1 className="ads-page__title">Мои объявления</h1>
        <div className="ads-page__count">{total} объявлений</div>
      </header>

      <AdsToolbar
        searchValue={searchValue}
        sortValue={sortValue}
        viewMode={viewMode}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onViewModeChange={setViewMode}
      />

      <div className="ads-page__body">
        <AdsFilters
          selectedCategories={selectedCategories}
          onlyNeedsRevision={onlyNeedsRevision}
          onCategoryChange={handleCategoryChange}
          onNeedsRevisionChange={handleNeedsRevisionChange}
          onReset={handleResetFilters}
        />

        <div className="ads-page__content">
          {loading && <Loader />}

          {!loading && error && <ErrorMessage message={error} />}

          {!loading && !error && items.length === 0 && (
            <div className="ads-empty">Ничего не найдено</div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="ads-grid">
                  {items.map((item) => (
                    <AdCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="ads-list-view">
                  {items.map((item) => (
                    <AdRow key={item.id} item={item} />
                  ))}
                </div>
              )}

              <AdsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdsListPage;