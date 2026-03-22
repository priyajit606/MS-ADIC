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
                model: "Wan-AI/Wan2.1-I2V-14B-480P", // Highest realism free model
                image_url: image,
                prompt: "Cinematic lighting, realistic movement, 4k, masterpiece, highly detailed", // Forces high quality
                motion_bucket_id: 127 // Increases the amount of movement
            })
        });

        const result = await response.json();
        if (result.video_url) {
            return res.status(200).json({ url: result.video_url });
        } else {
            return res.status(500).json({ error: "AI Busy. Try again in 1 minute." });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}
