function logout() {
    // Call the logout API endpoint if necessary
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // Redirect to login page or update state
  }  