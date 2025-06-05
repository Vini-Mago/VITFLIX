import React, { useEffect, useState } from 'react';
// import { getUsers } from '../../services/dataService'; // Original import - incorrect
import { adminGetAllUsers, adminUpdateUser, adminDeleteUser } from '../../services/dataService'; // Corrected import
import { User } from '../../types';
import { Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formState, setFormState] = useState<{ name: string; email: string; role: 'user' | 'admin'; avatar_url?: string }>({ name: '', email: '', role: 'user', avatar_url: '' });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await adminGetAllUsers();
      setUsers(fetchedUsers);
    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
      setError(err.response?.data?.message || err.message || 'Falha ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormState({ name: user.name, email: user.email, role: user.role, avatar_url: user.avatar || '' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormState({ name: '', email: '', role: 'user', avatar_url: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setLoading(true);
    setError(null);
    try {
      await adminUpdateUser(editingUser.id, {
        name: formState.name,
        email: formState.email,
        role: formState.role,
        // avatar_url: formState.avatar_url, // Avatar update might need upload logic
      });
      handleCancelEdit();
      await fetchUsers(); // Refresh the user list
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      setError(err.response?.data?.message || err.message || 'Falha ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      setLoading(true);
      setError(null);
      try {
        await adminDeleteUser(userId);
        await fetchUsers(); // Refresh the user list
      } catch (err: any) {
        console.error("Erro ao excluir usuário:", err);
        setError(err.response?.data?.message || err.message || 'Falha ao excluir usuário.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Usuários</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {editingUser && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Editar Usuário: {editingUser.name}</h2>
          <form onSubmit={handleUpdateUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input type="text" id="name" name="name" value={formState.name} onChange={handleInputChange} className="form-input" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" value={formState.email} onChange={handleInputChange} className="form-input" required />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Papel</label>
                <select id="role" name="role" value={formState.role} onChange={handleInputChange} className="form-select">
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {/* Add avatar upload/URL field if needed */}
            </div>
            <div className="flex justify-end space-x-3 pt-4 mt-4">
              <button type="button" onClick={handleCancelEdit} className="flex items-center btn-outline" disabled={loading}>
                <X className="h-4 w-4 mr-2" /> Cancelar
              </button>
              <button type="submit" className="flex items-center btn-primary disabled:opacity-50" disabled={loading}>
                <Save className="h-4 w-4 mr-2" /> {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">Carregando usuários...</td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">Nenhum usuário encontrado.</td>
              </tr>
            )}
            {!loading && users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                    src={user.avatar_url ? `${import.meta.env.VITE_API_BASE_URL}${user.avatar_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt={user.name}
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`; e.currentTarget.onerror = null; }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role === 'admin' ? 'Admin' : 'Usuário'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900" title="Editar">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900" title="Excluir">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;

