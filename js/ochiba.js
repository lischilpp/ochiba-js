function cubicBezier(p1x, p1y, p2x, p2y) {
    const NEWTON_ITERATIONS = 5;
    const NEWTON_MIN_SLOPE = 0.001;
    
    const cx = 3 * p1x;
    const bx = 3 * (p2x - p1x) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * p1y;
    const by = 3 * (p2y - p1y) - cy;
    const ay = 1 - cy - by;
    
    function cubic(a, b, c, t) {
        return ((a * t + b) * t + c) * t;
    }
    
    function derivative(a, b, c, t) {
        return 3 * a * t * t + 2 * b * t + c;
    }
    
    function newtonRaphsonIterate(x, guessT, ax, bx, cx) {
        let t = guessT;
        for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
            const currentSlope = derivative(ax, bx, cx, t);
            if (Math.abs(currentSlope) < NEWTON_MIN_SLOPE) break;
            const currentX = cubic(ax, bx, cx, t) - x;
            t -= currentX / currentSlope;
        }
        return t;
    }

    return function(t) {
        let x = Math.max(0, Math.min(1, t));
        if (t > 0 && t < 1) {
            x = newtonRaphsonIterate(t, t, ax, bx, cx);
        }
        return cubic(ay, by, cy, x);
    };
}

function inverseCubicBezier(p1x, p1y, p2x, p2y) {
    return cubicBezier(p1y, p1x, p2y, p2x);
}

const OCTimingFunctions = {
    // Linear - no easing, no acceleration
    linear: t => t,
    // Ease - slight acceleration from zero to full speed, then slight deceleration
    ease: inverseCubicBezier(0.25, 0.1, 0.25, 1),
    // Ease-in - acceleration from zero velocity
    easeIn: inverseCubicBezier(0.42, 0, 1, 1),
    // Ease-out - deceleration to zero velocity
    easeOut: inverseCubicBezier(0, 0, 0.58, 1),
    // Ease-in-out - acceleration until halfway, then deceleration
    easeInOut: inverseCubicBezier(0.42, 0, 0.58, 1),
};

class OCHelpers {
    static cubicBezierRegex = /^cubicBezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)$/;

    static intRange(start, end) {
        return Array.from({length: end - start + 1}, (_, i) => start + i);
    }
    static shuffleArray(array) {
        array.sort(() => .5 - Math.random());
    }
    static getDelayForTiming(duration, timingFunction, progres) {
        return duration * timingFunction(progres);
    }
    static hyphenToCamelCase(str) {
        return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    }
    static isCubicBezierSyntax(str) {
        return OCHelpers.cubicBezierRegex.test(str);
    }
    static getInverseCubicBezierFromString(str) {
        const match = OCHelpers.cubicBezierRegex.exec(str);
        return inverseCubicBezier(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4]));
    }
}

class CSSAnimation {
    constructor(duration=1, timing='ease', delay=0, keyframes, iterations=1, fillMode='forwards', prefixes=['']) {
        if (keyframes == null) throw 'keyframes is required for CSSAnimation'
        this.keyframes = keyframes;
        this.duration = duration;
        this.delay = delay;
        this.timing = timing;
        this.prefixes = prefixes;
        this.iterations = iterations;
        this.fillMode = fillMode;
    }

    toString() {
        return this.toStringWithModifiedDelay(this.delay);
    }

    toStringWithModifiedDelay(delay) {
        return this.getPrefixedStyle('animation',
            `${this.keyframes} ${this.duration}s ${this.timing} ${delay}s ${this.iterations}`) +
            this.getPrefixedStyle('animation-fill-mode', this.fillMode);
    }

    getPrefixedStyle(prop, val) {
        return this.prefixes.map(prefix => `;${prefix}${prop}:${val}`).join('');
    }
}

const OCLeafOrder = {
    asc: function(options, i, leaveCount) {
        return options.delay + OCHelpers.getDelayForTiming(options.duration, options.timing, i / leaveCount);
    },
    desc: function(options, i, leaveCount) {
        return options.delay + OCHelpers.getDelayForTiming(options.duration, options.timing, (leaveCount - i) / leaveCount);
    },
    midOut: function(options, i, leaveCount) {
        const mid = Math.floor(leaveCount * 0.5);
        let t;
        if (i >= mid) {
            t = (i - mid) / (leaveCount - mid);
        } else {
            t = (mid - i) / mid;
        }
        return options.delay + OCHelpers.getDelayForTiming(options.duration, options.timing, t);
    },
    outMid: function(options, i, leaveCount) {
        const mid = Math.floor(leaveCount * 0.5);
        let t;
        if (i < mid) {
            t = i / mid;
        } else {
            t = (leaveCount - i) / (leaveCount - mid);
        }
        return options.delay + OCHelpers.getDelayForTiming(options.duration, options.timing, t);
    },
    random: function(options, i, leaveCount) {
        if (i == 0) {
            this.shuffled = OCHelpers.intRange(0, leaveCount - 1);
            OCHelpers.shuffleArray(this.shuffled);
        }
        return options.delay + OCHelpers.getDelayForTiming(options.duration, options.timing, this.shuffled[i] / leaveCount);
    },
    segmentsAsc: function(options, i, leaveCount) {
        const interval = Math.floor(leaveCount * 0.25);
        const index = i % interval;
        return options.delay + OCHelpers.getDelayForTiming(options.duration, options.timing, index / interval);
    },
    segmentsDesc: function(options, i, leaveCount) {
        const interval = Math.floor(leaveCount * 0.25);
        const index = i % interval;
        return options.delay + OCHelpers.getDelayForTiming(options.duration, options.timing, (interval - index) / interval);
    }
}

