export default async function handler(req, res) {
    const { prompt, jobId } = req.body;
    const API_KEY = process.env.SF_KEY ? process.env.SF_KEY.trim() : null;

    if (!API_KEY) {
        return res.status(500).json({ error: "SF_KEY missing in Vercel settings!" });
    }

    // --- STEP 2: CHECK STATUS ---
    if (jobId) {
        try {
            const sRes = await fetch(`https://api.siliconflow.cn{jobId}`, {
                method: 'GET',
                headers: { 
                    "Authorization": `Bearer ${API_KEY}`,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
            });
            const sData = await sRes.json();
            return res.status(200).json(sData);
        } catch (e) {
            return res.status(500).json({ error: "Status check failed" });
        }
    }

    // --- STEP 1: SUBMIT VIDEO ---
    try {
        const response = await fetch("https://api.siliconflow.cn", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_KEY}`, 
                "Content-Type": "application/json",
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-T2V-14B-720P-Turbo",
                prompt: prompt
            })
        });

        const result = await response.json();

        if (response.status === 200 && (result.job_id || result.request_id)) {
            return res.status(200).json({ 
                jobId: result.job_id || result.request_id 
            });
        } else {
            return res.status(response.status).json({ 
                error: result.message || "AI Busy or Rejected" 
            });
        }

    } catch (e) {
        return res.status(500).json({ error: "Network Error: AI server unreachable" });
    }
}
