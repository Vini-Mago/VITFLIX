import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Category, Course, Video, File, DataContextType
} from '../types';
import {
  getCategories as apiGetCategories,
  getCourses as apiGetCourses,
  // getVideosByCourse, // Videos are fetched within getCourseById
  // getFilesByCourse, // Files are fetched within getCourseById
  createCategory as apiCreateCategory,
  updateCategory as apiUpdateCategory,
  deleteCategory as apiDeleteCategory,
  createCourse as apiCreateCourse,
  updateCourse as apiUpdateCourse,
  deleteCourse as apiDeleteCourse,
  createVideo as apiCreateVideo,
  updateVideo as apiUpdateVideo,
  deleteVideo as apiDeleteVideo,
  createFileRecord as apiCreateFileRecord, // Renamed in service
  updateFileMetadata as apiUpdateFileMetadata, // Renamed in service
  deleteFile as apiDeleteFile,
  // initializeData is removed - backend handles initialization
} from '../services/dataService';

// Default values - updated to reflect async nature
const defaultDataContext: DataContextType = {
  categories: [],
  courses: [],
  // Videos and Files are typically part of a specific Course object fetched from API
  // Maintaining separate top-level states for all videos/files might be inefficient
  videos: [], // Keep for now, but might be removed or refactored
  files: [], // Keep for now, but might be removed or refactored
  addCategory: async () => { throw new Error('Not implemented'); return {} as Category; },
  updateCategory: async () => { throw new Error('Not implemented'); return {} as Category; },
  deleteCategory: async () => { throw new Error('Not implemented'); },
  addCourse: async () => { throw new Error('Not implemented'); return {} as Course; },
  updateCourse: async () => { throw new Error('Not implemented'); return {} as Course; },
  deleteCourse: async () => { throw new Error('Not implemented'); },
  addVideo: async () => { throw new Error('Not implemented'); return {} as Video; },
  updateVideo: async () => { throw new Error('Not implemented'); return {} as Video; },
  deleteVideo: async () => { throw new Error('Not implemented'); },
  addFile: async () => { throw new Error('Not implemented'); return {} as File; }, // Corresponds to createFileRecord
  updateFile: async () => { throw new Error('Not implemented'); return {} as File; }, // Corresponds to updateFileMetadata
  deleteFile: async () => { throw new Error('Not implemented'); },
  loading: true, // Start loading true
  error: null,
  refreshData: async () => { throw new Error('Not implemented'); }, // Add refresh function
};

// Create context
export const DataContext = createContext<DataContextType>(defaultDataContext);

// Provider component
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  // Removed top-level videos and files state as they are part of courses now
  // const [videos, setVideos] = useState<Video[]>([]); 
  // const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to load initial data (categories and courses)
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch categories and courses in parallel
      const [fetchedCategories, fetchedCourses] = await Promise.all([
        apiGetCategories(),
        apiGetCourses(), // Fetch all courses initially
      ]);
      setCategories(fetchedCategories);
      setCourses(fetchedCourses);
    } catch (err) {
      console.error("Erro ao carregar dados iniciais:", err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Refresh function to reload data on demand
  const refreshData = useCallback(async () => {
      await loadInitialData();
  }, [loadInitialData]);

  // --- CRUD Function Implementations --- 
  // Wrap API calls and update local state upon success

  const addCategory = async (categoryData: Omit<Category, 'id' | 'courseIds' | 'createdAt' | 'course_count'>): Promise<Category> => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await apiCreateCategory(categoryData);
      // Refresh data to get updated list with counts
      await refreshData(); 
      return newCategory; 
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Erro ao adicionar categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (categoryId: string, categoryData: Partial<Omit<Category, 'id' | 'courseIds' | 'createdAt' | 'course_count'>>): Promise<Category> => {
    setLoading(true);
    setError(null);
    try {
      const updatedCategory = await apiUpdateCategory(categoryId, categoryData);
      // Refresh data to get updated list
      await refreshData();
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteCategory(categoryId);
      // Refresh data to reflect deletion and potential course updates
      await refreshData(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCourse = async (courseData: Omit<Course, 'id' | 'videoIds' | 'fileIds' | 'createdAt' | 'videos' | 'files' | 'category_title' | 'video_count' | 'file_count'>): Promise<Course> => {
    setLoading(true);
    setError(null);
    try {
      const newCourse = await apiCreateCourse(courseData);
      // Refresh data to get updated list
      await refreshData();
      return newCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar curso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (courseId: string, courseData: Partial<Omit<Course, 'id' | 'videoIds' | 'fileIds' | 'createdAt' | 'videos' | 'files' | 'category_title' | 'video_count' | 'file_count'>>): Promise<Course> => {
    setLoading(true);
    setError(null);
    try {
      const updatedCourse = await apiUpdateCourse(courseId, courseData);
      // Refresh data to get updated list
      await refreshData();
      return updatedCourse;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar curso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteCourse(courseId);
      // Refresh data to reflect deletion
      await refreshData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar curso');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Video and File operations often modify a specific course.
  // Instead of managing global video/file state, we might rely on refreshing 
  // the specific course data where the change happened, or refreshing all courses.
  // For simplicity, we'll refresh all data for now after these operations.

  const addVideo = async (videoData: Omit<Video, 'id' | 'createdAt'>): Promise<Video> => {
    setLoading(true);
    setError(null);
    try {
      const newVideo = await apiCreateVideo(videoData);
      await refreshData(); // Refresh all data
      return newVideo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar vídeo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateVideo = async (videoId: string, videoData: Partial<Omit<Video, 'id' | 'createdAt' | 'courseId'>>): Promise<Video> => {
    setLoading(true);
    setError(null);
    try {
      const updatedVideo = await apiUpdateVideo(videoId, videoData);
      await refreshData(); // Refresh all data
      return updatedVideo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar vídeo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (videoId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteVideo(videoId);
      await refreshData(); // Refresh all data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar vídeo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // File functions (mapping to renamed service functions)
  const addFile = async (fileData: Omit<File, 'id' | 'createdAt'>): Promise<File> => {
    setLoading(true);
    setError(null);
    try {
      const newFile = await apiCreateFileRecord(fileData);
      await refreshData(); // Refresh all data
      return newFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar arquivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFile = async (fileId: string, fileData: Partial<Pick<File, 'title' | 'description'>>): Promise<File> => {
    setLoading(true);
    setError(null);
    try {
      const updatedFile = await apiUpdateFileMetadata(fileId, fileData);
      await refreshData(); // Refresh all data
      return updatedFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar arquivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteFile(fileId);
      await refreshData(); // Refresh all data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar arquivo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        courses,
        videos: [], // Provide empty array or refactor components needing this
        files: [], // Provide empty array or refactor components needing this
        addCategory,
        updateCategory,
        deleteCategory,
        addCourse,
        updateCourse,
        deleteCourse,
        addVideo,
        updateVideo,
        deleteVideo,
        addFile,
        updateFile,
        deleteFile,
        loading,
        error,
        refreshData, // Expose refresh function
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

