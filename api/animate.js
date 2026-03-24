export default async function handler(req, res) {
    const { prompt, jobId } = req.body;
    
    // This pulls the key from your Vercel Environment Variables
    // .trim() removes any accidental spaces at the start or end
    const API_KEY = process.env.SF_KEY ? process.env.SF_KEY.trim() : null;

    if (!API_KEY) {
        return res.status(500).json({ error: "Vercel cannot find SF_KEY. Check Settings > Environment Variables!" });
    }

    // --- STEP 2: CHECK STATUS (Polling) ---
    if (jobId) {
        try {
            const sRes = await fetch(`https://api.siliconflow.cn{jobId}`, {
                headers: { "Authorization": `Bearer ${API_KEY}` }
            });
            const sData = await sRes.json();
            return res.status(200).json(sData);
        } catch (e) {
            return res.status(500).json({ error: "Status check failed" });
        }
    }

    // --- STEP 1: SUBMIT NEW VIDEO ---
    try {
        const response = await fetch("https://api.siliconflow.cn", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-T2V-14B-720P-Turbo", 
                prompt: prompt
            })
        });

        const result = await response.json();
        
        // If the API returns a 401, the key is definitely wrong in Vercel
        if (response.status === 401) {
            return res.status(401).json({ error: "SiliconFlow says: Invalid API Key. Please re-copy it from their site!" });
        }

        if (result.job_id || result.request_id) {
            return res.status(200).json({ jobId: result.job_id || result.request_id });
        } else {
            return res.status(500).json({ error: result.message || "AI Rejected the request" });
        }
    } catch (e) {
        return res.status(500).json({ error: "Network Error: Could not connect to AI" });
    }
}
