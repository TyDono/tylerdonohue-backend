// index.js
// Simple Node backend for AI Tyler

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// ---- CONFIG ----

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log('Has OPENAI_API_KEY?', !!process.env.OPENAI_API_KEY);

if (process.env.RESEND_API_KEY) {
    sgMail.setApiKey(process.env.RESEND_API_KEY);
} else {
    console.warn('WARN: RESEND_API_KEY not set; /contact will return email_not_configured.');
}

if (process.env.RESEND_API_KEY) {
    console.log("RESEND_API_KEY present?", true);
    console.log("RESEND_API_KEY prefix:", process.env.RESEND_API_KEY.slice(0, 3));
    console.log("RESEND_API_KEY length:", process.env.RESEND_API_KEY.length);
    sgMail.setApiKey(process.env.RESEND_API_KEY);
} else {
    console.warn("WARN: RESEND_API_KEY not set");
}


// You should define these in your env or hard-code for now
const CONTACT_TO = process.env.CONTACT_TO || 'you@example.com';
const CONTACT_FROM = process.env.CONTACT_FROM || 'no-reply@tylerdonohue.com';

const app = express();

// CORS: allow your site and local dev
app.use(
    cors({
        origin: [
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'https://tylerdonohue.com',
            'https://www.tylerdonohue.com',
        ],
    })
);

// Body parser for JSON
app.use(express.json());

// ---- Prompt loading helpers ----

function loadPromptFile(filename) {
    return fs.readFileSync(path.join(__dirname, 'ai-tyler', filename), 'utf8');
}

const TYLER_KNOWLEDGE = [
    loadPromptFile('about-ai-and-best-at.md'),
    loadPromptFile('bio-and-general.md'),
    loadPromptFile('skills-and-tech.md'),
    loadPromptFile('skills-mapping.md'),
    loadPromptFile('experience-and-projects.md'),
    loadPromptFile('education-and-summary.md'),
    loadPromptFile('faq.md'),
    loadPromptFile('project-details.md'),
    loadPromptFile('services-and-process.md'),
    loadPromptFile('system-rules.md'),
    loadPromptFile('oddities.md'),
].join('\n\n');


const SYSTEM_RULES = loadPromptFile('system-rules.md');

// ---- Routes ----

// Health check
app.get('/health', (req, res) => {
    res.json({ ok: true });
});

// Contact endpoint
app.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body || {};
        if (!email || !message) {
            return res.status(400).json({ ok: false, error: "missing_fields" });
        }

        const safeName = (name || "Portfolio Visitor").slice(0, 120);
        const safeEmail = String(email).slice(0, 200);
        const safeMessage = String(message).slice(0, 5000);

        await resend.emails.send({
            from: process.env.CONTACT_FROM,   // must be verified in Resend
            to: process.env.CONTACT_TO,
            replyTo: safeEmail,
            subject: `New portfolio contact from ${safeName}`,
            text: `From: ${safeName} <${safeEmail}>\n\nMessage:\n${safeMessage}`,
        });

        return res.json({ ok: true });
    } catch (err) {
        console.error("Resend contact error:", err);
        return res.status(500).json({ ok: false, error: "send_failed" });
    }
});

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body || {};

        if (!Array.isArray(messages)) {
            return res.status(400).json({ error: 'messages_array_required' });
        }

        const completion = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                {
                    role: 'system',
                    content: `
${SYSTEM_RULES}

Tyler Knowledge:
${TYLER_KNOWLEDGE}
                    `.trim(),
                },
                ...messages,
            ],
            max_tokens: 600,
        });

        const reply = completion.choices[0]?.message;
        if (!reply) {
            return res.status(500).json({ error: 'no_reply_from_model' });
        }

        res.json({ reply });
    } catch (err) {
        console.error('Chat error:', err);

        const detail =
            err?.response?.data ??
            err?.message ??
            String(err);

        res.status(500).json({
            error: 'ai_error',
            detail,
        });
    }
});

// ---- Start server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`AI Tyler backend listening on port ${PORT}`);
});
