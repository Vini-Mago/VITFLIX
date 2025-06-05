import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setFormError('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error is handled by context
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
        Acesse sua conta
      </h2>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {(error || formError) && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {formError || error}
          </div>
        )}
        
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Senha"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-gray-600">Não tem uma conta?</span>{' '}
            <Link to="/cadastro" className="font-medium text-primary hover:text-primary-dark">
              Cadastre-se
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {loading ? (
              <span className="animate-pulse">Entrando...</span>
            ) : (
              <>
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-primary-dark group-hover:text-primary-light" />
                </span>
                Entrar
              </>
            )}
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Use as credenciais de demonstração:</p>
          <p className="font-medium">Email: admin@eduflix.com</p>
          <p className="font-medium">Senha: admin123</p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;