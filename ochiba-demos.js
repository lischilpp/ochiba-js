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
    color: black;
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
    color: black;
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
order: 'out-mid',
timing: 'linear',
leafAnimation: {
    duration: 1,
    timing: 'ease',
    keyframes: 'scale-in'
},
duration: 1
});
`
    }
];
