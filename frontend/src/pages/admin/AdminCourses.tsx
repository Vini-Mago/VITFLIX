import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { Edit, Trash2, Plus, Save, X, Film, FileText } from 'lucide-react';

const AdminCourses: React.FC = () => {
  const { 
    categories, courses, videos, files,
    addCourse, updateCourse, deleteCourse,
    addVideo, updateVideo, deleteVideo,
    addFile, updateFile, deleteFile,
    loading 
  } = useData();
  
  // States for course form
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // States for video form
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [order, setOrder] = useState(1);
  
  // States for file form
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [fileDescription, setFileDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState(0);
  
  // View state
  const [viewMode, setViewMode] = useState<'courses' | 'videos' | 'files'>('courses');
  
  // Reset course form
  const resetCourseForm = () => {
    setTitle('');
    setDescription('');
    setInstructor('');
    setCategoryId('');
    setImageUrl('');
  };
  
  // Reset video form
  const resetVideoForm = () => {
    setVideoTitle('');
    setVideoDescription('');
    setVideoUrl('');
    setThumbnailUrl('');
    setDuration(0);
    setOrder(1);
  };
  
  // Reset file form
  const resetFileForm = () => {
    setFileTitle('');
    setFileDescription('');
    setFileUrl('');
    setFileType('');
    setFileSize(0);
  };
  
  // Handle add course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addCourse({
        title,
        description,
        instructor,
        categoryId,
        imageUrl,
      });
      
      resetCourseForm();
      setIsAddingCourse(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };
  
  // Handle edit course
  const handleEditCourse = (course: any) => {
    setTitle(course.title);
    setDescription(course.description);
    setInstructor(course.instructor);
    setCategoryId(course.categoryId);
    setImageUrl(course.imageUrl);
    setEditingCourseId(course.id);
    setIsAddingCourse(false);
  };
  
  // Handle update course
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCourseId) return;
    
    try {
      await updateCourse(editingCourseId, {
        title,
        description,
        instructor,
        categoryId,
        imageUrl,
      });
      
      resetCourseForm();
      setEditingCourseId(null);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };
  
  // Handle delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso? Todos os vídeos e arquivos relacionados serão excluídos.')) {
      try {
        await deleteCourse(courseId);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };
  
  // Handle add video
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourseId) return;
    
    try {
      await addVideo({
        courseId: selectedCourseId,
        title: videoTitle,
        description: videoDescription,
        videoUrl,
        thumbnailUrl,
        duration,
        order,
      });
      
      resetVideoForm();
      setIsAddingVideo(false);
    } catch (error) {
      console.error('Error adding video:', error);
    }
  };
  
  // Handle edit video
  const handleEditVideo = (video: any) => {
    setVideoTitle(video.title);
    setVideoDescription(video.description);
    setVideoUrl(video.videoUrl);
    setThumbnailUrl(video.thumbnailUrl);
    setDuration(video.duration);
    setOrder(video.order);
    setEditingVideoId(video.id);
    setSelectedCourseId(video.courseId);
    setIsAddingVideo(false);
  };
  
  // Handle update video
  const handleUpdateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingVideoId) return;
    
    try {
      await updateVideo(editingVideoId, {
        title: videoTitle,
        description: videoDescription,
        videoUrl,
        thumbnailUrl,
        duration,
        order,
      });
      
      resetVideoForm();
      setEditingVideoId(null);
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };
  
  // Handle delete video
  const handleDeleteVideo = async (videoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este vídeo?')) {
      try {
        await deleteVideo(videoId);
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };
  
  // Handle add file
  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCourseId) return;
    
    try {
      await addFile({
        courseId: selectedCourseId,
        title: fileTitle,
        description: fileDescription,
        fileUrl,
        fileType,
        fileSize,
      });
      
      resetFileForm();
      setIsAddingFile(false);
    } catch (error) {
      console.error('Error adding file:', error);
    }
  };
  
  // Handle edit file
  const handleEditFile = (file: any) => {
    setFileTitle(file.title);
    setFileDescription(file.description);
    setFileUrl(file.fileUrl);
    setFileType(file.fileType);
    setFileSize(file.fileSize);
    setEditingFileId(file.id);
    setSelectedCourseId(file.courseId);
    setIsAddingFile(false);
  };
  
  // Handle update file
  const handleUpdateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingFileId) return;
    
    try {
      await updateFile(editingFileId, {
        title: fileTitle,
        description: fileDescription,
        fileUrl,
        fileType,
        fileSize,
      });
      
      resetFileForm();
      setEditingFileId(null);
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };
  
  // Handle delete file
  const handleDeleteFile = async (fileId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este arquivo?')) {
      try {
        await deleteFile(fileId);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };
  
  // Get course name by ID
  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Desconhecido';
  };
  
  // Get category name by ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.title : 'Desconhecida';
  };
  
  // Get filtered videos by course
  const getFilteredVideos = () => {
    if (!selectedCourseId) return videos;
    return videos.filter(video => video.courseId === selectedCourseId);
  };
  
  // Get filtered files by course
  const getFilteredFiles = () => {
    if (!selectedCourseId) return files;
    return files.filter(file => file.courseId === selectedCourseId);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Conteúdo</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setViewMode('courses');
              setSelectedCourseId(null);
            }}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'courses' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cursos
          </button>
          <button
            onClick={() => setViewMode('videos')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'videos' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vídeos
          </button>
          <button
            onClick={() => setViewMode('files')}
            className={`px-3 py-1 rounded-md ${
              viewMode === 'files' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Arquivos
          </button>
        </div>
      </div>
      
      {/* Courses Section */}
      {viewMode === 'courses' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Cursos</h2>
            
            {!isAddingCourse && !editingCourseId && (
              <button
                onClick={() => setIsAddingCourse(true)}
                className="flex items-center bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md text-sm transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Novo Curso
              </button>
            )}
          </div>
          
          {(isAddingCourse || editingCourseId) && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isAddingCourse ? 'Adicionar Novo Curso' : 'Editar Curso'}
              </h3>
              
              <form onSubmit={isAddingCourse ? handleAddCourse : handleUpdateCourse}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="title" className="form-label">
                      Título
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="form-input"
                      placeholder="Digite o título do curso"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="form-label">
                      Descrição
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-input"
                      placeholder="Digite uma descrição para o curso"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="instructor" className="form-label">
                        Professor
                      </label>
                      <input
                        type="text"
                        id="instructor"
                        value={instructor}
                        onChange={(e) => setInstructor(e.target.value)}
                        className="form-input"
                        placeholder="Nome do professor"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="form-label">
                        Categoria
                      </label>
                      <select
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="imageUrl" className="form-label">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="form-input"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    {imageUrl && (
                      <div className="mt-2 h-32 w-full bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Imagem+Inválida')}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        resetCourseForm();
                        setIsAddingCourse(false);
                        setEditingCourseId(null);
                      }}
                      className="flex items-center btn-outline"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center btn-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isAddingCourse ? 'Adicionar' : 'Atualizar'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {courses.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">Nenhum curso cadastrado ainda.</p>
              <button
                onClick={() => setIsAddingCourse(true)}
                className="btn-primary"
              >
                Adicionar Primeiro Curso
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imagem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Professor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conteúdo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <img 
                            src={course.imageUrl} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50?text=Erro')}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getCategoryName(course.categoryId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {course.instructor}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <span className="flex items-center text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                            <Film className="h-3 w-3 mr-1" />
                            {course.videoIds.length}
                          </span>
                          <span className="flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full">
                            <FileText className="h-3 w-3 mr-1" />
                            {course.fileIds.length}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setViewMode('videos');
                            }}
                            className="text-purple-600 hover:text-purple-900"
                            title="Gerenciar vídeos"
                          >
                            <Film className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCourseId(course.id);
                              setViewMode('files');
                            }}
                            className="text-green-600 hover:text-green-900"
                            title="Gerenciar arquivos"
                          >
                            <FileText className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar curso"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir curso"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Videos Section */}
      {viewMode === 'videos' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-gray-800">Vídeos</h2>
              {selectedCourseId && (
                <span className="ml-2 text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  Curso: {getCourseName(selectedCourseId)}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedCourseId || ''}
                onChange={(e) => setSelectedCourseId(e.target.value || null)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Todos os cursos</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              
              {!isAddingVideo && !editingVideoId && (
                <button
                  onClick={() => {
                    if (!selectedCourseId && courses.length > 0) {
                      setSelectedCourseId(courses[0].id);
                    }
                    setIsAddingVideo(true);
                  }}
                  className={`flex items-center text-sm transition-colors ${
                    courses.length === 0
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-primary hover:bg-primary-dark text-white'
                  } px-3 py-1 rounded-md`}
                  disabled={courses.length === 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Vídeo
                </button>
              )}
            </div>
          </div>
          
          {(isAddingVideo || editingVideoId) && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isAddingVideo ? 'Adicionar Novo Vídeo' : 'Editar Vídeo'}
              </h3>
              
              <form onSubmit={isAddingVideo ? handleAddVideo : handleUpdateVideo}>
                <div className="grid grid-cols-1 gap-4">
                  {isAddingVideo && (
                    <div>
                      <label htmlFor="videoCourse\" className="form-label">
                        Curso
                      </label>
                      <select
                        id="videoCourse"
                        value={selectedCourseId || ''}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Selecione um curso</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="videoTitle" className="form-label">
                      Título
                    </label>
                    <input
                      type="text"
                      id="videoTitle"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="form-input"
                      placeholder="Digite o título do vídeo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="videoDescription" className="form-label">
                      Descrição
                    </label>
                    <textarea
                      id="videoDescription"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      className="form-input"
                      placeholder="Digite uma descrição para o vídeo"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="videoUrl" className="form-label">
                        URL do Vídeo
                      </label>
                      <input
                        type="url"
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="form-input"
                        placeholder="https://example.com/video.mp4"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="thumbnailUrl" className="form-label">
                        URL da Miniatura
                      </label>
                      <input
                        type="url"
                        id="thumbnailUrl"
                        value={thumbnailUrl}
                        onChange={(e) => setThumbnailUrl(e.target.value)}
                        className="form-input"
                        placeholder="https://example.com/thumbnail.jpg"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="duration" className="form-label">
                        Duração (segundos)
                      </label>
                      <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="form-input"
                        placeholder="Duração em segundos"
                        min="0"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="order" className="form-label">
                        Ordem
                      </label>
                      <input
                        type="number"
                        id="order"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value))}
                        className="form-input"
                        placeholder="Ordem do vídeo"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  
                  {thumbnailUrl && (
                    <div className="mt-2 h-32 w-full bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={thumbnailUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Imagem+Inválida')}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        resetVideoForm();
                        setIsAddingVideo(false);
                        setEditingVideoId(null);
                      }}
                      className="flex items-center btn-outline"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center btn-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isAddingVideo ? 'Adicionar' : 'Atualizar'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {courses.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">Você precisa criar um curso antes de adicionar vídeos.</p>
              <button
                onClick={() => {
                  setViewMode('courses');
                  setIsAddingCourse(true);
                }}
                className="btn-primary"
              >
                Criar Curso
              </button>
            </div>
          ) : getFilteredVideos().length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                {selectedCourseId 
                  ? 'Nenhum vídeo cadastrado para este curso.' 
                  : 'Nenhum vídeo cadastrado ainda.'}
              </p>
              <button
                onClick={() => setIsAddingVideo(true)}
                className="btn-primary"
              >
                Adicionar Primeiro Vídeo
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miniatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredVideos().map((video) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-10 rounded-md overflow-hidden">
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/50?text=Erro')}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {video.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getCourseName(video.courseId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {video.order}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditVideo(video)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Files Section */}
      {viewMode === 'files' && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-gray-800">Arquivos</h2>
              {selectedCourseId && (
                <span className="ml-2 text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  Curso: {getCourseName(selectedCourseId)}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={selectedCourseId || ''}
                onChange={(e) => setSelectedCourseId(e.target.value || null)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Todos os cursos</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              
              {!isAddingFile && !editingFileId && (
                <button
                  onClick={() => {
                    if (!selectedCourseId && courses.length > 0) {
                      setSelectedCourseId(courses[0].id);
                    }
                    setIsAddingFile(true);
                  }}
                  className={`flex items-center text-sm transition-colors ${
                    courses.length === 0
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-primary hover:bg-primary-dark text-white'
                  } px-3 py-1 rounded-md`}
                  disabled={courses.length === 0}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Arquivo
                </button>
              )}
            </div>
          </div>
          
          {(isAddingFile || editingFileId) && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isAddingFile ? 'Adicionar Novo Arquivo' : 'Editar Arquivo'}
              </h3>
              
              <form onSubmit={isAddingFile ? handleAddFile : handleUpdateFile}>
                <div className="grid grid-cols-1 gap-4">
                  {isAddingFile && (
                    <div>
                      <label htmlFor="fileCourse\" className="form-label">
                        Curso
                      </label>
                      <select
                        id="fileCourse"
                        value={selectedCourseId || ''}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="">Selecione um curso</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="fileTitle" className="form-label">
                      Título
                    </label>
                    <input
                      type="text"
                      id="fileTitle"
                      value={fileTitle}
                      onChange={(e) => setFileTitle(e.target.value)}
                      className="form-input"
                      placeholder="Digite o título do arquivo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fileDescription" className="form-label">
                      Descrição
                    </label>
                    <textarea
                      id="fileDescription"
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                      className="form-input"
                      placeholder="Digite uma descrição para o arquivo"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fileUrl" className="form-label">
                      URL do Arquivo
                    </label>
                    <input
                      type="url"
                      id="fileUrl"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      className="form-input"
                      placeholder="https://example.com/document.pdf"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fileType" className="form-label">
                        Tipo de Arquivo
                      </label>
                      <input
                        type="text"
                        id="fileType"
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value)}
                        className="form-input"
                        placeholder="application/pdf"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="fileSize" className="form-label">
                        Tamanho (bytes)
                      </label>
                      <input
                        type="number"
                        id="fileSize"
                        value={fileSize}
                        onChange={(e) => setFileSize(parseInt(e.target.value))}
                        className="form-input"
                        placeholder="Tamanho em bytes"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        resetFileForm();
                        setIsAddingFile(false);
                        setEditingFileId(null);
                      }}
                      className="flex items-center btn-outline"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </button>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center btn-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isAddingFile ? 'Adicionar' : 'Atualizar'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {courses.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">Você precisa criar um curso antes de adicionar arquivos.</p>
              <button
                onClick={() => {
                  setViewMode('courses');
                  setIsAddingCourse(true);
                }}
                className="btn-primary"
              >
                Criar Curso
              </button>
            </div>
          ) : getFilteredFiles().length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                {selectedCourseId 
                  ? 'Nenhum arquivo cadastrado para este curso.' 
                  : 'Nenhum arquivo cadastrado ainda.'}
              </p>
              <button
                onClick={() => setIsAddingFile(true)}
                className="btn-primary"
              >
                Adicionar Primeiro Arquivo
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Arquivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tamanho
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredFiles().map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center">
                          <FileText className="h-8 w-8 text-blue-500" />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {file.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {file.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {getCourseName(file.courseId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {file.fileType}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {file.fileSize < 1024 
                            ? `${file.fileSize} B` 
                            : file.fileSize < 1024 * 1024 
                              ? `${(file.fileSize / 1024).toFixed(1)} KB` 
                              : `${(file.fileSize / (1024 * 1024)).toFixed(1)} MB`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <a 
                            href={file.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-green-600 hover:text-green-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                          <button
                            onClick={() => handleEditFile(file)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminCourses;