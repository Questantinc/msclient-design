import React,{useState} from 'react'
import Dialog from './Dialog';

function UnAuthorizedRoute() {
    const [showDialog, setShowDialog] = useState(true);

    const handleCloseDialog = () => {
      setShowDialog(false);
      // Use browser history to go back
      window.history.back();
    };
  
    return (
      <div>
        {/* Your content here */}
        {showDialog && <Dialog onClose={handleCloseDialog} />}
      </div>
    );
  };
export default UnAuthorizedRoute