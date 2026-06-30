import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home'; // eager: landing page loads instantly

// Lazy-loaded routes — split out of the initial bundle.
const Menu = lazy(() => import('./pages/Menu'));
const Reservations = lazy(() => import('./pages/Reservations'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const MenuManager = lazy(() => import('./pages/admin/MenuManager'));
const AdminReservations = lazy(() => import('./pages/admin/Reservations'));
const AdminMessages = lazy(() => import('./pages/admin/Messages'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] grid place-items-center bg-black">
      <div className="font-display text-4xl text-red tracking-wider animate-pulse">
        GRINDHOUSE
      </div>
    </div>
  );
}

/** Public site shell — navbar + footer wrap the page. */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

/** Guards the admin section. */
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<RequireAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
