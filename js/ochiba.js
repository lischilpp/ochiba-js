class OC_ArgumentParser {

    static cubicBezierRegex = /^cubicBezier\(\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)\s*\)$/;

    static parseAttribute(containingDict, containingDictName, attributeName, attributeType, defaultValue, allowedValues) {
        if (attributeName in containingDict) {
            if (typeof allowedValues !== 'undefined' && typeof containingDict[attributeName] == 'string') {
                if (!allowedValues.includes(containingDict[attributeName])) throw `${containingDictName}.${attributeName} must be one of the following values: ${allowedValues.join(', ')}`;
                return;
            }
            if (typeof containingDict[attributeName] !== attributeType) throw `${containingDictName}.${attributeName} must be of type ${attributeType}`; 
        } else if (typeof defaultValue === attributeType) {
            containingDict[attributeName] = defaultValue;
        }
    }

    static hyphenToCamelCase(str) {
        return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    }

    static isCubicBezierSyntax(str) {
        return OC_ArgumentParser.cubicBezierRegex.test(str);
    }

    static getCubicBezierFromString(str) {
        const match = OC_ArgumentParser.cubicBezierRegex.exec(str);
        return OCTiming.cubicBezier(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]), parseFloat(match[4]));
    }

}


class OCTiming {

    static timingFunctions = {
        // Linear - no easing, no acceleration
        linear: t => t,
        // Ease - slight acceleration from zero to full speed, then slight deceleration
        ease: OCTiming.cubicBezier(0.25, 0.1, 0.25, 1),
        // Ease-in - acceleration from zero velocity
        easeIn: OCTiming.cubicBezier(0.42, 0, 1, 1),
        // Ease-out - deceleration to zero velocity
        easeOut: OCTiming.cubicBezier(0, 0, 0.58, 1),
        // Ease-in-out - acceleration until halfway, then deceleration
        easeInOut: OCTiming.cubicBezier(0.42, 0, 0.58, 1),
    };

    static cubicBezier(p1y, p1x, p2y, p2x) {
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

    static fromString(str) {
        if (str in OCTiming.timingFunctions){
            return OCTiming.timingFunctions[str];
        } else {
            str = str.replace(/ /g,'') // remove spaces
            if (OC_ArgumentParser.isCubicBezierSyntax(str)) {
                return OC_ArgumentParser.getCubicBezierFromString(str);
            } else throw `"${str}" is not a valid timing value`;
        }
    }

}


class OC_CSSAnimation {

