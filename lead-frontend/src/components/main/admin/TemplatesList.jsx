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
                <div className="col-md-4 col-sm-6 mb-4" key={template.id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{template.name}</h5>
                      <p className="card-text">
                        <strong>Language:</strong> {template.language}
                      </p>
                      <p className="card-text">
                        <strong>Status:</strong> {template.status}
                      </p>
                      <p className="card-text">
                        <strong>Category:</strong> {template.category}
                      </p>
                      <p className="card-text">
                        <strong>Components:</strong>
                      </p>
                      <ul>
                        {template.components.map((component, index) => (
                          <li key={index}>
                            <strong>Type:</strong> {component.type}
                            {component.type === 'HEADER' && (
                              <>
                                <br />
                                <strong>Header Media:</strong>
                                {component.format === 'IMAGE' && (
                                  <img
                                    src={component.example.header_handle[0]}
                                    alt="Header"
                                    className="img-fluid mt-2"
                                  />
                                )}
                                {component.format === 'VIDEO' && (
                                  <video
                                    src={component.example.header_handle[0]}
                                    className="img-fluid mt-2"
                                    controls
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </>
                            )}
                            {component.type === 'BODY' && (
                              <>
                                <br />
                                <strong>Text:</strong> {component.text}
                                {component.example?.body_text && (
                                  <>
                                    <br />
                                    <strong>Example:</strong>{' '}
                                    {component.example.body_text[0].map((text, idx) => (
                                      <span key={idx}>{text}{idx !== component.example.body_text[0].length - 1 ? ', ' : ''}</span>
                                    ))}
                                  </>
                                )}
                              </>
                            )}
                            {component.type === 'FOOTER' && (
                              <>
                                <br />
                                <strong>Text:</strong> {component.text}
                              </>
                            )}
                            {component.type === 'BUTTONS' && (
                              <>
                                <br />
                                <strong>Buttons:</strong>
                                <ul>
                                  {component.buttons.map((button, btnIdx) => (
                                    <li key={btnIdx}>
                                      <strong>Type:</strong> {button.type}
                                      <br />
                                      <strong>Text:</strong> {button.text}
                                      {button.url && (
                                        <>
                                          <br />
                                          <strong>URL:</strong> <a href={button.url} target="_blank" rel="noopener noreferrer">{button.url}</a>
                                        </>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        Select Template
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-100">No templates found.</div>
            )}

          </div>
        )}
        {selectedTemplate && (
          <TemplateDetails
            template={selectedTemplate}
            onBack={() => setSelectedTemplate(null)}
          />
        )}

        <MessageStatusList />

      </div>
    </>
  );
};

export default TemplatesList;