class OC {
    constructor(root) {
        if (root == null) throw 'the given element does not exist'
        this.root = root;
        this.leaves = [];

        if (this.root.children.length != 0) {
            this.initChildElements();
        } else {
            this.initLetters(true);
        }
    }

    // ### initializing leaves ###

    initChildElements() {
        for (const child of this.root.children) {
            child.classList.add('leaf');
            this.leaves.push(child);
        }
    }
    initLetters(fixedSize) {
        fixedSize = (fixedSize) ? 'display: inline-block' : '';
        var letters = this.root.innerHTML.split('');
        var htmlString = '';
        for (var i = 0; i < letters.length; i++) {
            var letter = letters[i];
            var isLeaf = ' class="leaf"';
            if (letter == ' ') {
                letter = '&nbsp;';
                isLeaf = '';
            }
            htmlString += '<span ' + isLeaf + ' style="' + fixedSize + '">' + letter + '</span>';
        }
        this.root.innerHTML = htmlString;
        this.leaves = this.root.getElementsByClassName('leaf');
    }

    getPrefixes(options) {
        if (typeof options !== 'undefined' && 'enablePrefixes' in options && options.enablePrefixes) {
            return ['', '-webkit-', '-moz-', '-o-'];
        }
        return [''];
    }

    animateLeaves(options) {
        options = this.validateAnimationOptions(options);

        for (let i = 0; i < this.leaves.length; i++) {
            const delay = options.leafAnimation.delay + OCLeafOrder[options.order](options, i, this.leaves.length);
            this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
        }

        if ('callback' in options) {
            const timeToComplete = parseInt((options.delay + options.duration
                + options.leafAnimation.delay + options.leafAnimation.duration) * 1000)
            window.setTimeout(options.callback, timeToComplete, this.root);
        }
    }

    validateAnimationOptions(options) {
        if (options == null) throw 'options are required for defining the animation'
        if (options.leafAnimation == null) throw 'leafAnimation is required for defining the animation';
        
        if ('timing' in options) options.timing = OCHelpers.hyphenToCamelCase(options.timing);
        else options.timing = 'linear';
        if (options.timing in OCTimingFunctions){
            options.timing = OCTimingFunctions[options.timing];
        } else {
            options.timing = options.timing.replace(/ /g,'') // remove spaces
            if (OCHelpers.isCubicBezierSyntax(options.timing)) {
                options.timing = OCHelpers.getInverseCubicBezierFromString(options.timing);
            } else {
                throw `timing "${options.timing}" is not a valid timing function`;
            }
        }
        
        if ('order' in options) options.order = OCHelpers.hyphenToCamelCase(options.order);
        else options.order = 'asc';

        if (!('duration' in options)) options.duration = 1;

        const prefixes = this.getPrefixes(options);
        options.leafAnimation = new CSSAnimation(
            options.leafAnimation.duration,
            options.leafAnimation.timing,
            options.leafAnimation.delay,
            options.leafAnimation.keyframes,
            options.leafAnimation.iterations,
            options.leafAnimation.fillMode,
            prefixes);
        options.delay = ('delay' in options) ? options.delay : 0;

        return options;
    }

    getLeaveAnimationAsString(options) {
        options = this.validateAnimationOptions(options);
        var cssString = '';
        for (var i = 0; i < this.leaves.length; i++) {
            const delay = options.leafAnimation.delay + OCLeafOrder[options.order](options, i, this.leaves.length);
            cssString += `#${this.root.id} .leaf:nth-child(${i + 1}) {${options.leafAnimation.toStringWithModifiedDelay(delay)}}`;
        }
        return cssString;
    }
}

class OCSequence {
    constructor(seqEntries) {
        for (const seqEntry of seqEntries) {
            for (const entry of seqEntry) {
                entry.root = new OC(entry.root)
            }
        }
        this.seqEntries = seqEntries
    }
    animate() {
        let total_delay = 0
        for (const seqEntry of this.seqEntries) {
            let maxDelay = 0
            let maxDuration = 0
            let maxLeafAnimationDelay = 0
            let maxLeafAnimationDuration = 0
            for (const entry of seqEntry) {
                entry.root.animateLeaves({
                    delay: total_delay + entry.animationProps.delay,
                    order: entry.animationProps.order,
                    timing: entry.animationProps.timing,
                    leafAnimation: entry.animationProps.leafAnimation,
                    duration: entry.animationProps.duration,
                })
                if (entry.animationProps.delay > maxDelay)
                    maxDelay = entry.animationProps.delay
                if (entry.animationProps.duration > maxDuration)
                    maxDuration = entry.animationProps.duration
                if (entry.animationProps.leafAnimation.delay > maxLeafAnimationDelay)
                    maxLeafAnimationDelay = entry.animationProps.leafAnimation.delay
                if (entry.animationProps.leafAnimation.duration > maxLeafAnimationDuration)
                    maxLeafAnimationDuration = entry.animationProps.leafAnimation.duration
            }
            total_delay += maxDelay + maxDuration + maxLeafAnimationDelay + maxLeafAnimationDuration
        }
    }
}