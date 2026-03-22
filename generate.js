export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { image } = req.body;
    const API_KEY = process.env.SF_KEY;

    try {
        const response = await fetch("https://api.siliconflow.cn", {
            method: "POST",
            headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "Wan-AI/Wan2.1-I2V-14B-720P-Turbo",
                image_url: image
            })
        });
        const result = await response.json();
        return res.status(200).json({ url: result.video_url || null, error: result.message });
    } catch (e) { return res.status(500).json({ error: "Server Error" }); }
}
