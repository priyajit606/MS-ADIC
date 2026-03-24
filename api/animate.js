export default async function handler(req, res) {
    const { prompt, jobId } = req.body;
    const API_KEY = process.env.SF_KEY;

    if (!API_KEY) return res.status(500).json({ error: "SF_KEY is missing in Vercel settings!" });

    // STEP 2: CHECK STATUS (Polling)
    if (jobId) {
        try {
            const statusRes = await fetch(`https://api.siliconflow.cn{jobId}`, {
                headers: { "Authorization": `Bearer ${API_KEY}` }
            });
            const statusData = await statusRes.json();
            return res.status(200).json(statusData);
        } catch (e) {
            return res.status(500).json({ error: "Could not reach SiliconFlow status server." });
        }
    }

    // STEP 1: SUBMIT NEW REQUEST
    try {
        const response = await fetch("https://api.siliconflow.cn/v1/video/submit", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-T2V-14B-720P-Turbo", // Fastest 2026 model
                prompt: prompt,
                video_size: "1280x720"
            })
        });

        const result = await response.json();
        
        // Handle common 2026 error codes
        if (response.status === 429) return res.status(429).json({ error: "Rate limit hit. Wait 1 min." });
        if (response.status === 401) return res.status(401).json({ error: "Invalid API Key." });
        if (response.status === 403) return res.status(403).json({ error: "Balance 0 or Prompt Rejected." });

        if (result.job_id || result.request_id) {
            return res.status(200).json({ jobId: result.job_id || result.request_id });
        } else {
            return res.status(500).json({ error: result.message || "AI Busy/Rejected" });
        }
    } catch (e) {
        return res.status(500).json({ error: "Network connection failed." });
    }
}
