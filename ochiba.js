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
  easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}

class OCHelpers {
    static intRange(start, end) {
        return Array.from({length: end - start + 1}, (_, i) => start + i);
    }
    static shuffleArray(array) {
        array.sort(() => .5 - Math.random());
    }
}

class CSSAnimation {
    constructor(duration, timing, delay, keyframes, prefixes) {
        if (duration == null) throw 'duration is required for CSSAnimation'
        if (timing == null) throw 'timing is required for CSSAnimation'
        if (delay == null) delay = 0
        if (keyframes == null) throw 'keyframes is required for CSSAnimation'
        if (prefixes == null) prefixes = ['']
        this.keyframes = keyframes;
        this.duration = duration;
        this.delay = delay;
        this.timing = timing;
        this.prefixes = prefixes;
    }

    toString() {
        return this.toStringWithModifiedDelay(this.delay);
    }

    toStringWithModifiedDelay(delay) {
        return this.getPrefixedStyle('animation',
            this.duration + 's ' + delay + 's ' + this.timing + ' ' + this.keyframes
         ) + this.getPrefixedStyle('animation-fill-mode', 'forwards');
    }

    getPrefixedStyle(prop, val) {
        return this.prefixes.map(prefix => `;${prefix}${prop}:${val}`).join('');
    }
}


class OCLeafOrder {
    
}

class OC {
    constructor(root) {
        if (root == null) throw 'the given element does not exist'
        this.root = root;

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
        if (options == null) throw 'options are required for defining the animation'
        if (options.leafAnimation == null) throw 'leafAnimation is required for defining the animation'
        if (!('timing' in options)) throw 'timing is required for defining the animation'
        if (!(options.timing in OCTimingFunctions)) throw `timing "${options.timing}" is not a valid timing function`

        const prefixes = this.getPrefixes(options);
        options.leafAnimation = new CSSAnimation(
            options.leafAnimation.duration,
            options.leafAnimation.timing,
            options.leafAnimation.delay,
            options.leafAnimation.keyframes,
            prefixes);
        options.delay = ('delay' in options) ? options.delay : 0;
        switch (options.order) {
            case 'asc':
                for (var i = 0; i < this.leaves.length; i++) {
                    var delay = options.delay + this.getDelayForTiming(options.duration, options.timing, i / this.leaves.length)
                    this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
                }
                break;
            case 'desc':
                var duration = options.duration / this.leaves.length;
                for (var i = this.leaves.length - 1; i >= 0; i--) {
                    const delay = options.delay + this.getDelayForTiming(options.duration, options.timing, (this.leaves.length - i) / this.leaves.length)
                    this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
                }
                break;
            case 'mid-out':
                var duration = Math.floor(options.duration / (this.leaves.length * 0.5));
                var mid = this.leaves.length * 0.5;
                if (mid % 1 == 0) {
                    var toLeft = mid - 1;
                    var toRight = mid;
                } else {
                    var toLeft = mid - 0.5;
                    var toRight = mid - 0.5;
                }
                for (var i = toRight; i < this.leaves.length; i++) {
                    const delay = options.delay + this.getDelayForTiming(duration, options.timing, (i - toRight) / toRight)
                    this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
                }
                for (var i = toLeft; i >= 0; i--) {
                    const delay = options.delay + this.getDelayForTiming(duration, options.timing, (toLeft - i) / toLeft)
                    this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
                }
                break;
            case 'out-mid':
                var duration = Math.floor(options.duration / (this.leaves.length * 0.5));
                var mid = this.leaves.length * 0.5;
                if (mid % 1 == 0) {
                    var toLeft = mid - 1;
                    var toRight = mid;
                } else {
                    var toLeft = mid - 0.5;
                    var toRight = mid - 0.5;
                }
                for (var i = 0; i <= toRight; i++) {
                    const delay = options.delay + this.getDelayForTiming(duration, options.timing, i / toRight)
                    this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
                }
                for (var i = this.leaves.length - 1; i >= toLeft; i--) {
                    const delay = options.delay + this.getDelayForTiming(duration, options.timing, (this.leaves.length - 1 - i) / toLeft)
                    this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
                }
                break;
            case 'random':
                var order = OCHelpers.intRange(0, this.leaves.length - 1);
                shuffleArray(order);
                for (var i = 0; i < this.leaves.length; i++) {
                    var delay = this.getDelayForTiming(options.timing, i / this.leaves.length, options.duration);
                    this.leaves[i].style.cssText += options.leafAnimation.toStringWithModifiedDelay(delay);
                }
                break;
        }
        if ('callback' in options) {
            const timeToComplete = parseInt((options.delay + options.duration
                + options.leafAnimation.delay + options.leafAnimation.duration) * 1000)
            window.setTimeout(options.callback, timeToComplete, this.root);
        }
    }
    // timing, progres, duration
    getDelayForTiming = function (duration, timing, progres) {
        return duration - OCTimingFunctions[timing](1 - progres) * duration;
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