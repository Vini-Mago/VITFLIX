import React from 'react';
import { Outlet } from 'react-router-dom';
import { Home, User, List, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold mr-2">
                  E
                </div>
                <span className="text-xl font-bold text-gray-900">EduFlix</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <Link to="/perfil\" className="flex items-center">
                    <span className="hidden md:block text-sm text-gray-700 mr-2">
                      Olá, {user.name}
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
                  </Link>
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
                  to="/"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Home className="mr-3 h-5 w-5" />
                  Início
                </Link>
                
                <Link
                  to="/perfil"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === '/perfil'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <User className="mr-3 h-5 w-5" />
                  Meu Perfil
                </Link>
                
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <List className="mr-3 h-5 w-5" />
                    Área Admin
                  </Link>
                )}
                
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
              to="/"
              className={`flex flex-col items-center py-2 px-3 text-xs ${
                location.pathname === '/' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <Home className="h-6 w-6" />
              <span>Início</span>
            </Link>
            
            <Link
              to="/perfil"
              className={`flex flex-col items-center py-2 px-3 text-xs ${
                location.pathname === '/perfil' ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <User className="h-6 w-6" />
              <span>Perfil</span>
            </Link>
            
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex flex-col items-center py-2 px-3 text-xs ${
                  location.pathname.startsWith('/admin') ? 'text-primary' : 'text-gray-600'
                }`}
              >
                <List className="h-6 w-6" />
                <span>Admin</span>
              </Link>
            )}
            
            <button
              onClick={logout}
              className="flex flex-col items-center py-2 px-3 text-xs text-gray-600"
            >
              <LogOut className="h-6 w-6" />
              <span>Sair</span>
            </button>
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

export default MainLayout;