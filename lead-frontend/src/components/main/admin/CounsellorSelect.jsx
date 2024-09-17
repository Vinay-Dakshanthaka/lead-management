// src/components/CounsellorSelect.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../config';
import { Form } from 'react-bootstrap';

const CounsellorSelect = ({ onSelect }) => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error('No token provided');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${baseURL}/api/admin/get-all-counsellors`, config);
        setCounsellors(response.data.counsellors);
        console.log('counsellors ', response.data.counsellors)
      } catch (error) {
        console.error('Error fetching counsellors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  if (loading) {
    return <div className="text-center my-3">Loading...</div>;
  }

  return (
    <Form.Group controlId="counsellorSelect">
      <Form.Label>Select Counsellor</Form.Label>
      <Form.Control as="select" onChange={(e) => onSelect(e.target.value)}>
        <option value="" className='text-dark'>Select a counsellor</option>
        {counsellors.map((counsellor) => (
          <option key={counsellor.counsellor_id} value={counsellor.counsellor_id}>
              {counsellor.counsellor_id}
            || {counsellor.name} || 
            {counsellor.email}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CounsellorSelect;