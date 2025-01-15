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
        <div className="card border-success mb-3" style={{ maxWidth: '400px', margin: '0' }}>
            <div className="card-header bg-success text-white">
                <h5 className="mb-0">{template.name}</h5>
            </div>
            <div className="card-body bg-light">
                {/* Header Section */}
                {headerComponent && headerComponent.format === 'IMAGE' && (
                    <div className="mb-3">
                        <img
                            src={image}
                            alt="Header"
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Body Section */}
                {bodyComponent && (
                    <p className="card-text" style={{ whiteSpace: 'pre-line' }}>
                        {bodyComponent.text}
                    </p>
                )}

                {/* Footer Section */}
                {footerComponent && (
                    <div className="text-muted">
                        <small>{footerComponent.text}</small>
                    </div>
                )}

                {/* Buttons Section */}
                {buttonComponent && buttonComponent.buttons && (
                    <div className="mt-3">
                        {buttonComponent.buttons.map((button, idx) => (
                            <div key={idx} className="d-grid gap-2">
                                {button.type === 'QUICK_REPLY' ? (
                                    <button className="btn btn-outline-success btn-sm">{button.text}</button>
                                ) : button.type === 'URL' ? (
                                    <a
                                        href={button.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        {button.text}
                                    </a>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplatePreview;
