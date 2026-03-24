export default async function handler(req, res) {
    const { prompt, jobId } = req.body;
    // 1. Double check the variable name matches Vercel exactly
    const API_KEY = process.env.SF_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: "Vercel can't find SF_KEY. Check your Settings!" });
    }

    // STEP 2: CHECK STATUS
    if (jobId) {
        try {
            const sRes = await fetch(`https://api.siliconflow.cn{jobId}`, {
                headers: { 
                    // FIXED: Ensure there is exactly one space after 'Bearer'
                    "Authorization": `Bearer ${API_KEY.trim()}` 
                }
            });
            const sData = await sRes.json();
            return res.status(200).json(sData);
        } catch (e) {
            return res.status(500).json({ error: "Status check failed" });
        }
    }

    // STEP 1: SUBMIT NEW VIDEO
    try {
        const response = await fetch("https://api.siliconflow.cn/v1/video/submit", {
            method: "POST",
            headers: { 
                // FIXED: Using .trim() to remove any accidental spaces from Vercel
                "Authorization": `Bearer ${API_KEY.trim()}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-T2V-14B-720P-Turbo",
                prompt: prompt
            })
        });

        const result = await response.json();
        
        // If SiliconFlow returns a 401, it's definitely the key
        if (response.status === 401) {
            return res.status(401).json({ error: "SiliconFlow says: Invalid API Key. Check the key value!" });
        }

        if (result.job_id || result.request_id) {
            return res.status(200).json({ jobId: result.job_id || result.request_id });
        } else {
            return res.status(500).json({ error: result.message || "AI Busy/Rejected" });
        }
    } catch (e) {
        return res.status(500).json({ error: "Network Error" });
    }
}
