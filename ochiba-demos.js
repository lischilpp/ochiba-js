const ochibaDemos = [
    {
        name: 'Wave from left',
        htmlCode:
`<html>
    <body>
        <h1 id="h1">OchibaJS is awesome!</h1>
        <script src="ochiba.js"></script>
    </body>
</html>
`,

        cssCode:
`h1 {
    color: #fff;
    font-family: Tahoma, sans-serif;
    text-align: center;
    margin-top: 80px;
}
h1 .leaf { /* make all leaves invisible first */
    opacity: 0;
}
@keyframes wave-from-left {
    0%   { transform: translateY(50px); opacity: 0; }
    20%  { transform: translateY(-45px); opacity: 0.2; }
    40%  { transform: translateY(35px); opacity: 0.4; }
    60%  { transform: translateY(-20px); opacity: 0.6; }
    80%  { transform: translateY(5px); opacity: 0.8; }
    100% { transform: translateY(0); opacity: 1; }
}
`,
        jsCode:
`const elem = document.getElementById('h1');
const oc = new OC(elem);
oc.animateLeaves({
order: 'asc',
timing: 'linear',
leafAnimation: {
    duration: 1,
    timing: 'ease',
    keyframes: 'wave-from-left'
},
duration: 1
});
`
    },
    {
        name: 'Scale in',
        htmlCode:
`<html>
    <body>
        <h1 id="h1">OchibaJS is awesome!</h1>
        <script src="ochiba.js"></script>
    </body>
</html>
`,

        cssCode:
`h1 {
    color: #fff;
    font-family: Tahoma, sans-serif;
    text-align: center;
    margin-top: 80px;
}
h1 .leaf { /* make all leaves invisible first */
    opacity: 0;
}
@keyframes scale-in {
    0%   { transform: scale(16); color: brown; opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}
`,
        jsCode:
`const elem = document.getElementById('h1');
const oc = new OC(elem);
oc.animateLeaves({
order: 'mid-out',
timing: 'linear',
leafAnimation: {
    duration: 1,
    timing: 'ease',
    keyframes: 'scale-in'
},
duration: 1
});
`
    },
    {
        name: 'Shake It!',
        htmlCode:
`<html>
    <body>
        <h1 id="h1">Shake it! Shake it!</h1>
        <script src="ochiba.js"></script>
    </body>
</html>
`,

        cssCode:

`h1 {
    font-family: Tahoma, sans-serif;
    text-align: center;
    line-height: 150px;
    font-size: 2em;
    letter-spacing: 5px;
}
h1 .leaf {
    color: red;
}
@keyframes shake-it {
    0%   { transform: translateY(0px); text-shadow: 0 0 1px red; box-shadow: 0 0 5px red}
    20%  { transform: translateY(-90px); color: green;}
    40%  { transform: translateY(70px); color: blue;}
    60%  { transform: translateY(-50px); color: red;}
    80%  { transform: translateY(25px); color: green; }
    100% { transform: translateY(0); opacity: 1; color: yellow;}
}
`,
        jsCode:
`const elem = document.getElementById('h1');
const oc = new OC(elem);
oc.animateLeaves({
order: 'out-mid',
timing: 'ease-out-cubic',
leafAnimation: {
    duration: 1,
    timing: 'ease',
    keyframes: 'shake-it',
    iterations: 'infinite',
    fillMode: 'forwards'
},
duration: 1
});
`
    },
    {
        name: 'List slide-in',
        htmlCode:
`<html>
    <body>
        <ul id="list">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
            <li>Item 4</li>
            <li>Item 5</li>
        </ul>
        <script src="ochiba.js"></script>
    </body>
</html>
`,

        cssCode: 
`
.leaf { /* make all leaves invisible first */
    opacity: 0;
}
ul li {
    color: #fff;
    font-family: Tahoma, sans-serif;
    font-size: 1.5em;
}
@keyframes slide-in-from-left {
    0%   { transform: translateX(-100px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
}`,
        jsCode:
`const elem = document.getElementById('list');
const oc = new OC(elem);
oc.animateLeaves({
    order: 'asc',
    timing: 'linear',
    duration: 1,
    leafAnimation: {
        duration: 0.5,
        timing: 'ease',
        keyframes: 'slide-in-from-left'
    },
    fillMode: 'forwards'
});
    `
}
];
