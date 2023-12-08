import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ setUserDetails }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      "https://bookish-pancake-q7w7vvr66ggfxp5j-3000.app.github.dev/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (response.ok) {
        // Handle successful response
        console.log("Data: ", data);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("userEmail", email);
        // fetch user role here and update state in App
        fetchUserRole().then(role => setUserDetails(email, role));
        navigate("/");
      } else {
        // Handle error in JSON response
        console.error("Login failed:", data.message);
      }
    } else {
      // Handle non-JSON response
      const text = await response.text();
      console.error("Non-JSON response:", text);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
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

export default LoginForm;
