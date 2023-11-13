// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import jwt_decode from 'jwt-decode';

// export default function ProtectedRoute({ children,isAuthenticated, requiredRole }) {
//   const token = localStorage.getItem('jwtToken');
//   console.log(token)
//   const decodedToken = jwt_decode(token);
//   console.log(decodedToken)
//   const userRole = decodedToken.role;
//   console.log(isAuthenticated) 
//   console.log(userRole)

//   if (requiredRole) {
//     if (userRole.trim().toLowerCase() === 'admin') {
//       // Admin has full access
//       return children;
//     } else if (userRole.trim().toLowerCase() === 'editor') {
//       if (requiredRole === 'editor') {
//         // Editors have access except for delete functionality
//         return children;
//       } else {
//         console.log(`Unauthorized access: userRole=${userRole}`);
//         return <Navigate to="/UnAuthorizedRoute" replace />;
//       }
//     } else {
//       console.log(`Unauthorized access: userRole=${userRole}`);
//       return <Navigate to="/UnAuthorizedRoute" replace />;
//     }
//   }

//   return children;
// }

import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export default function ProtectedRoute({ children, isAuthenticated, requiredRole }) {
  if (!isAuthenticated) {
    // Redirect to login if the user is not authenticated
    return <Navigate to="/" replace />;
  }

  const token = localStorage.getItem('jwtToken');
  const decodedToken = jwt_decode(token);
  const userRole = decodedToken.role.trim();

  if (!requiredRole) {
    // No specific role required, grant access
    return children;
  }

  const requiredRolesArray = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
 

  const lowercaseRequiredRoles = requiredRolesArray.map(role => role.toLowerCase());
  const lowercaseUserRole = userRole.trim().toLowerCase();

  if (lowercaseUserRole === 'admin') {
    // Admin has full access
    return children;
  }

  if (lowercaseRequiredRoles.includes(lowercaseUserRole)) {
    // User role matches one of the required roles
    return children;
  }
  return <Navigate to="/UnAuthorizedRoute" replace />;
}

