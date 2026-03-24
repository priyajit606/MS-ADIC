export default async function handler(req, res) {
    const { prompt, jobId } = req.body;
    const API_KEY = process.env.SF_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "SF_KEY missing in Vercel settings" });
    }

    // STEP 2: CHECK STATUS (Polled by index.html)
    if (jobId) {
        try {
            const statusRes = await fetch(`https://api.siliconflow.cn{jobId}`, {
                headers: { "Authorization": `Bearer ${API_KEY}` }
            });
            const statusData = await statusRes.json();
            // SiliconFlow returns 'status' and 'video_url'
            return res.status(200).json(statusData);
        } catch (e) {
            return res.status(500).json({ error: "Could not check video status" });
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
                model: "Wan-AI/Wan2.2-T2V-A14B", // Latest 2026 T2V Model
                prompt: prompt,
                video_size: "1280x720" // Standard 2026 HD resolution
            })
        });

        const result = await response.json();
        
        // Return jobId/requestId to the frontend for polling
        if (result.job_id || result.request_id) {
            return res.status(200).json({ jobId: result.job_id || result.request_id });
        } else {
            return res.status(500).json({ error: result.message || "AI Busy/Rejected" });
        }
    } catch (e) {
        return res.status(500).json({ error: "API Connection Failed" });
    }
}
