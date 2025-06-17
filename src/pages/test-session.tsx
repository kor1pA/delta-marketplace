"use client";
import React from "react";
import { useSession } from "next-auth/react";

export default function TestSession() {
  const { data: session, status } = useSession();
  return (
    <div>
      <h1>Session Debug</h1>
      <pre>{JSON.stringify({ status, session }, null, 2)}</pre>
    </div>
  );
}
