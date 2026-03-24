import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    const response = await fetch("https://api.siliconflow.cn", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SILICON_FLOW_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Wan-AI/Wan2.1-T2V-14B", // High-quality video model
        prompt: prompt
      })
    });

    const data = await response.json();
    return NextResponse.json(data); // Sends the requestId to your website
  } catch (error) {
    return NextResponse.json({ error: "Check your Vercel API Key!" }, { status: 500 });
  }
}
