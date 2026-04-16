const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Product = require('../../models/product');

let ai;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (e) {
    console.warn("Could not initialize Google Gen AI:", e);
}

router.post('/shopper/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        if (!ai) {
            return res.status(500).json({ error: "Gemini API key is missing or invalid. Please configure it in .env" });
        }

        const products = await Product.find({}).select('name desc price _id image');
        const catalogData = products.map(p => ({
            id: p._id,
            name: p.name,
            desc: p.desc,
            price: p.price
        }));

        const systemPrompt = `You are an AI Personal Shopper for Zest E-commerce.
Your job is to read the user query, and give a polite, helpful response recommending products from the catalog.
Here is the current catalog in JSON:
${JSON.stringify(catalogData)}

At the very end of your response, you MUST output a JSON block with recommended product IDs in the exact following format, if you have recommendations:
[RECOMMENDATIONS: id1, id2]

If you have no recommendations, do not include the recommendations block.
Keep your response welcoming, enthusiastic, and under 150 words. Format with standard text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: systemPrompt + "\n\nUser: " + message
        });

        const text = response.text;
        
        let recommendedProducts = [];
        let replyMsg = text;
        
        const match = text.match(/\[RECOMMENDATIONS:\s*(.+?)\]/i);
        if (match && match[1]) {
            const idsStr = match[1];
            const ids = idsStr.split(',').map(id => id.trim().replace(/['"]/g, ''));
            // Search mongo. Catch cast errors if id is invalid format.
            try {
                recommendedProducts = await Product.find({ _id: { $in: ids } });
            } catch (err) {
                console.error("Invalid ID format from LLM:", ids);
            }
            replyMsg = text.replace(match[0], '').trim();
        }

        res.json({
            message: replyMsg,
            recommendedProducts
        });
    } catch (e) {
        console.error("AI Shopper Error:", e);
        res.status(500).json({ error: "Failed to process chat: " + e.message });
    }
});

module.exports = router;
