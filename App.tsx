
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import Sidebar from './components/Layout/Sidebar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyForm from './pages/CompanyForm';
import CompanyDetails from './pages/CompanyDetails';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#050B14]">
      <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/empresas') return 'Gestão de Empresas';
    if (path === '/empresas/nova') return 'Nova Empresa';
    if (path.includes('/empresas/editar/')) return 'Edição de Unidade';
    if (path.includes('/empresas/')) return 'Dashboard de Unidade';
    if (path === '/faturamento') return 'Faturamento';
    if (path === '/configuracoes') return 'Configurações';
    return 'Evolutie Hub';
  };

  return (
    <div className="flex min-h-screen bg-background text-textPrimary selection:bg-secondary selection:text-white">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

      <main
        className={`flex-1 transition-all duration-500 p-6 md:p-10
          ${isCollapsed ? 'ml-20' : 'ml-0 md:ml-72'}`}
      >
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-4 bg-secondary rounded-full"></div>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              <span className="opacity-40">Evolutie Hub</span>
              <span className="text-secondary opacity-60">/</span>
              <span className="text-primary">{getPageTitle()}</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/empresas" element={<Companies />} />
            <Route path="/empresas/nova" element={<CompanyForm />} />
            <Route path="/empresas/editar/:id" element={<CompanyForm />} />
            <Route path="/empresas/:id" element={<CompanyDetails />} />
            <Route path="/faturamento" element={<Billing />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CompanyProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            />
          </Routes>
        </HashRouter>
      </CompanyProvider>
    </AuthProvider>
  );
};

export default App;
