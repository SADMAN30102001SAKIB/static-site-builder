"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function MediaLibrary({ onSelect, onClose }) {
  const [mediaItems, setMediaItems] = useState([
    // Sample media items that would normally come from a database
    // { id: '1', name: 'sample-1.jpg', url: 'https://via.placeholder.com/300x200?text=Sample+1', type: 'image', size: '24KB', uploadedAt: new Date().toISOString() },
  ]);
  
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'images', 'videos'
  
  // Filter media based on search and active tab
  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'images' && item.type === 'image') || 
                      (activeTab === 'videos' && item.type === 'video');
    return matchesSearch && matchesTab;
  });
  
  // Handle file upload with dropzone
  const onDrop = useCallback(acceptedFiles => {
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate upload completion
    setTimeout(() => {
      const newMediaItems = acceptedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        size: `${Math.round(file.size / 1024)}KB`,
        uploadedAt: new Date().toISOString(),
        file: file, // Keep the actual file object if needed
      }));
      
      setMediaItems(prev => [...newMediaItems, ...prev]);
      setIsUploading(false);
      setUploadProgress(0);
      clearInterval(interval);
    }, 3000);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    }
  });
  
  // Handle media selection
  const handleSelect = (media) => {
    setSelectedMedia(media.id === selectedMedia ? null : media.id);
  };
  
  // Handle confirmation of selection
  const handleConfirm = () => {
    const selected = mediaItems.find(item => item.id === selectedMedia);
    if (selected && onSelect) {
      onSelect(selected);
    }
    if (onClose) {
      onClose();
    }
  };
  
  // Handle media deletion
  const handleDelete = (id) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    if (selectedMedia === id) {
      setSelectedMedia(null);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Media Library</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4">
          <div className="flex space-x-2">
            <button 
              className={`px-4 py-2 text-sm rounded-md ${activeTab === 'all' ? 'bg-[rgb(var(--primary))] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setActiveTab('all')}
            >
              All Media
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${activeTab === 'images' ? 'bg-[rgb(var(--primary))] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setActiveTab('images')}
            >
              Images
            </button>
            <button 
              className={`px-4 py-2 text-sm rounded-md ${activeTab === 'videos' ? 'bg-[rgb(var(--primary))] text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </button>
          </div>
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>
      </div>
      
      {/* Upload Area */}
      <div className="px-6 py-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-[rgb(var(--primary))] bg-[rgb(var(--primary))/10]' : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <input {...getInputProps()} />
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag and drop files here, or click to select files
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            Support for images and videos
          </p>
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 dark:text-gray-300">Uploading...</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-[rgb(var(--primary))] h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Media Grid */}
      <div className="flex-grow px-6 py-4 overflow-y-auto">
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-gray-500 dark:text-gray-400">No media found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                onClick={() => handleSelect(media)}
                className={`relative rounded-lg overflow-hidden border ${
                  selectedMedia === media.id 
                    ? 'border-[rgb(var(--primary))] ring-2 ring-[rgb(var(--primary))]' 
                    : 'border-gray-200 dark:border-gray-700'
                } hover:opacity-90 cursor-pointer group`}
              >
                {media.type === 'image' ? (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={media.url}
                      alt={media.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center">
                    <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
                
                {/* Selected indicator */}
                {selectedMedia === media.id && (
                  <div className="absolute top-2 right-2 h-6 w-6 bg-[rgb(var(--primary))] rounded-full flex items-center justify-center text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                
                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(media.id);
                  }}
                  className="absolute top-2 left-2 h-8 w-8 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <div className="p-2 text-xs truncate">{media.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredMedia.length} items
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedMedia}
            className={`px-4 py-2 rounded-md ${
              selectedMedia
                ? 'bg-[rgb(var(--primary))] text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
