import type {
  GetItemsParams,
  ItemDetail,
  ItemResponse,
  ItemsResponse,
  UpdateItemPayload,
} from '../types/item';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function handleJsonResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (!response.ok) {
    let message = fallbackMessage;

    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function getItems(params: GetItemsParams = {}): Promise<ItemsResponse> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (typeof params.limit === 'number') searchParams.set('limit', String(params.limit));
  if (typeof params.skip === 'number') searchParams.set('skip', String(params.skip));
  if (params.needsRevision) searchParams.set('needsRevision', 'true');
  if (params.categories?.length) searchParams.set('categories', params.categories.join(','));
  if (params.sortColumn) searchParams.set('sortColumn', params.sortColumn);
  if (params.sortDirection) searchParams.set('sortDirection', params.sortDirection);

  const queryString = searchParams.toString();
  const url = queryString ? `${API_URL}/items?${queryString}` : `${API_URL}/items`;

  const response = await fetch(url);

  return handleJsonResponse<ItemsResponse>(response, 'Не удалось загрузить список объявлений');
}

export async function getItem(id: string): Promise<ItemDetail> {
  const response = await fetch(`${API_URL}/items/${id}`);
  const data = await handleJsonResponse<ItemResponse>(response, 'Не удалось загрузить объявление');

  if (!data.items.length) {
    throw new Error('Объявление не найдено');
  }

  return data.items[0];
}

export async function updateItem(id: string, payload: UpdateItemPayload): Promise<ItemDetail> {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await handleJsonResponse<{ item: ItemDetail }>(
    response,
    'Не удалось сохранить объявление',
  );

  return data.item;
}