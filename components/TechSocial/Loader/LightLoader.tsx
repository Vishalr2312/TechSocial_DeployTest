'use client';

import { useEffect, useState } from 'react';

const LightLoader = () => {
  return (
    <div className="preloader-overlay">
      <div className="preloader-box-light">
        <h2 className="loader-title">Loading...</h2>
        <p className="loader-subtitle">
          Please wait while we process your request.
        </p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LightLoader;
