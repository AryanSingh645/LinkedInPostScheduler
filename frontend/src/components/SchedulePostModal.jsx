import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DateTimePickerModal } from './DateTimePickerModal';

export function SchedulePostModal({ isOpen, onClose, onSubmit, post }) {
  const [images, setImages] = useState([]);
  const [text, settext] = useState('');
  const [schedule_time, setschedule_time] = useState(new Date());
  const [visibility, setVisibility] = useState('PUBLIC');
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  useEffect(() => {
    if (post) {
      setImages(post.images || []);
      settext(post.text || '');
      setschedule_time(post.schedule_time || new Date());
      setVisibility(post.visibility || 'PUBLIC');
    }
  }, [post]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare form data for multer
    const formData = new FormData();
    images.forEach((image) => {
        formData.append('gallery', image.file); // Append each image file
    });
    formData.append('text', text);
    formData.append('schedule_time', schedule_time.toISOString());
    formData.append('visibility', visibility);

    onSubmit(formData); // Pass formData to the onSubmit handler
    onClose();
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...newFiles]); // Add new files to the existing images array
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Schedule New Post</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img.preview} alt="Upload preview" className="w-full h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <input type="file" className="hidden" onChange={handleImageUpload} multiple accept="image/*" />
                  <Upload className="w-6 h-6 text-gray-400" />
                </label>
              </div>
            </div>

            {/* text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">text</label>
              <textarea
                value={text}
                onChange={(e) => settext(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your post text..."
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PUBLIC">Public</option>
                <option value="CONNECTIONS">Connections Only</option>
              </select>
            </div>

            {/* Schedule Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Time</label>
              <button
                type="button"
                onClick={() => setShowDateTimePicker(true)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <span className="text-gray-700">{format(schedule_time, 'PPP p')}</span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Post
              </button>
            </div>
          </form>
        </div>
      </div>

      <DateTimePickerModal
        isOpen={showDateTimePicker}
        onClose={() => setShowDateTimePicker(false)}
        onConfirm={setschedule_time}
        initialDateTime={schedule_time}
      />
    </div>
  );
}