import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { message, history } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "Gemini API key is not configured on the server" });
        }

        // Format history for Gemini API:
        // Gemini expects role: 'user' or 'model'
        const formattedHistory = (history || []).map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        const body = {
            systemInstruction: {
                parts: [
                    {
                        text: "You are TransitBot, the AI assistant for TransitOps, a premium smart fleet operations and dispatch management system. Help the user manage vehicles, drivers, trips, maintenance logs, and fuel tracking. Keep your answers brief, professional, and friendly."
                    }
                ]
            },
            contents: [
                ...formattedHistory,
                {
                    role: "user",
                    parts: [{ text: message }]
                }
            ]
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("Gemini API error status:", response.status, errData);
            return res.status(response.status).json({
                error: "Failed to communicate with Gemini API",
                details: errData
            });
        }

        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that request.";

        res.json({ reply: replyText });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
