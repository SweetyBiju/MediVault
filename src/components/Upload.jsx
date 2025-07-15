// Upload.jsx
import { Download } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

const Upload = ({ uploadedFiles, setUploadedFiles }) => {
  const onDrop = (acceptedFiles) => {
    const uploaded = [];

    acceptedFiles.forEach((file) => {
      // 🔍 Auto-detect file type
      let detectedType = "Other";
      const name = file.name.toLowerCase();

      if (name.includes("prescription")) {
        detectedType = "Prescription";
      } else if (name.includes("report")) {
        detectedType = "Report";
      } else if (name.includes("bill")) {
        detectedType = "Bill";
      } else if (file.type.includes("pdf")) {
        detectedType = "Report";
      } else if (file.type.includes("image")) {
        detectedType = "Prescription";
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const expiry = Date.now() + 3600000; // 1 hour
      const preview = URL.createObjectURL(file);
      const fileSizeMB = parseFloat((file.size / 1024 / 1024).toFixed(2)); // MB

      const fileObj = {
        name: file.name,
        size: fileSizeMB,
        type: detectedType,
        date: new Date().toLocaleDateString(),
        otp,
        otpExpiry: expiry,
        preview,
      };

      uploaded.push(fileObj);

      // 🔄 Update cloudStorageUsed
      const currentStorage = parseFloat(localStorage.getItem('cloudStorageUsed') || '0');
      const newStorage = currentStorage + fileSizeMB;
      localStorage.setItem('cloudStorageUsed', newStorage.toFixed(2));
    });

    const updatedFiles = [...uploadedFiles, ...uploaded];
    setUploadedFiles(updatedFiles);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));

    toast.success("File uploaded successfully!");
  };



  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    setUploadedFiles(storedFiles);
  }, [setUploadedFiles]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 h-[500px] transition hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
        Upload Prescriptions
      </h3>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-[1.02] duration-300 ${isDragActive
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
