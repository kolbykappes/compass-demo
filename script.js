const content = document.getElementById('app-container');
const headerNav = document.getElementById('header-nav');
let config = {};
let backButton;

async function init() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        
        createBackButton();

        window.addEventListener('hashchange', router);
        router(); // Initial call
    } catch (error) {
        console.error("Initialization failed:", error);
        content.innerHTML = "<p>Error loading configuration. Please check the console.</p>";
    }
}

function createBackButton() {
    backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.textContent = 'Back';
    backButton.style.display = 'none';
    headerNav.appendChild(backButton);

    backButton.onclick = () => location.hash = '';
}

function convertToClassname(text) {
    return text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-|-$/g, '');
}

function shortenModuleType(moduleType) {
    const typeMap = {
        'Company Introduction': 'Company Intro',
        'Practice-Specific Type A (Core Capability)': 'Core Capability',
        'Practice-Specific Type B (Solution)': 'Solution',
        'Practice-Specific Type D (Success Story)': 'Success Story',
        'Practice-Specific Type E (Talent)': 'Talent'
    };
    return typeMap[moduleType] || moduleType;
}

async function renderModuleList(pursuitId) {
    const pursuit = config.pursuits[pursuitId];
    if (!pursuit) {
        content.innerHTML = '<p>Pursuit not found.</p>';
        return;
    }

    // Main pursuit info box
    let pursuitInfoHtml = `
        <div class="pursuit-info">
            <h2>${pursuit.title}</h2>
            <p>${pursuit.description}</p>
            <p><strong>Prospect:</strong> ${pursuit.prospect.role} at ${pursuit.prospect.company}</p>
        </div>
        <h3>Recommended Module Sequence</h3>
    `;

    // Table for the module sequence
    let tableHtml = '<table class="module-table">';
    tableHtml += `
        <thead>
            <tr>
                <th>Step</th>
                <th>Module</th>
                <th>Recommended Delay</th>
                <th>Notes</th>
                <th>Tags</th>
            </tr>
        </thead>
        <tbody>
    `;

    // Populate table rows
    for (const moduleInfo of pursuit.modules) {
        try {
            const response = await fetch(`modules/${moduleInfo.id}?v=${new Date().getTime()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const module = await response.json();
            tableHtml += `
                <tr data-module-id="${moduleInfo.id}">
                    <td class="sequence-step">${moduleInfo.sequence}</td>
                    <td>
                        <div class="module-title-text">${module.metadata.title}</div>
                    </td>
                    <td>${moduleInfo.delay}</td>
                    <td class="notes-column">${moduleInfo.notes}</td>
                    <td class="tags-column">
                        <div class="module-tags">
                            <span class="tag module-type ${convertToClassname(module.metadata.module_type)}">${shortenModuleType(module.metadata.module_type)}</span>
                            <span class="tag practice-area ${convertToClassname(module.metadata.practice_area)}">${module.metadata.practice_area}</span>
                        </div>
                    </td>
                </tr>
            `;
        } catch (error) {
            console.error('Error fetching module:', moduleInfo.id, error);
            // Skip the module if it fails to load
        }
    }

    tableHtml += '</tbody></table>';

    content.innerHTML = pursuitInfoHtml + tableHtml;

    document.querySelectorAll('.module-table tbody tr').forEach(row => {
        row.addEventListener('click', () => {
            const pursuitId = getHashParam('pursuit');
            location.hash = `#pursuit=${pursuitId}&module=${row.dataset.moduleId}`;
        });
    });

    backButton.style.display = 'inline-block';
    backButton.textContent = '← Back to Pursuits';
    backButton.onclick = () => location.hash = '#pursuits';
}


