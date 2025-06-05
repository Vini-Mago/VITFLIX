import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { Edit, Trash2, Plus, Save, X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Category } from '../../types'; // Import Category type
import { uploadFile } from '../../services/dataService'; // Import upload function

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, loading: dataLoading, error: dataError } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Stores the final URL (relative path from backend)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setSelectedFile(null);
    setImagePreview(null);
    setEditingId(null);
    setIsAdding(false);
    setIsUploading(false);
    setUploadError(null);
    setFormError(null);
  };

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageUrl(''); // Clear existing imageUrl if a new file is selected
      setUploadError(null); // Clear previous upload errors
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    let finalImageUrl = imageUrl; // Use existing URL unless a new file is uploaded

    // 1. Upload file if selected
    if (selectedFile) {
      setIsUploading(true);
      setUploadError(null);
      try {
        const uploadResult = await uploadFile(selectedFile);
        finalImageUrl = uploadResult.fileUrl; // Use the relative URL from backend
        setImageUrl(finalImageUrl); // Update state with the new URL
      } catch (err: any) {
        console.error('Upload error:', err);
        setUploadError(err.response?.data?.message || err.message || 'Falha no upload da imagem.');
        setIsUploading(false);
        return; // Stop submission if upload fails
      } finally {
        setIsUploading(false);
      }
    }

    // Ensure an image URL is present (either existing or newly uploaded)
    if (!finalImageUrl) {
        setFormError('A imagem da categoria é obrigatória.');
        return;
    }

    // 2. Add or Update Category data
    try {
      const categoryData = {
        title,
        description,
        imageUrl: finalImageUrl,
      };

      if (isAdding) {
        await addCategory(categoryData);
      } else if (editingId) {
        await updateCategory(editingId, categoryData);
      }

      resetForm();
    } catch (err: any) {
      console.error('Error saving category:', err);
      setFormError(err.response?.data?.message || err.message || 'Erro ao salvar categoria.');
    }
  };

  // Handle edit category selection
  const handleEditCategory = (category: Category) => {
    resetForm(); // Clear previous form state
    setTitle(category.title);
    setDescription(category.description);
    setImageUrl(category.image_url); // Set existing image URL
    setImagePreview(`${API_BASE_URL}${category.image_url}`); // Set preview for existing image
    setEditingId(category.id);
    setIsAdding(false);
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId: string) => {
    // Backend schema ON DELETE SET NULL for courses.category_id
    // Adjust confirmation message if needed based on backend behavior
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Os cursos associados terão sua categoria removida.')) {
      try {
        await deleteCategory(categoryId);
      } catch (error: any) {
        console.error('Error deleting category:', error);
        alert(`Erro ao excluir categoria: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Update image preview if imageUrl changes (e.g., after upload)
  useEffect(() => {
    if (imageUrl && !selectedFile) {
      setImagePreview(`${API_BASE_URL}${imageUrl}`);
    }
  }, [imageUrl, selectedFile]);

  const isLoading = dataLoading || isUploading;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h1>
        {!isAdding && !editingId && (
          <button
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="flex items-center bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Categoria
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {isAdding ? 'Adicionar Nova Categoria' : 'Editar Categoria'}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="Digite o título da categoria"
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  placeholder="Digite uma descrição para a categoria"
                  rows={3}
                  required
                />
              </div>

              {/* Image Upload Input */}
              <div>
                <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">Imagem da Categoria</label>
                <div className="mt-1 flex items-center space-x-4 p-3 border border-gray-300 rounded-md">
                  <div className="flex-shrink-0 h-20 w-32 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/128x80?text=Erro';
                            e.currentTarget.onerror = null; // prevent infinite loop
                        }}
                      />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  <label htmlFor="imageFile" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <Upload className="h-4 w-4 mr-2 inline-block" />
                    <span>{selectedFile ? 'Alterar Imagem' : 'Selecionar Imagem'}</span>
                    <input id="imageFile" name="imageFile" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </label>
                  {selectedFile && <span className="text-sm text-gray-500 truncate max-w-xs">{selectedFile.name}</span>}
                </div>
                {uploadError && <p className="mt-2 text-sm text-red-600"><AlertCircle className="h-4 w-4 inline mr-1"/>{uploadError}</p>}
                {isUploading && <p className="mt-2 text-sm text-blue-600">Enviando imagem...</p>}
              </div>

              {/* Form Error */}
              {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                      <strong className="font-bold">Erro: </strong>
                      <span className="block sm:inline">{formError}</span>
                  </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center btn-outline"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center btn-primary disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Salvando...' : (isAdding ? 'Adicionar' : 'Atualizar')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      {dataError && <p className="text-red-600 mb-4">Erro ao carregar categorias: {dataError}</p>}
      {categories.length === 0 && !isAdding && !editingId && !dataLoading ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">Nenhuma categoria cadastrada ainda.</p>
          <button onClick={() => { resetForm(); setIsAdding(true); }} className="btn-primary">
            Adicionar Primeira Categoria
          </button>
        </div>
      ) : (
        !isAdding && !editingId && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cursos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-10 rounded-md overflow-hidden bg-gray-100">
                        {category.image_url && (
                            <img
                                src={`${API_BASE_URL}${category.image_url}`}
                                alt={category.title}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/64x40?text=Erro'; e.currentTarget.onerror = null; }}
                            />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{category.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Assuming backend provides course_count now */}
                      <div className="text-sm text-gray-500">{category.course_count ?? category.courseIds?.length ?? 0} cursos</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditCategory(category)} className="text-blue-600 hover:text-blue-900"><Edit className="h-5 w-5" /></button>
                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default AdminCategories;

