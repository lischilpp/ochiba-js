const ochibaDemos = [
    {
        name: 'Wave from left',
        htmlCode:
`<html>
    <body>
        <h1 id="h1">OchibaJS is awesome!</h1>
        <script src="js/ochiba.js"></script>
    </body>
</html>
`,

        cssCode:
`h1 {
    color: #fff;
    font-family: Tahoma, sans-serif;
    text-align: center;
    margin-top: 80px;
    opacity: 0;
}
@keyframes wave {
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
    duration: 1,
    order: 'asc',
    timing: 'ease',
    leafAnimation: {
        duration: 1,
        timing: 'ease',
        keyframes: 'wave'
    },
});
`
    },
    {
        name: 'Scale in',
        htmlCode:
`<html>
    <body>
        <h1 id="h1">You can use OchibaJS on any element that has child nodes or text.</h1>
        <script src="js/ochiba.js"></script>
    </body>
</html>
`,

        cssCode:
`h1 {
    color: #fff;
    font-family: Tahoma, sans-serif;
    text-align: center;
    margin-top: 80px;
    font-size: 1.5em;
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
    duration: 1,
    order: 'mid-out',
    timing: 'linear',
    leafAnimation: {
        duration: 1,
        timing: 'ease',
        keyframes: 'scale-in'
    },
});
`
    },
    {
        name: 'Shake It!',
        htmlCode:
`<html>
    <body>
        <h1 id="h1">Shake it! Shake it!</h1>
        <script src="js/ochiba.js"></script>
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
    duration: 1,
    order: 'out-mid',
    timing: 'ease-out',
    leafAnimation: {
        duration: 1,
        timing: 'linear',
        keyframes: 'shake-it',
        iterations: 'infinite',
        fillMode: 'forwards'
    },
});
`
    },
    {
        name: 'List slide-in',
        htmlCode:
`<html>
    <body>
        <h2>Grocery List</h2>
        <ul id="list">
            <li>Apples</li>
            <li>Oranges</li>
            <li>Bananas</li>
            <li>Strawberries</li>
            <li>Blueberries</li>
        </ul>
        <script src="js/ochiba.js"></script>
    </body>
</html>
`,

        cssCode: 
`
body {
    font-family: Tahoma, sans-serif;
}
h2, li {
    color: #fff;
    font-size: 1.2em;
}
ul {
    opacity: 0;
}
h2 {
    margin-left: 10px;
}
@keyframes slide-in-from-left {
    0%   { transform: translateX(-100px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
}`,
        jsCode:
`const elem = document.getElementById('list');
const oc = new OC(elem);
oc.animateLeaves({
    duration: 1,
    order: 'asc',
    timing: 'linear',
    fillMode: 'forwards',
    leafAnimation: {
        duration: 0.5,
        timing: 'ease',
        keyframes: 'slide-in-from-left'
    },
});
    `
    },
    {
        name: 'Whirlwind',
        htmlCode:
`<html>
    <body>
        <h1 id="h1">This looks pretty dope.</h1>
        <script src="js/ochiba.js"></script>
    </body>
</html>
`,

        cssCode: 
`
body {
    font-family: Tahoma, sans-serif;
}
h1 {
    color: aqua;
    font-family: Tahoma, sans-serif;
    text-align: center;
    margin-top: 80px;
    opacity: 0;
}
@keyframes whirlwind {
    from { transform: rotate(7200deg) scale(0.5) translateY(-100px); opacity: 0; }
    to   { transform: rotate(0) scale(1); opacity: 1; }
}`,
        jsCode:
`const elem = document.getElementById('h1');
const oc = new OC(elem);
oc.animateLeaves({
    delay: 0,
    order: 'mid-out',
    timing: 'ease-in',
    leafAnimation: {
        duration: 2,
        delay: 0,
        timing: 'ease-in',
        keyframes: 'whirlwind',
    },
    duration: 1
});
    `
}
];