async function renderModuleDetail(pursuitId, moduleId) {
    try {
        const response = await fetch(`modules/${moduleId}?v=${new Date().getTime()}`);
        const module = await response.json();

        let html = `
            <h2>${module.metadata.title}</h2>
            <p class="module-overview-text">${module.metadata.overview}</p>

            <details class="module-intel-details">
                <summary>View Module Details</summary>
                <div class="module-intel-box">
                    <p><strong>Module ID:</strong> ${module.metadata.module_id}</p>
                    <p><strong>Module Type:</strong> ${module.metadata.module_type}</p>
                    <p><strong>Relevant Roles:</strong> ${module.metadata.relevant_roles.join(', ')}</p>
                </div>
            </details>

            <div class="tabs">
                <button class="tab-link active" onclick="openTab(event, 'email')">Email</button>
                <button class="tab-link" onclick="openTab(event, 'phone')">Phone Script</button>
                <button class="tab-link" onclick="openTab(event, 'linkedin')">LinkedIn</button>
                <button class="tab-link" onclick="openTab(event, 'objections')">Objections</button>
                <button class="tab-link" onclick="openTab(event, 'collateral')">Collateral</button>
            </div>

            <div id="email" class="tab-content active">
                ${renderEmailContent(module.content.email)}
            </div>
            <div id="phone" class="tab-content">
                ${renderPhoneScript(module.content.phone)}
            </div>
            <div id="linkedin" class="tab-content">
                ${renderLinkedInContent(module.content.linkedin)}
            </div>
            <div id="objections" class="tab-content">
                ${renderObjections(module.content.objections)}
            </div>
            <div id="collateral" class="tab-content">
                ${renderCollateral(module.content.collateral)}
            </div>
        `;

        content.innerHTML = html;

    } catch (error) {
        console.error("Error rendering module detail:", error);
        content.innerHTML = `<p>Error loading module details. Please check the console.</p>`;
    }

    backButton.style.display = 'inline-block';
    backButton.textContent = `← Back to Module List`;
    backButton.onclick = () => location.hash = `#pursuit=${pursuitId}`;
}

function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

function renderContentSection(title, body, buttonText) {
    return `
        <div class="content-box">
             <h4>${title}<button class="copy-btn">${buttonText}</button></h4>
             <div class="copy-content">${body.replace(/\n/g, '<br>')}</div>
        </div>
    `;
}

function renderObjections(objections) {
    if (!objections || objections.length === 0) return '<div class="content-box"><p>No objections listed.</p></div>';
    let html = '';
    objections.forEach(obj => {
        html += `
            <div class="content-box objection">
                <h4>${obj.objection}<button class="copy-btn">Copy Response</button></h4>
                <div class="copy-content"><p>${obj.response}</p></div>
            </div>
        `;
    });
    return html;
}

function renderCollateral(collateral) {
    if (!collateral) return '';
    return `
        <h3>Collateral</h3>
        <p><a href="${collateral.link}" target="_blank">${collateral.title}</a></p>
    `;
}

function renderPhoneScript(phone) {
    if (!phone) return '<div class="content-box"><p>No phone script found.</p></div>';
    
    let html = '';
    
    // Opening
    html += `<div class="content-box">
        <h4>Opening<button class="copy-btn">Copy Opening</button></h4>
        <div class="copy-content">${phone.opening.replace(/\n/g, '<br>')}</div>
    </div>`;
    
    // Key Message
    html += `<div class="content-box">
        <h4>Key Message<button class="copy-btn">Copy Message</button></h4>
        <div class="copy-content">${phone.key_message.replace(/\n/g, '<br>')}</div>
    </div>`;
    
    // Evidence Point
    html += `<div class="content-box">
        <h4>Evidence Point<button class="copy-btn">Copy Evidence</button></h4>
        <div class="copy-content">${phone.evidence_point.replace(/\n/g, '<br>')}</div>
    </div>`;
    
    // Engagement Question
    html += `<div class="content-box">
        <h4>Engagement Question<button class="copy-btn">Copy Question</button></h4>
        <div class="copy-content">${phone.engagement_question.replace(/\n/g, '<br>')}</div>
    </div>`;
    
    // Voicemail Script
    if (phone.voicemail) {
        html += `<div class="content-box">
            <h4>Voicemail Script<button class="copy-btn">Copy Voicemail</button></h4>
            <div class="copy-content">${phone.voicemail.replace(/\n/g, '<br>')}</div>
        </div>`;
    }
    
    return html;
}

function renderLinkedInContent(linkedin) {
    if (!linkedin) return '<div class="content-box"><p>No LinkedIn content found.</p></div>';
    
    let html = '';
    
    // Connection Request
    if (linkedin.connection_request) {
        html += `<div class="content-box">
            <h4>Connection Request<button class="copy-btn">Copy Connection Request</button></h4>
            <div class="copy-content">${linkedin.connection_request.replace(/\n/g, '<br>')}</div>
        </div>`;
    }
    
    // InMessage Subject
    if (linkedin.inmessage_subject) {
        html += `<div class="content-box">
            <h4>InMessage Subject<button class="copy-btn">Copy Subject</button></h4>
            <div class="copy-content">${linkedin.inmessage_subject.replace(/\n/g, '<br>')}</div>
        </div>`;
    }
    
    // InMessage Body
    if (linkedin.inmessage_body) {
        html += `<div class="content-box">
            <h4>InMessage Body<button class="copy-btn">Copy InMessage</button></h4>
            <div class="copy-content">${linkedin.inmessage_body.replace(/\n/g, '<br>')}</div>
        </div>`;
    }
    
    return html;
}

