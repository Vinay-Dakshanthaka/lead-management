import React from 'react';

const TemplatePreview = ({ template, image }) => {
    if (!template) {
        return <p>No template data available</p>;
    }

    const { components } = template;

    // Extract template components
    const headerComponent = components.find(comp => comp.type === 'HEADER' && comp.format === 'IMAGE');
    const bodyComponent = components.find(comp => comp.type === 'BODY');
    const footerComponent = components.find(comp => comp.type === 'FOOTER');
    const buttonComponent = components.find(comp => comp.type === 'BUTTONS');

    return (
        <div className="col-lg-12 col-md-12 mb-4" key={template.id}>
        <div className="card border-success mb-3" style={{ maxWidth: '400px', margin: '0' }}>
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">{template.name}</h5>
          </div>
          <div className="card-body bg-light">
            {/* Header Section */}
            {template.components.find((component) => component.type === "HEADER" && component.format === "IMAGE") && (
              <div className="mb-3">
                {template.components
                  .filter((component) => component.type === "HEADER" && component.format === "IMAGE")
                  .map((header, index) => (
                    <img
                      key={index}
                      src={image ? image : header.example.header_handle[0]}
                      alt="Header"
                      className="img-fluid rounded"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  ))}
              </div>
            )}
    
            {/* Body Section */}
            {template.components.find((component) => component.type === "BODY") && (
              <div className="mb-3">
                {template.components
                  .filter((component) => component.type === "BODY")
                  .map((body, index) => (
                    <p key={index} className="card-text" style={{ whiteSpace: 'pre-line' }}>
                      {body.text}
                    </p>
                  ))}
              </div>
            )}
    
            {/* Footer Section */}
            {template.components.find((component) => component.type === "FOOTER") && (
              <div className="text-muted">
                {template.components
                  .filter((component) => component.type === "FOOTER")
                  .map((footer, index) => (
                    <small key={index}>{footer.text}</small>
                  ))}
              </div>
            )}
    
            {/* Buttons Section */}
            {template.components.find((component) => component.type === "BUTTONS") && (
              <div className="mt-3">
                {template.components
                  .filter((component) => component.type === "BUTTONS")
                  .map((buttonGroup, index) => (
                    <div key={index} className="d-grid gap-2">
                      {buttonGroup.buttons.map((button, btnIdx) => (
                        button.type === "QUICK_REPLY" ? (
                          <button key={btnIdx} className="btn btn-outline-success btn-sm">{button.text}</button>
                        ) : button.type === "URL" ? (
                          <a
                            key={btnIdx}
                            href={button.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm"
                          >
                            {button.text}
                          </a>
                        ) : null
                      ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default TemplatePreview;
