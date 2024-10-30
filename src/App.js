// src/App.js
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function App() {
  const [showLogin, setShowLogin] = useState(true);

    const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="App">
    {showLogin ? (
      <LoginForm toggleForm={toggleForm} />
    ) : (
      <RegisterForm toggleForm={toggleForm} />
    )}
  </div>
  );
}

export default App;
