# Static COMPASS Module Viewer - Requirements Document

## Problem Domain

Create a static HTML/CSS/JavaScript application that displays sales module sequences for specific sales pursuits. The application serves as a "fancy mockup" that demonstrates how sales representatives would consume targeted outreach modules in a real-world scenario.

The system needs to:
- Display a list of recommended modules for a specific sales pursuit
- Allow viewing individual modules in a professional, interactive format
- Provide easy navigation between the module list and individual modules
- Work as completely static files that can be deployed anywhere

## Application Structure

### File Organization
```
/
├── index.html                 # Main application file
├── styles.css                 # All styling
├── script.js                  # Application logic
├── config.json               # Pursuit definitions and routing
└── modules/                   # Module data files
    ├── AI-D1.json
    ├── AI-B2.json
    ├── INFRA-A1.json
    └── ... (additional modules)
```

### Routing Strategy
The application uses URL hash routing to determine which pursuit to display:
- `index.html` - Shows default pursuit or selection interface
- `index.html#pursuit=financial-services-ai` - Shows specific pursuit
- `index.html#pursuit=financial-services-ai&module=AI-D1` - Shows specific module

## Data Schema

### Config.json Structure
```json
{
  "pursuits": {
    "financial-services-ai": {
      "title": "Financial Services - AI & Data Transformation",
      "description": "Recommended modules for financial services prospects exploring AI and data modernization",
      "prospect": {
        "company": "Regional Bank Corp",
        "role": "Chief Technology Officer",
        "industry": "Financial Services"
      },
      "modules": [
        "AI-D1",
        "AI-B2",
        "INFRA-A1"
      ]
    },
    "healthcare-cloud": {
      "title": "Healthcare - Cloud Infrastructure Modernization",
      "description": "Recommended modules for healthcare organizations moving to cloud",
      "prospect": {
        "company": "Metro Health System",
        "role": "VP of Information Technology",
        "industry": "Healthcare"
      },
      "modules": [
        "INFRA-A1",
        "CYBER-B1",
        "APP-C2"
      ]
    }
  }
}
```

### Module JSON Structure
Each module file (e.g., `modules/AI-D1.json`) contains:

