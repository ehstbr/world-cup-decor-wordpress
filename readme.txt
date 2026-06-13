=== World Cup Decorations ===
Contributors: eduardohst
Tags: world cup, decoration, confetti, bunting, svg, woocommerce
Requires at least: 5.8
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.3.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Author: Eduardo Henrique Silva Teixeira
Author URI: https://networked.com.br
Contact: contato@networked.com.br

Subtle World Cup decoration for WordPress and WooCommerce sites, with country-based SVG colors and session/cookie intro controls.

== Description ==

World Cup Decorations adds an elegant, non-intrusive festive overlay to your site. It is inspired by seasonal “falling snow” plugins, but adapted for the World Cup with SVG bunting, paper confetti, an intro-only bouncing ball, an intro-only vuvuzela, and an intro-only tactics board.

Main features:

* SVG bunting generated directly in the browser.
* SVG paper confetti with clear quantity controls: total intro pieces and continuous pieces per second.
* Bouncing ball shown only in the intro animation.
* Vuvuzela shown only in the intro animation.
* Country list with national-color inspired palettes.
* Intro repeat control by browser session or every X days via cookie.
* Option to avoid display on WooCommerce cart, checkout and My Account pages.
* Respects users with reduced motion enabled in their system.
* Uses `pointer-events: none` so decorations do not block clicks, menus or buttons.
* Includes a translation template and translations for Portuguese (Brazil), Spanish, French, Simplified Chinese, Hindi and Arabic.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/` or install the ZIP file through the WordPress admin.
2. Activate the plugin in the Plugins screen.
3. Go to Appearance > World Cup Decorations.
4. Choose the country, decorative elements and intro repeat behavior.
5. Save the settings.

== Frequently Asked Questions ==

= Does the intro animation appear on every page? =

It does not have to. The settings screen allows you to limit the intro to once per browser session or every X days via cookie. After the intro, only subtle elements remain, such as bunting and a light confetti effect.

= Are the bouncing ball and vuvuzela permanent? =

No. They are intro-only elements. After the session/cookie rule is registered, they will not appear again until the rule allows it.

= Are the decorative elements heavy images? =

No. The elements are generated as SVG/DOM/CSS by the plugin JavaScript. There are no external images.

= Is it safe for WooCommerce stores? =

Yes. By default, the plugin avoids cart, checkout and My Account pages to reduce distraction on sensitive shopping pages.

== Changelog ==

= 1.3.2 =
* Renamed the main plugin file to world-cup-decorations.php.
* Changed the text domain to world-cup-decorations.
* Renamed translation template and locale files to match the new text domain.

= 1.2.4 =
* Replaced percentage-based confetti controls with clearer piece-count and pieces-per-second metrics.
* Reworked the bouncing ball animation using simple physics for a smoother left-to-right fall and bounce.


= 1.2.2 =
* Removed the redundant “Show only selected elements” setting.
* Updated the bouncing ball intro so it drops from the visible top of the viewport, bounces along the bottom area and exits from left to right.

= 1.2.1 =
* Replaced the frontend ball and vuvuzela artwork with sanitized SVGs supplied by the site owner.
* Added sanitized SVG copies under assets/svg for easier maintenance.

= 1.2.0 =
* Improved SVG artwork for bunting, ball, and vuvuzela.
* Added an intro-only tactics board / coach clipboard animation.
* Added mobile-friendly behavior and optional disable on mobile.

= 1.1.0 =
* Default interface changed to English.
* Added Brazilian Portuguese translation files.
* Moved the settings page to Appearance > World Cup Decorations.

= 1.0.0 =
* Initial version.


= 1.2.4 =
* Fixed the vuvuzela visibility issue.
* Improved the ball animation and kept the ball perfectly round.
* Redesigned the bunting to use mostly solid country colors with occasional flag-inspired pennants.
* Added subtle wind sway to the bunting and improved consistency across desktop and mobile.


= 1.2.5 =
* Fixed the bunting layout so the rope and pennants span the full page width again.
* Fixed the pennant sway animation so it no longer collapses the pennants into one area.


= 1.2.6 =
* Adjusted bunting proportions to look more consistent between desktop and mobile.
* Increased the number and size of the pennants.
* Reduced excessive spacing on smaller screens.


= 1.2.7 =
* Added configurable bunting coverage for desktop and mobile.
* Reduced the default desktop pennant density.
* The number of pennants is now calculated from the selected horizontal screen coverage.


= 1.2.9 =
* Changed plugin author metadata to Eduardo Henrique Silva Teixeira / Networked.
* Set default desktop and mobile bunting coverage to 40%.
* Fixed the coverage calculation so changing the control has a visible effect on the frontend.


= 1.3.0 =
* Replaced the static admin preview with a modal preview that simulates the current unsaved settings on a fake storefront.
* Added localization files for Spanish, French, Simplified Chinese, Hindi and Arabic, while keeping Brazilian Portuguese.
* Reviewed English admin copy and localized preview UI strings.


= 1.3.1 =
* Removed the underline from the preview modal close button.
