// src/components/Admin/FileUpload.jsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFile, faCheckCircle, faTimesCircle, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { uploadDocument } from '../../services/api';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
      ];
      return validTypes.includes(file.type);
    });

    setFiles(prev => [...prev, ...validFiles]);
    setUploadStatus(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      await uploadDocument(formData);
      setUploadStatus({ type: 'success', message: 'Files uploaded successfully!' });
      setFiles([]);
    } catch (error) {
      setUploadStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Upload failed. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Upload Documents</h2>

        {/* Drag & Drop Zone */}
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
            dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-500/50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <motion.div
            animate={{ y: dragActive ? -10 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FontAwesomeIcon
              icon={faCloudUploadAlt}
              className={`text-6xl mb-4 ${dragActive ? 'text-purple-500' : 'text-gray-400'}`}
            />
            <p className="text-white text-lg font-semibold mb-2">
              {dragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-gray-400 text-sm">
              or click to browse
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Supported: PDF, DOCX, DOC, XLSX, XLS, TXT
            </p>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            className="hidden"
          />
        </motion.div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <h3 className="text-white font-semibold mb-3">Selected Files ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FontAwesomeIcon icon={faFile} className="text-purple-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-gray-400 text-xs">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 ml-3"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={uploading}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Upload Files'
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Status */}
        <AnimatePresence>
          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-4 p-4 rounded-lg border flex items-center ${
                uploadStatus.type === 'success'
                  ? 'bg-green-500/20 border-green-500/50 text-green-200'
                  : 'bg-red-500/20 border-red-500/50 text-red-200'
              }`}
            >
              <FontAwesomeIcon
                icon={uploadStatus.type === 'success' ? faCheckCircle : faTimesCircle}
                className="mr-3 text-xl"
              />
              <p>{uploadStatus.message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FileUpload;
