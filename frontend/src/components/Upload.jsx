// Upload.jsx
import { Download } from 'lucide-react';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

const Upload = ({ uploadedFiles, setUploadedFiles }) => {
  const onDrop = async (acceptedFiles) => {
  const uploaded = acceptedFiles.map((file) => {
    let detectedType = "Other";
    const name = file.name.toLowerCase();
    if (name.includes("prescription")) detectedType = "Prescription";
    else if (name.includes("report")) detectedType = "Report";
    else if (name.includes("bill")) detectedType = "Bill";
    else if (file.type.includes("pdf")) detectedType = "Report";
    else if (file.type.includes("image")) detectedType = "Prescription";

    const fileSizeMB = parseFloat((file.size / 1024 / 1024).toFixed(2));
    return { name: file.name, size: fileSizeMB, type: detectedType }; // Exclude preview
  });

  console.log('Sending data:', uploaded);
  const token = localStorage.getItem('token');
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(uploaded),
  });
  const data = await res.json();
  console.log('Response:', res.status, data);
  if (data.success) {
    setUploadedFiles([...uploadedFiles, ...data.data]);
    toast.success("File uploaded successfully!");
  } else {
    toast.error(`Upload failed: ${data.error || 'Server error'}`);
  }
};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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