import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { baseURL } from '../../config';

const UploadTemplateMedia = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [mediaType, setMediaType] = useState(''); // Image, Video, or None
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const response = await axios.get(`${baseURL}/api/whatsapp/listWhatsAppTemplates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTemplates(response.data.templates.data || []);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setError('Failed to fetch templates. Please try again.');
      toast.error('Failed to fetch templates.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (templateName) => {
    setSelectedTemplate(templateName);

    // Find the selected template
    const template = templates.find((t) => t.name === templateName);

    // Determine the required media type
    const headerComponent = template?.components.find((c) => c.type === 'HEADER');
    if (headerComponent) {
      setMediaType(headerComponent.format || 'None');
    } else {
      setMediaType('None');
    }
  };

  const handleMediaUpload = async (e) => {
    e.preventDefault();

    if (!selectedTemplate) {
        toast.error('Please select a template.');
        return;
    }

    if (!mediaFile) {
        toast.error('Please upload a media file (image or video).');
        return;
    }

    const formData = new FormData();
    formData.append('file', mediaFile); // Use 'file' to match the controller's expected field name
    formData.append('template_name', selectedTemplate);

    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        const response = await axios.post(
            `${baseURL}/api/whatsapp/uploadTemplateMedia`, // Match the backend route
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const fileType = mediaFile.type.startsWith('image/') ? 'Image' : 'Video';
        toast.success(`${fileType} uploaded successfully!`);
        console.log('Uploaded Data:', response.data);
    } catch (err) {
        console.error(`Error uploading media:`, err);
        const fileType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
        toast.error(`Failed to upload ${fileType}. Please try again.`);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Upload Template Media</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleMediaUpload}>
        <div className="mb-3">
          <label htmlFor="templateSelect" className="form-label">
            Select Template
          </label>
          <select
            id="templateSelect"
            className="form-select"
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            <option value="">-- Select a Template --</option>
            {templates.map((template) => {
              const headerComponent = template.components.find((c) => c.type === 'HEADER');
              const format = headerComponent?.format || 'None';
              const mediaMessage =
                format === 'IMAGE'
                  ? '(Requires Image)'
                  : format === 'VIDEO'
                  ? '(Requires Video)'
                  : '(No Media Required)';

              return (
                <option key={template.name} value={template.name}>
                  {template.name} {mediaMessage}
                </option>
              );
            })}
          </select>
        </div>

        {mediaType !== 'None' && (
          <div className="mb-3">
            <label htmlFor="mediaUpload" className="form-label">
              Upload {mediaType}
            </label>
            <input
              type="file"
              className="form-control"
              id="mediaUpload"
              accept={mediaType === 'IMAGE' ? 'image/*' : 'video/*'}
              onChange={(e) => setMediaFile(e.target.files[0])}
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Uploading...' : `Upload ${mediaType}`}
        </button>
      </form>
    </div>
  );
};

export default UploadTemplateMedia;
