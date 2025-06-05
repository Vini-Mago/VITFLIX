import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../hooks/useData';
import ReactPlayer from 'react-player';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { videos, courses, loading, error } = useData();
  const navigate = useNavigate();
  
  // Find the video
  const video = videos.find(v => v.id === videoId);
  
  // Get course
  const course = video ? courses.find(c => c.id === video.courseId) : undefined;
  
  // Get all videos from this course
  const courseVideos = course 
    ? videos
        .filter(v => v.courseId === course.id)
        .sort((a, b) => a.order - b.order)
    : [];
  
  // Find current video index
  const currentIndex = courseVideos.findIndex(v => v.id === videoId);
  
  // Get previous and next videos
  const prevVideo = currentIndex > 0 ? courseVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < courseVideos.length - 1 ? courseVideos[currentIndex + 1] : null;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-lg text-gray-600">Carregando...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <p>Erro ao carregar dados: {error}</p>
      </div>
    );
  }
  
  if (!video || !course) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
        <p>Vídeo não encontrado</p>
        <Link to="/" className="text-primary font-medium mt-2 inline-block">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <Link 
        to={`/curso/${course.id}`} 
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar para {course.title}
      </Link>
      
      <div className="bg-black rounded-xl overflow-hidden mb-4 aspect-video shadow-xl relative">
        <ReactPlayer
          url={video.videoUrl}
          width="100%"
          height="100%"
          controls={true}
          playing={true}
          playsinline={true}
          config={{
            youtube: {
              playerVars: { showinfo: 1 }
            },
            vimeo: {
              playerOptions: { title: true, byline: false, portrait: false }
            },
            file: {
              attributes: {
                controlsList: 'nodownload',
                onContextMenu: (e: React.MouseEvent) => e.preventDefault()
              }
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
        <p className="text-gray-600 mb-4">{video.description}</p>
        
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <div>
            {prevVideo && (
              <button
                onClick={() => navigate(`/video/${prevVideo.id}`)}
                className="inline-flex items-center text-sm text-primary hover:text-primary-dark"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior: {prevVideo.title}
              </button>
            )}
          </div>
          
          <div>
            {nextVideo && (
              <button
                onClick={() => navigate(`/video/${nextVideo.id}`)}
                className="inline-flex items-center text-sm text-primary hover:text-primary-dark"
              >
                Próximo: {nextVideo.title}
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Todos os vídeos deste curso</h2>
        
        <div className="space-y-2">
          {courseVideos.map(v => (
            <Link
              key={v.id}
              to={`/video/${v.id}`}
              className={`flex items-center p-2 rounded-md ${
                v.id === videoId 
                  ? 'bg-blue-50 text-primary border border-blue-100' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-xs font-medium text-gray-700">{v.order}</span>
              </div>
              <div className="flex-grow">
                <h3 className="text-sm font-medium">{v.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;