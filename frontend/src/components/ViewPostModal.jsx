import React from 'react';
import { X } from 'lucide-react';
import { format } from 'date-fns';

export function ViewPostModal({ post, isOpen, onClose }) {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Post Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
            </div>

            {/* Schedule Time & Visibility */}
            <div className="flex flex-wrap gap-4 items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Scheduled for:</span>
                <span className="text-gray-600">{format(post.schedule_time, 'PPP p')}</span>
              </div>

              <span className={`px-3 py-1 rounded-full ${
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
    </div>
  );
}