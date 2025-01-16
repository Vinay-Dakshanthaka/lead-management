import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import TemplateDetails from './TemplateDetails';
import UploadTemplateImage from './UploadTemplateImage';
import MessageStatusList from '../manageLead/MessageStatusList';

const TemplatesList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${baseURL}/api/whatsapp/listWhatsAppTemplates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTemplates(response.data.templates.data || []);
      console.log(response.data)
    } catch (err) {
      setError('Failed to fetch templates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <>
      {!selectedTemplate && <UploadTemplateImage />}
      <div className="container my-4">
        <h2 className="text-center mb-4">WhatsApp Message Templates</h2>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {!loading && !error && !selectedTemplate && (
          <div className="row">
            {templates.length > 0 ? (
             templates.map((template) => (
              <div className="col-lg-4 col-md-6 mb-4 mt-4" key={template.id}>
                <p className='h5'>{template.name}</p>
                <div className="card border-0 shadow h-100">
                  <div className="card-body p-3">
                    {/* Template Header */}
                    {template.components.find((component) => component.type === "HEADER") && (
                      <div className="mb-3">
                        {template.components
                          .filter((component) => component.type === "HEADER")
                          .map((header, index) => (
                            <div key={index}>
                              {header.format === "IMAGE" && (
                                <img
                                  src={header.example.header_handle[0]}
                                  alt="Header"
                                  className="img-fluid rounded"
                                />
                              )}
                              {header.format === "VIDEO" && (
                                <video
                                  src={header.example.header_handle[0]}
                                  className="img-fluid rounded"
                                  controls
                                >
                                  Your browser does not support the video tag.
                                </video>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
            
                    {/* Template Body */}
                    {template.components.find((component) => component.type === "BODY") && (
                      <div className="mb-3">
                        {template.components
                          .filter((component) => component.type === "BODY")
                          .map((body, index) => (
                            <div key={index}>
                              <p className="text-muted">{body.text}</p>
                              {body.example?.body_text && (
                                <p className="text-muted small">
                                  {body.example.body_text[0].map((text, idx) => (
                                    <span key={idx}>
                                      {text}
                                      {idx !== body.example.body_text[0].length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
            
                    {/* Template Footer */}
                    {template.components.find((component) => component.type === "FOOTER") && (
                      <div className="mt-3 text-muted small text-center">
                        {template.components
                          .filter((component) => component.type === "FOOTER")
                          .map((footer, index) => (
                            <p key={index}>{footer.text}</p>
                          ))}
                      </div>
                    )}
            
                    {/* Template Buttons */}
                    {template.components.find((component) => component.type === "BUTTONS") && (
                      <div className="mt-3">
                        {template.components
                          .filter((component) => component.type === "BUTTONS")
                          .map((buttonGroup, index) => (
                            <div key={index} className="d-flex flex-column gap-2">
                              {buttonGroup.buttons.map((button, btnIdx) => (
                                <button
                                  key={btnIdx}
                                  className={`btn disabled btn-sm ${
                                    button.type === "URL" ? "btn-outline-primary" : "btn-outline-secondary"
                                  }`} title={button.url}
                                  onClick={() => window.open(button.url, "_blank")}
                                >
                                  {button.text}
                                </button>
                              ))}
                            </div>
                          ))}
                      </div>
                    )}
            
                    {/* Select Button */}
                    <button
                      className="btn btn-success mt-3 w-100"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="text-center w-100">
                <p>No templates found.</p>
              </div>
            )}
          </div>
        )}
        {selectedTemplate && (
          <TemplateDetails
            template={selectedTemplate}
            onBack={() => setSelectedTemplate(null)}
          />
          
        )}

        {/* <MessageStatusList /> */}

      </div>
    </>
  );
};

export default TemplatesList;
