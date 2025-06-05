import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, User, List, LogOut, 
  LayoutGrid, Film, Users, Settings
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/admin" className="flex items-center">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-2">
                  E
                </div>
                <span className="text-xl font-bold text-gray-900">EduFlix Admin</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <span className="hidden md:block text-sm text-gray-700 mr-2">
                    Admin: {user.name}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex-grow flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-grow px-2 space-y-1">
                <Link
                  to="/admin"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/admin'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <LayoutGrid className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
                
                <Link
                  to="/admin/categorias"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/admin/categorias'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <List className="mr-3 h-5 w-5" />
                  Categorias
                </Link>
                
                <Link
                  to="/admin/cursos"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/admin/cursos'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Film className="mr-3 h-5 w-5" />
                  Cursos
                </Link>
                
                <Link
                  to="/admin/usuarios"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/admin/usuarios'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Usuários
                </Link>
                
                <hr className="my-4 border-gray-200" />
                
                <Link
                  to="/"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Voltar ao Site
                </Link>
                
                <button
                  onClick={logout}
                  className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sair
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Mobile bottom navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="flex justify-around">
            <Link
              to="/admin"
              className={`flex flex-col items-center py-2 px-3 text-xs ${
                location.pathname === '/admin' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <LayoutGrid className="h-6 w-6" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/admin/categorias"
              className={`flex flex-col items-center py-2 px-3 text-xs ${
                location.pathname === '/admin/categorias' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <List className="h-6 w-6" />
              <span>Categorias</span>
            </Link>
            
            <Link
              to="/admin/cursos"
              className={`flex flex-col items-center py-2 px-3 text-xs ${
                location.pathname === '/admin/cursos' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <Film className="h-6 w-6" />
              <span>Cursos</span>
            </Link>
            
            <Link
              to="/"
              className="flex flex-col items-center py-2 px-3 text-xs text-gray-600"
            >
              <Home className="h-6 w-6" />
              <span>Site</span>
            </Link>
          </div>
        </div>
        
        {/* Page content */}
        <div className="flex-1 overflow-auto pb-16 md:pb-0">
          <main className="py-6 px-4 sm:px-6 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;