```json
{
  "metadata": {
    "module_id": "AI-D1",
    "title": "AI-Powered Documentation Automation",
    "module_type": "Practice-Specific Type D (Success Story)",
    "practice_area": "AI & Data",
    "relevant_roles": [
      "Chief Information Officer",
      "Chief Technology Officer",
      "VP of Information Technology",
      "Director of IT",
      "Technical Project Manager"
    ],
    "overview": "This module focuses on Eliassen Group's success in implementing AI-powered documentation automation for financial services organizations, highlighting the significant ROI achieved through streamlined processes, reduced manual effort, and improved content quality."
  },
  "content": {
    "email": {
      "subject": "65% Faster Documentation with AI Automation",
      "body": "Dear [Prospect Name],\n\nTechnical documentation processes often consume excessive time and resources, with technical writers spending up to 70% of their time manually gathering information while quality remains inconsistent.\n\nEliassen Group's AI & Data practice recently partnered with a leading financial institution to transform their approach to technical documentation through:\n\n• AI agent framework with specialized components for quality control\n• Custom Microsoft Copilot implementation with specialized prompts\n• Intelligent content extraction from code repositories\n• AI-assisted content generation tailored to different audience personas\n\nUnlike generic automation approaches, our solution delivered targeted improvements specific to documentation workflows. The results were compelling: 65% reduction in documentation creation time, 80% decrease in quality control effort, and annual cost savings exceeding $1.2M.\n\nI'd welcome the opportunity to discuss how similar approaches might benefit [Company Name]'s documentation processes.\n\nBest regards,\n[Your Name]\n[Your Title]\nEliassen Group"
    },
    "phone": {
      "opening": "Hello [Prospect Name], this is [Your Name] from Eliassen Group's AI & Data practice.",
      "key_message": "We've been helping organizations transform technical documentation processes through AI-powered automation, dramatically reducing the time spent on manual information gathering while improving consistency and quality.",
      "evidence_point": "Recently, we helped a financial services client reduce documentation creation time by 65% and quality control effort by 80%, delivering annual cost savings exceeding $1.2M through a custom AI solution leveraging Microsoft Copilot and specialized agents.",
      "engagement_question": "I'm curious about your current documentation processes and whether you're exploring AI to streamline these workflows?",
      "voicemail": "Hello [Prospect Name], this is [Your Name] from Eliassen Group's AI & Data practice. We've been helping organizations transform technical documentation through AI automation, recently helping a financial client achieve 65% faster documentation creation and $1.2M in annual savings. I'd appreciate a brief conversation about your documentation processes. You can reach me at [phone number]."
    },
    "linkedin": {
      "connection_request": "I lead AI & Data solutions at Eliassen Group and help organizations automate documentation processes. Given your role at [Company], I thought you might be interested in our recent work in this area.",
      "inmessage_subject": "AI Documentation Automation: 65% Faster + $1.2M Savings",
      "inmessage_body": "Hi [Prospect Name],\n\nI noticed your role at [Company] likely involves overseeing documentation processes that support your development teams.\n\nOur AI & Data practice recently implemented an AI-powered documentation platform for a financial services client that reduced creation time by 65% and delivered $1.2M in annual savings.\n\nWould you be open to a brief discussion about how similar approaches might benefit your organization?\n\nBest regards,\n[Your Name]"
    },
    "objections": [
      {
        "objection": "We're not ready for AI implementation in our documentation processes.",
        "response": "Many clients start with small, targeted pilots that demonstrate value quickly. We can suggest low-risk entry points that address specific pain points in your current workflow without disrupting existing processes."
      },
      {
        "objection": "Our documentation has specialized requirements that AI can't handle.",
        "response": "Our approach involves customizing AI capabilities for your specific needs. For our financial services client, we built specialized components that understood their complex regulatory and technical requirements while maintaining quality."
      },
      {
        "objection": "We'd need to integrate with too many existing systems.",
        "response": "Our solution architecture is designed for integration flexibility. We've successfully connected with diverse environments including ServiceNow, Atlassian products, GitHub, and content management systems while minimizing disruption."
      },
      {
        "objection": "We're concerned about quality issues with AI-generated content.",
        "response": "Quality control is central to our approach. We implemented specialized AI components specifically for quality verification, resulting in an 80% decrease in QC effort while actually improving documentation consistency."
      },
      {
        "objection": "This sounds expensive to implement.",
        "response": "Our financial services client achieved ROI within the first year with $1.2M in annual savings. We typically structure implementations to deliver incremental value, with initial modules often paying for themselves within months."
      }
    ],
    "collateral": {
      "title": "AI-Powered Documentation Automation Platform - Financial Services Success Story",
      "link": "[Eliassen Group Case Study URL]"
    }
  }
}
```

## User Interface Requirements

### Pursuit List View
When no specific pursuit is selected or multiple pursuits exist:
- Display available pursuits as cards or list items
- Each pursuit shows title, description, and prospect information
- Click to navigate to specific pursuit (`#pursuit=pursuit-id`)

### Module List View
When a specific pursuit is selected (`#pursuit=pursuit-id`):
- Header showing pursuit title, description, and prospect context
- List of recommended modules for this pursuit
- Each module displays:
  - Module title
  - Module type (badge/tag style)
  - Brief overview/description
  - Practice area indicator
- Click module to view details (`#pursuit=pursuit-id&module=module-id`)

### Module Detail View
When viewing a specific module (`#pursuit=pursuit-id&module=module-id`):
- Uses the existing collapsible section design from the HTML template
- Header with module metadata (title, type, practice area)
- Module overview prominently displayed
- Navigation tabs for: Email, Phone Script, LinkedIn, Objections, Collateral
- "Back to Module List" button returns to pursuit view
- Optional: Next/Previous module navigation

## Technical Requirements

### JavaScript Functionality
- Hash-based routing system to manage application state
- JSON loading and parsing for config and module data
- Dynamic HTML generation from JSON data
- Event handling for navigation and interactions
- Local storage for user preferences (optional)

