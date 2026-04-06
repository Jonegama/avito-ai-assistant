import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/common/loader';
import ErrorMessage from '../components/common/errorMessage';
import { getItem } from '../api/itemsApi';
import type { Category, ItemDetail } from '../types/item';
import { formatPrice, getCategoryLabel } from '../utils/itemHelpers';

function formatDate(value?: string) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getParamLabel(key: string) {
  const map: Record<string, string> = {
    type: 'Тип',
    brand: 'Бренд',
    model: 'Модель',
    color: 'Цвет',
    condition: 'Состояние',
    yearOfManufacture: 'Год выпуска',
    transmission: 'Коробка',
    mileage: 'Пробег',
    enginePower: 'Мощность, л.с.',
    address: 'Адрес',
    area: 'Площадь, м²',
    floor: 'Этаж',
    description: 'Описание',
  };

  return map[key] || key;
}

function getCategoryFields(category: Category): string[] {
  if (category === 'electronics') {
    return ['type', 'brand', 'model', 'color', 'condition'];
  }

  if (category === 'auto') {
    return ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'];
  }

  return ['type', 'address', 'area', 'floor'];
}

function getParamValue(key: string, value: unknown) {
  if (value === undefined || value === null || value === '') {
    return '—';
  }

  if (key === 'type') {
    const map: Record<string, string> = {
      laptop: 'Ноутбук',
      phone: 'Телефон',
      misc: 'Другое',
      flat: 'Квартира',
      house: 'Дом',
      room: 'Комната',
    };

    return map[String(value)] || String(value);
  }

  if (key === 'condition') {
    return value === 'new' ? 'Новый' : value === 'used' ? 'Б/у' : String(value);
  }

  if (key === 'transmission') {
    return value === 'automatic' ? 'Автомат' : value === 'manual' ? 'Механика' : String(value);
  }

  return String(value);
}

function AdViewPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const [ad, setAd] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadAd() {
      try {
        setLoading(true);
        setError('');
        const data = await getItem(id);

        if (!ignore) {
          setAd(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Произошла ошибка');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadAd();

    return () => {
      ignore = true;
    };
  }, [id]);

  const characteristics = useMemo(() => {
    if (!ad) return [];

    return getCategoryFields(ad.category).map((key) => ({
      key,
      label: getParamLabel(key),
      value: getParamValue(key, (ad.params as Record<string, unknown>)?.[key]),
    }));
  }, [ad]);

  const missingFields = useMemo(() => {
    if (!ad?.missingFields?.length) return [];

    return ad.missingFields.map((field) => getParamLabel(field));
  }, [ad]);

  if (loading) {
    return (
      <div className="page-shell">
        <Loader />
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="page-shell">
        <ErrorMessage message={error || 'Объявление не найдено'} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="ad-view-page">
        <div className="ad-view-header">
          <div className="ad-view-header__left">
            <button type="button" className="ad-view-back" onClick={() => navigate('/ads')}>
              ← К списку объявлений
            </button>

            <h1 className="ad-view-header__title">{ad.title}</h1>

            <button
              type="button"
              className="ad-view-header__edit"
              onClick={() => navigate(`/ads/${ad.id}/edit`)}
            >
              Редактировать
            </button>
          </div>

          <div className="ad-view-header__right">
            <div className="ad-view-header__price">{formatPrice(ad.price)}</div>
            <div className="ad-view-header__meta">
              <div>Категория: {getCategoryLabel(ad.category)}</div>
              <div>Опубликовано: {formatDate(ad.createdAt)}</div>
              <div>Отредактировано: {formatDate(ad.updatedAt)}</div>
            </div>
          </div>
        </div>

        <div className="ad-view-divider" />

        <div className="ad-view-main">
          <div className="ad-view-gallery">
            <div className="ad-view-image">
              <div className="ad-view-image__placeholder">
                <svg viewBox="0 0 64 64" aria-hidden="true">
                  <rect x="9" y="13" width="46" height="38" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle cx="21" cy="24" r="4" fill="currentColor" />
                  <path d="M16 43L28 30L36 38L44 27L52 43H16Z" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="ad-view-thumbs">
              {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="ad-view-thumb">
                <div className="ad-view-thumb__placeholder">
                  <svg viewBox="0 0 64 64" aria-hidden="true">
                    <rect x="9" y="13" width="46" height="38" rx="3" fill="none" stroke="currentColor" strokeWidth="3" />
                    <circle cx="21" cy="24" r="4" fill="currentColor" />
                    <path d="M16 43L28 30L36 38L44 27L52 43H16Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
              ))}
            </div>
          </div>

          <div className="ad-view-side">
            {ad.needsRevision && (
              <div className="ad-view-warning">
                <div className="ad-view-warning__head">
                  <div className="ad-view-warning__dot" />
                  <div className="ad-view-warning__title">Требуются доработки</div>
                </div>

                <div className="ad-view-warning__text">У объявления не заполнены поля:</div>
                <ul className="ad-view-warning__list">
                  {missingFields.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="ad-view-specs">
              <h2 className="ad-view-specs__title">Характеристики</h2>

              <div className="ad-view-specs__table">
                {characteristics.map((item) => (
                  <div key={item.key} className="ad-view-specs__row">
                    <div className="ad-view-specs__label">{item.label}</div>
                    <div className="ad-view-specs__value">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="ad-view-description">
          <h2 className="ad-view-description__title">Описание</h2>
          <div className="ad-view-description__text">
            {ad.description?.trim() || 'Описание пока не заполнено'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdViewPage;