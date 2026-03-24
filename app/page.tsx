"use client";
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [video, setVideo] = useState("");
  const [status, setStatus] = useState("");

  const generate = async () => {
    setStatus("Starting...");
    const res = await fetch('/api/animate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
    const { requestId } = await res.json();

    // Check status every 5 seconds
    const checkInterval = setInterval(async () => {
      setStatus("Generating video... please wait");
      const checkRes = await fetch("https://api.siliconflow.cn", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SILICON_KEY}` }, 
        body: JSON.stringify({ requestId })
      });
      const data = await checkRes.json();
      if (data.status === "SUCCEED") {
        setVideo(data.videoUrl);
        setStatus("Done!");
        clearInterval(checkInterval);
      }
    }, 5000);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', background: '#111', color: '#fff', minHeight: '100vh' }}>
      <h1>MS-ADIC Video Gen</h1>
      <input style={{color:'#000', padding:'10px'}} onChange={(e) => setPrompt(e.target.value)} placeholder="A cat in space..." />
      <button onClick={generate} style={{padding:'10px', marginLeft:'10px'}}>Generate</button>
      <p>{status}</p>
      {video && <video src={video} controls width="100%" style={{marginTop:'20px'}} />}
    </div>
  );
}
