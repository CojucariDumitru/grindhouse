import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservations from './pages/Reservations';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import MenuManager from './pages/admin/MenuManager';
import AdminReservations from './pages/admin/Reservations';
import AdminMessages from './pages/admin/Messages';

/** Public site shell — navbar + footer wrap the page. */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1">
        <Outlet />
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
    </>
  );
}
