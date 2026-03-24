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
        model: "Wan-AI/Wan2.1-T2V-14B",
        prompt: prompt
      })
    });
    const data = await response.json();
    return NextResponse.json(data); 
  } catch (err) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

