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
                        <div class="module-title">${module.metadata.title}</div>
                        <div class="module-tags">
                            <span class="tag">${module.metadata.module_type}</span>
                            <span class="tag">${module.metadata.practice_area}</span>
                        </div>
                    </td>
                    <td>${moduleInfo.delay}</td>
                    <td>${moduleInfo.notes}</td>
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
    backButton.onclick = () => location.hash = '';
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
                ${renderContentSection('Email Content', module.content.email.body, 'Copy Email')}
            </div>
            <div id="phone" class="tab-content">
                ${renderContentSection('Phone Script', module.content.phone.key_message, 'Copy Script')}
            </div>
            <div id="linkedin" class="tab-content">
                ${renderContentSection('LinkedIn Content', module.content.linkedin.inmessage_body, 'Copy Content')}
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

    backButton.style.display = 'none';
}


function getHashParam(param) {
    const params = new URLSearchParams(location.hash.substring(1));
    return params.get(param);
}

function router() {
    const pursuitId = getHashParam('pursuit');
    const moduleId = getHashParam('module');

    if (moduleId && pursuitId) {
        renderModuleDetail(pursuitId, moduleId);
    } else if (pursuitId) {
        const pursuit = config.pursuits[pursuitId];
        if (pursuit.status === 'coming-soon') {
            renderComingSoon(pursuit);
        } else {
            renderModuleList(pursuitId);
        }
    } else if (location.hash === '#all-modules') {
        renderAllModules();
    } else {
        renderPursuitList();
    }
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

