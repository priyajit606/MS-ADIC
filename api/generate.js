export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    
    const { image } = req.body;
    const API_KEY = process.env.SF_KEY;

    try {
        const response = await fetch("https://api.siliconflow.cn", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${API_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-I2V-14B-720P-Turbo",
                image_url: image
            })
        });

        const result = await response.json();
        const videoUrl = result.video_url || result.url;

        if (videoUrl) {
            return res.status(200).json({ url: videoUrl });
        } else {
            return res.status(500).json({ error: result.message || "Model Busy" });
        }
    } catch (e) {
        return res.status(500).json({ error: "Server error" });
    }
}

