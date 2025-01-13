import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import { toast, Toaster } from 'react-hot-toast';
import { BiCheckCircle, BiXCircle } from 'react-icons/bi';

const AdminDetails = () => {
    const [counsellors, setCounsellors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounsellors = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('No token provided');
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get(`${baseURL}/api/admin/super-admin/admin-details`, config);
                setCounsellors(response.data.counsellors);
                console.log('Admin details:', response.data);
            } catch (error) {
                toast.error('Failed to fetch counsellors');
                console.error('Error fetching counsellors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounsellors();
    }, []);

    if (loading) {
        return <div className="text-center my-5">Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <Toaster />
            <h2 className="text-center mb-4">Counsellors Details</h2>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Admin Config</th>
                        </tr>
                    </thead>
                    <tbody>
                        {counsellors.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No counsellors found
                                </td>
                            </tr>
                        ) : (
                            counsellors.map((counsellor) => (
                                <tr key={counsellor.counsellor_id}>
                                    <td>{counsellor.counsellor_id}</td>
                                    <td>{counsellor.name || 'N/A'}</td>
                                    <td>{counsellor.email}</td>
                                    <td>{counsellor.phone}</td>
                                    <td>
                                        {counsellor.adminconfig && counsellor.adminconfig.length > 0 ? (
                                            <>
                                               
                                                <BiCheckCircle className='text-success display-6' title='Configuration done'
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <BiXCircle className='text-danger display-6' title='No admin config available' />
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDetails;