    constructor(keyframes, duration, delay, timing, iterations, fillMode, prefixes) {
        this.keyframes = keyframes;
        this.duration = duration;
        this.delay = delay;
        this.timing = timing;
        this.iterations = iterations;
        this.fillMode = fillMode;
        this.prefixes = prefixes;
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

class OC_LeafOrder {

    static orderFunctions = {

        asc: function(options, i, leaveCount) {
            return options.delay + OC_LeafOrder.getDelayForTiming(options.duration, options.timing, i / leaveCount);
        },

        desc: function(options, i, leaveCount) {
            return options.delay + OC_LeafOrder.getDelayForTiming(options.duration, options.timing, (leaveCount - i) / leaveCount);
        },

        midOut: function(options, i, leaveCount) {
            const mid = Math.floor(leaveCount * 0.5);
            let t;
            if (i >= mid) {
                t = (i - mid) / (leaveCount - mid);
            } else {
                t = (mid - i) / mid;
            }
            return options.delay + OC_LeafOrder.getDelayForTiming(options.duration, options.timing, t);
        },

        outMid: function(options, i, leaveCount) {
            const mid = Math.floor(leaveCount * 0.5);
            let t;
            if (i < mid) {
                t = i / mid;
            } else {
                t = (leaveCount - i) / (leaveCount - mid);
            }
            return options.delay + OC_LeafOrder.getDelayForTiming(options.duration, options.timing, t);
        },

        random: function(options, i, leaveCount) {
            if (i == 0) {
                this.shuffled = OC_LeafOrder.intRange(0, leaveCount - 1);
                OC_LeafOrder.shuffleArray(this.shuffled);
            }
            return options.delay + OC_LeafOrder.getDelayForTiming(options.duration, options.timing, this.shuffled[i] / leaveCount);
        },

        segmentsAsc: function(options, i, leaveCount) {
            const interval = Math.floor(leaveCount * 0.25);
            const index = i % interval;
            return options.delay + OC_LeafOrder.getDelayForTiming(options.duration, options.timing, index / interval);
        },

        segmentsDesc: function(options, i, leaveCount) {
            const interval = Math.floor(leaveCount * 0.25);
            const index = i % interval;
            return options.delay + OC_LeafOrder.getDelayForTiming(options.duration, options.timing, (interval - index) / interval);
        }
    }

    static intRange(start, end) {
        return Array.from({length: end - start + 1}, (_, i) => start + i);
    }

    static shuffleArray(array) {
        array.sort(() => .5 - Math.random());
    }

    static getDelayForTiming(duration, timingFunction, progres) {
        return duration * timingFunction(progres);
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
        const style = fixedSize ? 'display: inline-block' : '';
        const letters = this.root.innerHTML.split('');
        this.root.innerHTML = letters.map(letter =>
            letter === ' ' 
                ? '<span style="' + style + '">&nbsp;</span>' 
                : '<span class="leaf" style="' + style + '">' + letter + '</span>'
        ).join('');
        this.leaves = this.root.getElementsByClassName('leaf');
    }

    getPrefixes(options) {
        if ('enablePrefixes' in options && options.enablePrefixes) {
            return ['', '-webkit-', '-moz-', '-o-'];
        }
        return [''];
    }

    animateLeaves(options) {
        options = this.parseAnimationOptions(options);

        for (let i = 0; i < this.leaves.length; i++) {
            const delay = options.leafAnimation.delay + OC_LeafOrder.orderFunctions[options.order](options, i, this.leaves.length);
            this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
        }

        if ('callback' in options) {
            const timeToComplete = parseInt((options.delay + options.duration
                + options.leafAnimation.delay + options.leafAnimation.duration) * 1000)
            window.setTimeout(options.callback, timeToComplete, this.root);
        }
    }

    parseAnimationOptions(options) {
        // ### required attributes
        if (typeof options !== 'object') throw 'options are required'

        // leafAnimation
        // ###### required leafAnimation attributes
        if (!('leafAnimation' in options)) throw 'leafAnimation is required';
        
        // leafAnimation duration
        OC_ArgumentParser.parseAttribute(options.leafAnimation, 'options.leafAnimation', 'duration', 'number', 1);

        // leafAnimation delay
        OC_ArgumentParser.parseAttribute(options.leafAnimation, 'options.leafAnimation', 'delay', 'number', 0);

        // leafAnimation timing
        OC_ArgumentParser.parseAttribute(options.leafAnimation, 'options.leafAnimation', 'timing', 'string', 'ease');

        // leafAnimation iterations
        OC_ArgumentParser.parseAttribute(options.leafAnimation, 'options.leafAnimation', 'iterations', 'number', 1, ['infinite', 'initial', 'inherit']);

        // leafAnimation fillMode
        OC_ArgumentParser.parseAttribute(options.leafAnimation, 'options.leafAnimation', 'fillMode', 'string', 'forwards');

        options.leafAnimation = new OC_CSSAnimation(
            options.leafAnimation.keyframes,
            options.leafAnimation.duration,
            options.leafAnimation.delay,
            options.leafAnimation.timing,
            options.leafAnimation.iterations,
            options.leafAnimation.fillMode,
            this.getPrefixes(options));
        
        // ### optional attributes
        // duration
        OC_ArgumentParser.parseAttribute(options, 'options', 'duration', 'number', 1);

        // delay
        OC_ArgumentParser.parseAttribute(options, 'options', 'delay', 'number', 0);

        // order
        OC_ArgumentParser.parseAttribute(options, 'options', 'order', 'string', 'asc');
        options.order = OC_ArgumentParser.hyphenToCamelCase(options.order);

        // timing
        OC_ArgumentParser.parseAttribute(options, 'options', 'timing', 'string', 'ease');
        options.timing = OC_ArgumentParser.hyphenToCamelCase(options.timing);
        options.timing = OCTiming.fromString(options.timing)

        // callback
        OC_ArgumentParser.parseAttribute(options, 'options', 'callback', 'function');

        return options;
    }

    getLeaveAnimationAsString(options) {
        options = this.parseAnimationOptions(options);
        var cssString = '';
        for (var i = 0; i < this.leaves.length; i++) {
            const delay = options.leafAnimation.delay + OC_LeafOrder.orderFunctions[options.order](options, i, this.leaves.length);
            cssString += `#${this.root.id} .leaf:nth-child(${i + 1}) {${options.leafAnimation.toStringWithModifiedDelay(delay)}}`;
        }
        return cssString;
    }
}


class OC_Sequence {

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