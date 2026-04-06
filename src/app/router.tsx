import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdsListPage from '../pages/adsListPage';
import AdViewPage from '../pages/adViewPage';
import AdEditPage from '../pages/adEditPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/ads" replace />,
  },
  {
    path: '/ads',
    element: <AdsListPage />,
  },
  {
    path: '/ads/:id',
    element: <AdViewPage />,
  },
  {
    path: '/ads/:id/edit',
    element: <AdEditPage />,
  },
]);