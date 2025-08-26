const content = document.getElementById('app-container');
const headerNav = document.getElementById('header-nav');
let config = {};
let backButton;



async function init() {
    try {
        const response = await fetch(`config.json?v=${new Date().getTime()}`);
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
        'Company Intro': 'Company Intro',
        'General / Company Intro': 'General / Company Intro',
        'Core Capability': 'Core Capability',
        'Solution': 'Solution',
        'Success Story': 'Success Story',
        'Talent': 'Talent'
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

async function renderModuleDetailFromId(moduleId) {
    try {
        // Find the module file that contains this module ID
        const moduleFiles = [
            'intro_eliassen_group_overview.json',
            'intro_eliassen_tech_services.json',
            'intro_eliassen_pro_services.json',
            'into_eliassen_delivery_models.json',
            'core_capability_data_ai_practice_overview.json',
            'core_capability_data_architecture_modernization.json',
            'core_capability_ai_portfolio.json',
            'core_capability_ai_delivery.json',
            'solution_data_governance__compliance_framework.json',
            'solution_enterprise_llm_implementation.json',
            'success_story_ai-powered_documentation_automation.json',
            'success_story_ai-powered_regulatory_intelligence.json',
            'success_story_product_agility_transformation.json',
            'success_story_enterprise_agile_transformation.json',
            'talent_ai__data_expertise.json'
        ];

        let module = null;
        for (const file of moduleFiles) {
            try {
                const response = await fetch(`modules/${file}?v=${new Date().getTime()}`);
                if (response.ok) {
                    const moduleData = await response.json();
                    if (moduleData.metadata.module_id === moduleId) {
                        module = moduleData;
                        break;
                    }
                }
            } catch (error) {
                console.error('Error loading module:', file, error);
            }
        }

        if (!module) {
            content.innerHTML = '<p>Module not found.</p>';
            return;
        }

        // Check if this is a success story module
        const isSuccessStory = module.metadata.module_type === "Success Story";

        let html = `
            <div class="module-detail-header">
                <div class="module-header-left">
                    <h2>${module.metadata.title}</h2>
                    <p class="module-overview-text">${module.metadata.overview}</p>
                </div>
                <div class="module-header-right">
                    <details class="module-intel-details">
                        <summary>View Module Details</summary>
                        <div class="module-intel-box">
                            <p><strong>Module ID:</strong> ${module.metadata.module_id}</p>
                            <p><strong>Module Type:</strong> ${module.metadata.module_type}</p>
                            <p><strong>Relevant Roles:</strong> ${module.metadata.relevant_roles.join(', ')}</p>
                        </div>
                    </details>
                </div>
            </div>

            <div class="tabs">
                <button class="tab-link active" onclick="openTab(event, 'email')">Email</button>
                <button class="tab-link" onclick="openTab(event, 'phone')">Phone Script</button>
                <button class="tab-link" onclick="openTab(event, 'linkedin')">LinkedIn</button>
                <button class="tab-link" onclick="openTab(event, 'objections')">Objections</button>
                ${isSuccessStory ? '<button class="tab-link" onclick="openTab(event, \'collateral\')">Collateral</button>' : ''}
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
            ${isSuccessStory ? `<div id="collateral" class="tab-content">
                ${renderCollateral(module.content.collateral)}
            </div>` : ''}
        `;

        content.innerHTML = html;

    } catch (error) {
        console.error("Error rendering module detail:", error);
        content.innerHTML = `<p>Error loading module details. Please check the console.</p>`;
    }

    backButton.style.display = 'inline-block';
    backButton.textContent = `← Back to All Modules`;
    backButton.onclick = () => location.hash = '#all-modules';
}


async function renderModuleDetail(pursuitId, moduleId) {
    try {
        const response = await fetch(`modules/${moduleId}?v=${new Date().getTime()}`);
        const module = await response.json();

        // Check if this is a success story module
        const isSuccessStory = module.metadata.module_type === "Success Story";

        let html = `
            <div class="module-detail-header">
                <div class="module-header-left">
                    <h2>${module.metadata.title}</h2>
                    <p class="module-overview-text">${module.metadata.overview}</p>
                </div>
                <div class="module-header-right">
                    <details class="module-intel-details">
                        <summary>View Module Details</summary>
                        <div class="module-intel-box">
                            <p><strong>Module ID:</strong> ${module.metadata.module_id}</p>
                            <p><strong>Module Type:</strong> ${module.metadata.module_type}</p>
                            <p><strong>Relevant Roles:</strong> ${module.metadata.relevant_roles.join(', ')}</p>
                        </div>
                    </details>
                </div>
            </div>

            <div class="tabs">
                <button class="tab-link active" onclick="openTab(event, 'email')">Email</button>
                <button class="tab-link" onclick="openTab(event, 'phone')">Phone Script</button>
                <button class="tab-link" onclick="openTab(event, 'linkedin')">LinkedIn</button>
                <button class="tab-link" onclick="openTab(event, 'objections')">Objections</button>
                ${isSuccessStory ? '<button class="tab-link" onclick="openTab(event, \'collateral\')">Collateral</button>' : ''}
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
            ${isSuccessStory ? `<div id="collateral" class="tab-content">
                ${renderCollateral(module.content.collateral)}
            </div>` : ''}
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
        <div class="content-box">
            <h4>Case Study Collateral</h4>
            <p><a href="${collateral.link}" target="_blank" rel="noopener noreferrer">${collateral.title}</a></p>
        </div>
    `;
}

function renderPhoneScript(phone) {
    if (!phone) return '<div class="content-box"><p>No phone script found.</p></div>';

    let html = '<div class="content-box disclaimer"><strong>Note:</strong> Use as a talking points guide, not a verbatim script.</div>';

    const createSection = (title, content) => {
        if (!content || content.length === 0) return '';
        
        let listItems = '';
        if (Array.isArray(content)) {
            listItems = content.map(item => `<li>${item}</li>`).join('');
        } else {
            listItems = `<li>${content}</li>`;
        }

        return `
            <div class="content-box">
                <h4>${title}</h4>
                <ul class="copy-content talking-points">
                    ${listItems}
                </ul>
            </div>
        `;
    };

    html += createSection('Key Talking Points', phone.key_talking_points);
    html += createSection('Evidence Point', phone.evidence_point);
    html += createSection('Engagement Question', phone.engagement_question);
    html += createSection('Voicemail Script', phone.voicemail);


    
    return html;
}

function renderLinkedInContent(linkedin) {
    if (!linkedin) return '<div class="content-box"><p>No LinkedIn content found.</p></div>';
    
    let html = '';
    
    // Connection Request
    if (linkedin.connection_request) {
        html += `<div class="content-box">
            <h4>Connection Request<button class="copy-btn">Copy Connection Request</button></h4>
            <div class="copy-content">${linkedin.connection_request.replace(/\\n/g, '<br>').replace(/\n/g, '<br>')}</div>
        </div>`;
    }
    
    // InMessage Subject
    if (linkedin.inmessage_subject) {
        html += `<div class="content-box">
            <h4>InMessage Subject<button class="copy-btn">Copy Subject</button></h4>
            <div class="copy-content">${linkedin.inmessage_subject.replace(/\\n/g, '<br>').replace(/\n/g, '<br>')}</div>
        </div>`;
    }
    
    // InMessage Body
    if (linkedin.inmessage_body) {
        html += `<div class="content-box">
            <h4>InMessage Body<button class="copy-btn">Copy InMessage</button></h4>
            <div class="copy-content">${linkedin.inmessage_body.replace(/\\n/g, '<br>').replace(/\n/g, '<br>')}</div>
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
        // Convert \n and \\n to <br> tags, then convert ** to <strong>
        let formattedBody = email.body
            .replace(/\\n/g, '<br>')
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
        html += `<div class="content-box">
            <h4>Email Body<button class="copy-btn">Copy Email</button></h4>
            <div class="copy-content">${formattedBody}</div>
        </div>`;
    }
    

    
    return html;
}

function renderPursuitList() {
    const pursuitEntries = Object.entries(config.pursuits);
    
    content.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
            <h2>COMPASS Demo</h2>
            <p>This demonstration shows how COMPASS guides sales teams through strategic outreach sequences. Click any pursuit below to see the recommended module sequence for that sales scenario.</p>
            
                         <div class="pursuit-list">
                 ${pursuitEntries.map(([pursuitId, pursuit]) => `
                     <div class="pursuit-card" onclick="location.hash='#pursuit=${pursuitId}'">
                         <h3 class="persona-title">${pursuit.title}</h3>
                         <p class="persona-focus">Focus: ${pursuit.description}</p>
                         <p class="persona-narrative">Navigate Rapid Pace of AI</p>
                     </div>
                 `).join('')}
             </div>
            
            <div style="margin-top: 3rem; text-align: center;">
                <button id="show-all-modules" class="secondary-btn" style="margin-bottom: 1rem;">All Modules - By Type</button>
                <button id="show-all-modules-practice" class="secondary-btn" style="margin-bottom: 1rem; margin-left: 1rem;">All Modules - By Practice</button>
                <p style="color: #666; font-style: italic;">Select a pursuit type above to explore the COMPASS methodology with real sales content.</p>
            </div>
        </div>
    `;
    
    backButton.style.display = 'inline-block';
    backButton.textContent = '← Back to Home';
    backButton.onclick = () => location.hash = '';
    
    // Add event listener for the show all modules button
    document.getElementById('show-all-modules').addEventListener('click', () => {
        location.hash = '#all-modules';
    });
    
    // Add event listener for the show all modules by practice button
    document.getElementById('show-all-modules-practice').addEventListener('click', () => {
        location.hash = '#all-modules-practice';
    });
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
    const moduleId = getHashParam('module');

    if (pursuit && module) {
        renderModuleDetail(pursuit, module);
    } else if (pursuit) {
        renderModuleList(pursuit);
    } else if (moduleId) {
        renderModuleDetailFromId(moduleId);
    } else if (hash === 'pursuits') {
        renderPursuitList();
    } else if (hash === 'all-modules') {
        renderAllModulesByType();
    } else if (hash === 'all-modules-practice') {
        renderAllModulesByPractice();
    } else {
        renderLandingPage();
    }
}

function renderLandingPage() {
    content.innerHTML = `
        <div class="landing-page">
            <section class="hero-section" style="padding: 2rem 0;">
                <div class="hero-content">
                    <div style="text-align: center; margin-bottom: 1.5rem;">
                        <img src="images/Compass-fullres.png" alt="COMPASS" style="max-width: 600px; height: auto; margin-bottom: 1rem;">
                    </div>
                    <p class="hero-description" style="margin-bottom: 1.5rem;">
                        COMPASS provides curated sequences of sales outreach modules designed to engage 
                        prospects across different personas and showcase practice capabilities through strategic, 
                        targeted messaging and optimal sequencing.
                    </p>
                    <div class="cta-buttons">
                        <button id="start-compass" class="primary-btn">View Sales Pursuits</button>
                    </div>
                </div>
            </section>
            
            <section class="features-section" style="padding: 1.5rem 0;">
                <div class="features-grid">
                    <div class="feature-card">
                        <h3>📊 Strategic Sequencing</h3>
                        <p>Modules ordered by sales psychology and optimal timing for maximum impact</p>
                    </div>
                    <div class="feature-card">
                        <h3>🎯 Persona-Focused</h3>
                        <p>Tailored content for different prospect personas and leadership challenges</p>
                    </div>
                    <div class="feature-card">
                        <h3>📝 Multi-Channel</h3>
                        <p>Email, phone scripts, LinkedIn outreach, and objection handling</p>
                    </div>
                </div>
            </section>
        </div>
    `;
    
    // Add event listener for the button
    document.getElementById('start-compass').addEventListener('click', () => {
        location.hash = '#pursuits';
    });
}

async function renderAllModulesByType() {
    try {
        // Get all module files from the modules directory
        const moduleFiles = [
            'intro_eliassen_group_overview.json',
            'intro_eliassen_tech_services.json',
            'intro_eliassen_pro_services.json',
            'into_eliassen_delivery_models.json',
            'core_capability_data_ai_practice_overview.json',
            'core_capability_data_architecture_modernization.json',
            'core_capability_ai_portfolio.json',
            'core_capability_ai_delivery.json',
            'solution_data_governance__compliance_framework.json',
            'solution_enterprise_llm_implementation.json',
            'success_story_ai-powered_documentation_automation.json',
            'success_story_ai-powered_regulatory_intelligence.json',
            'success_story_product_agility_transformation.json',
            'success_story_enterprise_agile_transformation.json',
            'talent_ai__data_expertise.json'
        ];

        // Load all modules
        const modules = [];
        for (const file of moduleFiles) {
            try {
                const response = await fetch(`modules/${file}?v=${new Date().getTime()}`);
                if (response.ok) {
                    const module = await response.json();
                    modules.push(module);
                }
            } catch (error) {
                console.error('Error loading module:', file, error);
            }
        }

        // Group modules by type
        const modulesByType = {};
        modules.forEach(module => {
            let type = module.metadata.module_type;
            
            // Combine Company Introduction and Company Intro into one section
            if (type === "Company Introduction" || type === "Company Intro") {
                type = "General / Company Intro";
            }
            
            if (!modulesByType[type]) {
                modulesByType[type] = [];
            }
            modulesByType[type].push(module);
        });

        // Generate HTML
        let html = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
                <h2>All Modules - By Type</h2>
                <p style="margin-bottom: 2rem; color: #666;">Browse all available modules organized by their type and purpose.</p>
        `;

        // Sort module types for consistent display
        const sortedTypes = Object.keys(modulesByType).sort();
        
        sortedTypes.forEach(type => {
            const typeModules = modulesByType[type];
            html += `
                <div class="module-type-section" style="margin-bottom: 3rem;">
                    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
                        ${type}
                    </h3>
                    <div class="module-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem;">
            `;

            typeModules.forEach(module => {
                html += `
                    <div class="module-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" 
                         onclick="location.hash='#module=${module.metadata.module_id}'">
                        <h4 style="margin: 0 0 0.75rem 0; color: #2c3e50; font-size: 1.1rem;">${module.metadata.title}</h4>
                        <p style="margin: 0; color: #7f8c8d; font-size: 0.9rem; line-height: 1.4;">${module.metadata.overview}</p>
                        <div style="margin-top: 1rem;">
                            <span class="tag practice-area ${convertToClassname(module.metadata.practice_area)}" style="font-size: 0.8rem; padding: 0.2rem 0.5rem;">${module.metadata.practice_area}</span>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `</div>`;

        content.innerHTML = html;

        // Add hover effects
        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
        });

    } catch (error) {
        console.error("Error rendering all modules:", error);
        content.innerHTML = '<p>Error loading modules. Please check the console.</p>';
    }

    backButton.style.display = 'inline-block';
    backButton.textContent = '← Back to Pursuits';
    backButton.onclick = () => location.hash = '#pursuits';
}

async function renderAllModulesByPractice() {
    try {
        // Get all module files from the modules directory
        const moduleFiles = [
            'intro_eliassen_group_overview.json',
            'intro_eliassen_tech_services.json',
            'intro_eliassen_pro_services.json',
            'into_eliassen_delivery_models.json',
            'core_capability_data_ai_practice_overview.json',
            'core_capability_data_architecture_modernization.json',
            'core_capability_ai_portfolio.json',
            'core_capability_ai_delivery.json',
            'solution_data_governance__compliance_framework.json',
            'solution_enterprise_llm_implementation.json',
            'success_story_ai-powered_documentation_automation.json',
            'success_story_ai-powered_regulatory_intelligence.json',
            'success_story_product_agility_transformation.json',
            'success_story_enterprise_agile_transformation.json',
            'talent_ai__data_expertise.json'
        ];

        // Load all modules
        const modules = [];
        for (const file of moduleFiles) {
            try {
                const response = await fetch(`modules/${file}?v=${new Date().getTime()}`);
                if (response.ok) {
                    const module = await response.json();
                    modules.push(module);
                }
            } catch (error) {
                console.error('Error loading module:', file, error);
            }
        }

        // Group modules by practice area
        const modulesByPractice = {};
        modules.forEach(module => {
            const practice = module.metadata.practice_area;
            if (!modulesByPractice[practice]) {
                modulesByPractice[practice] = [];
            }
            modulesByPractice[practice].push(module);
        });

        // Generate HTML
        let html = `
            <div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
                <h2>All Modules - By Practice</h2>
                <p style="margin-bottom: 2rem; color: #666;">Browse all available modules organized by their practice area and specialization.</p>
        `;

        // Sort practice areas for consistent display
        const sortedPractices = Object.keys(modulesByPractice).sort();
        
        sortedPractices.forEach(practice => {
            const practiceModules = modulesByPractice[practice];
            html += `
                <div class="module-practice-section" style="margin-bottom: 3rem;">
                    <h3 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; margin-bottom: 1.5rem;">
                        ${practice}
                    </h3>
                    <div class="module-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem;">
            `;

            practiceModules.forEach(module => {
                html += `
                    <div class="module-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;" 
                         onclick="location.hash='#module=${module.metadata.module_id}'">
                        <h4 style="margin: 0 0 0.75rem 0; color: #2c3e50; font-size: 1.1rem;">${module.metadata.title}</h4>
                        <p style="margin: 0; color: #7f8c8d; font-size: 0.9rem; line-height: 1.4;">${module.metadata.overview}</p>
                        <div style="margin-top: 1rem;">
                            <span class="tag module-type ${convertToClassname(module.metadata.module_type)}" style="font-size: 0.8rem; padding: 0.2rem 0.5rem;">${module.metadata.module_type}</span>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `</div>`;

        content.innerHTML = html;

        // Add hover effects
        document.querySelectorAll('.module-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            });
        });

    } catch (error) {
        console.error("Error rendering all modules by practice:", error);
        content.innerHTML = '<p>Error loading modules. Please check the console.</p>';
    }

    backButton.style.display = 'inline-block';
    backButton.textContent = '← Back to Pursuits';
    backButton.onclick = () => location.hash = '#pursuits';
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
    if (e.target.classList.contains('copy-btn') || e.target.classList.contains('copy-btn-inline')) {
        let copyContent;
        
        if (e.target.classList.contains('copy-btn-inline')) {
            // For inline copy buttons, find the copy-content in the same list item
            const listItem = e.target.closest('li');
            copyContent = listItem.querySelector('.copy-content');
        } else {
            // For regular copy buttons, find the copy-content in the same content box
            const contentBox = e.target.closest('.content-box');
            copyContent = contentBox.querySelector('.copy-content');
        }
        
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

