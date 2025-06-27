import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // We are simply acknowledging the request and will handle the password reset 
  // on the client-side for simplicity. This endpoint can be enhanced later 
  // for more robust server-side flows if needed (e.g., with a dedicated email service).
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    // In a real app, you might log this request or perform other server-side tasks.
    // For now, we just return a success message. The client will handle the email sending.
    return NextResponse.json({ message: "Request received. If an account exists, a reset link will be sent." });

  } catch (error) {
    console.error("Forgot password request error:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
} 