import axios from "axios";
import { baseURL } from "../../config";

export const sendBulkEmail = async (formData) => {
    try {
        const response = await axios.post(`${baseURL}/api/email/send-bulk-email`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        console.log(error)
        throw new Error(error.message || "Error sending bulk emails");
    }
};

// =================

// export const sendBulkEmailByExcel = async (formData) => {
//     try {
//         const response = await axios.post(`${baseURL}/api/email/send-bulk-email-excel`, formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw new Error(error.response?.data?.message || "Error sending bulk emails");
//     }
// };


// ==========================

// export const sendBulkEmailsIndividually = async (formData) => {
//     try {
//         const response = await axios.post(`${baseURL}/api/email/send-bulk-email-individual`, formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//         return response;
//     } catch (error) {
//         console.error(error);
//         throw new Error(error.response?.data?.message || "Error sending bulk emails");
//     }
// };

export const sendBulkEmailsIndividually = async (formData) => {
    try {
        const response = await axios.post(`${baseURL}/api/email/send-bulk-email-individual`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }, 
        });
        return response;
    } catch (error) {
        console.log("erroro: :",error)
        console.error("Error sending bulk emails:", error.message);
        throw new Error(error.response?.data?.message || "Failed to start email-sending process");
    }
};

export const getEmailSendingProgress = async (taskId) => {
    try {
        const response = await axios.get(`${baseURL}/api/email/progress/${taskId}`);
        console.log("response : task id ", response)
        return response;
    } catch (error) {
        console.error("Error fetching email progress:", error.message);
        throw new Error("Failed to fetch progress");
    }
};

// =-=-=-=-=-

// Function to send bulk emails from an Excel file
export const sendBulkEmailByExcel = async (formData, onProgress) => {
    try {
        const response = await axios.post(`${baseURL}/api/email/send-bulk-email-excel`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error sending bulk emails:", error);
        throw new Error(error.response?.data?.message || "Error sending bulk emails");
    }
};

// Function to check email sending progress
export const checkEmailProgress = async () => {
    try {
        const response = await axios.get(`${baseURL}/api/email/progress`);
        return response.data;
    } catch (error) {
        console.error("Error checking email progress:", error);
        throw new Error("Failed to fetch email sending progress");
    }
};
