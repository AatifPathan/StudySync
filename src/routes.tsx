import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import HomePage from './pages/index';
import AuthPage from './pages/auth';
import AuthGooglePage from './pages/auth-google';
import Spinner from './components/Spinner';
import DashboardLayout from './layouts/DashboardLayout';

// ── Public pages ──────────────────────────────────────────────────────
const FeaturesPage     = lazy(() => import('./pages/features'));
const HowItWorksPage   = lazy(() => import('./pages/how-it-works'));
const TestimonialsPage = lazy(() => import('./pages/testimonials'));
const ContactPage      = lazy(() => import('./pages/contact'));

// ── Dashboard pages ───────────────────────────────────────────────────
const DashboardHome    = lazy(() => import('./pages/dashboard/index'));
const PlannerPage      = lazy(() => import('./pages/dashboard/planner'));
const TasksPage        = lazy(() => import('./pages/dashboard/tasks'));
const StudyToolsPage   = lazy(() => import('./pages/dashboard/tools'));
const FocusPage        = lazy(() => import('./pages/dashboard/focus'));
const RoomsPage        = lazy(() => import('./pages/dashboard/rooms'));
const AnalyticsPage    = lazy(() => import('./pages/dashboard/analytics'));
const SettingsPage     = lazy(() => import('./pages/dashboard/settings'));

// ── 404 ───────────────────────────────────────────────────────────────
const NotFoundPage = import.meta.env.DEV
  ? lazy(() => import('../dev-tools/src/PageNotFound'))
  : lazy(() => import('./pages/_404'));

const Fallback = () => (
  <div className="flex justify-center py-8 h-screen items-center">
    <Spinner />
  </div>
);

function wrap(Component: React.ComponentType) {
  return (
    <Suspense fallback={<Fallback />}>
      <Component />
    </Suspense>
  );
}

function dashWrap(Component: React.ComponentType) {
  return (
    <DashboardLayout>
      <Suspense fallback={<Fallback />}>
        <Component />
      </Suspense>
    </DashboardLayout>
  );
}

// ── Public routes (inside RootLayout) ────────────────────────────────
export const routes: RouteObject[] = [
  { path: '/',             element: <HomePage /> },
  { path: '/features',     element: wrap(FeaturesPage) },
  { path: '/how-it-works', element: wrap(HowItWorksPage) },
  { path: '/testimonials', element: wrap(TestimonialsPage) },
  { path: '/contact',      element: wrap(ContactPage) },
  { path: '*',             element: wrap(NotFoundPage) },
];

// ── Auth routes (no header/footer) ───────────────────────────────────
export const authRoutes: RouteObject[] = [
  { path: '/login',        element: <AuthPage /> },
  { path: '/signup',       element: <AuthPage /> },
  { path: '/auth',         element: <AuthPage /> },
  { path: '/auth/google',  element: <AuthGooglePage /> },
];

// ── Dashboard routes (DashboardLayout, no RootLayout) ─────────────────
export const dashboardRoutes: RouteObject[] = [
  { path: '/dashboard',            element: dashWrap(DashboardHome) },
  { path: '/dashboard/planner',    element: dashWrap(PlannerPage) },
  { path: '/dashboard/tasks',      element: dashWrap(TasksPage) },
  { path: '/dashboard/tools',      element: dashWrap(StudyToolsPage) },
  { path: '/dashboard/focus',      element: dashWrap(FocusPage) },
  { path: '/dashboard/rooms',      element: dashWrap(RoomsPage) },
  { path: '/dashboard/analytics',  element: dashWrap(AnalyticsPage) },
  { path: '/dashboard/settings',   element: dashWrap(SettingsPage) },
];

export type Path =
  | '/'
  | '/features'
  | '/how-it-works'
  | '/testimonials'
  | '/contact'
  | '/login'
  | '/signup'
  | '/dashboard'
  | '/dashboard/planner'
  | '/dashboard/tasks'
  | '/dashboard/tools'
  | '/dashboard/focus'
  | '/dashboard/rooms'
  | '/dashboard/analytics'
  | '/dashboard/settings';

export type Params = Record<string, string | undefined>;
