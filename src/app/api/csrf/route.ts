import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

export async function GET() {
  try {
    const csrfToken = await generateCsrfToken();
    return NextResponse.json({ csrfToken });
  } catch (error) {
    console.error("Error generating CSRF token:", error);
    return NextResponse.json({ error: "Failed to generate CSRF token" }, { status: 500 });
  }
}
