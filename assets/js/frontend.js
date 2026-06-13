(function () {
    'use strict';

    var win = window;
    var doc = document;
    var config = win.LDBCopaDoMundoConfig || {};
    if (!config || !config.enabled) {
        return;
    }

    var root = null;
    var timers = [];
    var intervalId = null;
    var rafIds = [];
    var liveConfetti = 0;

    function addTimer(id) {
        timers.push(id);
        return id;
    }

    function clamp(value, min, max) {
        value = Number(value);
        if (isNaN(value)) {
            value = min;
        }
        return Math.min(max, Math.max(min, value));
    }

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function color(index, fallback) {
        var palette = Array.isArray(config.palette) ? config.palette : [];
        if (!palette.length) {
            return fallback || '#009739';
        }
        return palette[((index % palette.length) + palette.length) % palette.length] || fallback || '#009739';
    }

    function escapeAttr(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function prefersReducedMotion() {
        return !!(config.behavior && config.behavior.respectReducedMotion && win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function isMobileViewport() {
        var breakpoint = clamp(config.behavior && config.behavior.mobileBreakpoint, 320, 1440);
        return win.innerWidth <= breakpoint;
    }

    function disableOnMobile() {
        return !!(config.behavior && config.behavior.disableOnMobile && isMobileViewport());
    }

    function createRoot() {
        root = doc.createElement('div');
        root.className = 'ldb-copa-root';
        root.setAttribute('aria-hidden', 'true');
        root.style.setProperty('--ldb-copa-z-index', String(clamp(config.behavior && config.behavior.zIndex, 1, 2147483000)));
        doc.body.appendChild(root);
        return root;
    }

    function getCookie(name) {
        var match = doc.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
        return match ? decodeURIComponent(match[1]) : '';
    }

    function setCookie(name, value, days) {
        var expires = '';
        if (days > 0) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = '; expires=' + date.toUTCString();
        }
        doc.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Lax';
    }

    function shouldRunIntro() {
        var intro = config.intro || {};
        var mode = intro.repeatMode || 'days';
        var key = intro.storageKey || 'ldb_copa_intro';
        var cookieName = intro.cookieName || key;
        var cookieDays = clamp(intro.cookieDays, 1, 365);

        if (mode === 'always') {
            return true;
        }

        if (mode === 'session') {
            try {
                if (win.sessionStorage.getItem(key) === '1') {
                    return false;
                }
                win.sessionStorage.setItem(key, '1');
                return true;
            } catch (err) {
                if (getCookie(cookieName) === 'session') {
                    return false;
                }
                setCookie(cookieName, 'session', 1);
                return true;
            }
        }

        if (getCookie(cookieName) === '1') {
            return false;
        }
        setCookie(cookieName, '1', cookieDays);
        return true;
    }

    function ropeYAt(index, total) {
        var progress = total > 1 ? index / (total - 1) : 0;
        return 20 + Math.sin(progress * Math.PI) * 7;
    }

    function solidFlagMarkup(fill, body) {
        return '<path d="' + body + '" fill="' + fill + '" stroke="rgba(15,23,42,.18)" stroke-width="1.15"/>';
    }

    function patternedFlagMarkup(flagIndex, fill, accent, alt, light, body) {
        var patterns = [
            '<rect x="0" y="0" width="40" height="17" fill="' + fill + '"/><rect x="0" y="17" width="40" height="17" fill="' + accent + '"/><rect x="0" y="34" width="40" height="22" fill="' + fill + '"/>',
            '<rect x="0" y="0" width="12" height="56" fill="' + fill + '"/><rect x="12" y="0" width="16" height="56" fill="' + light + '"/><rect x="28" y="0" width="12" height="56" fill="' + accent + '"/>',
            '<rect x="0" y="0" width="40" height="56" fill="' + fill + '"/><polygon points="20,8 31,18 20,28 9,18" fill="' + accent + '"/><circle cx="20" cy="18" r="4.4" fill="' + alt + '"/>',
            '<rect x="0" y="0" width="40" height="56" fill="' + light + '"/><path d="M0 25 H40" stroke="' + accent + '" stroke-width="8"/><path d="M20 0 V56" stroke="' + accent + '" stroke-width="8"/>'
        ];
        return '<path d="' + body + '" fill="' + fill + '" stroke="rgba(15,23,42,.18)" stroke-width="1.15"/>' +
            '<clipPath id="ldbFlagClip' + flagIndex + '"><path d="' + body + '"/></clipPath>' +
            '<g clip-path="url(#ldbFlagClip' + flagIndex + ')">' + patterns[flagIndex % patterns.length] + '</g>';
    }

    function renderBunting() {
        if (!config.features || !config.features.bunting || !root) {
            return;
        }

        var wrap = doc.createElement('div');
        wrap.className = 'ldb-copa-bunting';
        var viewportWidth = Math.max(360, win.innerWidth || doc.documentElement.clientWidth || 1000);
        var bunting = config.bunting || {};
        var coverage = isMobileViewport()
            ? clamp(bunting.coverageMobile, 10, 100)
            : clamp(bunting.coverageDesktop, 10, 100);
        var estimatedFlagWidth = isMobileViewport() ? 42 : 44;
        var count = Math.round((viewportWidth * (coverage / 100)) / estimatedFlagWidth);
        count = Math.max(isMobileViewport() ? 3 : 5, Math.min(isMobileViewport() ? 16 : 32, count));
        var viewWidth = viewportWidth;
        var viewHeight = 112;
        var spacing = viewWidth / (count + 1);
        var rope = escapeAttr('rgba(137, 122, 90, 0.96)');
        var shadow = 'rgba(15,23,42,.14)';
        var ropePath = 'M -24 21';
        var flags = '';

        for (var i = 0; i < count; i += 1) {
            var x = spacing * (i + 1);
            var y = ropeYAt(i, count);
            ropePath += ' L ' + x.toFixed(1) + ' ' + y.toFixed(1);

            var primary = escapeAttr(color(i, '#009739'));
            var accent = escapeAttr(color(i + 1, '#FEDD00'));
            var alt = escapeAttr(color(i + 2, '#012169'));
            var light = escapeAttr(color(i + 3, '#FFFFFF'));
            var shape = i % 4;
            var body = shape === 0
                ? 'M0 0 H44 V54 L22 44 L0 54 Z'
                : (shape === 1
                    ? 'M0 0 H44 V47 L33 62 L22 51 L11 62 L0 47 Z'
                    : (shape === 2 ? 'M0 0 H44 V62 H0 Z' : 'M0 0 H44 V50 L30 62 L14 50 L0 62 Z'));
            var usePattern = (i % 4 === 0);
            var animDuration = (3.7 + (i % 5) * 0.33).toFixed(2);
            var animDelay = (-0.45 * (i % 7)).toFixed(2);
            var innerMarkup = usePattern
                ? patternedFlagMarkup(i, primary, accent, alt, light, body)
                : solidFlagMarkup(primary, body);

            flags += '<g transform="translate(' + (x - 22).toFixed(1) + ' ' + (y + 2).toFixed(1) + ')">' +
                '<g class="ldb-copa-flag-sway" style="animation-duration:' + animDuration + 's;animation-delay:' + animDelay + 's">' +
                    '<path d="M22 -2 V6" stroke="' + rope + '" stroke-width="2" stroke-linecap="round"/>' +
                    '<circle cx="22" cy="2.4" r="2.8" fill="#f6f7fb" stroke="rgba(0,0,0,.18)" stroke-width="1"/>' +
                    '<g filter="url(#ldbCopaFlagShadow)">' + innerMarkup + '</g>' +
                '</g>' +
            '</g>';
        }

        ropePath += ' L ' + (viewWidth + 24) + ' 21';

        wrap.innerHTML = '<svg viewBox="0 0 ' + viewWidth + ' ' + viewHeight + '" preserveAspectRatio="none" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg">' +
            '<defs><filter id="ldbCopaFlagShadow" x="-20%" y="-15%" width="140%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="' + shadow + '" flood-opacity="0.18"/></filter></defs>' +
            '<path d="' + ropePath + '" fill="none" stroke="' + rope + '" stroke-width="3.2" stroke-linecap="round"/>' +
            flags +
        '</svg>';
        root.appendChild(wrap);
    }

    function confettiSvg(fill, shape) {
        if (shape === 1) {
            return '<svg viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"><polygon points="1,2 11,0 9,13 0,12" fill="' + fill + '" /></svg>';
        }
        if (shape === 2) {
            return '<svg viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"><path d="M2 1h8l-1 12H1z" fill="' + fill + '" /></svg>';
        }
        return '<svg viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="1" width="8" height="12" rx="1.5" fill="' + fill + '" /></svg>';
    }

    function spawnConfetti(isInitial) {
        if (!config.features || !config.features.confetti || !root) {
            return;
        }
        var maxLive = isInitial ? (isMobileViewport() ? 85 : 160) : (isMobileViewport() ? 24 : 40);
        if (liveConfetti >= maxLive) {
            return;
        }
        liveConfetti += 1;
        var piece = doc.createElement('span');
        var size = rand(isInitial ? 6 : 4, isInitial ? 13 : 9);
        var duration = rand(isInitial ? 5.5 : 8.5, isInitial ? 10.5 : 14.5);
        var delay = isInitial ? rand(0, 2.4) : 0;
        var drift = rand(-80, 110);
        var x = rand(-4, 100);
        var fill = escapeAttr(color(Math.floor(rand(0, 20)), '#FEDD00'));
        var shape = Math.floor(rand(0, 3));
        piece.className = 'ldb-copa-confetti' + (isInitial ? '' : ' ldb-copa-confetti--soft');
        piece.style.left = x + 'vw';
        piece.style.setProperty('--ldb-copa-piece-size', size + 'px');
        piece.style.setProperty('--ldb-copa-piece-duration', duration + 's');
        piece.style.setProperty('--ldb-copa-piece-delay', delay + 's');
        piece.style.setProperty('--ldb-copa-piece-drift', drift + 'px');
        piece.style.setProperty('--ldb-copa-piece-rot-start', rand(-90, 90) + 'deg');
        piece.style.setProperty('--ldb-copa-piece-rot-end', rand(360, 980) + 'deg');
        piece.style.setProperty('--ldb-copa-piece-opacity', isInitial ? rand(0.6, 0.95) : rand(0.35, 0.68));
        piece.innerHTML = confettiSvg(fill, shape);
        root.appendChild(piece);
        addTimer(win.setTimeout(function () {
            if (piece.parentNode) {
                piece.parentNode.removeChild(piece);
            }
            liveConfetti = Math.max(0, liveConfetti - 1);
        }, (duration + delay + 0.5) * 1000));
    }

    function runInitialConfetti() {
        if (!config.features || !config.features.confetti) {
            return;
        }
        var configuredCount = clamp(config.confetti && config.confetti.initialCount, 0, 300);
        var mobileLimit = isMobileViewport() ? 95 : 300;
        var count = Math.round(Math.min(configuredCount, mobileLimit));
        for (var i = 0; i < count; i += 1) {
            addTimer(win.setTimeout(function () {
                spawnConfetti(true);
            }, rand(0, 2400)));
        }
    }

    function startContinuousConfetti() {
        if (!config.features || !config.features.confetti) {
            return;
        }
        var piecesPerSecond = clamp(config.confetti && config.confetti.continuousPerSecond, 0, 5);
        if (piecesPerSecond <= 0) {
            return;
        }

        var interval = clamp(1000 / piecesPerSecond, 200, 30000);
        intervalId = win.setInterval(function () {
            spawnConfetti(false);
        }, interval);
    }

    function soccerBallSvg() {
        var d = "M61.934 31.992c.021-.713.209-10.904-5.822-17.538c-.268-.593-1.539-2.983-5.641-5.904a41.959 41.959 0 0 0-5.775-3.763l-.008-.004C44.432 4.646 39.43 2 33.359 2c-.461 0-.917.027-1.368.058V2.05c-4.629-.101-9.227 1.09-11.998 2.341c-2.458 1.11-5.187 2.971-5.384 3.115C11.205 9.41 4.75 17.051 4.239 21.1c-2.063 2.637-3.787 14.482.004 21.697c2.658 10.027 12.664 15.045 13.46 15.43c.484.309 5.937 3.68 12.636 3.68c.281 0 1.98.094 2.586.094c7.241 0 17.971-5.104 20.217-9.102c6.171-4.514 9.37-16.147 8.792-20.907M17.758 47.055c-2.869-4.641-4.504-10.705-4.854-12.098c.908-1.361 5.387-7.965 7.939-9.952c1.445.266 7.479 1.374 13.17 2.404c.715 1.853 3.852 10.029 4.75 13.185c-.99 1.174-4.879 5.702-8.708 9.248c-4.065.019-10.979-2.326-12.297-2.787M53.824 14.58c-.012.45-.119 2.05-.885 3.887c-1.521-.777-5.344-2.441-10.584-2.722c-.793-1.171-3.777-5.254-8.49-8.086c.645-1.262 1.543-2.801 2.068-3.27c.17-.048.434-.092.836-.092c2.527 0 6.893 1.655 7.273 1.802c.403.213 8.251 4.439 9.782 8.481M11.773 34.012c-3.423-.584-5.458-1.648-6.066-2.008c-1.273-4.617-.248-9.607-.09-10.322c1.256-2.246 4.832-7.971 7.191-9.058c2.445-.499 5.494.121 6.736.424c-.117 1.615-.342 6.127.326 10.862c-2.706 2.178-6.989 8.447-8.097 10.102M31.685 3.53c.768.057 1.895.225 2.667.454c-.77 1.024-1.559 2.542-1.932 3.292c-1.57.257-7.533 1.397-12.211 4.43c-.943-.25-3.791-.917-6.488-.687c.668-1.293 1.666-2.249 1.773-2.347c.371-.266 7.513-5.263 16.191-5.155v.013m19.096 38.093c-1.17-.048-5.678-.305-10.621-1.466c-.947-3.302-4.074-11.444-4.789-13.296a556.586 556.586 0 0 1 6.928-9.654c5.688.312 9.682 2.387 10.455 2.82c3.295 5.299 4.018 10.711 4.117 11.615c-1.75 5.446-5.211 9.113-6.09 9.981M3.655 28.519c.084 1.266.287 2.599.654 3.917a11.738 11.738 0 0 0-.682 2.651a33.039 33.039 0 0 1 .028-6.568m9.644 23.359c1.508-1.453 3.367-2.867 4.088-3.401c1.63.574 8.324 2.837 12.591 2.837c.727.975 3.104 4.028 6.018 6.362c-1.814 1.775-4.434 2.613-4.897 2.752c-8.127.218-16.042-4.35-17.8-8.55m21.463 8.538c.922-.537 1.883-1.244 2.678-2.139c1.297-.179 6.863-1.137 11.893-4.832c.332.036.879.08 1.49.063c-3.018 2.957-10.382 6.26-16.061 6.908m15.424-8.376c1.807-4.708 1.73-8.258 1.641-9.392c.992-.972 4.396-4.599 6.285-10.113c1.018.17 1.68.429 1.994.574c.109.4.291 1.324.188 2.725c-.77 5.043-3.428 12.6-8.084 15.941c-.468.239-1.292.291-2.024.265";
        return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" focusable="false" role="presentation">' +
            '<circle cx="32" cy="32" r="30.2" fill="#FFFFFF" stroke="#0f172a" stroke-width="1.3"/>' +
            '<path d="' + escapeAttr(d) + '" fill="#11161d"/>' +
            '<circle cx="32" cy="32" r="30.2" fill="none" stroke="rgba(255,255,255,.45)" stroke-width=".7"/>' +
        '</svg>';
    }

    function renderBall() {
        if (!config.features || !config.features.ball) {
            return;
        }

        var ball = doc.createElement('span');
        ball.className = 'ldb-copa-ball';
        ball.innerHTML = soccerBallSvg();
        root.appendChild(ball);

        var ballSize = ball.getBoundingClientRect().width || 56;
        var viewportWidth = win.innerWidth || doc.documentElement.clientWidth || 1024;
        var viewportHeight = win.innerHeight || doc.documentElement.clientHeight || 768;
        var floor = Math.max(110, viewportHeight - ballSize - Math.max(10, viewportHeight * 0.02));
        var x = -ballSize * 1.1;
        var y = -ballSize * 0.9;
        var vx = isMobileViewport() ? 215 : 260;
        var vy = 80;
        var gravity = isMobileViewport() ? 2100 : 2350;
        var restitution = 0.67;
        var rotation = 0;
        var lastTime = null;
        var startedAt = null;
        var shadow = null;

        function finish() {
            if (shadow && shadow.parentNode) {
                shadow.parentNode.removeChild(shadow);
            }
            if (ball.parentNode) {
                ball.parentNode.removeChild(ball);
            }
        }

        shadow = doc.createElement('span');
        shadow.className = 'ldb-copa-ball-shadow';
        root.appendChild(shadow);

        function tick(timestamp) {
            if (!startedAt) {
                startedAt = timestamp;
            }
            if (lastTime === null) {
                lastTime = timestamp;
            }

            var dt = Math.min((timestamp - lastTime) / 1000, 0.03);
            lastTime = timestamp;

            vy += gravity * dt;
            x += vx * dt;
            y += vy * dt;
            rotation += (vx * dt / Math.max(1, ballSize)) * 160;

            if (y >= floor) {
                y = floor;
                vy = -Math.abs(vy) * restitution;
                if (Math.abs(vy) < 140) {
                    vy = -140;
                }
            }

            var opacity = 1;
            if (x > viewportWidth * 0.86) {
                opacity = Math.max(0, 1 - ((x - viewportWidth * 0.86) / (viewportWidth * 0.18)));
            }

            ball.style.opacity = String(opacity);
            ball.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + rotation.toFixed(1) + 'deg)';

            if (shadow) {
                var shadowScale = Math.max(0.45, Math.min(1.15, 1.05 - ((floor - y) / Math.max(1, viewportHeight)) * 1.2));
                var shadowOpacity = Math.max(0.08, Math.min(0.28, 0.26 - ((floor - y) / Math.max(1, viewportHeight)) * 0.28));
                shadow.style.opacity = String(opacity * shadowOpacity);
                shadow.style.transform = 'translate3d(' + (x + ballSize * 0.05).toFixed(1) + 'px,' + (floor + ballSize * 0.84).toFixed(1) + 'px,0) scaleX(' + shadowScale.toFixed(2) + ')';
            }

            var elapsed = timestamp - startedAt;
            if (x > viewportWidth + ballSize * 1.6 || elapsed > 9000) {
                finish();
                return;
            }

            var raf = win.requestAnimationFrame(tick);
            rafIds.push(raf);
        }

        var firstRaf = win.requestAnimationFrame(tick);
        rafIds.push(firstRaf);
        addTimer(win.setTimeout(finish, 9400));
    }

    function vuvuzelaSvg() {
        var paths = ["M107.424,50.504c2.218,0,4.385-0.901,5.949-2.465c1.564-1.574,2.465-3.741,2.465-5.949c0-2.218-0.901-4.385-2.465-5.949 c-1.564-1.574-3.732-2.465-5.949-2.465s-4.385,0.891-5.949,2.465c-1.564,1.564-2.465,3.732-2.465,5.949 c0,2.208,0.901,4.376,2.465,5.949C103.039,49.603,105.206,50.504,107.424,50.504z", "M25.753,99.507c2.218,0,4.385-0.901,5.949-2.465c1.564-1.574,2.465-3.741,2.465-5.949c0-2.218-0.901-4.385-2.465-5.949 c-1.564-1.574-3.732-2.465-5.949-2.465s-4.385,0.891-5.949,2.465c-1.564,1.564-2.465,3.732-2.465,5.949 c0,2.218,0.901,4.385,2.465,5.949C21.367,98.606,23.535,99.507,25.753,99.507z", "M74.755,148.51c2.218,0,4.385-0.901,5.949-2.465c1.564-1.564,2.465-3.732,2.465-5.949s-0.901-4.385-2.465-5.949 c-1.564-1.574-3.732-2.465-5.949-2.465s-4.385,0.891-5.949,2.465c-1.564,1.564-2.465,3.732-2.465,5.949 c0,2.208,0.901,4.376,2.465,5.949C70.37,147.609,72.538,148.51,74.755,148.51z", "M254.432,229.686c-2.218,0-4.385,0.891-5.949,2.465c-1.564,1.564-2.465,3.732-2.465,5.949c0,2.208,0.901,4.376,2.465,5.949 c1.564,1.564,3.732,2.465,5.949,2.465c2.218,0,4.385-0.901,5.949-2.465c1.564-1.574,2.465-3.741,2.465-5.949 c0-2.218-0.901-4.385-2.465-5.949C258.817,230.577,256.65,229.686,254.432,229.686z", "M189.095,197.018c-2.218,0-4.385,0.901-5.949,2.465c-1.564,1.564-2.465,3.732-2.465,5.949s0.901,4.385,2.465,5.949 c1.564,1.564,3.732,2.465,5.949,2.465s4.385-0.901,5.949-2.465c1.564-1.574,2.465-3.741,2.465-5.949 c0-2.218-0.901-4.385-2.465-5.949S191.313,197.018,189.095,197.018z", "M156.427,262.355c-2.218,0-4.385,0.891-5.949,2.465c-1.564,1.564-2.465,3.732-2.465,5.949c0,2.218,0.901,4.385,2.465,5.949 s3.732,2.465,5.949,2.465s4.385-0.901,5.949-2.465c1.564-1.564,2.465-3.732,2.465-5.949c0-2.218-0.901-4.385-2.465-5.949 C160.812,263.246,158.644,262.355,156.427,262.355z", "M157.069,81.669C130.186,124.46,81.632,191.605,2.981,268.471c-1.892,1.848-2.965,4.377-2.98,7.022 c-0.015,2.645,1.029,5.187,2.899,7.057l11.55,11.55c1.857,1.857,4.376,2.899,7,2.899c0.018,0,0.038,0,0.057,0 c2.645-0.015,5.174-1.089,7.022-2.98c76.867-78.651,144.011-127.205,186.803-154.089c1.72-1.08,3.406-2.126,5.076-3.156 l-58.304-63.239C160.49,76.181,158.813,78.893,157.069,81.669z", "M296.974,90.028c-0.165-2.269-1.109-4.493-2.832-6.236c-0.004-0.004-0.008-0.009-0.013-0.013 c-0.001-0.001-0.002-0.002-0.003-0.004c-0.003-0.003-0.007-0.006-0.01-0.009c-0.001-0.002-0.003-0.003-0.004-0.005 c-0.004-0.004-0.009-0.008-0.013-0.013L213.25,2.899c-0.004-0.004-0.008-0.007-0.012-0.011c-0.003-0.004-0.007-0.007-0.01-0.011 h-0.001c-3.868-3.845-10.118-3.837-13.978,0.021c-1.087,1.087-1.868,2.364-2.343,3.723c-0.681,1.794-8.031,20.741-25.853,51.794 l64.093,69.518c33.113-19.28,53.401-27.146,55.227-27.839c1.279-0.447,2.484-1.163,3.527-2.15c0.002-0.002,0.003-0.003,0.005-0.005 l0.001-0.001c0.116-0.109,0.229-0.222,0.339-0.336c1.659-1.729,2.568-3.911,2.728-6.136v-0.002 c0.001-0.002,0.001-0.004,0.001-0.004C297.009,90.98,297.009,90.502,296.974,90.028z"];
        var c0 = escapeAttr(color(0, '#38A638'));
        var c1 = escapeAttr(color(1, '#FFD21F'));
        var c2 = escapeAttr(color(2, '#2458B8'));
        var c3 = escapeAttr(color(3, '#FFFFFF'));
        var dotColors = [c1, c2, c0, c1, c2, c0];
        var svg = '<svg viewBox="0 0 297 297" xmlns="http://www.w3.org/2000/svg" focusable="false" role="presentation">' +
            '<defs>' +
                '<linearGradient id="ldbVuvuUploadedBody" x1="0" x2="1" y1="1" y2="0"><stop offset="0%" stop-color="' + c2 + '"/><stop offset="38%" stop-color="' + c0 + '"/><stop offset="100%" stop-color="' + c0 + '"/></linearGradient>' +
                '<linearGradient id="ldbVuvuUploadedBell" x1="0" x2="1"><stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c1 + '" stop-opacity=".88"/></linearGradient>' +
            '</defs>' +
            '<g class="ldb-copa-sound-lines" fill="none" stroke-linecap="round">' +
                '<path class="ldb-copa-sound-line" d="M267 48 C286 30 291 17 294 5" stroke="' + c1 + '" stroke-width="8"/>' +
                '<path class="ldb-copa-sound-line" d="M277 74 C300 70 309 69 319 70" stroke="' + c2 + '" stroke-width="8"/>' +
                '<path class="ldb-copa-sound-line" d="M260 102 C283 116 292 128 300 141" stroke="' + c0 + '" stroke-width="8"/>' +
            '</g>' +
            '<g transform="rotate(-4 148.5 148.5)">';

        for (var i = 0; i < 6; i += 1) {
            svg += '<path d="' + escapeAttr(paths[i]) + '" fill="' + dotColors[i] + '" opacity=".96"/>';
        }

        svg += '<path d="' + escapeAttr(paths[6]) + '" fill="url(#ldbVuvuUploadedBody)" stroke="rgba(15,23,42,.28)" stroke-width="2.5"/>' +
            '<path d="' + escapeAttr(paths[7]) + '" fill="url(#ldbVuvuUploadedBell)" stroke="rgba(15,23,42,.30)" stroke-width="2.5"/>' +
            '<path d="M154 82 C113 142 65 200 11 258" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="7" stroke-linecap="round" opacity=".75"/>' +
            '<path d="M203 19 L281 98" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="8" stroke-linecap="round" opacity=".65"/>' +
            '<path d="M13 278 L25 290" stroke="' + c3 + '" stroke-width="5" stroke-linecap="round" opacity=".9"/>' +
            '</g></svg>';
        return svg;
    }

    function renderVuvuzela() {
        if (!config.features || !config.features.vuvuzela) {
            return;
        }
        var item = doc.createElement('span');
        item.className = 'ldb-copa-vuvuzela';
        item.innerHTML = vuvuzelaSvg();
        root.appendChild(item);
        addTimer(win.setTimeout(function () {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
        }, 6600));
    }

    function tacticsBoardSvg() {
        var lineColor = escapeAttr(color(1, '#FEDD00'));
        var accent = escapeAttr(color(0, '#009739'));
        var accent2 = escapeAttr(color(2, '#012169'));
        return '<svg viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" focusable="false" role="presentation">' +
            '<defs><filter id="ldbBoardShadow"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0,0,0,.26)"/></filter></defs>' +
            '<g filter="url(#ldbBoardShadow)">' +
                '<rect x="18" y="18" width="284" height="204" rx="18" fill="#BC8A52" stroke="#80552D" stroke-width="4"/>' +
                '<rect x="34" y="42" width="252" height="164" rx="10" fill="#0F693A" stroke="#D7E7DA" stroke-width="3"/>' +
                '<rect x="118" y="6" width="84" height="26" rx="8" fill="#C9CDD3" stroke="#7E8794" stroke-width="3"/>' +
            '</g>' +
            '<g fill="none" stroke="#DCE9DE" stroke-width="3" opacity=".95">' +
                '<rect x="56" y="62" width="208" height="124" rx="4"/>' +
                '<path d="M160 62 V186"/><circle cx="160" cy="124" r="22"/><path d="M56 100 H84 M56 148 H84 M236 100 H264 M236 148 H264"/>' +
                '<path d="M56 86 C74 86 86 96 86 110 C86 124 74 134 56 134"/><path d="M264 86 C246 86 234 96 234 110 C234 124 246 134 264 134"/>' +
            '</g>' +
            '<g fill="none" stroke="' + lineColor + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="7 7">' +
                '<path d="M95 150 C122 132 132 110 150 94"/>' +
                '<path d="M160 108 C183 118 203 128 228 136"/>' +
                '<path d="M130 154 C159 154 180 170 210 170"/>' +
            '</g>' +
            '<g fill="' + accent + '" stroke="#ffffff" stroke-width="3">' +
                '<circle cx="92" cy="152" r="11"/><circle cx="158" cy="107" r="11"/><circle cx="125" cy="153" r="11"/>' +
            '</g>' +
            '<g fill="' + accent2 + '" stroke="#ffffff" stroke-width="3">' +
                '<circle cx="228" cy="136" r="11"/><circle cx="211" cy="170" r="11"/><circle cx="191" cy="87" r="11"/>' +
            '</g>' +
            '<g fill="#FFF7D6" stroke="#1E2430" stroke-width="2.2">' +
                '<circle cx="162" cy="124" r="6"/>' +
            '</g>' +
            '<g fill="none" stroke="' + lineColor + '" stroke-width="4" stroke-linecap="round">' +
                '<path d="M147 95 l10 -4 l-2 11"/><path d="M222 136 l9 7 l-11 2"/><path d="M207 170 l11 -4 l-1 12"/>' +
            '</g>' +
        '</svg>';
    }

    function renderTacticsBoard() {
        if (!config.features || !config.features.tacticsBoard) {
            return;
        }
        var board = doc.createElement('span');
        board.className = 'ldb-copa-board';
        board.innerHTML = tacticsBoardSvg();
        root.appendChild(board);
        addTimer(win.setTimeout(function () {
            if (board.parentNode) {
                board.parentNode.removeChild(board);
            }
        }, 7000));
    }

    function boot() {
        if (!doc.body || disableOnMobile()) {
            return;
        }
        createRoot();
        renderBunting();
        if (prefersReducedMotion()) {
            return;
        }
        var introAllowed = shouldRunIntro();
        if (introAllowed) {
            runInitialConfetti();
            renderBall();
            renderVuvuzela();
            renderTacticsBoard();
            addTimer(win.setTimeout(startContinuousConfetti, 4400));
        } else {
            startContinuousConfetti();
        }
    }

    function destroy() {
        if (intervalId) {
            win.clearInterval(intervalId);
            intervalId = null;
        }
        timers.forEach(function (id) {
            win.clearTimeout(id);
        });
        timers = [];
        rafIds.forEach(function (id) {
            win.cancelAnimationFrame(id);
        });
        rafIds = [];
        if (root && root.parentNode) {
            root.parentNode.removeChild(root);
        }
        root = null;
    }

    if (doc.readyState === 'loading') {
        doc.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
        boot();
    }

    win.addEventListener('pagehide', destroy, { once: true });
}());
