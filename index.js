document.addEventListener('DOMContentLoaded', init, false)

function init() {
    animateHeader()
    initCodeEditor()
}

function animateHeader() {
    const seq = new OCSequence([
        [
            {
                root: document.getElementById('headline'),
                animationProps: {
                    delay: 0.1,
                    order: 'asc',
                    timing: 'linear',
                    leafAnimation: {
                        duration: 1,
                        delay: 0,
                        timing: 'ease',
                        keyframes: 'headline'
                    },
                    duration: 1,
                }
            }
        ],
        [{
            root: document.getElementById('sub-headline'),
            animationProps: {
                delay: 0,
                order: 'asc',
                timing: 'linear',
                leafAnimation: {
                    duration: 1,
                    delay: 0,
                    timing: 'ease',
                    keyframes: 'sub-headline'
                },
                duration: 1
            }
        }],
    ])
    seq.animate()
}


function initCodeEditor() {
    const demoListElem = document.getElementById('demo-list');
    const codeEditorElem = document.getElementById('code-editor');
    const tabs = document.querySelectorAll('#tabs li');
    const runButtonElem = document.getElementById('run-button');
    const previewFrame = document.getElementById('preview-frame');

    let htmlCode = '';
    let cssCode = '';
    let jsCode = '';
    let currentLang = 'js';

    function loadDemo(demo) {
        htmlCode = demo.htmlCode;
        cssCode = demo.cssCode;
        jsCode = demo.jsCode;
        switchToEditorTab('js');
    }

    function updatePreview() {
        const previewContent = `
            <html>
                <head>
                    <style>${cssCode}</style>
                </head>
                <body>
                    ${htmlCode}
                    <script>${jsCode}</script>
                </body>
            </html>
        `;
        previewFrame.srcdoc = previewContent;
    }

    function switchToEditorTab(lang) {
        tabs.forEach(t => t.classList.remove('active'));
        const tab = Array.from(tabs).find(t => t.dataset.lang === lang);
        tab.classList.add('active');
        currentLang = lang;
        codeEditorElem.value = lang === 'html' ? htmlCode : lang === 'css' ? cssCode : jsCode;
    }

    // switch to different editor tab when clicking on tab
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchToEditorTab(tab.dataset.lang);
        });
    });

    // automatically update preview when changing code
    codeEditorElem.addEventListener('input', () => {
        if (currentLang === 'html') htmlCode = codeEditorElem.value;
        if (currentLang === 'css') cssCode = codeEditorElem.value;
        if (currentLang === 'js') jsCode = codeEditorElem.value;
        updatePreview();
    });

    // update preview when clicking run button
    runButtonElem.addEventListener('click', () => {
        updatePreview();
    });

    demoListElem.innerHTML = ochibaDemos.map((demo, i) => `<li data-index="${i}">${demo.name}</li>`).join('');

    demoListElem.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const demoIndex = parseInt(e.target.dataset.index);
            loadDemo(ochibaDemos[demoIndex]);
            updatePreview();
        }
    });

    loadDemo(ochibaDemos[0]);
}