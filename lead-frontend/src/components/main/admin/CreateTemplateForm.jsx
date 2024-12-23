// import React, { useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { baseURL } from "../../config";


// const CreateTemplateForm = () => {
//   const [loading, setLoading] = useState(false);
//   const [responseData, setResponseData] = useState(null);
//   const [errorData, setErrorData] = useState(null);

//   const handleCreateTemplate = async () => {
//     setLoading(true);
//     setResponseData(null);
//     setErrorData(null);

//     try {
//       const response = await axios.post(`${baseURL}/api/whatsapp/create-template`);
//       setResponseData(response.data);
//       toast.success("Template created successfully!");
//     } catch (error) {
//       console.log(error)
//       // const errorDetails = error.response?.data || error.message;
//       const errorDetails = error.response?.data || error.message;
//       setErrorData(errorDetails);
//       toast.error("Failed to create template!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Create WhatsApp Template</h2>
//       <p>Click the button below to create a new WhatsApp template dynamically.</p>
//       <button
//         className="btn btn-primary"
//         onClick={handleCreateTemplate}
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Create Template"}
//       </button>

//       {/* Success Response */}
//       {responseData && (
//         <div className="mt-4 alert alert-success">
//           <h5>Success!</h5>
//           <pre>{JSON.stringify(responseData, null, 2)}</pre>
//         </div>
//       )}

//       {/* Error Response */}
//       {errorData && (
//         <div className="mt-4 alert alert-danger">
//           <h5>Error!</h5>
//           {errorData.error && <p><strong>Error:</strong> {errorData.error}</p>}
//           {errorData.details && (
//             <pre className="bg-light p-2">{JSON.stringify(errorData.details, null, 2)}</pre>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateTemplateForm;


// import React, { useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { baseURL } from "../../config";
// import toast from "react-hot-toast";

// const CreateTemplateForm = () => {
//   const [bodyText, setBodyText] = useState("");
//   const [image, setImage] = useState(null);
//   const [buttons, setButtons] = useState([{ type: "QUICK_REPLY", text: "" }]);
//   const [loading, setLoading] = useState(false);

//   const handleAddButton = () => {
//     setButtons([...buttons, { type: "QUICK_REPLY", text: "" }]);
//   };

//   const handleRemoveButton = (index) => {
//     setButtons(buttons.filter((_, i) => i !== index));
//   };

//   const handleButtonChange = (index, value) => {
//     const updatedButtons = [...buttons];
//     updatedButtons[index].text = value;
//     setButtons(updatedButtons);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!bodyText || !image) {
//       toast.error("Please fill all required fields!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("bodyText", bodyText);
//     formData.append("image", image);
//     formData.append("buttons", JSON.stringify(buttons));

//     setLoading(true);

//     try {
//       const response = await axios.post(`${baseURL}/api/whatsApp/create-template`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Template created successfully!");
//       console.log("Response:", response.data);
//     } catch (error) {
//       console.error("Error:", error.response?.data || error.message);
//       toast.error("Failed to create template. Check the console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h3>Create WhatsApp Template</h3>
//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         {/* Body Text */}
//         <div className="mb-3">
//           <label htmlFor="bodyText" className="form-label">
//             Body Text <span className="text-danger">*</span>
//           </label>
//           <textarea
//             className="form-control"
//             id="bodyText"
//             rows="3"
//             value={bodyText}
//             onChange={(e) => setBodyText(e.target.value)}
//             required
//           ></textarea>
//         </div>

//         {/* Image Upload */}
//         <div className="mb-3">
//           <label htmlFor="image" className="form-label">
//             Upload Image <span className="text-danger">*</span>
//           </label>
//           <input
//             className="form-control"
//             type="file"
//             id="image"
//             accept="image/*"
//             onChange={(e) => setImage(e.target.files[0])}
//             required
//           />
//         </div>

//         {/* Buttons */}
//         <div className="mb-3">
//           <label className="form-label">Buttons</label>
//           {buttons.map((button, index) => (
//             <div key={index} className="d-flex align-items-center mb-2">
//               <input
//                 type="text"
//                 className="form-control me-2"
//                 placeholder="Enter button text"
//                 value={button.text}
//                 onChange={(e) => handleButtonChange(index, e.target.value)}
//                 required
//               />
//               <button
//                 type="button"
//                 className="btn btn-danger"
//                 onClick={() => handleRemoveButton(index)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             className="btn btn-primary mt-2"
//             onClick={handleAddButton}
//           >
//             Add Button
//           </button>
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="btn btn-success" disabled={loading}>
//           {loading ? "Creating Template..." : "Create Template"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateTemplateForm;




