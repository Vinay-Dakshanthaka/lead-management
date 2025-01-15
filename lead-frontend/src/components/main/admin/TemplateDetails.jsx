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

      console.log("Response : ", response.data)

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
            images.map((media) => {
              const isImage = /\.(png|jpe?g|gif|bmp|webp)$/i.test(media.image_url); // Check if it's an image
              const isVideo = /\.(mp4|webm|ogg|avi|mov|mkv)$/i.test(media.image_url); // Check if it's a video

              return (
                <div className="col-md-4 col-sm-6 mb-4" key={media.id}>
                  <div className="card h-100">
                    {isImage && (
                      <img
                        src={media.image_url}
                        alt={media.template_name}
                        className="card-img-top"
                      />
                    )}
                    {isVideo && (
                      <video
                        controls
                        className="card-img-top"
                        style={{ width: '100%', height: 'auto' }}
                      >
                        <source src={media.image_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    <div className="card-body text-center">
                      <input
                        type="checkbox"
                        checked={selectedImage === media.image_url}
                        onChange={() => handleImageSelect(media.image_url)}
                      />{' '}
                      Select {isImage ? 'Image' : 'Video'}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center w-100">No media found for this template.</div>
          )}
        </div>
      )}
      <LeadDetails selectedImage={selectedImage} template={template}/>
    </div>
  );
};

export default TemplateDetails;
