import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegistrationForm({ setUserDetails }) {
    // Initialize state variables
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Used to redirect the user

    const handleLogin = async () => {
        const response = await fetch('https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Data: ", data);
            // Store the tokens in localStorage
            localStorage.setItem('accessToken', data.accessToken);
            console.log("Token: ", data.accessToken); // Log the token in the console for debugging purposes
            localStorage.setItem('userEmail', email); // Store the user's email in localStorage
            // fetch user role here and update state in App
            fetchUserRole().then(role => setUserDetails(email, role)); 
            // Navigate to the home page
            navigate('/'); 
        } else {
            console.error('Login failed:', data.message);
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        // Send form data to the API for registration
        const response = await fetch('https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            await handleLogin(); // If registration is successful, log in to the app automatically
            console.log('Registration successful');
        } else {
            const message = await response.text();
            console.error('Registration failed:', message);
        }
    };

    // JSX returned by the component
    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Register</button>
        </form>
    );
}

async function fetchUserRole() {
    const response = await fetch("https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/fetch-user", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.role;
    }
    return null;
  }

export default RegistrationForm;