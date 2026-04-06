import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

let items = [
  {
    id: '1',
    category: 'electronics',
    title: 'MacBook Pro 16”',
    description: 'Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro.',
    price: 64000,
    createdAt: '2026-03-10T22:39:00.000Z',
    updatedAt: '2026-03-10T23:12:00.000Z',
    params: {
      type: 'laptop',
      brand: 'Apple',
      model: 'M1 Pro',
      condition: 'used'
    }
  },
  {
    id: '2',
    category: 'auto',
    title: 'Volkswagen Polo',
    description: '',
    price: 1100000,
    createdAt: '2026-03-09T12:00:00.000Z',
    updatedAt: '2026-03-09T12:00:00.000Z',
    params: {
      brand: 'Volkswagen',
      model: 'Polo',
      yearOfManufacture: 2018,
      transmission: 'automatic',
      mileage: 87000
    }
  },
  {
    id: '3',
    category: 'real_estate',
    title: 'Студия, 25м²',
    description: 'Продаётся уютная студия.',
    price: 15000000,
    createdAt: '2026-03-08T09:00:00.000Z',
    updatedAt: '2026-03-08T09:00:00.000Z',
    params: {
      type: 'flat',
      address: 'Москва',
      area: 25,
      floor: 7
    }
  },
  {
    id: '4',
    category: 'real_estate',
    title: '1-кк, 44м²',
    description: '',
    price: 19000000,
    createdAt: '2026-03-07T10:30:00.000Z',
    updatedAt: '2026-03-07T10:30:00.000Z',
    params: {
      type: 'flat',
      area: 44
    }
  },
  {
    id: '5',
    category: 'electronics',
    title: 'Наушники',
    description: 'Беспроводные наушники в хорошем состоянии.',
    price: 2990,
    createdAt: '2026-03-06T11:15:00.000Z',
    updatedAt: '2026-03-06T11:15:00.000Z',
    params: {
      type: 'misc',
      brand: 'Sony',
      model: 'WH-CH520',
      color: 'Чёрный',
      condition: 'used'
    }
  },
  {
    id: '6',
    category: 'electronics',
    title: 'iPhone 17 Pro Max',
    description: '',
    price: 107000,
    createdAt: '2026-03-05T14:20:00.000Z',
    updatedAt: '2026-03-05T14:20:00.000Z',
    params: {
      type: 'phone',
      brand: 'Apple',
      model: 'iPhone 17 Pro Max'
    }
  },
  {
    id: '7',
    category: 'auto',
    title: 'Toyota Camry',
    description: 'Надёжный автомобиль, один владелец.',
    price: 3900000,
    createdAt: '2026-03-04T13:10:00.000Z',
    updatedAt: '2026-03-04T13:10:00.000Z',
    params: {
      brand: 'Toyota',
      model: 'Camry',
      yearOfManufacture: 2021,
      transmission: 'automatic',
      mileage: 42000,
      enginePower: 181
    }
  },
  {
    id: '8',
    category: 'electronics',
    title: 'iPad Air 11, 2024 г.',
    description: 'Планшет в отличном состоянии, почти не использовался.',
    price: 37000,
    createdAt: '2026-03-03T15:00:00.000Z',
    updatedAt: '2026-03-03T15:00:00.000Z',
    params: {
      type: 'misc',
      brand: 'Apple',
      model: 'iPad Air 11',
      color: 'Синий',
      condition: 'used'
    }
  },
  {
    id: '9',
    category: 'electronics',
    title: 'MAJOR VI',
    description: '',
    price: 20000,
    createdAt: '2026-03-02T16:40:00.000Z',
    updatedAt: '2026-03-02T16:40:00.000Z',
    params: {
      type: 'misc',
      brand: 'Marshall',
      model: 'Major VI',
      color: 'Чёрный',
      condition: ''
    }
  },
  {
    id: '10',
    category: 'electronics',
    title: 'Пылесос Dyson V11',
    description: 'Вертикальный пылесос, работает отлично.',
    price: 25000,
    createdAt: '2026-03-01T09:25:00.000Z',
    updatedAt: '2026-03-01T09:25:00.000Z',
    params: {
      type: 'misc',
      brand: 'Dyson',
      model: 'V11',
      color: 'Серый',
      condition: 'used'
    }
  },
  {
    id: '11',
    category: 'real_estate',
    title: 'Дом, 120м²',
    description: 'Просторный дом за городом.',
    price: 8700000,
    createdAt: '2026-02-28T12:45:00.000Z',
    updatedAt: '2026-02-28T12:45:00.000Z',
    params: {
      type: 'house',
      address: 'Московская область',
      area: 120,
      floor: 2
    }
  },
  {
    id: '12',
    category: 'real_estate',
    title: 'Комната, 18м²',
    description: '',
    price: 3200000,
    createdAt: '2026-02-27T11:30:00.000Z',
    updatedAt: '2026-02-27T11:30:00.000Z',
    params: {
      type: 'room',
      address: 'Санкт-Петербург',
      area: 18,
      floor: ''
    }
  },
  {
    id: '13',
    category: 'auto',
    title: 'Omoda C5',
    description: 'Почти новый кроссовер, хорошая комплектация.',
    price: 2900000,
    createdAt: '2026-02-26T10:10:00.000Z',
    updatedAt: '2026-02-26T10:10:00.000Z',
    params: {
      brand: 'Omoda',
      model: 'C5',
      yearOfManufacture: 2024,
      transmission: 'automatic',
      mileage: 9000,
      enginePower: 147
    }
  },
  {
    id: '14',
    category: 'electronics',
    title: 'Игровой монитор LG',
    description: '',
    price: 18000,
    createdAt: '2026-02-25T17:35:00.000Z',
    updatedAt: '2026-02-25T17:35:00.000Z',
    params: {
      type: 'misc',
      brand: 'LG',
      model: 'UltraGear',
      color: '',
      condition: 'used'
    }
  },
  {
    id: '15',
    category: 'electronics',
    title: 'Samsung Galaxy S25',
    description: 'Смартфон в идеальном состоянии.',
    price: 92000,
    createdAt: '2026-02-24T18:20:00.000Z',
    updatedAt: '2026-02-24T18:20:00.000Z',
    params: {
      type: 'phone',
      brand: 'Samsung',
      model: 'Galaxy S25',
      color: 'Серый',
      condition: 'used'
    }
  }
];

