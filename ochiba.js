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
    constructor(duration, timing, delay, keyframes) {
        if (duration == null) throw 'duration is required for CSSAnimation'
        if (timing == null) throw 'timing is required for CSSAnimation'
        if (delay == null) delay = 0
        if (keyframes == null) throw 'keyframes is required for CSSAnimation'
        this.keyframes = keyframes;
        this.duration = duration;
        this.delay = delay;
        this.timing = timing;
    }

    toString() {
        const delay = (animation.delay + delay) || delay|| 0;

        return this.getPrefixedStyle('animation',
            animation.duration + 's ' + delay + 's ' + animation.timing + ' ' + animation.keyframes
         ) + this.getPrefixedStyle('animation-fill-mode', 'forwards');
    }

    getPrefixedStyle(prop, val) {
        var style = '';
        for (var i = 0; i < this.prefixes.length; i++)
            style += ';' + this.prefixes[i] + prop + ':' + val;
        return style;
    }
}

class OC {
    constructor(root, options) {
        if (root == null) throw 'the given element does not exist'
        this.root = root;

        if (options == null) throw 'options are required for defining the animation'
        if (options.leafAnimation == null) throw 'leafAnimation is required for defining the animation'

        this.options.leafAnimation = new CSSAnimation(
            this.options.leafAnimation.duration,
            this.options.leafAnimation.timing,
            this.options.leafAnimation.delay,
            this.options.leafAnimation.keyframes);

        this.initPrefixes(options);

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

    initPrefixes(options) {
        this.prefixes = [''];
        if (typeof options !== 'undefined') {
            if ('enablePrefixes' in options && options.enablePrefixes) {
                this.prefixes = ['', '-webkit-', '-moz-', '-o-'];
            }
        }
    }

    getAnimatedLeafString(animation, delay) {
        return this.getPrefixedStyle('animation', this.getAnimationString({
            duration: animation.duration,
            delay: (animation.delay + delay) || delay,
            timing: animation.timing,
            keyframes: animation.keyframes
        })) + this.getPrefixedStyle('animation-fill-mode', 'forwards');
    }

    animateLeaves(options) {
        options.delay = (typeof options.delay != 'undefined') ? options.delay : 0;
        switch (options.order) {
            case 'linear':
                for (var i = 0; i < this.leaves.length; i++) {
                    var delay = options.delay + this.getDelayForTiming(options.timing, i / this.leaves.length, options.duration)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay)
                }
                break;
            case 'linear-reverse':
                var duration = options.duration / this.leaves.length;
                for (var i = this.leaves.length - 1; i >= 0; i--) {
                    const delay = options.delay + this.getDelayForTiming(options.timing, (this.leaves.length - i) / this.leaves.length, options.duration)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
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
                    const delay = options.delay + this.getDelayForTiming(options.timing, (i - toRight) / toRight, options.duration)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
                }
                for (var i = toLeft; i >= 0; i--) {
                    const delay = options.delay + this.getDelayForTiming(options.timing, (toLeft - i) / toLeft, options.duration)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
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
                    const delay = options.delay + this.getDelayForTiming(options.timing, i / toRight, duration)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
                }
                for (var i = this.leaves.length - 1; i >= toLeft; i--) {
                    const delay = options.delay + this.getDelayForTiming(options.timing, (this.leaves.length - 1 - i) / toLeft, duration)
                    this.leaves[i].style.cssText += this.getAnimatedLeafString(options.leafAnimation, delay);
                }
                break;
            case 'random':
                var order = OCHelpers.intRange(0, this.leaves.length - 1);
                shuffleArray(order);
                for (var i = 0; i < this.leaves.length; i++) {
                    var delay = this.getDelayForTiming(options.timing, i / this.leaves.length, options.duration);
                    this.leaves[order[i]].style.cssText += this.getAnimatedLeafString(options.leafAnimation, options.delay + delay);
                }
                break;
        }
        if (typeof options.callback != 'undefined') {
            const timeToComplete = parseInt((options.delay + options.duration
                + options.leafAnimation.delay + options.leafAnimation.duration) * 1000)
            window.setTimeout(options.callback, timeToComplete, this.root);
        }
    }

    getAnimationAsHTMLString() {
        return this.root.innerHTML;
    }

    addPrefixedStyle(elem, prop, val) {
        for (var i = 0; i < this.prefixes.length; i++)
            elem.style[this.prefixes[i] + prop] = val;
    }

    

    getDelayForTiming = function (timing, progres, time) {
        return time - OCTimingFunctions[timing](1 - progres) * time;
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