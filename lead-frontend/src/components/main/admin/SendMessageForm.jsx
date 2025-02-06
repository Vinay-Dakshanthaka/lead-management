import React, { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import toast from 'react-hot-toast';
import { Alert } from 'react-bootstrap';

const SendMessageForm = ({ template, selectedImage }) => {
    const [phoneNumbers, setPhoneNumbers] = useState('');
    const [messageStatus, setMessageStatus] = useState({});
    const [hasAttemptedSend, setHasAttemptedSend] = useState(false);

    console.log("received template data : ", template)
    console.log("Received Image : ", selectedImage)

    const sendMessage = async (phoneNumber) => {
        const to = `91${phoneNumber}`;
        const payload = {
            to,
            templateName: template.name,
            languageCode: template.language,
            userName: 'Lead',
            mediaUrl: selectedImage,
            parameterCount: 0,
            textBody: '',
            websiteLink: 'https://lara.co.in',
        };

        try {
            console.log("To ", payload.to)
            const response = await axios.post(

                `${baseURL}/api/whatsapp/sendMediaTemplate`,
                { ...payload },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setMessageStatus((prev) => ({
                ...prev,
                [phoneNumber]: 'success',
            }));
            toast.success(`Message sent to ${phoneNumber}`);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessageStatus((prev) => ({
                ...prev,
                [phoneNumber]: 'failure',
            }));
            toast.error(`Failed to send message to ${phoneNumber}`);
        }
    };

    const handleSendMessage = async () => {
        setHasAttemptedSend(true);
        const numbers = phoneNumbers.split(/[,\s]+/);
        numbers.forEach(async (phoneNumber) => {
            if (phoneNumber.trim()) {
                await sendMessage(phoneNumber.trim());
            }
        });
    };

    const handlePhoneChange = (e) => {
        setPhoneNumbers(e.target.value);
    };

    return (
        <div className="row">
            <Alert variant='warning' style={{ padding: '20px', borderRadius: '5px', backgroundColor: '#fff3cd', color: '#856404' }}>
                <strong>Note:</strong>
                <p style={{ margin: '10px 0' }}>
                    Please provide the numbers in one of the following formats:
                </p>
                <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
                    <li>Comma-separated: <code>1234567890,1234567890</code></li>
                    <li>Space-separated: <code>1234567890 1234567890</code></li>
                    <li>Each number on a new line:
                        <code>
                            1234567890<br />
                            1234567890<br />
                            1234567890<br />
                        </code>
                    </li>
                </ul>
            </Alert>
            <div className="col-md-6">
                <textarea
                    className="form-control"
                    placeholder="Enter phone numbers separated by commas or spaces"
                    value={phoneNumbers}
                    onChange={handlePhoneChange}
                    rows="12"
                />
                <button className="btn btn-success mt-3" onClick={handleSendMessage}>
                    Send Messages
                </button>
            </div>
            <div className="col-md-6">
                <div style={{ maxHeight: 300 }} className='overflow-y-auto'>
                    {hasAttemptedSend &&
                        phoneNumbers.split(/[,\s]+/).map((phoneNumber, index) => (
                            <div key={index} className="d-flex justify-content-between align-items-center mt-2 overflow-y-auto" >
                                <span>{phoneNumber}</span>
                                {messageStatus[phoneNumber] === 'success' ? (
                                    <i className="bi bi-check-circle-fill text-success"></i>
                                ) : messageStatus[phoneNumber] === 'failure' ? (
                                    <i className="bi bi-x-circle-fill text-danger"></i>
                                ) : null}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default SendMessageForm;