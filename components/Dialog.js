// Dialog.js
import React from 'react';

const Dialog = ({ onClose }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>This option is for admin access only.</h3>
        <button onClick={onClose}>Back to the Page</button>
      </div>
    </div>
  );
};

export default Dialog;
