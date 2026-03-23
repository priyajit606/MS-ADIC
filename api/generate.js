export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { image } = req.body;
    const API_KEY = process.env.SF_KEY;

    try {
        // Updated 2026 endpoint
        const response = await fetch("https://api.siliconflow.cn", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-I2V-14B-720P-Turbo",
                image_url: image,
                // These parameters help avoid the "Server Busy" error
                prompt: "cinematic motion, high quality, 4k",
                motion_bucket_id: 127
            })
        });

        const result = await response.json();
        
        // SiliconFlow sometimes returns errors in a "message" field
        if (result.video_url || result.url) {
            return res.status(200).json({ url: result.video_url || result.url });
        } else {
            // This captures the exact reason from SiliconFlow
            console.error("SiliconFlow Error:", result);
            return res.status(500).json({ error: result.message || "AI Busy/No Credits" });
        }
    } catch (e) { 
        return res.status(500).json({ error: "Network Error: Try smaller image" }); 
    }
}
