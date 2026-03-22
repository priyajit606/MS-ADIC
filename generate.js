export default async function handler(req, res) {
    const { image } = JSON.parse(req.body);
    const API_KEY = process.env.SF_KEY;

    const response = await fetch("https://api.siliconflow.cn", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "Wan-AI/Wan2.1-I2V-14B-720P-Turbo", // The 2026 Free King
            image_url: image
        })
    });

    const result = await response.json();
    res.status(200).json({ url: result.video_url || null, error: result.message });
}