// dynamic text template 

import React, { useState } from "react";
// import axios from "axios";
// import { baseURL } from "../../config";
// import toast from "react-hot-toast";
import TemplatesList from "./TemplatesList";

const CreateWhatsAppTemplate = () => {
  // const [templateName, setTemplateName] = useState("");
  // const [category, setCategory] = useState("UTILITY");
  // const [language, setLanguage] = useState("en_US");
  // const [bodyText, setBodyText] = useState("");
  // const [button1, setButton1] = useState("");
  // const [button2, setButton2] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState(null);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setErrorMessage(null); // Clear previous errors
  //   setIsLoading(true);

  //   if (!templateName || !bodyText || !button1) {
  //     toast.error("Please fill in all required fields.");
  //     setIsLoading(false);
  //     return;
  //   }

  //   const buttons = [button1, button2].filter(Boolean); // Filter out empty buttons

  //   const templateData = {
  //     name: templateName,
  //     category,
  //     language,
  //     bodyText,
  //     buttons,
  //   };

  //   try {
  //     const response = await axios.post(`${baseURL}/api/whatsapp/create-template`, templateData);
  //     toast.success("Template created successfully!");
  //     console.log(response.data);
  //     setTemplateName("");
  //     setCategory("UTILITY");
  //     setLanguage("en_US");
  //     setBodyText("");
  //     setButton1("");
  //     setButton2("");
  //   } catch (error) {
  //     console.error("Error creating template:", error.response?.data || error.message);
  //     setErrorMessage(error.response?.data || "Failed to create template.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <>
    {/* <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="text-center mb-4">Create WhatsApp Template</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="templateName" className="form-label">
                Template Name <span className="text-danger">(*)</span>
              </label>
              <input
                type="text"
                id="templateName"
                className="form-control"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="bodyText" className="form-label">
                Template Body Text <span className="text-danger">(*)</span>
              </label>
              <textarea
                id="bodyText"
                className="form-control"
                rows="4"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="button1" className="form-label">
                Button 1 Text <span className="text-danger">(*)</span>
              </label>
              <input
                type="text"
                id="button1"
                className="form-control"
                value={button1}
                onChange={(e) => setButton1(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="button2" className="form-label">
                Button 2 Text (Optional)
              </label>
              <input
                type="text"
                id="button2"
                className="form-control"
                value={button2}
                onChange={(e) => setButton2(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Template Category
              </label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="UTILITY">UTILITY</option>
                <option value="MARKETING">MARKETING</option>
                <option value="TRANSACTIONAL">TRANSACTIONAL</option>
              </select>
            </div>

            {errorMessage && (
              <div className="alert alert-danger">
                <strong>Error:</strong> {JSON.stringify(errorMessage, null, 2)}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Create Template"
              )}
            </button>
          </form>
        </div>
      </div>
    </div> */}
      <TemplatesList />
    </>
  );
};

export default CreateWhatsAppTemplate;


// template with image 

// import React, { useState } from "react";
// import axios from "axios";
// import { baseURL } from "../../config";
// import toast from "react-hot-toast";
// import TemplatesList from "./TemplatesList";

// const CreateWhatsAppTemplate = () => {
//   const [templateName, setTemplateName] = useState("");
//   const [category, setCategory] = useState("UTILITY");
//   const [language, setLanguage] = useState("en_US");
//   const [bodyText, setBodyText] = useState("");
//   const [button1, setButton1] = useState("");
//   const [button2, setButton2] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [headerMediaId, setHeaderMediaId] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(null);

//   const handleImageUpload = async () => {
//     if (!imageFile) {
//       toast.error("Please select an image file first.");
//       return;
//     }

//     setIsUploading(true);
//     try {
//       const formData = new FormData();
//       formData.append("image", imageFile); // Use 'image' to match the Multer field
      

