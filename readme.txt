=== World Cup Decorations ===
Contributors: eduardohst
Tags: world cup, decoration, confetti, bunting, woocommerce
Requires at least: 5.8
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.3.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Author: Eduardo Henrique Silva Teixeira
Author URI: https://networked.com.br
Contact: contato@networked.com.br

Add subtle football tournament decorations to WordPress and WooCommerce sites with bunting, confetti and intro animations.

== Description ==

World Cup Decorations adds an elegant, non-intrusive festive overlay to WordPress sites. It is inspired by seasonal decoration plugins, but adapted for football tournaments with SVG bunting, paper confetti, an intro-only bouncing ball, an intro-only vuvuzela, and an intro-only tactics board.

The plugin is designed for commercial websites and WooCommerce stores that want a festive look without hurting usability or distracting customers during important purchase steps.

Main features:

* SVG bunting generated directly in the browser.
* Country-based color palettes.
* Paper confetti with clear quantity controls: total intro pieces and continuous pieces per second.
* Intro-only bouncing ball animation.
* Intro-only vuvuzela animation.
* Intro-only tactics board animation.
* Admin preview modal with a fake storefront preview.
* Configurable desktop and mobile bunting coverage.
* Option to avoid display on WooCommerce cart, checkout and My Account pages.
* Option to disable all decorations on mobile devices.
* Respects users with reduced motion enabled in their system.
* Uses `pointer-events: none` so decorations do not block clicks, menus or buttons.
* Includes translation files for Portuguese (Brazil), Spanish, French, Simplified Chinese, Hindi and Arabic.

This plugin is not affiliated with FIFA, official tournaments, teams, sponsors, or event organizers. It does not use official logos, mascots or copyrighted tournament artwork.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/` or install the ZIP file through the WordPress admin.
2. Activate the plugin in the Plugins screen.
3. Go to Appearance > World Cup Decorations.
4. Choose the country, decorative elements and intro repeat behavior.
5. Save the settings.

== Frequently Asked Questions ==

= Does the intro animation appear on every page? =

It does not have to. The settings screen allows you to limit the intro to once per browser session or every X days via a first-party cookie. After the intro, only subtle elements remain, such as bunting and a light confetti effect.

= Are the bouncing ball and vuvuzela permanent? =

No. They are intro-only elements. After the session or cookie rule is registered, they will not appear again until the selected rule allows it.

= Are the decorative elements heavy images? =

No. The elements are generated as SVG, DOM and CSS by the plugin JavaScript. There are no external frontend dependencies.

= Is it safe for WooCommerce stores? =

Yes. By default, the plugin avoids cart, checkout and My Account pages to reduce distraction on sensitive shopping pages.

= Does the plugin collect personal data? =

No. The plugin does not collect personal data, does not track visitors, and does not send data to external servers.

== Privacy ==

World Cup Decorations does not collect personal data and does not connect to external services.

Depending on the selected intro repeat setting, the plugin may use either browser `sessionStorage` or a first-party cookie to remember whether the intro animation has already been displayed. This information is stored only in the visitor's browser and is not sent to external servers by the plugin.

The cookie/session value is used only for presentation behavior and not for analytics, advertising or user tracking.

== External services ==

This plugin does not connect to external services, APIs, CDNs, analytics platforms or advertising networks.

== Screenshots ==

1. Admin settings page.
2. Preview modal with fake storefront.
3. Frontend decorations on desktop.
4. Frontend decorations on mobile.

== Changelog ==

= 1.3.3 =
* Cleaned up the WordPress.org readme metadata.
* Reduced readme tags to five.
* Reorganized the changelog.
* Added privacy and external services disclosures.
* Added a trademark/non-affiliation clarification.

= 1.3.2 =
* Renamed the main plugin file to `world-cup-decorations.php`.
* Changed the text domain to `world-cup-decorations`.
* Renamed translation template and locale files to match the new text domain.

= 1.3.1 =
* Removed the underline from the preview modal close button.

= 1.3.0 =
* Replaced the static admin preview with a modal preview that simulates the current unsaved settings on a fake storefront.
* Added localization files for Spanish, French, Simplified Chinese, Hindi and Arabic, while keeping Brazilian Portuguese.
* Reviewed English admin copy and localized preview UI strings.

= 1.2.9 =
* Changed plugin author metadata to Eduardo Henrique Silva Teixeira / Networked.
* Set default desktop and mobile bunting coverage to 40%.
* Fixed the coverage calculation so changing the control has a visible effect on the frontend.

= 1.2.8 =
* Fixed the frontend coverage calculation so desktop and mobile coverage settings affect the visible bunting.
* Changed default desktop and mobile bunting coverage to 40%.

= 1.2.7 =
* Added configurable bunting coverage for desktop and mobile.
* Reduced the default desktop pennant density.
* The number of pennants is now calculated from the selected horizontal screen coverage.

= 1.2.6 =
* Adjusted bunting proportions to look more consistent between desktop and mobile.
* Increased the number and size of the pennants.
* Reduced excessive spacing on smaller screens.

= 1.2.5 =
* Fixed the bunting layout so the rope and pennants span the full page width again.
* Fixed the pennant sway animation so it no longer collapses the pennants into one area.

= 1.2.4 =
* Fixed the vuvuzela visibility issue.
* Improved the ball animation and kept the ball perfectly round.
* Redesigned the bunting to use mostly solid country colors with occasional flag-inspired pennants.
* Added subtle wind sway to the bunting and improved consistency across desktop and mobile.
* Replaced percentage-based confetti controls with clearer piece-count and pieces-per-second metrics.
* Reworked the bouncing ball animation using simple physics for a smoother left-to-right fall and bounce.

= 1.2.2 =
* Removed the redundant “Show only selected elements” setting.
* Updated the bouncing ball intro so it drops from the visible top of the viewport, bounces along the bottom area and exits from left to right.

= 1.2.1 =
* Replaced the frontend ball and vuvuzela artwork with sanitized SVGs supplied by the site owner.
* Added sanitized SVG copies under `assets/svg` for easier maintenance.

= 1.2.0 =
* Improved SVG artwork for bunting, ball and vuvuzela.
* Added an intro-only tactics board / coach clipboard animation.
* Added mobile-friendly behavior and optional disable on mobile.

= 1.1.0 =
* Default interface changed to English.
* Added Brazilian Portuguese translation files.
* Moved the settings page to Appearance > World Cup Decorations.

= 1.0.0 =
* Initial version.

== Upgrade Notice ==

= 1.3.3 =
Readme cleanup and WordPress.org submission preparation. No settings migration is required.
