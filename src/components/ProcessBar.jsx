// src/components/ProgressBar.jsx
import React from 'react';

export default function ProgressBar({ step }) {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        {[1, 2, 3, 4, 5, 6].map((num, idx) => (
          <React.Fragment key={num}>
            <div
              className={`progress-dot ${
                step === num ? 'active' : step > num ? 'completed' : ''
              }`}
            >
              {num}
            </div>
            {idx < 5 && (
              <div
                className={`progress-line ${step > num ? 'completed' : ''}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
