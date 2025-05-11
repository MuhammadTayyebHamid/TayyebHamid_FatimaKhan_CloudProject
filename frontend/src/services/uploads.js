import api from './api';
import axios from 'axios';

export const getUploadUrl = async (fileType) => {
  const response = await api.post('/uploads/presigned-url', { fileType });
  return response.data;
};

export const uploadImage = async (file) => {
  const fileType = file.type;
  
  // Get a presigned URL
  const { uploadUrl, fileUrl } = await getUploadUrl(fileType);
  
  // Upload the file directly to S3
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': fileType
    }
  });
  
  return fileUrl;
};