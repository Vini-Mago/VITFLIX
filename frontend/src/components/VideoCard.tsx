import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '../types';
import { Play } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <Link 
      to={`/video/${video.id}`}
      className="flex flex-col md:flex-row gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 animate-fade-in"
    >
      <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <div className="bg-white/90 rounded-full p-2">
            <Play className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <h3 className="font-medium text-gray-900 line-clamp-1">{video.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
          {video.description}
        </p>
        <div className="flex items-center mt-2">
          <span className="text-xs text-gray-500">
            Aula {video.order}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;