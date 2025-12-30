import React, { useEffect } from 'react';

const InstagramLogin = () => {
  useEffect(() => {
    // Redirect to Instagram
    window.location.href = 'https://www.instagram.com';
  }, []);

  return null;
};

export default InstagramLogin;