// Pass a callback function to `refreshToken` which will handle the redirection.
export default async function refreshToken(onFailure) {
    const response = await fetch('https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') })
    });
  
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      return true;
    } else {
      // Handle failed refresh
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
  
      if (onFailure && typeof onFailure === 'function') {
        onFailure(); // Call the failure callback
      }
      
      return false;
    }
  }
    