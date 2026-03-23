export default async function handler(req, res) {
    const API_KEY = process.env.SF_KEY;
    const { image, jobId } = req.body;

    // --- STEP 2: CHECK STATUS ---
    if (jobId) {
        try {
            const checkRes = await fetch(`https://api.siliconflow.cn`, {
                method: "POST",
                headers: { 
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ requestId: jobId })
            });
            const statusData = await checkRes.json();
            return res.status(200).json(statusData);
        } catch (e) {
            return res.status(500).json({ error: "Polling failed" });
        }
    }

    // --- STEP 1: SUBMIT IMAGE ---
    try {
        const response = await fetch("https://api.siliconflow.cn", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-I2V-14B-720P-Turbo",
                image_url: image // Send the compressed Base64
            })
        });

        const result = await response.json();
        
        if (result.requestId || result.job_id) {
            return res.status(200).json({ jobId: result.requestId || result.job_id });
        } else {
            return res.status(500).json({ error: result.message || "AI Rejected Request" });
        }
    } catch (e) {
        return res.status(500).json({ error: "Connection to AI failed" });
    }
}
