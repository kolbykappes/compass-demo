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

### **Core Principles (Updated Based on Feedback):**

1. **Persona-Centric:** The content must speak directly to the likely priorities and pain points of the `relevant_roles`. A CTO cares about technology strategy, scalability, and ROI. A CISO cares about risk, compliance, and threat mitigation.

2. **Value-Oriented with Evidence:** Do not just describe features. Describe the *value* and *outcomes* of our services. Use strong, quantifiable metrics (e.g., cost savings, efficiency gains, risk reduction) with **direct client references or data points** whenever possible. Include specific evidence from actual engagements.

3. **Clear and Concise Language:** Write in clear, professional language. Use "more than X" instead of "X+" for better readability. Choose precise words ("analysis" over "analyses" when appropriate). Avoid unnecessary jargon and be direct.

4. **Authentic and Conservative Voice:** Write as a helpful expert, not an aggressive salesperson. **Avoid over-promising quick wins** and be cautious with specific promises. Address realistic concerns rather than creating unrealistic expectations.

5. **Technology-Agnostic Flexibility:** **Avoid being overly specific about technology partnerships** (e.g., don't emphasize Microsoft partnership exclusively since prospects may use AWS, GCP, or other platforms). Focus on our expertise across multiple platforms.

6. **Actionable with Realistic Expectations:** Every piece of content should guide toward a next step. **Set realistic time expectations** for discussions and suggest specific timeframes when possible.

---

## 3. Content Generation Guidelines (by section)

### **`metadata.overview`**
- In 2-3 sentences, state the problem, the solution, and the positive business outcome
- Focus on **team expertise and proven capability** rather than broad industry claims
- Keep context-focused and specific to what we actually deliver

### **`content.email`**
- **Subject:** Compelling and concise. Create curiosity or state a powerful benefit
- **Body Structure:**
  - **Hook:** Start with a problem or insight relevant to the prospect's role/industry
  - **Solution:** Briefly introduce how Eliassen Group addresses this problem **with specific team expertise**
  - **Proof:** Provide **specific, metric-driven examples with client data points** (anonymized as needed)
  - **Call to Action:** End with low-friction questions that **indicate potential value/savings** and suggest realistic timeframes

### **`content.phone`**
- **`opening`**: Direct and professional: who you are and your area of expertise
- **`key_message`**: Single most important idea conveyed in 15 seconds, focused on **proven capability**
- **`evidence_point`**: **Most compelling data point or client success with specific metrics**
- **`engagement_question`**: Open-ended question that **hints at potential value** (e.g., "What challenges are you seeing with...")
- **`voicemail`**: Compressed version with **specific value proposition** and callback information

### **`content.linkedin`**
- **`connection_request`**: Brief, professional, mention expertise area and their role
- **`inmessage_body`**: 
  - More casual but professional tone
  - Use whitespace for readability
  - Get to value proposition quickly
  - **Include specific data points or client outcomes**

### **`content.objections`**
- Think of 3-5 most likely objections including:
  - **Budget/timing concerns**
  - **Technology platform preferences**
  - **Internal capability questions**
  - **Risk aversion to change**
- For each objection, provide **empathetic responses that address underlying concerns** rather than being defensive
- **Address fear/trepidation of change** rather than just skepticism
- Provide **proof points that can be substantiated** if challenged

### **`content.collateral`**
- Descriptive title for supporting content (Case Study, Solution Brief, etc.)
- **Consider visual formats** like infographics for data-heavy content
- Use placeholder `"#"` for unknown URLs

---

## 4. Enhanced Quality Standards

### **Evidence and Data Requirements:**
- Include **specific percentages, timeframes, and measurable outcomes**
- Reference **actual client experiences** (anonymized appropriately)
- Use **"more than X"** instead of "X+" formatting
- Provide **substantiable claims** that can withstand scrutiny

### **Language and Tone Standards:**
- Use **active voice** and present tense
- Choose **precise terminology** (avoid ambiguous words)
- Write **conversationally** but maintain professionalism
- **Avoid overly technical jargon** unless necessary for the audience

### **Flexibility Requirements:**
- **Don't lock into specific technology partnerships** unless relevant to the prospect
- Focus on **methodology and expertise** rather than tool-specific capabilities
- Allow for **customization based on prospect's tech stack**

### **Engagement Standards:**
- **Set realistic expectations** for discussion length and outcomes
- **Suggest specific timeframes** when possible ("15-minute discussion," "brief 20-minute call")
- Include **future scheduling suggestions** to make next steps easier
- Focus on **collaborative discovery** rather than sales pressure

---

## 5. Filename Convention

The module's filename should follow the convention: `type_title.json`

- **type:** Text inside parentheses from `module_type`, lowercase, spaces as underscores
- **title:** `title` field, lowercase, spaces as underscores, special characters removed

Example: "AI-Powered Documentation Automation" with type "(Success Story)" = `success_story_ai_powered_documentation_automation.json`

---

## 6. Review Checklist

Before finalizing any module, verify:

- [ ] **Clarity**: Is the language clear and concise?
- [ ] **Evidence**: Are claims backed by specific data/client examples?
- [ ] **Flexibility**: Does it avoid overly specific technology assumptions?
- [ ] **Realism**: Are promises and timelines realistic?
- [ ] **Value Focus**: Does it clearly articulate business outcomes?
- [ ] **Engagement**: Does it provide clear, low-friction next steps?
- [ ] **Proof**: Can all claims be substantiated if challenged?