(function () {
    'use strict';

    var OPT = 'ldb_copa_do_mundo_options';
    var admin = window.LDBCopaAdmin || {};
    var strings = admin.strings || {};
    var countries = admin.countries || {};

    function byId(id) {
        return document.getElementById(id);
    }

    function field(name) {
        return document.querySelector('[name="' + OPT + '[' + name + ']"]');
    }

    function boolField(name) {
        var input = field(name);
        return !!(input && input.checked);
    }

    function numberField(name, fallback) {
        var input = field(name);
        var value = input ? parseFloat(String(input.value).replace(',', '.')) : NaN;
        return isNaN(value) ? fallback : value;
    }

    function stringField(name, fallback) {
        var input = field(name);
        return input ? String(input.value) : fallback;
    }

    function updateRangeOutput(input) {
        var output = input.parentElement ? input.parentElement.querySelector('output') : null;
        if (!output) {
            return;
        }
        output.textContent = String(input.value) + (input.getAttribute('data-suffix') || '');
    }

    function updateCookieDaysVisibility() {
        var mode = byId('ldb-copa-repeat-mode');
        var fieldEl = document.querySelector('.ldb-copa-cookie-days-field');
        if (!mode || !fieldEl) {
            return;
        }
        fieldEl.style.display = mode.value === 'days' ? '' : 'none';
    }

    function getCountry() {
        var code = stringField('country', 'BR');
        return countries[code] || countries.BR || { name: 'Brazil', flag: '🇧🇷', colors: ['#009739', '#FEDD00', '#012169', '#FFFFFF'] };
    }

    function color(palette, index, fallback) {
        if (!Array.isArray(palette) || !palette.length) {
            return fallback || '#009739';
        }
        return palette[((index % palette.length) + palette.length) % palette.length] || fallback || '#009739';
    }

    function setText(id, value) {
        var el = byId(id);
        if (el) {
            el.textContent = value || '';
        }
    }

    function clearStage(stage) {
        while (stage.firstChild) {
            stage.removeChild(stage.firstChild);
        }
    }

    function makeFlag(palette, index) {
        var flag = document.createElement('span');
        flag.className = 'ldb-copa-modal-flag';
        flag.style.setProperty('--flag-color', color(palette, index, '#009739'));
        flag.style.animationDelay = String((index % 7) * -0.23) + 's';
        flag.style.animationDuration = String(3.4 + (index % 4) * 0.28) + 's';

        if (index % 4 === 0) {
            flag.classList.add('is-patterned');
            flag.style.setProperty('--flag-accent', color(palette, index + 1, '#FEDD00'));
            flag.style.setProperty('--flag-alt', color(palette, index + 2, '#012169'));
        }

        if (index % 3 === 1) {
            flag.classList.add('is-cut-double');
        } else if (index % 3 === 2) {
            flag.classList.add('is-square');
        }

        return flag;
    }

    function renderPreviewBunting(stage, palette, width) {
        if (!boolField('show_bunting')) {
            var disabled = document.createElement('div');
            disabled.className = 'ldb-copa-preview-disabled-message';
            disabled.textContent = strings.buntingDisabled || 'Bunting is disabled in the current settings.';
            stage.appendChild(disabled);
            return;
        }

        var breakpoint = numberField('mobile_breakpoint', 767);
        var isMobile = width <= breakpoint;
        var coverage = numberField(isMobile ? 'bunting_coverage_mobile' : 'bunting_coverage_desktop', 40);
        coverage = Math.max(10, Math.min(100, coverage));
        var flagWidth = isMobile ? 38 : 44;
        var count = Math.max(2, Math.min(28, Math.round((width * (coverage / 100)) / flagWidth)));
        var bunting = document.createElement('div');
        bunting.className = 'ldb-copa-modal-bunting';

        var rope = document.createElement('div');
        rope.className = 'ldb-copa-modal-rope';
        bunting.appendChild(rope);

        for (var i = 0; i < count; i += 1) {
            bunting.appendChild(makeFlag(palette, i));
        }

        stage.appendChild(bunting);
    }

    function renderPreviewConfetti(stage, palette) {
        if (!boolField('show_confetti')) {
            return;
        }
        var configured = numberField('initial_confetti_count', 80);
        var count = Math.max(8, Math.min(72, Math.round(configured / 2)));
        for (var i = 0; i < count; i += 1) {
            var piece = document.createElement('span');
            piece.className = 'ldb-copa-modal-confetti';
            piece.style.left = String(Math.random() * 96 + 2) + '%';
            piece.style.top = String(Math.random() * 76 + 12) + '%';
            piece.style.background = color(palette, i, '#FEDD00');
            piece.style.transform = 'rotate(' + String(Math.round(Math.random() * 140 - 70)) + 'deg)';
            piece.style.animationDelay = String(Math.random() * -4) + 's';
            stage.appendChild(piece);
        }
    }

    function renderPreviewIntroItems(stage, palette) {
        if (boolField('show_vuvuzela')) {
            var vuvu = document.createElement('span');
            vuvu.className = 'ldb-copa-modal-vuvuzela';
            vuvu.innerHTML = '<svg viewBox="0 0 220 110" aria-hidden="true"><path d="M12 74 L138 28 L194 18 C212 15 222 36 208 48 L159 88 L28 92 Z" fill="' + color(palette, 0, '#009739') + '" stroke="#172033" stroke-width="4"/><path d="M150 27 L197 17 C218 15 225 39 208 50 L162 88 Z" fill="' + color(palette, 1, '#FEDD00') + '" stroke="#172033" stroke-width="4"/><path d="M0 76 L28 68 L34 92 L5 102 Z" fill="' + color(palette, 2, '#012169') + '" stroke="#172033" stroke-width="4"/><path d="M57 66 C95 51 125 40 156 35" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="7" stroke-linecap="round"/></svg>';
            stage.appendChild(vuvu);
        }

        if (boolField('show_ball')) {
            var ball = document.createElement('span');
            ball.className = 'ldb-copa-modal-ball';
            ball.textContent = '⚽';
            stage.appendChild(ball);
        }

        if (boolField('show_tactics_board')) {
            var board = document.createElement('span');
            board.className = 'ldb-copa-modal-board';
            board.innerHTML = '<svg viewBox="0 0 220 150" aria-hidden="true"><rect x="8" y="10" width="204" height="132" rx="14" fill="#b9824c"/><rect x="22" y="30" width="176" height="96" rx="8" fill="#11683c" stroke="#dbeadf" stroke-width="3"/><path d="M110 30 V126 M22 78 H198" stroke="#dbeadf" stroke-width="2" opacity=".7"/><path d="M55 96 C80 70 100 68 127 54 C146 45 164 48 180 62" fill="none" stroke="' + color(palette, 1, '#FEDD00') + '" stroke-width="4" stroke-dasharray="7 7"/><circle cx="55" cy="96" r="8" fill="' + color(palette, 0, '#009739') + '" stroke="#fff" stroke-width="2"/><circle cx="127" cy="54" r="8" fill="' + color(palette, 2, '#012169') + '" stroke="#fff" stroke-width="2"/><circle cx="180" cy="62" r="8" fill="' + color(palette, 0, '#009739') + '" stroke="#fff" stroke-width="2"/></svg>';
            stage.appendChild(board);
        }
    }

    function openPreview() {
        var modal = byId('ldb-copa-preview-modal');
        var stage = byId('ldb-copa-preview-stage');
        var fakePage = byId('ldb-copa-fake-page');
        if (!modal || !stage || !fakePage) {
            return;
        }

        var country = getCountry();
        var palette = country.colors || ['#009739', '#FEDD00', '#012169', '#FFFFFF'];
        setText('ldb-copa-preview-store-name', strings.fakeStoreName || 'Demo battery store');
        setText('ldb-copa-preview-cart-label', strings.cartLabel || 'Cart');
        setText('ldb-copa-preview-logo', (country.flag || '') + ' ' + (country.name || 'Brazil'));
        setText('ldb-copa-preview-search', strings.searchPlaceholder || 'Search for products...');
        setText('ldb-copa-preview-category', strings.categoryMenu || 'Categories');
        setText('ldb-copa-preview-home', strings.homeMenu || 'Home');
        setText('ldb-copa-preview-offers', strings.offersMenu || 'Offers');
        setText('ldb-copa-preview-blog', strings.blogMenu || 'Blog');
        setText('ldb-copa-preview-hero-label', strings.heroLabel || 'World Cup offer');
        setText('ldb-copa-preview-hero-title', strings.heroTitle || 'Decorated storefront preview');
        setText('ldb-copa-preview-hero-text', strings.heroText || 'Bunting, confetti and intro-only elements are rendered over this simulated page.');
        setText('ldb-copa-preview-buy-now', strings.buyNow || 'Buy now');
        setText('ldb-copa-preview-product-one', strings.productOne || 'Car batteries');
        setText('ldb-copa-preview-product-two', strings.productTwo || 'Motorcycle batteries');
        setText('ldb-copa-preview-product-three', strings.productThree || 'Chargers and tools');
        setText('ldb-copa-preview-note', strings.previewNote || 'Preview only: this does not set cookies and does not change the public site until you save.');

        fakePage.style.setProperty('--preview-main', color(palette, 0, '#009739'));
        fakePage.style.setProperty('--preview-accent', color(palette, 1, '#FEDD00'));
        fakePage.style.setProperty('--preview-alt', color(palette, 2, '#012169'));
        clearStage(stage);
        renderPreviewBunting(stage, palette, fakePage.getBoundingClientRect().width || 900);
        renderPreviewConfetti(stage, palette);
        renderPreviewIntroItems(stage, palette);

        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('ldb-copa-modal-open');
        var closeButton = modal.querySelector('.ldb-copa-modal-close');
        if (closeButton) {
            closeButton.focus();
        }
    }

    function closePreview() {
        var modal = byId('ldb-copa-preview-modal');
        if (!modal) {
            return;
        }
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('ldb-copa-modal-open');
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.ldb-copa-range').forEach(function (input) {
            updateRangeOutput(input);
            input.addEventListener('input', function () {
                updateRangeOutput(input);
            });
        });

        var mode = byId('ldb-copa-repeat-mode');
        if (mode) {
            mode.addEventListener('change', updateCookieDaysVisibility);
            updateCookieDaysVisibility();
        }

        var openButton = byId('ldb-copa-open-preview');
        if (openButton) {
            openButton.addEventListener('click', openPreview);
        }

        document.addEventListener('click', function (event) {
            if (event.target && event.target.closest('[data-ldb-copa-close-preview]')) {
                closePreview();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closePreview();
            }
        });
    });
}());
