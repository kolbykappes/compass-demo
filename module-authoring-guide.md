# AI-Powered Module Authoring Guide

This document provides the technical schema and creative guidance for an AI to generate new sales outreach modules for the COMPASS Module Viewer.

---

## 1. Module JSON Schema

All modules MUST conform to the following JSON structure. All fields are required.

```json
{
  "metadata": {
    "module_id": "string",
    "title": "string",
    "module_type": "string (e.g., 'Practice-Specific Type D (Success Story)', 'Core Capability', 'Solution-focused')",
    "practice_area": "string (e.g., 'AI & Data', 'Infrastructure', 'App Dev', 'Cybersecurity')",
    "relevant_roles": ["string"],
    "overview": "string (2-3 sentence summary)"
  },
  "content": {
    "email": {
      "subject": "string",
      "body": "string (Use '\\n' for line breaks)"
    },
    "phone": {
      "opening": "string",
      "key_message": "string",
      "evidence_point": "string",
      "engagement_question": "string",
      "voicemail": "string"
    },
    "linkedin": {
      "connection_request": "string (Max 300 characters)",
      "inmessage_subject": "string",
      "inmessage_body": "string (Use '\\n' for line breaks)"
    },
    "objections": [
      {
        "objection": "string",
        "response": "string"
      }
    ],
    "collateral": {
      "title": "string",
      "link": "string (URL or placeholder '#')"
    }
  }
}
```

---

## 2. AI Authoring Instructions

### **Guiding Principle: Maintainability**
To ensure modules are easy to create and maintain, each module should contain only **one version of the content** for email, phone, and LinkedIn. Do not create different content versions for different roles within the same module. The goal is a single, strong piece of outreach that can be lightly personalized by the sales team.

### **Core Principles:**
1.  **Persona-Centric:** The content must speak directly to the likely priorities and pain points of the `relevant_roles`. A CTO cares about technology strategy, scalability, and ROI. A CISO cares about risk, compliance, and threat mitigation.
2.  **Value-Oriented:** Do not just describe features. Describe the *value* and *outcomes* of our services. Use strong, quantifiable metrics (e.g., cost savings, efficiency gains, risk reduction) whenever possible.
3.  **Authentic Voice:** Write in a clear, confident, and professional tone. Avoid jargon where simpler language works better. The voice should be that of a helpful expert, not an aggressive salesperson.
4.  **Actionable:** Every piece of content should guide the prospect toward a next step, whether it's a reply, a call, or simply thinking about a problem in a new way.

### **Content Generation Guidelines (by section):**

*   **`metadata.overview`**:
    *   This is the most important summary. In 2-3 sentences, what is this module about and why should the prospect care? State the problem, the solution, and the positive business outcome.

*   **`content.email`**:
    *   **Subject:** Make it compelling and concise. It should create curiosity or state a powerful benefit.
    *   **Body:**
        *   **Hook:** Start with a problem or insight relevant to the prospect's role or industry.
        *   **Solution:** Briefly introduce how Eliassen Group addresses this problem.
        *   **Proof:** Provide a specific, metric-driven example (like in a success story) or explain the core value (like in a capability module).
        *   **Call to Action:** End with a low-friction question, like "Would you be open to a brief discussion?"

*   **`content.phone`**:
    *   This is a script, not a transcript. Keep it brief and focused.
    *   **`opening`**: Get straight to the point: who you are and where you're from.
    *   **`key_message`**: The single most important idea you want to convey in 15 seconds.
    *   **`evidence_point`**: Your most compelling data point or success story summary.
    *   **`engagement_question`**: An open-ended question to start a conversation. Avoid "yes/no" questions.
    *   **`voicemail`**: A compressed version of the `key_message` and `evidence_point` with a callback number.

*   **`content.linkedin`**:
    *   **`connection_request`**: Keep it very brief and professional. Mention your area of expertise and their role.
    *   **`inmessage_body`**: A slightly more casual and concise version of the email. Get to the point quickly. Use whitespace to make it readable.

*   **`content.objections`**:
    *   Think of the 3-5 most likely reasons a prospect would say "no" or "not now."
    *   For each `objection`, provide a respectful, empathetic, and helpful `response` that reframes the issue and keeps the conversation open. Do not be defensive.

*   **`content.collateral`**:
    *   Provide a descriptive title for a piece of supporting content (e.g., Case Study, Whitepaper, Solution Brief).
    *   Use a placeholder `"#"` for the link if the actual URL is unknown. 