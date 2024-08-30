document.addEventListener('DOMContentLoaded', init, false)

function init() {
    animateHeader()
    initCodeEditor()
}

function animateHeader() {
    const seq = new OCSequence([
        [
            {
                elem: document.getElementById('headline'),
                animationProps: {
                    delay: 0.1,
                    order: 'linear',
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
            elem: document.getElementById('sub-headline'),
            animationProps: {
                delay: 0,
                order: 'linear',
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
    const codeEditorElem = document.getElementById('code-editor');
    const tabs = document.querySelectorAll('#tabs li');
    const runButtonElem = document.getElementById('run-button');
    const previewFrame = document.getElementById('preview-frame');

    let htmlCode = 
`<html>
    <body>
        <h1 id="h1">OchibaJS is awesome!</h1>
        <script src="ochiba.js"></script>
    </body>
</html>
`;
    let cssCode =
`h1 {
    color: black;
    font-family: Tahoma, sans-serif;
    text-align: center;
    margin-top: 80px;
}

h1 .leaf { /* make all leaves invisible first */
    opacity: 0;
}

@keyframes example1 {
    0%   { transform: translateY(50px); opacity: 0; }
    20%  { transform: translateY(-45px); opacity: 0.2; }
    40%  { transform: translateY(35px); opacity: 0.4; }
    60%  { transform: translateY(-20px); opacity: 0.6; }
    80%  { transform: translateY(5px); opacity: 0.8; }
    100% { transform: translateY(0); opacity: 1; }
}

@keyframes example2 {
    0%   { transform: scale(16); color: brown; opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes example3 {
    0%   { transform: scale(16) scaleY(0); color: brown; opacity: 0; }
    50%   { transform: scale(1) scaleY(2); color: brown; opacity: 0.5; }
    80%   { transform: scale(1); color: brown; opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
}
`;
    let jsCode = 
`const elem = document.getElementById('h1');
const oc = new OC(elem);
oc.animateLeaves({
delay: 0,
order: 'linear',
timing: 'linear',
leafAnimation: {
    duration: 1,
    delay: 0,
    timing: 'ease',
    keyframes: 'example1'
},
duration: 1
});
`;
    let currentLang = 'js';

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

    // Initial setup
    switchToEditorTab(currentLang);
}