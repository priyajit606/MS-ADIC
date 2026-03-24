export default async function handler(req, res) {
    // 1. Check if the key exists (Avoids crashing)
    const API_KEY = process.env.SF_KEY ? process.env.SF_KEY.trim() : null;
    if (!API_KEY) {
        return res.status(500).json({ error: "Vercel Settings: SF_KEY is missing!" });
    }

    const { prompt, jobId } = req.body;

    try {
        // --- STEP 2: CHECK STATUS ---
        if (jobId) {
            const sRes = await fetch(`https://api.siliconflow.cn{jobId}`, {
                headers: { "Authorization": `Bearer ${API_KEY}` }
            });
            const sData = await sRes.json();
            return res.status(200).json(sData);
        }

        // --- STEP 1: SUBMIT VIDEO ---
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
        return res.status(200).json({ 
            jobId: result.job_id || result.request_id, 
            error: result.message 
        });

    } catch (error) {
        // This stops the Error 500 and tells you the real problem
        return res.status(500).json({ error: "Server caught an error: " + error.message });
    }
}
