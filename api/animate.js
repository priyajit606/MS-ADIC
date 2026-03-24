export default async function handler(req, res) {
    const { prompt, jobId } = req.body;
    const API_KEY = process.env.SF_KEY;

    // IF CHECKING STATUS
    if (jobId) {
        const sRes = await fetch(`https://api.siliconflow.cn{jobId}`, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });
        const sData = await sRes.json();
        return res.status(200).json(sData);
    }

    // IF SUBMITTING NEW
    try {
        const response = await fetch("https://api.siliconflow.cn", {
            method: "POST",
            headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-T2V-14B-720P", // High Quality 2026 model
                prompt: prompt
            })
        });
        const result = await response.json();
        return res.status(200).json({ jobId: result.job_id || result.request_id, error: result.message });
    } catch (e) {
        return res.status(500).json({ error: "API Connection Failed" });
    }
}
