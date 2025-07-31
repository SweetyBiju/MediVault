import { Download } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import axios from 'axios';

const Upload = ({ uploadedFiles, setUploadedFiles }) => {
  const onDrop = async (acceptedFiles) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to upload files.');
      return;
    }

    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      let detectedType = 'Other';
      const name = file.name.toLowerCase();
      if (name.includes('prescription')) detectedType = 'Prescription';
      else if (name.includes('report')) detectedType = 'Report';
      else if (name.includes('bill')) detectedType = 'Bill';
      else if (file.type.includes('pdf')) detectedType = 'Report';
      else if (file.type.includes('image')) detectedType = 'Prescription';

      formData.append('files', file);
      formData.append('type', detectedType); // Send type for each file
    });

    console.log('Sending data:', formData);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response:', res.status, res.data);
      if (res.data.success) {
        setUploadedFiles([...uploadedFiles, ...res.data.data]);
        toast.success('File uploaded successfully!');
      } else {
        toast.error(`Upload failed: ${res.data.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.error || 'Upload failed.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 h-[500px] transition hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
        Upload Prescriptions
      </h3>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-[1.02] duration-300 ${
          isDragActive
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 dark:text-gray-300 text-sm h-[300px]">
          {isDragActive ? 'Drop the files here...' : 'Drag & drop or click to upload prescriptions'}
        </p>
      </div>
    </div>
  );
};

export default Upload;