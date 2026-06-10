import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar          from './components/Navbar';
import Home            from './pages/Home';
import Templates       from './pages/Templates';
import TemplateDetail  from './pages/TemplateDetail';
import OrderForm       from './pages/OrderForm';
import InvitationPage  from './pages/InvitationPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isInvitationPage = location.pathname.startsWith('/i/');

  return (
    <>
      {!isInvitationPage && <Navbar />}
      <Routes>
        <Route path="/"                      element={<Home />}           />
        <Route path="/templates"             element={<Templates />}      />
        <Route path="/templates/:id"         element={<TemplateDetail />} />
        <Route path="/order/:templateId"     element={<OrderForm />}      />
        <Route path="/i/:slug"               element={<InvitationPage />} />
      </Routes>
    </>
  );
}
