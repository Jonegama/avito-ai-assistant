import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/common/loader';
import ErrorMessage from '../components/common/errorMessage';
import { generateAiSuggestion } from '../api/aiApi';
import { getItem, updateItem } from '../api/itemsApi';
import { clearDraft, loadDraft, saveDraft } from '../utils/draft';
import type { Category, ItemDetail, UpdateItemPayload } from '../types/item';

function toInputValue(value: unknown) {
  return value === undefined || value === null ? '' : String(value);
}

type VisibleField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required?: boolean;
};

function AdEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();

  const [sourceItem, setSourceItem] = useState<ItemDetail | null>(null);
  const [form, setForm] = useState<UpdateItemPayload | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [aiDescription, setAiDescription] = useState('');
  const [aiPrice, setAiPrice] = useState('');
  const [aiLoading, setAiLoading] = useState<'description' | 'price' | null>(null);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);
        setError('');

        const item = await getItem(id);
        const draft = loadDraft(id);

        const initialForm: UpdateItemPayload =
          draft || {
            category: item.category,
            title: item.title,
            description: item.description || '',
            price: item.price,
            params: item.params || {},
          };

        if (!ignore) {
          setSourceItem(item);
          setForm(initialForm);
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

    loadData();

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    if (form) {
      saveDraft(id, form);
    }
  }, [form, id]);

  const descriptionLength = form?.description?.length || 0;
  const descriptionButtonText = form?.description?.trim()
    ? 'Улучшить описание'
    : 'Придумать описание';

  const visibleFields = useMemo<VisibleField[]>(() => {
    if (!form) return [];

    if (form.category === 'electronics') {
      return [
        { key: 'type', label: 'Тип', type: 'select', required: true },
        { key: 'brand', label: 'Бренд', type: 'text' },
        { key: 'model', label: 'Модель', type: 'text' },
        { key: 'color', label: 'Цвет', type: 'text' },
        { key: 'condition', label: 'Состояние', type: 'select' },
      ];
    }

    if (form.category === 'auto') {
      return [
        { key: 'brand', label: 'Бренд', type: 'text' },
        { key: 'model', label: 'Модель', type: 'text' },
        { key: 'yearOfManufacture', label: 'Год выпуска', type: 'number' },
        { key: 'transmission', label: 'Коробка', type: 'select' },
        { key: 'mileage', label: 'Пробег', type: 'number' },
        { key: 'enginePower', label: 'Мощность, л.с.', type: 'number' },
      ];
    }

    return [
      { key: 'type', label: 'Тип', type: 'select' },
      { key: 'address', label: 'Адрес', type: 'text' },
      { key: 'area', label: 'Площадь, м²', type: 'number' },
      { key: 'floor', label: 'Этаж', type: 'number' },
    ];
  }, [form]);

  function updateFormField<K extends keyof UpdateItemPayload>(key: K, value: UpdateItemPayload[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateParamField(key: string, value: string) {
    setForm((prev) => {
      if (!prev) return prev;

      const numericFields = ['yearOfManufacture', 'mileage', 'enginePower', 'area', 'floor'];
      const nextValue = numericFields.includes(key)
        ? value === ''
          ? undefined
          : Number(value)
        : value;

      return {
        ...prev,
        params: {
          ...prev.params,
          [key]: nextValue,
        },
      };
    });
  }

  function handleCategoryChange(category: Category) {
    setForm((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        category,
        params: {},
      };
    });

    setAiPrice('');
    setAiDescription('');
  }

  async function handleGenerateDescription() {
    if (!form) return;

    try {
      setAiLoading('description');
      setAiError('');
      const result = await generateAiSuggestion({
        mode: 'description',
        ...form,
      });
      setAiDescription(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Ошибка AI');
    } finally {
      setAiLoading(null);
    }
  }

  async function handleGeneratePrice() {
    if (!form) return;

    try {
      setAiLoading('price');
      setAiError('');
      const result = await generateAiSuggestion({
        mode: 'price',
        ...form,
      });
      setAiPrice(result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Ошибка AI');
    } finally {
      setAiLoading(null);
    }
  }

  function handleApplyAiPrice() {
    if (!aiPrice) return;

    const match = aiPrice.match(/\d[\d\s]*/);

    if (!match) return;

    const parsedPrice = Number(match[0].replace(/\s/g, ''));

    if (!Number.isNaN(parsedPrice)) {
      updateFormField('price', parsedPrice);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form) return;

    const normalizedPrice = Number(form.price);

    if (!form.category || !form.title.trim() || Number.isNaN(normalizedPrice) || normalizedPrice <= 0) {
      setError('Заполни обязательные поля: категория, название и корректная цена');
      return;
    }

    try {
      setSaving(true);
      setError('');

      await updateItem(id, {
        ...form,
        title: form.title.trim(),
        description: form.description?.trim() || '',
        price: normalizedPrice,
      });

      clearDraft(id);
      navigate(`/ads/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить объявление');
    } finally {
      setSaving(false);
    }
  }

  function renderSelectOptions(fieldKey: string): ReactNode {
    if (!form) return null;

    if (fieldKey === 'type' && form.category === 'electronics') {
      return (
        <>
          <option value="phone">Телефон</option>
          <option value="laptop">Ноутбук</option>
          <option value="misc">Другое</option>
        </>
      );
    }

    if (fieldKey === 'type' && form.category === 'real_estate') {
      return (
        <>
          <option value="flat">Квартира</option>
          <option value="house">Дом</option>
          <option value="room">Комната</option>
        </>
      );
    }

    if (fieldKey === 'condition') {
      return (
        <>
          <option value="new">Новый</option>
          <option value="used">Б/у</option>
        </>
      );
    }

    if (fieldKey === 'transmission') {
      return (
        <>
          <option value="automatic">Автомат</option>
          <option value="manual">Механика</option>
        </>
      );
    }

    return null;
  }

  function renderLabel(label: string, required?: boolean) {
    return (
      <label className="ad-edit-label">
        {required ? <span className="ad-edit-required">* </span> : null}
        {label}
      </label>
    );
  }

  function renderClearableInput(params: {
    value: string | number;
    onChange: (value: string) => void;
    onClear: () => void;
    type?: 'text' | 'number';
  }) {
    return (
      <div className="ad-edit-input-wrap">
        <input
          className="ad-edit-input ad-edit-input--clearable"
          type={params.type || 'text'}
          value={params.value}
          onChange={(e) => params.onChange(e.target.value)}
        />

        {String(params.value).length > 0 ? (
          <button
            type="button"
            className="ad-edit-clear"
            onClick={params.onClear}
            aria-label="Очистить поле"
          >
            ×
          </button>
        ) : null}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-shell">
        <Loader />
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="page-shell">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!form || !sourceItem) {
    return null;
  }

  return (
    <div className="page-shell">
      <div className="ad-edit-shell">
        <form className="ad-edit-page ad-edit-page--mock" onSubmit={handleSubmit}>
          <div className="ad-edit-page__header">
            <h1 className="ad-edit-page__title">Редактирование объявления</h1>
          </div>

          {error && <ErrorMessage message={error} />}
          {aiError && <ErrorMessage message={aiError} />}

          <div className="ad-edit-section ad-edit-section--first">
            <div className="ad-edit-field ad-edit-field--category">
              {renderLabel('Категория', true)}

              <select
                className="ad-edit-input"
                value={form.category}
                onChange={(e) => handleCategoryChange(e.target.value as Category)}
              >
                <option value="electronics">Электроника</option>
                <option value="auto">Авто</option>
                <option value="real_estate">Недвижимость</option>
              </select>
            </div>
          </div>

          <div className="ad-edit-section">
            <div className="ad-edit-grid ad-edit-grid--stack">
              <div className="ad-edit-field ad-edit-field--full">
                {renderLabel('Название', true)}

                {renderClearableInput({
                  value: form.title,
                  onChange: (value) => updateFormField('title', value),
                  onClear: () => updateFormField('title', ''),
                })}
              </div>

              <div className="ad-edit-price-row">
                <div className="ad-edit-field ad-edit-field--price-main">
                  {renderLabel('Цена', true)}

                  {renderClearableInput({
                    value: form.price,
                    type: 'number',
                    onChange: (value) => updateFormField('price', value === '' ? 0 : Number(value)),
                    onClear: () => updateFormField('price', 0),
                  })}
                </div>

                <div className="ad-edit-price-side">
                  <button
                    type="button"
                    className="ad-edit-ai-button"
                    onClick={handleGeneratePrice}
                    disabled={aiLoading !== null}
                  >
                    <span className="ad-edit-ai-button__icon">⌁</span>
                    <span>{aiLoading === 'price' ? 'Генерация...' : 'Узнать рыночную цену'}</span>
                  </button>

                  {aiPrice ? (
                    <div className="ad-edit-popover ad-edit-popover--price">
                      <div className="ad-edit-popover__title">Ответ AI:</div>

                      <div className="ad-edit-popover__content">{aiPrice}</div>

                      <div className="ad-edit-popover__actions">
                        <button
                          type="button"
                          className="ad-edit-apply"
                          onClick={handleApplyAiPrice}
                        >
                          Применить
                        </button>

                        <button
                          type="button"
                          className="ad-edit-popover__secondary"
                          onClick={() => setAiPrice('')}
                        >
                          Закрыть
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="ad-edit-section">
            <h2 className="ad-edit-section__title">Характеристики</h2>

            <div className="ad-edit-grid">
              {visibleFields.map((field) => {
                const currentValue = (form.params as Record<string, unknown>)[field.key];

                if (field.type === 'select') {
                  return (
                    <div key={field.key} className="ad-edit-field">
                      {renderLabel(field.label, field.required)}

                      <select
                        className="ad-edit-input"
                        value={toInputValue(currentValue)}
                        onChange={(e) => updateParamField(field.key, e.target.value)}
                      >
                        <option value="">Не выбрано</option>
                        {renderSelectOptions(field.key)}
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={field.key} className="ad-edit-field">
                    {renderLabel(field.label, field.required)}

                    {renderClearableInput({
                      value: toInputValue(currentValue),
                      type: field.type,
                      onChange: (value) => updateParamField(field.key, value),
                      onClear: () => updateParamField(field.key, ''),
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ad-edit-section">
            <h2 className="ad-edit-section__title">Описание</h2>

            <div className="ad-edit-description-wrap">
              <textarea
                className="ad-edit-textarea"
                maxLength={1000}
                value={form.description || ''}
                onChange={(e) => updateFormField('description', e.target.value)}
              />

              <div className="ad-edit-counter">{descriptionLength} / 1000</div>
            </div>

            <div className="ad-edit-inline-actions">
              <button
                type="button"
                className="ad-edit-ai-button"
                onClick={handleGenerateDescription}
                disabled={aiLoading !== null}
              >
                <span className="ad-edit-ai-button__icon">💡</span>
                <span>
                  {aiLoading === 'description' ? 'Генерация...' : descriptionButtonText}
                </span>
              </button>
            </div>

            {aiDescription ? (
              <div className="ad-edit-description-ai">
                <div className="ad-edit-popover__title">Ответ AI:</div>

                <div className="ad-edit-popover__content">{aiDescription}</div>

                <div className="ad-edit-popover__actions">
                  <button
                    type="button"
                    className="ad-edit-apply"
                    onClick={() => updateFormField('description', aiDescription)}
                  >
                    Применить
                  </button>

                  <button
                    type="button"
                    className="ad-edit-popover__secondary"
                    onClick={() => setAiDescription('')}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <div className="ad-edit-footer">
            <button className="ad-edit-submit" type="submit" disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>

            <button
              type="button"
              className="ad-edit-cancel"
              onClick={() => navigate(`/ads/${id}`)}
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdEditPage;