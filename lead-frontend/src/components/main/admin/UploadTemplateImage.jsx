import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  toast } from 'react-hot-toast';
import { baseURL } from '../../config';

const UploadTemplateImage = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch templates on mount
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await axios.get(`${baseURL}/api/whatsapp/listWhatsAppTemplates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Safely set state after the response
      setTemplates(response.data.templates.data || []);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError('Failed to fetch templates. Please try again.');
      toast.error('Failed to fetch templates.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!selectedTemplate) {
      toast.error('Please select a template.');
      return;
    }

    if (!imageFile) {
      toast.error('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('template_name', selectedTemplate);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await axios.post(
        `${baseURL}/api/whatsapp/uploadTemplateImage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Image uploaded successfully!');
      console.log('Uploaded Data:', response.data);
    } catch (err) {
      console.error('Error uploading image:', err);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Upload Template Image</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleImageUpload}>
        <div className="mb-3">
          <label htmlFor="templateSelect" className="form-label">
            Select Template
          </label>
          <select
            id="templateSelect"
            className="form-select"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="">-- Select a Template --</option>
            {templates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="imageUpload" className="form-label">
            Upload Image
          </label>
          <input
            type="file"
            className="form-control"
            id="imageUpload"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
};

export default UploadTemplateImage;
