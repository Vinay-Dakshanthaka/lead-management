// src/components/Breadcrumbs.jsx
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

const Breadcrumbs = () => {
  const location = useLocation();
  const { lead_id } = useParams();

  // List of paths to exclude from breadcrumbs
  const excludePaths = ['/sign-in'];

  // Get current path
  const currentPath = location.pathname;

  // Skip breadcrumb rendering if the current path is in the exclude list
  if (excludePaths.includes(currentPath)) {
    return null;
  }

  const breadcrumbs = currentPath
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => {
      const path = `/${arr.slice(0, index + 1).join('/')}`;
      return { path, segment };
    });

  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
      {breadcrumbs.map(({ path, segment }, index) => (
        <Breadcrumb.Item
          key={path}
          href={path}
          active={index === breadcrumbs.length - 1}
        >
          {segment}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
