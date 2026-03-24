"use client";
import { useState } from 'react';

export default function MS_ADIC_Gen() {
  const [prompt, setPrompt] = useState("");
  const [video, setVideo] = useState("");
  const [loading, setLoading] = useState(false);

  const startVideo = async () => {
    setLoading(true);
    // Step 1: Start the generation
    const res = await fetch('/api/animate', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    });
    const { requestId } = await res.json();

    // Step 2: Check status every 5 seconds until SUCCEED
    const check = setInterval(async () => {
      const statusRes = await fetch("https://api.siliconflow.cn", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SILICON_KEY}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ requestId })
      });
      const data = await statusRes.json();

      if (data.status === "SUCCEED") {
        setVideo(data.videoUrl);
        setLoading(false);
        clearInterval(check);
      }
    }, 5000);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', background: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>MS-ADIC AI VIDEO</h1>
      <input 
        style={{ color: '#000', padding: '12px', width: '300px', borderRadius: '5px' }}
        onChange={(e) => setPrompt(e.target.value)} 
        placeholder="A dragon flying over mountains..." 
      />
      <button onClick={startVideo} disabled={loading} style={{ padding: '12px 20px', marginLeft: '10px', cursor: 'pointer' }}>
        {loading ? "Generating... (Wait 1 min)" : "Create Video"}
      </button>
      <div style={{ marginTop: '30px' }}>
        {video && <video src={video} controls width="100%" style={{ maxWidth: '700px' }} autoPlay />}
      </div>
    </div>
  );
}
