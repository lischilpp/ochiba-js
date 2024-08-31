OCTimingFunctions = {// easing functions by gre: https://gist.github.com/gre/1650294 that are licensed under WTFPL version 2
  // no easing, no acceleration
  linear: t => t,
  // accelerating from zero velocity
  easeInQuad: t => t*t,
  // decelerating to zero velocity
  easeOutQuad: t => t*(2-t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  // accelerating from zero velocity 
  easeInCubic: t => t*t*t,
  // decelerating to zero velocity 
  easeOutCubic: t => (--t)*t*t+1,
  // acceleration until halfway, then deceleration 
  easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  // accelerating from zero velocity 
  easeInQuart: t => t*t*t*t,
  // decelerating to zero velocity 
  easeOutQuart: t => 1-(--t)*t*t*t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
  // accelerating from zero velocity
  easeInQuint: t => t*t*t*t*t,
  // decelerating to zero velocity
  easeOutQuint: t => 1+(--t)*t*t*t*t,
  // acceleration until halfway, then deceleration 
  easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t,
}

class OCHelpers {
    static intRange(start, end) {
        return Array.from({length: end - start + 1}, (_, i) => start + i);
    }
    static shuffleArray(array) {
        array.sort(() => .5 - Math.random());
    }
    static getDelayForTiming(duration, timing, progres) {
        return duration - OCTimingFunctions[timing](1 - progres) * duration;
    }
    static hyphenToCamelCase(str) {
        return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
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
        if (!(options.timing in OCTimingFunctions)) throw `timing "${options.timing}" is not a valid timing function`;
        
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