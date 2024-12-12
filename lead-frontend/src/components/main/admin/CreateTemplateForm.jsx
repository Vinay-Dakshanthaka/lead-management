import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseURL } from "../../config";


const CreateTemplateForm = () => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [errorData, setErrorData] = useState(null);

  const handleCreateTemplate = async () => {
    setLoading(true);
    setResponseData(null);
    setErrorData(null);

    try {
      const response = await axios.post(`${baseURL}/api/whatsapp/create-template`);
      setResponseData(response.data);
      toast.success("Template created successfully!");
    } catch (error) {
      console.log(error)
      // const errorDetails = error.response?.data || error.message;
      const errorDetails = error.response?.data || error.message;
      setErrorData(errorDetails);
      toast.error("Failed to create template!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create WhatsApp Template</h2>
      <p>Click the button below to create a new WhatsApp template dynamically.</p>
      <button
        className="btn btn-primary"
        onClick={handleCreateTemplate}
        disabled={loading}
      >
        {loading ? "Processing..." : "Create Template"}
      </button>

      {/* Success Response */}
      {responseData && (
        <div className="mt-4 alert alert-success">
          <h5>Success!</h5>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}

      {/* Error Response */}
      {errorData && (
        <div className="mt-4 alert alert-danger">
          <h5>Error!</h5>
          {errorData.error && <p><strong>Error:</strong> {errorData.error}</p>}
          {errorData.details && (
            <pre className="bg-light p-2">{JSON.stringify(errorData.details, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateTemplateForm;
