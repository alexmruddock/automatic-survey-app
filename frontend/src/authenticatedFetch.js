// At the top of authenticatedFetch.js
import refreshToken from './refreshToken';

export default async function authenticatedFetch(url, options = {}) {
  // Add the access token to the request  
  let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  
    // If the token is expired, try to refresh it
    if (response.status === 401) { // Assuming 401 status code for expired tokens
      const refreshed = await refreshToken(); // Call refreshToken() to get a new access token
      if (refreshed) {
        // Retry the original request with the new access token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
      }
    }
  
    return response;
  }