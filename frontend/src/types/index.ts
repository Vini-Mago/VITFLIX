export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  enrolledCourses: string[];
  avatar?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  courseIds: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  instructor: string;
  imageUrl: string;
  videoIds: string[];
  fileIds: string[];
  createdAt: string;
}

export interface Video {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  order: number;
  createdAt: string;
}

export interface File {
  id: string;
  courseId: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface DataContextType {
  categories: Category[];
  courses: Course[];
  videos: Video[];
  files: File[];
  addCategory: (category: Omit<Category, 'id' | 'courseIds' | 'createdAt'>) => Promise<Category>;
  updateCategory: (categoryId: string, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'videoIds' | 'fileIds' | 'createdAt'>) => Promise<Course>;
  updateCourse: (courseId: string, data: Partial<Course>) => Promise<Course>;
  deleteCourse: (courseId: string) => Promise<void>;
  addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => Promise<Video>;
  updateVideo: (videoId: string, data: Partial<Video>) => Promise<Video>;
  deleteVideo: (videoId: string) => Promise<void>;
  addFile: (file: Omit<File, 'id' | 'createdAt'>) => Promise<File>;
  updateFile: (fileId: string, data: Partial<File>) => Promise<File>;
  deleteFile: (fileId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}