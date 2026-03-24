export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
    
    const { prompt } = req.body;
    const API_KEY = process.env.SF_KEY;

    try {
        const response = await fetch("https://api.siliconflow.cn", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-T2V-14B-720P", // Correct Text-to-Video ID for 2026
                prompt: prompt
            })
        });

        const result = await response.json();
        
        // Return video URL or error message
        if (result.video_url || result.url) {
            return res.status(200).json({ url: result.video_url || result.url });
        } else {
            return res.status(500).json({ error: result.message || "Model Busy" });
        }
    } catch (e) {
        return res.status(500).json({ error: "Server Error" });
    }
}
