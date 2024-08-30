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
delay: 0,
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
delay: 0,
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
        <h1 id="h1">Shake it!</h1>
        <script src="ochiba.js"></script>
    </body>
</html>
`,

        cssCode:

`h1 {
    color: #fff;
    font-family: Tahoma, sans-serif;
    text-align: center;
    line-height: 300px;
    font-size: 2em;

}
h1 .leaf { /* make all leaves invisible first */
    opacity: 0;
}
@keyframes shake-it {
    0%   { transform: translateY(0px); text-shadow: 0 0 1px red; box-shadow: 0 0 5px red}
    20%  { transform: translateY(-180px); color: green; text-shadow: 0 0 1px red; box-shadow: 0 0 5px red}
    40%  { transform: translateY(140px); color: blue; text-shadow: 0 0 1px red; box-shadow: 0 0 5px red}
    60%  { transform: translateY(-100px); color: red; text-shadow: 0 0 1px red; box-shadow: 0 0 5px red}
    80%  { transform: translateY(50px); color: green; }
    100% { transform: translateY(0); opacity: 1; color: yellow;}
}
`,
        jsCode:
`const elem = document.getElementById('h1');
const oc = new OC(elem);
oc.animateLeaves({
delay: 0.2,
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
        name: 'Rotate in',
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
    color: red;
    font-family: Tahoma, sans-serif;
    text-align: center;
    margin-top: 80px;
}

@keyframes rotate-in {
    0%   { transform: rotate(-360deg) scale(0); opacity: 0; }
    100% { transform: rotate(0deg) scale(1); opacity: 1; }
}
`,
        jsCode:
`const elem = document.getElementById('h1');
const oc = new OC(elem);
oc.animateLeaves({
delay: 0.1,
order: 'desc',
timing: 'ease-in-out-cubic',
leafAnimation: {
    duration: 1.2,
    timing: 'ease-in-out',
    keyframes: 'rotate-in'
},
duration: 1.2
});
`
    },
    {
        name: 'Slide from top',
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
    color: black;
    font-family: Tahoma, sans-serif;
    text-align: center;
    margin-top: 80px;
}
h1 .leaf { /* make all leaves invisible first */
    opacity: 0;
}
@keyframes slide-from-top {
    0%   { transform: translateY(-100%); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
}
`,
        jsCode:
`const elem = document.getElementById('h1');
const oc = new OC(elem);
oc.animateLeaves({
delay: 0.2,
order: 'asc',
timing: 'ease-out-cubic',
leafAnimation: {
    duration: 1,
    timing: 'ease',
    keyframes: 'slide-from-top'
},
duration: 1
});
`
    }
];