//       const response = await axios.post(`${baseURL}/api/whatsapp/upload-media`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setHeaderMediaId(response.data.mediaId);
//       toast.success("Image uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading image:", error.response?.data || error.message);
//       toast.error("Failed to upload image.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrorMessage(null);
//     setIsLoading(true);

//     if (!templateName || !bodyText || !button1 || (imageFile && !headerMediaId)) {
//       const errorMessage =
//         !templateName ? "Template Name is required." :
//         !bodyText ? "Body Text is required." :
//         !button1 ? "Button 1 Text is required." :
//         !headerMediaId ? "Please upload an image and complete the upload." :
//         "Please complete all required fields.";
//       toast.error(errorMessage);
//       setIsLoading(false);
//       return;
//     }
    

//     const templateData = {
//       name: templateName,
//       category,
//       language,
//       bodyText,
//       buttons: [button1, button2].filter(Boolean),
//       headerMediaId: headerMediaId || null,
//     };

//     try {
//       const response = await axios.post(`${baseURL}/api/whatsapp/create-template`, templateData);
//       toast.success("Template created successfully!");
//       console.log(response.data);

//       // Reset the form fields
//       setTemplateName("");
//       setCategory("UTILITY");
//       setLanguage("en_US");
//       setBodyText("");
//       setButton1("");
//       setButton2("");
//       setImageFile(null);
//       setHeaderMediaId("");
//     } catch (error) {
//       console.error("Error creating template:", error.response?.data || error.message);
//       setErrorMessage(error.response?.data || "Failed to create template.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="card shadow-lg">
//         <div className="card-body">
//           <h2 className="text-center mb-4">Create WhatsApp Template</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label htmlFor="templateName" className="form-label">
//                 Template Name <span className="text-danger">(*)</span>
//               </label>
//               <input
//                 type="text"
//                 id="templateName"
//                 className="form-control"
//                 value={templateName}
//                 onChange={(e) => setTemplateName(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="bodyText" className="form-label">
//                 Template Body Text <span className="text-danger">(*)</span>
//               </label>
//               <textarea
//                 id="bodyText"
//                 className="form-control"
//                 rows="4"
//                 value={bodyText}
//                 onChange={(e) => setBodyText(e.target.value)}
//                 required
//               ></textarea>
//             </div>

//             <div className="mb-3">
//               <label htmlFor="button1" className="form-label">
//                 Button 1 Text <span className="text-danger">(*)</span>
//               </label>
//               <input
//                 type="text"
//                 id="button1"
//                 className="form-control"
//                 value={button1}
//                 onChange={(e) => setButton1(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="button2" className="form-label">
//                 Button 2 Text (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="button2"
//                 className="form-control"
//                 value={button2}
//                 onChange={(e) => setButton2(e.target.value)}
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="imageFile" className="form-label">
//                 Upload Image File (Optional)
//               </label>
//               <input
//                 type="file"
//                 id="imageFile"
//                 className="form-control"
//                 onChange={(e) => setImageFile(e.target.files[0])}
//               />
//               <button
//                 type="button"
//                 className="btn btn-secondary mt-2"
//                 onClick={handleImageUpload}
//                 disabled={isUploading}
//               >
//                 {isUploading ? (
//                   <span
//                     className="spinner-border spinner-border-sm me-2"
//                     role="status"
//                     aria-hidden="true"
//                   ></span>
//                 ) : (
//                   "Upload Image"
//                 )}
//               </button>
//             </div>

//             <div className="mb-3">
//               <label htmlFor="category" className="form-label">
//                 Template Category
//               </label>
//               <select
//                 id="category"
//                 className="form-select"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 <option value="UTILITY">UTILITY</option>
//                 <option value="MARKETING">MARKETING</option>
//                 <option value="TRANSACTIONAL">TRANSACTIONAL</option>
//               </select>
//             </div>

//             {errorMessage && (
//               <div className="alert alert-danger">
//                 <strong>Error:</strong> {JSON.stringify(errorMessage, null, 2)}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="btn btn-primary w-100"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <span
//                   className="spinner-border spinner-border-sm me-2"
//                   role="status"
//                   aria-hidden="true"
//                 ></span>
//               ) : (
//                 "Create Template"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//       <TemplatesList />
//     </div>
//   );
// };

// export default CreateWhatsAppTemplate;