### CSS Styling Requirements
- Professional, clean design matching Eliassen Group branding
- Responsive design that works on desktop and mobile
- Consistent with existing module template styling
- Smooth transitions between views
- Print-friendly styles for module content

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- No server-side dependencies
- Works from file:// URLs for local testing

## Navigation Flow

### Primary Navigation Paths
1. **Landing** → **Pursuit Selection** (if multiple pursuits)
   - `index.html` → `index.html#pursuit=pursuit-id`

2. **Pursuit Selection** → **Module List**
   - `index.html#pursuit=pursuit-id`

3. **Module List** → **Module Detail**
   - `index.html#pursuit=pursuit-id&module=module-id`

4. **Module Detail** → **Module List**
   - Via "Back to Module List" button

### URL Structure Examples
- `index.html` - Default/selection view
- `index.html#pursuit=financial-services-ai` - Module list for financial services AI pursuit
- `index.html#pursuit=financial-services-ai&module=AI-D1` - Specific module view
- `index.html#pursuit=healthcare-cloud&module=INFRA-A1` - Different pursuit, different module

## Content Generation Logic

### Module Content Rendering
The application should dynamically generate HTML from JSON data:

1. **Module Header**
   - Title, type badge, practice area
   - Module overview in highlighted box
   - Relevant roles list

2. **Tabbed Content Sections**
   - Email: Subject line + formatted body
   - Phone: Structured script with labeled sections
   - LinkedIn: Connection request + InMessage formatting
   - Objections: Formatted Q&A pairs
   - Collateral: Link with description

3. **Navigation Elements**
   - Back button
   - Tab switching
   - Next/previous (if desired)

### Content Formatting Rules
- Preserve line breaks in email/phone content
- Convert bullet points (•) to proper HTML lists
- Handle placeholder text ([Prospect Name], [Company]) with styling
- Format objections as expandable/collapsible items
- Ensure all content is copy-pasteable

## Deployment Requirements

### Static File Deployment
- All files must be serveable as static content
- No server-side processing required
- Compatible with:
  - Vercel static hosting
  - Netlify
  - GitHub Pages
  - AWS S3 static website hosting
  - Any web server

### Performance Requirements
- Fast loading times (< 2 seconds for initial load)
- Minimal JavaScript bundle size
- Optimized CSS (no unnecessary frameworks)
- Efficient JSON loading (only load needed data)

## Sample Data Requirements

Create sample data for at least 2-3 different pursuits:

### Sample Pursuits
1. **Financial Services - AI & Data Transformation**
   - Modules: AI-D1, AI-B2, DATA-A1
   - Prospect: CTO at Regional Bank

2. **Healthcare - Cloud Infrastructure Modernization**  
   - Modules: INFRA-A1, CYBER-B1, APP-C2
   - Prospect: VP IT at Health System

3. **Manufacturing - Application Development**
   - Modules: APP-D1, APP-B2, INFRA-A1
   - Prospect: Director of IT at Manufacturing Company

### Module Categories Needed
- At least 2-3 modules per practice area (AI/Data, Infrastructure, App Dev, Cybersecurity)
- Mix of module types (Success Story, Core Capability, Solution-focused)
- Realistic content that demonstrates the system's capabilities

## Success Criteria

### Functional Requirements
- Successfully loads and displays pursuit lists
- Navigates between pursuit list and module details
- Renders module content in professional format
- All interactive elements (tabs, buttons) work correctly
- Responsive design works on mobile and desktop

### Content Requirements
- All sample modules display correctly
- Content is readable and professionally formatted
- Copy-paste functionality works for email/phone content
- Navigation flow is intuitive and error-free

### Technical Requirements
- Works as static files without server
- Fast loading and smooth interactions
- Clean, maintainable code structure
- Easy to add new pursuits and modules

## Future Considerations

### Potential Enhancements (Out of Scope)
- Search/filter functionality for modules
- Usage tracking and analytics
- Print-optimized layouts
- Share/export functionality
- Module customization interface
- Integration with external systems

### Scalability Notes
- JSON structure should support easy addition of new modules
- CSS classes should be reusable and well-organized
- JavaScript should be modular for easy maintenance
- File organization should scale to 50+ modules