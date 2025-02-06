import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { baseURL } from "../../config";

const MailSender = () => {
  const { register, handleSubmit, reset } = useForm();
  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (data) => {
    if (isSending) {
      toast.warn("A task is already in progress. Please wait.");
      return;
    }

    if (!data.excelFile?.[0]) {
      toast.error("Please upload an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("from", data.from);
    formData.append("subject", data.subject);
    formData.append("text", data.text);
    formData.append("files", data.excelFile[0]); // Excel file

    // Append additional attachments
    if (data.attachments?.length > 0) {
      Array.from(data.attachments).forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      setIsSending(true);
      const response = await axios.post(
        `${baseURL}/api/email/send-bulk-email-excel`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setTaskId(response.data.taskId);
      toast.success("Emails are being sent. You can track the progress below.");
      reset(); // Reset the form after submission
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error while sending emails."
      );
    }
  };

  useEffect(() => {
    let interval;
    if (taskId) {
      setProgress(null); // Reset progress before polling starts

      interval = setInterval(async () => {
        try {
          const response = await axios.get(
            `${baseURL}/api/email/progress/${taskId}`
          );
          setProgress(response.data);

          if (response.data.progress === 100) {
            toast.success("All emails have been sent.");
            setTaskId(null);
            setIsSending(false);
            clearInterval(interval);
          }
        } catch (error) {
          toast.error("Error fetching progress.");
          clearInterval(interval);
        }
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Send Bulk Emails</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block font-medium">From</label>
          <input
            type="email"
            {...register("from", { required: true })}
            className="w-full p-2 border rounded"
            placeholder="Sender's Email Address"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Subject</label>
          <input
            type="text"
            {...register("subject", { required: true })}
            className="w-full p-2 border rounded"
            placeholder="Email Subject"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Text</label>
          <textarea
            {...register("text", { required: true })}
            className="w-full p-2 border rounded"
            placeholder="Email Content"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Upload Excel File</label>
          <input
            type="file"
            {...register("excelFile", { required: true })}
            className="w-full p-2 border rounded"
            accept=".xlsx, .xls"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Attachments (Optional)</label>
          <input
            type="file"
            {...register("attachments")}
            className="w-full p-2 border rounded"
            multiple
          />
        </div>

        <button
          type="submit"
          className={`${
            isSending ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-4 py-2 rounded`}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send Emails"}
        </button>
      </form>

      {progress && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Email Progress</h2>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p><strong>Total Emails:</strong> {progress.totalEmails}</p>
            <p><strong>Sent Emails:</strong> {progress.sentEmails}</p>
            <p><strong>Failed Emails:</strong> {progress.failedEmails}</p>
            <p>
              <strong>Progress:</strong> {progress.progress}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MailSender;
