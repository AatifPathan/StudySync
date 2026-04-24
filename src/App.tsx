import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import CookieBannerErrorBoundary from '@/components/CookieBannerErrorBoundary';
import RootLayout from './layouts/RootLayout';
import Spinner from './components/Spinner';
import { routes, authRoutes, dashboardRoutes } from './routes';

const CookieBanner = lazy(async () => {
  try {
    return await import('@/components/CookieBanner');
  } catch (error) {
    console.warn('Failed to load CookieBanner:', error);
    return { default: () => null };
  }
});

const SpinnerFallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

const router = createBrowserRouter([
  // Auth pages — no header/footer
  ...authRoutes,

  // Dashboard pages — DashboardLayout (no RootLayout)
  ...dashboardRoutes,

  // Main site — wrapped in RootLayout
  {
    path: '/',
    element: import.meta.env.MODE === 'development' ? (
        <Suspense fallback={<SpinnerFallback />}>
          <RootLayout>
            <Outlet />
          </RootLayout>
        </Suspense>

    ) : (
      <Suspense fallback={<SpinnerFallback />}>
        <RootLayout>
          <Outlet />
        </RootLayout>
      </Suspense>
    ),
    children: routes,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <CookieBannerErrorBoundary>
        <Suspense fallback={null}>
          <CookieBanner />
        </Suspense>
      </CookieBannerErrorBoundary>
    </>
  );
}
