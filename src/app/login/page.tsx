"use client";

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState(''); // Initialize with an empty string
  const [password, setPassword] = useState(''); // Initialize with an empty string

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    console.log('Email changed:', e.target.value); // Add console log
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    console.log('Password changed:', e.target.value); // Add console log
  };

  // Defensive: never allow undefined or null as value
  const safeEmail = email ?? '';
  const safePassword = password ?? '';

  return (
    <form>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={safeEmail}
          onChange={e => setEmail(typeof e.target.value === "string" ? e.target.value : "")}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={safePassword}
          onChange={e => setPassword(typeof e.target.value === "string" ? e.target.value : "")}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