function getRequiredParams(category) {
  if (category === 'electronics') {
    return ['type', 'brand', 'model', 'condition', 'color'];
  }

  if (category === 'auto') {
    return ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'];
  }

  return ['type', 'address', 'area', 'floor'];
}

function getMissingFields(item) {
  const missing = [];

  if (!item.description || !item.description.trim()) {
    missing.push('description');
  }

  const params = item.params || {};

  getRequiredParams(item.category).forEach((key) => {
    const value = params[key];
    if (value === undefined || value === null || value === '') {
      missing.push(key);
    }
  });

  return missing;
}

function getNeedsRevision(item) {
  return getMissingFields(item).length > 0;
}

app.get('/items', (req, res) => {
  const {
    q,
    limit,
    skip,
    needsRevision,
    categories,
    sortColumn,
    sortDirection
  } = req.query;

  let result = [...items];

  if (q) {
    const search = String(q).toLowerCase();
    result = result.filter((item) =>
      item.title.toLowerCase().includes(search)
    );
  }

  if (needsRevision === 'true') {
    result = result.filter((item) => getNeedsRevision(item));
  }

  if (categories) {
    const categoriesList = String(categories).split(',');
    result = result.filter((item) => categoriesList.includes(item.category));
  }

  if (sortColumn) {
    result.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;

      if (sortColumn === 'title') {
        return a.title.localeCompare(b.title) * direction;
      }

      if (sortColumn === 'createdAt') {
        return (
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
          direction
        );
      }

      return 0;
    });
  }

  const total = result.length;

  const skipValue = Number(skip) || 0;
  const limitValue = Number(limit) || result.length;

  result = result.slice(skipValue, skipValue + limitValue);

  const itemsOut = result.map((item) => ({
    ...item,
    needsRevision: getNeedsRevision(item)
  }));

  res.json({
    items: itemsOut,
    total
  });
});

app.get('/items/:id', (req, res) => {
  const item = items.find((item) => item.id === req.params.id);

  if (!item) {
    return res.status(404).json({
      message: 'Объявление не найдено'
    });
  }

  res.json({
    items: [
      {
        ...item,
        needsRevision: getNeedsRevision(item),
        missingFields: getMissingFields(item)
      }
    ],
    total: 1
  });
});

app.put('/items/:id', (req, res) => {
  const index = items.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      message: 'Объявление не найдено'
    });
  }

  const body = req.body;

  items[index] = {
    ...items[index],
    category: body.category,
    title: body.title,
    description: body.description,
    price: body.price,
    params: body.params || {},
    updatedAt: new Date().toISOString()
  };

  res.json({
    item: {
      ...items[index],
      needsRevision: getNeedsRevision(items[index])
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend started on http://localhost:${PORT}`);
});