function renderEmailContent(email) {
    if (!email) return '<div class="content-box"><p>No email content found.</p></div>';
    
    let html = '';
    
    // Subject Line
    if (email.subject) {
        html += `<div class="content-box">
            <h4>Subject Line<button class="copy-btn">Copy Subject</button></h4>
            <div class="copy-content">${email.subject}</div>
        </div>`;
    }
    
    // Email Body
    if (email.body) {
        html += `<div class="content-box">
            <h4>Email Body<button class="copy-btn">Copy Email</button></h4>
            <div class="copy-content">${email.body.replace(/\n/g, '<br>')}</div>
        </div>`;
    }
    
    return html;
}

function renderPursuitList() {
    let html = '<h2>Select a Pursuit</h2><div class="pursuit-list">';
    for (const id in config.pursuits) {
        const pursuit = config.pursuits[id];
        html += `
            <div class="pursuit-card" data-pursuit-id="${id}">
                <h3>${pursuit.title}</h3>
                <p>${pursuit.description}</p>
            </div>
        `;
    }
    html += '</div>';
    content.innerHTML = html;

    document.querySelectorAll('.pursuit-card').forEach(card => {
        card.addEventListener('click', () => {
            location.hash = `#pursuit=${card.dataset.pursuitId}`;
        });
    });

    backButton.style.display = 'inline-block';
    backButton.textContent = '← Back to Home';
    backButton.onclick = () => location.hash = '';
}


function getHashParam(param) {
    const params = new URLSearchParams(location.hash.substring(1));
    return params.get(param);
}

function router() {
    const hash = window.location.hash.substring(1);
    
    if (!hash) {
        renderLandingPage();
        backButton.style.display = 'none';
        return;
    }
    
    const pursuit = getHashParam('pursuit');
    const module = getHashParam('module');

    if (pursuit && module) {
        renderModuleDetail(pursuit, module);
    } else if (pursuit) {
        renderModuleList(pursuit);
    } else {
        renderPursuitList();
    }
}

function renderLandingPage() {
    content.innerHTML = `
        <div class="landing-page">
            <section class="hero-section">
                <div class="hero-content">
                    <h2>Strategic Sales Module Sequences</h2>
                    <p class="hero-description">
                        COMPASS provides curated sequences of sales outreach modules designed to accelerate 
                        prospect engagement and drive successful outcomes for specific sales pursuits.
                    </p>
                    <div class="cta-buttons">
                        <button id="start-compass" class="primary-btn">View Sales Pursuits</button>
                    </div>
                </div>
            </section>
            
            <section class="features-section">
                <div class="features-grid">
                    <div class="feature-card">
                        <h3>📊 Strategic Sequencing</h3>
                        <p>Modules ordered by sales psychology and optimal timing for maximum impact</p>
                    </div>
                    <div class="feature-card">
                        <h3>🎯 Industry-Specific</h3>
                        <p>Tailored content for specific verticals and prospect types</p>
                    </div>
                    <div class="feature-card">
                        <h3>📝 Multi-Channel</h3>
                        <p>Email, phone scripts, LinkedIn outreach, and objection handling</p>
                    </div>
                </div>
            </section>
        </div>
    `;
    
    // Add event listener for the start button
    document.getElementById('start-compass').addEventListener('click', () => {
        location.hash = '#pursuits';
    });
}

function renderAllModules() {
    // This function will need to be implemented
    content.innerHTML = '<h2>All Modules</h2><p>Feature coming soon.</p>';
    backButton.style.display = 'inline-block';
    backButton.onclick = () => location.hash = '';
}

function renderComingSoon(pursuit) {
    content.innerHTML = `
        <div class="coming-soon">
            <h2>${pursuit.title}</h2>
            <p>This pursuit is still under development.</p>
            <h3>Coming Soon!</h3>
        </div>
    `;
    backButton.style.display = 'inline-block';
    backButton.onclick = () => location.hash = '';
}


document.addEventListener('DOMContentLoaded', init);

// Copy button functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('copy-btn')) {
        const contentBox = e.target.closest('.content-box');
        const copyContent = contentBox.querySelector('.copy-content');
        
        if (copyContent) {
            // Get text content, removing HTML tags and converting <br> to newlines
            let textToCopy = copyContent.innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<[^>]*>/g, '')
                .trim();
            
            // Copy to clipboard
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                const originalText = e.target.textContent;
                e.target.textContent = 'Copied!';
                e.target.classList.add('copied');
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Visual feedback
                const originalText = e.target.textContent;
                e.target.textContent = 'Copied!';
                e.target.classList.add('copied');
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.classList.remove('copied');
                }, 2000);
            });
        }
    }
});

