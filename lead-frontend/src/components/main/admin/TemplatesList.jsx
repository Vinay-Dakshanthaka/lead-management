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
                <div className="col-lg-4 col-md-6 mb-4" key={template.id}>
                  <div className="card border-0 shadow h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">{template.name}</h5>
                        <span
                          className={`badge ${template.status === "APPROVED"
                              ? "bg-success"
                              : template.status === "PENDING"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                            }`}
                        >
                          {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                        </span>
                      </div>
                      <p className="card-text mb-2">
                        <strong>Language:</strong> {template.language}
                      </p>
                      <p className="card-text mb-2">
                        <strong>Category:</strong> {template.category}
                      </p>
                      <p className="card-text mb-2">
                        <strong>Components:</strong>
                      </p>
                      <ul className="list-group list-group-flush">
                        {template.components.map((component, index) => (
                          <li className="list-group-item" key={index}>
                            <strong>Type:</strong> {component.type}
                            {component.type === "HEADER" && (
                              <div className="mt-2">
                                <strong>Header Media:</strong>
                                {component.format === "IMAGE" && (
                                  <img
                                    src={component.example.header_handle[0]}
                                    alt="Header"
                                    className="img-fluid rounded mt-2"
                                  />
                                )}
                                {component.format === "VIDEO" && (
                                  <video
                                    src={component.example.header_handle[0]}
                                    className="img-fluid rounded mt-2"
                                    controls
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </div>
                            )}
                            {component.type === "BODY" && (
                              <div className="mt-2">
                                <strong>Text:</strong> {component.text}
                                {component.example?.body_text && (
                                  <div>
                                    <strong>Example:</strong>{" "}
                                    {component.example.body_text[0].map((text, idx) => (
                                      <span key={idx}>
                                        {text}
                                        {idx !== component.example.body_text[0].length - 1
                                          ? ", "
                                          : ""}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                            {component.type === "FOOTER" && (
                              <div className="mt-2">
                                <strong>Text:</strong> {component.text}
                              </div>
                            )}
                            {component.type === "BUTTONS" && (
                              <div className="mt-2">
                                <strong>Buttons:</strong>
                                <ul>
                                  {component.buttons.map((button, btnIdx) => (
                                    <li key={btnIdx}>
                                      <strong>Type:</strong> {button.type}
                                      <br />
                                      <strong>Text:</strong> {button.text}
                                      {button.url && (
                                        <div>
                                          <strong>URL:</strong>{" "}
                                          <a
                                            href={button.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {button.url}
                                          </a>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="btn btn-primary mt-3 w-100"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        Select Template
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
