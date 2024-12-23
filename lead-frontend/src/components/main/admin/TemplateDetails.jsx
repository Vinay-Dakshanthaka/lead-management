import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import LeadDetails from './LeadDetails';

const TemplateDetails = ({ template, onBack }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Track the selected image

  useEffect(() => {
    fetchTemplateImages();
  }, []);

  const fetchTemplateImages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${baseURL}/api/whatsapp/getTemplateImagesByCounsellorId`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Filter images by the selected template name
      const filteredImages = response.data.templateImages.filter(
        (image) => image.template_name === template.name
      );

      setImages(filteredImages);
    } catch (err) {
      setError('Failed to fetch template images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image === selectedImage ? null : image); // Toggle selection
  };

  return (
    <div className="container my-4">
      <button className="btn btn-secondary mb-4" onClick={onBack}>
        Back to Templates
      </button>
      <h3 className="mb-4">{template.name} - Uploaded Images</h3>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {!loading && !error && (
        <div className="row">
          {images.length > 0 ? (
            images.map((image) => (
              <div className="col-md-4 col-sm-6 mb-4" key={image.id}>
                <div className="card h-100">
                  <img
                    src={image.image_url}
                    alt={image.template_name}
                    className="card-img-top"
                  />
                  <div className="card-body text-center">
                    <input
                      type="checkbox"
                      checked={selectedImage === image.image_url}
                      onChange={() => handleImageSelect(image.image_url)}
                    />{' '}
                    Select Image
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center w-100">No images found for this template.</div>
          )}
        </div>
      )}
      <LeadDetails selectedImage={selectedImage} templateName={template.name} templateLanguage={template.language}/>
    </div>
  );
};

export default TemplateDetails;
