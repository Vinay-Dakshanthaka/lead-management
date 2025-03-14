// import React, { useState } from "react";
// import { toast } from "react-hot-toast";
// import { sendBulkEmail, sendBulkEmailByExcel, sendBulkEmailsIndividually } from "./emailService";
// import EmailForm from "./EmailForm";
// import StatusList from "./StatusList";

// const BulkEmailSender = () => {
//     const [statusList, setStatusList] = useState([]);
//     const [isSending, setIsSending] = useState(false);

//     const handleSendEmails = async (formData, method) => {
//         setIsSending(true);
//         try {
//             let response;
//             if (method === "excel") {
//                 response = await sendBulkEmailByExcel(formData);
//             } else {
//                 response = await sendBulkEmailsIndividually(formData);
//             }
    
//             const failedEmails = response?.data?.failedEmails || [];
    
//             if (failedEmails.length > 0) {
//                 setStatusList(failedEmails);
//                 toast.error("Some emails failed to send.");
//             } else {
//                 toast.success("Emails sent successfully!");
//             }
//         } catch (error) {
//             toast.error("An error occurred while sending emails.");
//             console.error(error);
//         } finally {
//             setIsSending(false);
//         }
//     };
    

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center">Send Bulk Emails</h2>
//             <EmailForm onSubmit={handleSendEmails} isSending={isSending} />
//             <StatusList statusList={statusList} />
//         </div>
//     );
// };

// export default BulkEmailSender;



import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { sendBulkEmailByExcel, sendBulkEmailsIndividually } from "./emailService";
import EmailForm from "./EmailForm";
import StatusList from "./StatusList";

const BulkEmailSender = () => {
    const [statusList, setStatusList] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleSendEmails = async (formData, method) => {
        setIsSending(true);
        setProgress(0);
        try {
            let response;
            if (method === "excel") {
                response = await sendBulkEmailByExcel(formData, setProgress);
            } else {
                response = await sendBulkEmailsIndividually(formData, setProgress);
                console.log(sendBulkEmailsIndividually,"----------------------sendBulkEmailsIndividually")
            }
    
            const failedEmails = response?.data?.failedEmails || [];
            const sentEmails = response?.data?.sentEmails || [];
    
            const emailStatuses = [
                ...sentEmails.map(email => ({ email, status: "SENT" })),
                ...failedEmails.map(email => ({ email, status: "FAILED" }))
            ];
    
            setStatusList(emailStatuses);
    
            if (failedEmails.length > 0) {
                toast.error("Some emails failed to send.");
            } else {
                toast.success("Emails are sending in the background!");
            }
        } catch (error) {
            toast.error("An error occurred while sending emails.");
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };
    
    return (
        <div className="container mt-5">
            <h2 className="text-center">Send Bulk Emails</h2>
            {isSending && <p className="text-center">Progress: {progress}%</p>}
            <EmailForm onSubmit={handleSendEmails} isSending={isSending} />
            {/* <StatusList statusList={statusList} /> */}
        </div>
    );
};

export default BulkEmailSender;
