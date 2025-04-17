import React from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

export function PostCard({ post, onEdit, onDelete, onView }) {
  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '...';
  };

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
        post.visibility === 'PUBLIC' ? 'bg-white' : 'bg-blue-50'
      }`}
    >
      <div className="relative cursor-pointer" onClick={() => onView(post)}>
        <img 
          src={post.images[0]} 
          alt="Post preview" 
          className="w-full h-48 object-cover"
        />
        {post.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
            +{post.images.length - 1}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-gray-700 mb-4">{truncateText(post.text, 150)}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(post)}
              className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(post)}
              className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs ${
              post.visibility === 'PUBLIC' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {post.visibility}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}