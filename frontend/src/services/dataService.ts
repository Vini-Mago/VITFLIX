import axios from 'axios';
import { Category, Course, Video, File, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Assuming token is stored here by AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Functions --- (Moved logic primarily to AuthContext, but might need helpers)
// Registration is handled by AuthContext calling the API directly
// Login is handled by AuthContext calling the API directly

// --- User Functions --- (Mainly for Admin or Profile)

// Get current user profile
export const getMyProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/api/users/me');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    throw error;
  }
};

// Update current user profile
export const updateMyProfile = async (userData: Partial<Omit<User, 'id' | 'role' | 'password_hash' | 'enrolledCourses' | 'createdAt'>>): Promise<User> => {
  try {
    const response = await apiClient.put<User>('/api/users/me', userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error);
    throw error;
  }
};

// --- Admin User Functions ---
export const adminGetAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<User[]>('/api/users');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todos os usuários (admin):", error);
    throw error;
  }
};

export const adminGetUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get<User>(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário por ID (admin):", error);
    throw error;
  }
};

export const adminUpdateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put<User>(`/api/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuário (admin):", error);
    throw error;
  }
};

export const adminDeleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/users/${id}`);
  } catch (error) {
    console.error("Erro ao deletar usuário (admin):", error);
    throw error;
  }
};

// --- Category Functions ---
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>('/api/categories');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await apiClient.get<Category>(`/api/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categoria por ID:", error);
    throw error;
  }
};

export const createCategory = async (categoryData: Omit<Category, 'id' | 'courseIds' | 'createdAt' | 'course_count'>): Promise<Category> => {
  try {
    const response = await apiClient.post<Category>('/api/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, 'id' | 'courseIds' | 'createdAt' | 'course_count'>>): Promise<Category> => {
  try {
    const response = await apiClient.put<Category>(`/api/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/categories/${id}`);
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    throw error;
  }
};

// --- Course Functions ---
export const getCourses = async (categoryId?: string): Promise<Course[]> => {
  try {
    const params = categoryId ? { categoryId } : {};
    const response = await apiClient.get<Course[]>('/api/courses', { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    throw error;
  }
};

export const getCourseById = async (id: string): Promise<Course> => {
  try {
    // The backend route includes videos and files in the response
    const response = await apiClient.get<Course>(`/api/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar curso por ID:", error);
    throw error;
  }
};

export const createCourse = async (courseData: Omit<Course, 'id' | 'videoIds' | 'fileIds' | 'createdAt' | 'videos' | 'files' | 'category_title' | 'video_count' | 'file_count'>): Promise<Course> => {
  try {
    const response = await apiClient.post<Course>('/api/courses', courseData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    throw error;
  }
};

export const updateCourse = async (id: string, courseData: Partial<Omit<Course, 'id' | 'videoIds' | 'fileIds' | 'createdAt' | 'videos' | 'files' | 'category_title' | 'video_count' | 'file_count'>>): Promise<Course> => {
  try {
    const response = await apiClient.put<Course>(`/api/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/courses/${id}`);
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    throw error;
  }
};

// --- Video Functions --- (Often handled via getCourseById, but direct manipulation needed for Admin)

export const createVideo = async (videoData: Omit<Video, 'id' | 'createdAt'>): Promise<Video> => {
  try {
    const response = await apiClient.post<Video>('/api/videos', videoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar vídeo:", error);
    throw error;
  }
};

export const updateVideo = async (id: string, videoData: Partial<Omit<Video, 'id' | 'createdAt' | 'courseId'>>): Promise<Video> => {
  try {
    const response = await apiClient.put<Video>(`/api/videos/${id}`, videoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar vídeo:", error);
    throw error;
  }
};

export const deleteVideo = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/videos/${id}`);
  } catch (error) {
    console.error("Erro ao deletar vídeo:", error);
    throw error;
  }
};

// --- File Functions --- (Often handled via getCourseById, but direct manipulation needed for Admin)

// Creates the file metadata record in the DB
export const createFileRecord = async (fileData: Omit<File, 'id' | 'createdAt'>): Promise<File> => {
  try {
    const response = await apiClient.post<File>('/api/files', fileData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar registro de arquivo:", error);
    throw error;
  }
};

// Updates file metadata (title, description)
export const updateFileMetadata = async (id: string, fileData: Partial<Pick<File, 'title' | 'description'>>): Promise<File> => {
  try {
    const response = await apiClient.put<File>(`/api/files/${id}`, fileData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar metadados do arquivo:", error);
    throw error;
  }
};

export const deleteFile = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/files/${id}`);
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    throw error;
  }
};

// --- Upload Function ---
// Handles the actual file upload, returns file metadata including the URL
export const uploadFile = async (file: Blob, fieldName: string = 'file'): Promise<{ fileUrl: string; filePath: string; filename: string; mimetype: string; size: number }> => {
  const formData = new FormData();
  formData.append(fieldName, file);

  try {
    const response = await apiClient.post('/api/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer upload do arquivo:", error);
    throw error;
  }
};

// --- Enrollment Functions ---
export const enrollInCourse = async (courseId: string): Promise<any> => {
  try {
    const response = await apiClient.post('/api/enrollments', { courseId });
    return response.data;
  } catch (error) {
    console.error("Erro ao matricular no curso:", error);
    throw error;
  }
};

export const unenrollFromCourse = async (courseId: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/api/enrollments/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao cancelar matrícula:", error);
    throw error;
  }
};

export const getMyEnrolledCourses = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.get<Course[]>('/api/enrollments/my-courses');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar cursos matriculados:", error);
    throw error;
  }
};

export const checkEnrollment = async (courseId: string): Promise<{ isEnrolled: boolean }> => {
    try {
        const response = await apiClient.get<{ isEnrolled: boolean }>(`/api/enrollments/check/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao verificar matrícula:", error);
        throw error;
    }
};

// Remove localStorage specific functions and initialization
// const getData = <T>(key: string, defaultValue: T): T => { ... };
// const saveData = <T>(key: string, data: T): void => { ... };
// export const initializeData = (): void => { ... };

