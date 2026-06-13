<?php
/**
 * Plugin Name: World Cup Decorations
 * Description: Adds subtle World Cup decorations to your site: SVG bunting, falling confetti, intro animations with a bouncing ball, a vuvuzela and a tactics board, plus country-based colors and session/cookie repeat controls.
 * Version:     1.3.3
 * Author:      Eduardo Henrique Silva Teixeira
 * Author URI:  https://networked.com.br
 * Author Email: contato@networked.com.br
 * License:     GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: world-cup-decorations
 * Domain Path: /languages
 * Requires at least: 5.8
 * Tested up to: 7.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

final class LDB_Copa_Do_Mundo_Plugin
{
    public const VERSION = '1.3.3';
    public const OPTION_NAME = 'ldb_copa_do_mundo_options';

    private static ?self $instance = null;

    /**
     * National-color inspired palettes.
     *
     * @return array<string,array{name:string,flag:string,colors:array<int,string>}>
     */
    public static function countries(): array
    {
        return [
            'ZA' => ['name' => __('South Africa', 'world-cup-decorations'), 'flag' => '🇿🇦', 'colors' => ['#007A4D', '#FFB612', '#000000', '#DE3831', '#002395', '#FFFFFF']],
            'DE' => ['name' => __('Germany', 'world-cup-decorations'), 'flag' => '🇩🇪', 'colors' => ['#000000', '#DD0000', '#FFCE00', '#FFFFFF']],
            'SA' => ['name' => __('Saudi Arabia', 'world-cup-decorations'), 'flag' => '🇸🇦', 'colors' => ['#006C35', '#FFFFFF', '#C8D6C6']],
            'DZ' => ['name' => __('Algeria', 'world-cup-decorations'), 'flag' => '🇩🇿', 'colors' => ['#006233', '#FFFFFF', '#D21034']],
            'AR' => ['name' => __('Argentina', 'world-cup-decorations'), 'flag' => '🇦🇷', 'colors' => ['#74ACDF', '#FFFFFF', '#F6B40E']],
            'AU' => ['name' => __('Australia', 'world-cup-decorations'), 'flag' => '🇦🇺', 'colors' => ['#00008B', '#FFFFFF', '#FF0000', '#FFCD00']],
            'BE' => ['name' => __('Belgium', 'world-cup-decorations'), 'flag' => '🇧🇪', 'colors' => ['#000000', '#FAE042', '#ED2939']],
            'BO' => ['name' => __('Bolivia', 'world-cup-decorations'), 'flag' => '🇧🇴', 'colors' => ['#D52B1E', '#F9E300', '#007934']],
            'BR' => ['name' => __('Brazil', 'world-cup-decorations'), 'flag' => '🇧🇷', 'colors' => ['#009739', '#FEDD00', '#012169', '#FFFFFF']],
            'CM' => ['name' => __('Cameroon', 'world-cup-decorations'), 'flag' => '🇨🇲', 'colors' => ['#007A5E', '#CE1126', '#FCD116']],
            'CA' => ['name' => __('Canada', 'world-cup-decorations'), 'flag' => '🇨🇦', 'colors' => ['#FF0000', '#FFFFFF']],
            'CL' => ['name' => __('Chile', 'world-cup-decorations'), 'flag' => '🇨🇱', 'colors' => ['#0039A6', '#FFFFFF', '#D52B1E']],
            'CO' => ['name' => __('Colombia', 'world-cup-decorations'), 'flag' => '🇨🇴', 'colors' => ['#FCD116', '#003893', '#CE1126']],
            'KR' => ['name' => __('South Korea', 'world-cup-decorations'), 'flag' => '🇰🇷', 'colors' => ['#FFFFFF', '#C60C30', '#003478', '#000000']],
            'CR' => ['name' => __('Costa Rica', 'world-cup-decorations'), 'flag' => '🇨🇷', 'colors' => ['#002B7F', '#FFFFFF', '#CE1126']],
            'HR' => ['name' => __('Croatia', 'world-cup-decorations'), 'flag' => '🇭🇷', 'colors' => ['#FF0000', '#FFFFFF', '#171796', '#00A3E0']],
            'DK' => ['name' => __('Denmark', 'world-cup-decorations'), 'flag' => '🇩🇰', 'colors' => ['#C60C30', '#FFFFFF']],
            'EC' => ['name' => __('Ecuador', 'world-cup-decorations'), 'flag' => '🇪🇨', 'colors' => ['#FFD100', '#034EA2', '#ED1C24']],
            'EG' => ['name' => __('Egypt', 'world-cup-decorations'), 'flag' => '🇪🇬', 'colors' => ['#CE1126', '#FFFFFF', '#000000', '#C09300']],
            'ES' => ['name' => __('Spain', 'world-cup-decorations'), 'flag' => '🇪🇸', 'colors' => ['#AA151B', '#F1BF00', '#FFFFFF']],
            'US' => ['name' => __('United States', 'world-cup-decorations'), 'flag' => '🇺🇸', 'colors' => ['#B22234', '#FFFFFF', '#3C3B6E']],
            'FR' => ['name' => __('France', 'world-cup-decorations'), 'flag' => '🇫🇷', 'colors' => ['#0055A4', '#FFFFFF', '#EF4135']],
            'GH' => ['name' => __('Ghana', 'world-cup-decorations'), 'flag' => '🇬🇭', 'colors' => ['#CE1126', '#FCD116', '#006B3F', '#000000']],
            'NL' => ['name' => __('Netherlands', 'world-cup-decorations'), 'flag' => '🇳🇱', 'colors' => ['#AE1C28', '#FFFFFF', '#21468B', '#FF9B00']],
            'EN' => ['name' => __('England', 'world-cup-decorations'), 'flag' => '🏴', 'colors' => ['#FFFFFF', '#CE1124', '#00247D']],
            'IT' => ['name' => __('Italy', 'world-cup-decorations'), 'flag' => '🇮🇹', 'colors' => ['#009246', '#FFFFFF', '#CE2B37']],
            'JP' => ['name' => __('Japan', 'world-cup-decorations'), 'flag' => '🇯🇵', 'colors' => ['#FFFFFF', '#BC002D', '#111111']],
            'MA' => ['name' => __('Morocco', 'world-cup-decorations'), 'flag' => '🇲🇦', 'colors' => ['#C1272D', '#006233', '#FFFFFF']],
            'MX' => ['name' => __('Mexico', 'world-cup-decorations'), 'flag' => '🇲🇽', 'colors' => ['#006847', '#FFFFFF', '#CE1126']],
            'NG' => ['name' => __('Nigeria', 'world-cup-decorations'), 'flag' => '🇳🇬', 'colors' => ['#008753', '#FFFFFF']],
            'NO' => ['name' => __('Norway', 'world-cup-decorations'), 'flag' => '🇳🇴', 'colors' => ['#BA0C2F', '#FFFFFF', '#00205B']],
            'PA' => ['name' => __('Panama', 'world-cup-decorations'), 'flag' => '🇵🇦', 'colors' => ['#FFFFFF', '#005293', '#D21034']],
            'PY' => ['name' => __('Paraguay', 'world-cup-decorations'), 'flag' => '🇵🇾', 'colors' => ['#D52B1E', '#FFFFFF', '#0038A8']],
            'PE' => ['name' => __('Peru', 'world-cup-decorations'), 'flag' => '🇵🇪', 'colors' => ['#D91023', '#FFFFFF']],
            'PL' => ['name' => __('Poland', 'world-cup-decorations'), 'flag' => '🇵🇱', 'colors' => ['#FFFFFF', '#DC143C']],
            'PT' => ['name' => __('Portugal', 'world-cup-decorations'), 'flag' => '🇵🇹', 'colors' => ['#006600', '#FF0000', '#FFD100', '#FFFFFF']],
            'QA' => ['name' => __('Qatar', 'world-cup-decorations'), 'flag' => '🇶🇦', 'colors' => ['#8A1538', '#FFFFFF']],
            'RS' => ['name' => __('Serbia', 'world-cup-decorations'), 'flag' => '🇷🇸', 'colors' => ['#C6363C', '#0C4076', '#FFFFFF']],
            'SN' => ['name' => __('Senegal', 'world-cup-decorations'), 'flag' => '🇸🇳', 'colors' => ['#00853F', '#FDEF42', '#E31B23']],
            'SE' => ['name' => __('Sweden', 'world-cup-decorations'), 'flag' => '🇸🇪', 'colors' => ['#006AA7', '#FECC00']],
            'CH' => ['name' => __('Switzerland', 'world-cup-decorations'), 'flag' => '🇨🇭', 'colors' => ['#FF0000', '#FFFFFF']],
            'TN' => ['name' => __('Tunisia', 'world-cup-decorations'), 'flag' => '🇹🇳', 'colors' => ['#E70013', '#FFFFFF']],
            'UY' => ['name' => __('Uruguay', 'world-cup-decorations'), 'flag' => '🇺🇾', 'colors' => ['#0038A8', '#FFFFFF', '#FCD116']],
            'VE' => ['name' => __('Venezuela', 'world-cup-decorations'), 'flag' => '🇻🇪', 'colors' => ['#F4D900', '#0033A0', '#D90012', '#FFFFFF']],
        ];
    }

    /**
     * @return array<string,mixed>
     */
    public static function defaults(): array
    {
        return [
            'enabled' => 1,
            'country' => 'BR',
            'show_bunting' => 1,
            'show_confetti' => 1,
            'show_ball' => 1,
            'show_vuvuzela' => 1,
            'show_tactics_board' => 1,
            'bunting_coverage_desktop' => 40,
            'bunting_coverage_mobile' => 40,
            'intro_repeat_mode' => 'days',
            'cookie_days' => 7,
            'initial_confetti_count' => 120,
            'continuous_confetti_per_second' => 0.25,
            'hide_on_woocommerce_sensitive_pages' => 1,
            'respect_reduced_motion' => 1,
            'disable_on_mobile' => 0,
            'mobile_breakpoint' => 767,
            'z_index' => 999999,
        ];
    }

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct()
    {
        add_action('init', [$this, 'load_textdomain']);
        add_action('admin_menu', [$this, 'add_settings_page']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_frontend_assets']);
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), [$this, 'plugin_action_links']);
    }

    public function load_textdomain(): void
    {
        load_plugin_textdomain('world-cup-decorations', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    /**
     * @return array<string,mixed>
     */
    public static function get_options(): array
    {
        $saved = get_option(self::OPTION_NAME, []);
        if (!is_array($saved)) {
            $saved = [];
        }

        $options = wp_parse_args($saved, self::defaults());

        // Backward compatibility for versions that used percentage-based confetti settings.
        if (!array_key_exists('initial_confetti_count', $saved) && isset($saved['initial_confetti_intensity'])) {
            $legacyIntensity = max(0, min(100, (int) $saved['initial_confetti_intensity']));
            $options['initial_confetti_count'] = (int) round(18 + ($legacyIntensity / 100) * 132);
        }

        if (!array_key_exists('continuous_confetti_per_second', $saved) && isset($saved['continuous_confetti_frequency'])) {
            $legacyFrequency = max(0, min(100, (int) $saved['continuous_confetti_frequency']));
            if ($legacyFrequency <= 0) {
                $options['continuous_confetti_per_second'] = 0;
            } else {
                $legacyInterval = max(850, min(4300, 4000 - ($legacyFrequency * 29)));
                $options['continuous_confetti_per_second'] = round(1000 / $legacyInterval, 2);
            }
        }

        return $options;
    }

    public function add_settings_page(): void
    {
        add_theme_page(
            __('World Cup Decorations', 'world-cup-decorations'),
            __('World Cup Decorations', 'world-cup-decorations'),
            'manage_options',
            'world-cup-decorations',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings(): void
    {
        register_setting(
            'ldb_copa_do_mundo_group',
            self::OPTION_NAME,
            [
                'type' => 'array',
                'sanitize_callback' => [$this, 'sanitize_options'],
                'default' => self::defaults(),
            ]
        );
    }

    /**
     * @param mixed $input
     * @return array<string,mixed>
     */
    public function sanitize_options($input): array
    {
        $defaults = self::defaults();
        $countries = self::countries();
        $input = is_array($input) ? $input : [];

        $boolKeys = [
            'enabled',
            'show_bunting',
            'show_confetti',
            'show_ball',
            'show_vuvuzela',
            'show_tactics_board',
            'hide_on_woocommerce_sensitive_pages',
            'respect_reduced_motion',
            'disable_on_mobile',
        ];

        $options = [];
        foreach ($boolKeys as $key) {
            $options[$key] = !empty($input[$key]) ? 1 : 0;
        }

        $country = isset($input['country']) ? sanitize_text_field((string) $input['country']) : $defaults['country'];
        $options['country'] = array_key_exists($country, $countries) ? $country : $defaults['country'];

        $repeatMode = isset($input['intro_repeat_mode']) ? sanitize_key((string) $input['intro_repeat_mode']) : 'days';
        $options['intro_repeat_mode'] = in_array($repeatMode, ['session', 'days', 'always'], true) ? $repeatMode : 'days';

        $options['cookie_days'] = isset($input['cookie_days']) ? max(1, min(365, (int) $input['cookie_days'])) : (int) $defaults['cookie_days'];
        $options['bunting_coverage_desktop'] = isset($input['bunting_coverage_desktop']) ? max(10, min(100, (int) $input['bunting_coverage_desktop'])) : (int) $defaults['bunting_coverage_desktop'];
        $options['bunting_coverage_mobile'] = isset($input['bunting_coverage_mobile']) ? max(10, min(100, (int) $input['bunting_coverage_mobile'])) : (int) $defaults['bunting_coverage_mobile'];
        $options['initial_confetti_count'] = isset($input['initial_confetti_count']) ? max(0, min(300, (int) $input['initial_confetti_count'])) : (int) $defaults['initial_confetti_count'];

        $continuousRate = isset($input['continuous_confetti_per_second'])
            ? (float) str_replace(',', '.', (string) $input['continuous_confetti_per_second'])
            : (float) $defaults['continuous_confetti_per_second'];
        $options['continuous_confetti_per_second'] = round(max(0, min(5, $continuousRate)), 2);

        $options['mobile_breakpoint'] = isset($input['mobile_breakpoint']) ? max(320, min(1440, (int) $input['mobile_breakpoint'])) : (int) $defaults['mobile_breakpoint'];
        $options['z_index'] = isset($input['z_index']) ? max(1, min(2147483000, (int) $input['z_index'])) : (int) $defaults['z_index'];

        return wp_parse_args($options, $defaults);
    }

    /**
     * @param array<int,string> $links
     * @return array<int,string>
     */
    public function plugin_action_links(array $links): array
    {
        array_unshift(
            $links,
            sprintf(
                '<a href="%s">%s</a>',
                esc_url(admin_url('themes.php?page=world-cup-decorations')),
                esc_html__('Settings', 'world-cup-decorations')
            )
        );

        return $links;
    }

    /**
     * @param mixed $hook
     */
    public function enqueue_admin_assets($hook): void
    {
        if ($hook !== 'appearance_page_world-cup-decorations') {
            return;
        }

        wp_enqueue_style('ldb-copa-admin', plugin_dir_url(__FILE__) . 'assets/css/admin.css', [], self::VERSION);
        wp_enqueue_script('ldb-copa-admin', plugin_dir_url(__FILE__) . 'assets/js/admin.js', [], self::VERSION, true);

        $countries = [];
        foreach (self::countries() as $code => $country) {
            $countries[$code] = [
                'name' => $country['name'],
                'flag' => $country['flag'],
                'colors' => array_values($country['colors']),
            ];
        }

        wp_localize_script(
            'ldb-copa-admin',
            'LDBCopaAdmin',
            [
                'countries' => $countries,
                'strings' => [
                    'previewTitle' => __('World Cup decorations preview', 'world-cup-decorations'),
                    'previewSubtitle' => __('This modal simulates the current settings on a fake store page. Unsaved changes are included in the preview.', 'world-cup-decorations'),
                    'closePreview' => __('Close preview', 'world-cup-decorations'),
                    'fakeStoreName' => __('Demo battery store', 'world-cup-decorations'),
                    'searchPlaceholder' => __('Search for products...', 'world-cup-decorations'),
                    'categoryMenu' => __('Categories', 'world-cup-decorations'),
                    'homeMenu' => __('Home', 'world-cup-decorations'),
                    'offersMenu' => __('Offers', 'world-cup-decorations'),
                    'blogMenu' => __('Blog', 'world-cup-decorations'),
                    'cartLabel' => __('Cart', 'world-cup-decorations'),
                    'heroLabel' => __('World Cup offer', 'world-cup-decorations'),
                    'heroTitle' => __('Decorated storefront preview', 'world-cup-decorations'),
                    'heroText' => __('Bunting, confetti and intro-only elements are rendered over this simulated page.', 'world-cup-decorations'),
                    'buyNow' => __('Buy now', 'world-cup-decorations'),
                    'productOne' => __('Car batteries', 'world-cup-decorations'),
                    'productTwo' => __('Motorcycle batteries', 'world-cup-decorations'),
                    'productThree' => __('Chargers and tools', 'world-cup-decorations'),
                    'introOnly' => __('Intro only', 'world-cup-decorations'),
                    'buntingDisabled' => __('Bunting is disabled in the current settings.', 'world-cup-decorations'),
                    'previewNote' => __('Preview only: this does not set cookies and does not change the public site until you save.', 'world-cup-decorations'),
                ],
            ]
        );
    }

    public function enqueue_frontend_assets(): void
    {
        if (!$this->should_render_frontend()) {
            return;
        }

        $options = self::get_options();
        $countries = self::countries();
        $country = $countries[$options['country']] ?? $countries['BR'];

        wp_enqueue_style('ldb-copa-frontend', plugin_dir_url(__FILE__) . 'assets/css/frontend.css', [], self::VERSION);
        wp_enqueue_script('ldb-copa-frontend', plugin_dir_url(__FILE__) . 'assets/js/frontend.js', [], self::VERSION, true);

        $config = [
            'enabled' => (bool) $options['enabled'],
            'country' => (string) $options['country'],
            'countryName' => (string) $country['name'],
            'palette' => array_values($country['colors']),
            'features' => [
                'bunting' => (bool) $options['show_bunting'],
                'confetti' => (bool) $options['show_confetti'],
                'ball' => (bool) $options['show_ball'],
                'vuvuzela' => (bool) $options['show_vuvuzela'],
                'tacticsBoard' => (bool) $options['show_tactics_board'],
            ],
            'intro' => [
                'repeatMode' => (string) $options['intro_repeat_mode'],
                'cookieDays' => (int) $options['cookie_days'],
                'cookieName' => 'ldb_copa_intro_' . substr(md5(home_url('/')), 0, 10),
                'storageKey' => 'ldb_copa_intro_' . substr(md5(home_url('/')), 0, 10),
            ],
            'bunting' => [
                'coverageDesktop' => (int) $options['bunting_coverage_desktop'],
                'coverageMobile' => (int) $options['bunting_coverage_mobile'],
            ],
            'confetti' => [
                'initialCount' => (int) $options['initial_confetti_count'],
                'continuousPerSecond' => (float) $options['continuous_confetti_per_second'],
            ],
            'behavior' => [
                'respectReducedMotion' => (bool) $options['respect_reduced_motion'],
                'disableOnMobile' => (bool) $options['disable_on_mobile'],
                'mobileBreakpoint' => (int) $options['mobile_breakpoint'],
                'zIndex' => (int) $options['z_index'],
            ],
        ];

        wp_add_inline_script('ldb-copa-frontend', 'window.LDBCopaDoMundoConfig = ' . wp_json_encode($config) . ';', 'before');
    }

    private function should_render_frontend(): bool
    {
        if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
            return false;
        }

        $options = self::get_options();
        if (empty($options['enabled'])) {
            return false;
        }

        if (!empty($options['hide_on_woocommerce_sensitive_pages'])) {
            if ((function_exists('is_cart') && is_cart()) || (function_exists('is_checkout') && is_checkout()) || (function_exists('is_account_page') && is_account_page())) {
                return false;
            }
        }

        return (bool) apply_filters('ldb_copa_do_mundo_should_render', true, $options);
    }

    public function render_settings_page(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        $options = self::get_options();
        $countries = self::countries();
        ?>
        <div class="wrap ldb-copa-admin-wrap">
            <h1><?php echo esc_html__('World Cup Decorations', 'world-cup-decorations'); ?></h1>
            <p class="description">
                <?php echo esc_html__('Subtle decoration for WordPress and WooCommerce sites: SVG bunting, falling confetti, intro-only animations with a bouncing ball, a realistic vuvuzela and a tactical clipboard, all with country-based colors and repeat controls.', 'world-cup-decorations'); ?>
            </p>

            <form method="post" action="options.php" class="ldb-copa-settings-layout">
                <?php settings_fields('ldb_copa_do_mundo_group'); ?>

                <div class="ldb-copa-card ldb-copa-card-main">
                    <div class="ldb-copa-card-header">
                        <span class="ldb-copa-admin-ball" aria-hidden="true"></span>
                        <div>
                            <h2><?php echo esc_html__('Main settings', 'world-cup-decorations'); ?></h2>
                            <p><?php echo esc_html__('Choose the country palette, decorative elements, intro behavior and mobile handling.', 'world-cup-decorations'); ?></p>
                        </div>
                    </div>

                    <?php $this->render_toggle('enabled', __('Enable decorations on the site', 'world-cup-decorations'), $options); ?>

                    <div class="ldb-copa-field">
                        <label for="ldb-copa-country"><strong><?php echo esc_html__('Country / Theme colors', 'world-cup-decorations'); ?></strong></label>
                        <select id="ldb-copa-country" name="<?php echo esc_attr(self::OPTION_NAME); ?>[country]">
                            <?php foreach ($countries as $code => $country): ?>
                                <option value="<?php echo esc_attr($code); ?>" <?php selected($options['country'], $code); ?>>
                                    <?php echo esc_html($country['flag'] . ' ' . $country['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description"><?php echo esc_html__('SVG colors adapt to the selected country palette.', 'world-cup-decorations'); ?></p>
                    </div>

                    <h3><?php echo esc_html__('Decorative elements', 'world-cup-decorations'); ?></h3>
                    <div class="ldb-copa-grid-2">
                        <?php $this->render_toggle('show_bunting', __('Bunting', 'world-cup-decorations'), $options, '🎏'); ?>
                        <?php $this->render_toggle('show_confetti', __('Paper confetti', 'world-cup-decorations'), $options, '▣'); ?>
                        <?php $this->render_toggle('show_ball', __('Bouncing ball — intro only', 'world-cup-decorations'), $options, '⚽'); ?>
                        <?php $this->render_toggle('show_vuvuzela', __('Vuvuzela — intro only', 'world-cup-decorations'), $options, '📣'); ?>
                        <?php $this->render_toggle('show_tactics_board', __('Tactics board — intro only', 'world-cup-decorations'), $options, '🧠'); ?>
                    </div>

                    <h3><?php echo esc_html__('Bunting density', 'world-cup-decorations'); ?></h3>
                    <div class="ldb-copa-note">
                        <?php echo esc_html__('Coverage means how much of the screen width is visually occupied by pennants. The plugin calculates the number of flags automatically based on the viewport width.', 'world-cup-decorations'); ?>
                    </div>
                    <?php $this->render_range('bunting_coverage_desktop', __('Desktop horizontal coverage', 'world-cup-decorations'), $options, 10, 100, '%'); ?>
                    <?php $this->render_range('bunting_coverage_mobile', __('Mobile horizontal coverage', 'world-cup-decorations'), $options, 10, 100, '%'); ?>

                    <h3><?php echo esc_html__('Intro animation behavior', 'world-cup-decorations'); ?></h3>
                    <div class="ldb-copa-note ldb-copa-note-blue">
                        <?php echo esc_html__('The ball, vuvuzela and tactics board appear only during the intro animation. After that, only subtle decorations remain on the page.', 'world-cup-decorations'); ?>
                    </div>

                    <div class="ldb-copa-field">
                        <label for="ldb-copa-repeat-mode"><strong><?php echo esc_html__('Repeat full intro animation', 'world-cup-decorations'); ?></strong></label>
                        <select id="ldb-copa-repeat-mode" name="<?php echo esc_attr(self::OPTION_NAME); ?>[intro_repeat_mode]">
                            <option value="session" <?php selected($options['intro_repeat_mode'], 'session'); ?>><?php echo esc_html__('Only once per browser session', 'world-cup-decorations'); ?></option>
                            <option value="days" <?php selected($options['intro_repeat_mode'], 'days'); ?>><?php echo esc_html__('Every X days using a cookie', 'world-cup-decorations'); ?></option>
                            <option value="always" <?php selected($options['intro_repeat_mode'], 'always'); ?>><?php echo esc_html__('Always repeat — useful only for testing', 'world-cup-decorations'); ?></option>
                        </select>
                    </div>

                    <div class="ldb-copa-field ldb-copa-cookie-days-field">
                        <label for="ldb-copa-cookie-days"><strong><?php echo esc_html__('Cookie days', 'world-cup-decorations'); ?></strong></label>
                        <input type="number" min="1" max="365" id="ldb-copa-cookie-days" name="<?php echo esc_attr(self::OPTION_NAME); ?>[cookie_days]" value="<?php echo esc_attr((string) $options['cookie_days']); ?>" />
                        <p class="description"><?php echo esc_html__('Controls when the full intro animation can be displayed again.', 'world-cup-decorations'); ?></p>
                    </div>

                    <h3><?php echo esc_html__('Paper confetti', 'world-cup-decorations'); ?></h3>
                    <?php
                    $this->render_number(
                        'initial_confetti_count',
                        __('Initial paper pieces', 'world-cup-decorations'),
                        $options,
                        0,
                        300,
                        1,
                        __('Total number of paper pieces released during the intro animation.', 'world-cup-decorations')
                    );
                    $this->render_number(
                        'continuous_confetti_per_second',
                        __('Continuous paper pieces per second', 'world-cup-decorations'),
                        $options,
                        0,
                        5,
                        0.05,
                        __('Average number of paper pieces generated per second after the intro. Example: 0.20 means one piece every five seconds.', 'world-cup-decorations')
                    );
                    ?>

                    <h3><?php echo esc_html__('Mobile & compatibility', 'world-cup-decorations'); ?></h3>
                    <?php $this->render_toggle('disable_on_mobile', __('Disable all decorations on mobile devices', 'world-cup-decorations'), $options); ?>
                    <div class="ldb-copa-field">
                        <label for="ldb-copa-mobile-breakpoint"><strong><?php echo esc_html__('Mobile breakpoint (px)', 'world-cup-decorations'); ?></strong></label>
                        <input type="number" min="320" max="1440" id="ldb-copa-mobile-breakpoint" name="<?php echo esc_attr(self::OPTION_NAME); ?>[mobile_breakpoint]" value="<?php echo esc_attr((string) $options['mobile_breakpoint']); ?>" />
                        <p class="description"><?php echo esc_html__('If disabled on mobile is enabled, widths equal to or below this value will not render decorations.', 'world-cup-decorations'); ?></p>
                    </div>
                    <?php $this->render_toggle('hide_on_woocommerce_sensitive_pages', __('Do not show on WooCommerce cart, checkout and My Account pages', 'world-cup-decorations'), $options); ?>
                    <?php $this->render_toggle('respect_reduced_motion', __('Respect users with reduced motion enabled in their system', 'world-cup-decorations'), $options); ?>

                    <div class="ldb-copa-field ldb-copa-zindex-field">
                        <label for="ldb-copa-z-index"><strong><?php echo esc_html__('Visual layer / z-index', 'world-cup-decorations'); ?></strong></label>
                        <input type="number" min="1" max="2147483000" id="ldb-copa-z-index" name="<?php echo esc_attr(self::OPTION_NAME); ?>[z_index]" value="<?php echo esc_attr((string) $options['z_index']); ?>" />
                        <p class="description"><?php echo esc_html__('Increase only if a theme element is covering the decoration.', 'world-cup-decorations'); ?></p>
                    </div>

                    <?php submit_button(__('Save settings', 'world-cup-decorations'), 'primary large', 'submit', false); ?>
                </div>

                <aside class="ldb-copa-card ldb-copa-preview-card" aria-label="<?php echo esc_attr__('Preview', 'world-cup-decorations'); ?>">
                    <h2><?php echo esc_html__('Preview', 'world-cup-decorations'); ?></h2>
                    <p><?php echo esc_html__('Open a simulated storefront using the current settings. It is better than the old static preview and also works with unsaved form changes.', 'world-cup-decorations'); ?></p>
                    <button type="button" class="button button-secondary button-hero" id="ldb-copa-open-preview">
                        <?php echo esc_html__('Open preview modal', 'world-cup-decorations'); ?>
                    </button>
                    <div class="ldb-copa-note">
                        <?php echo esc_html__('The preview runs inside this settings screen only. It does not affect cookies, visitors or your public frontend.', 'world-cup-decorations'); ?>
                    </div>
                </aside>
            </form>

            <div id="ldb-copa-preview-modal" class="ldb-copa-modal" hidden aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="ldb-copa-preview-modal-title">
                <div class="ldb-copa-modal-backdrop" data-ldb-copa-close-preview></div>
                <div class="ldb-copa-modal-dialog" role="document">
                    <div class="ldb-copa-modal-header">
                        <div>
                            <h2 id="ldb-copa-preview-modal-title"><?php echo esc_html__('World Cup decorations preview', 'world-cup-decorations'); ?></h2>
                            <p><?php echo esc_html__('This modal simulates the current settings on a fake store page. Unsaved changes are included in the preview.', 'world-cup-decorations'); ?></p>
                        </div>
                        <button type="button" class="button-link ldb-copa-modal-close" data-ldb-copa-close-preview aria-label="<?php echo esc_attr__('Close preview', 'world-cup-decorations'); ?>">×</button>
                    </div>
                    <div class="ldb-copa-modal-body">
                        <div class="ldb-copa-fake-page" id="ldb-copa-fake-page">
                            <div class="ldb-copa-fake-decor-stage" id="ldb-copa-preview-stage" aria-hidden="true"></div>
                            <div class="ldb-copa-fake-topbar"><span id="ldb-copa-preview-store-name"></span><span id="ldb-copa-preview-cart-label"></span></div>
                            <div class="ldb-copa-fake-header">
                                <strong id="ldb-copa-preview-logo"></strong>
                                <div class="ldb-copa-fake-search" id="ldb-copa-preview-search"></div>
                            </div>
                            <div class="ldb-copa-fake-nav">
                                <span id="ldb-copa-preview-category"></span>
                                <span id="ldb-copa-preview-home"></span>
                                <span id="ldb-copa-preview-offers"></span>
                                <span id="ldb-copa-preview-blog"></span>
                            </div>
                            <div class="ldb-copa-fake-content">
                                <section class="ldb-copa-fake-hero">
                                    <small id="ldb-copa-preview-hero-label"></small>
                                    <h3 id="ldb-copa-preview-hero-title"></h3>
                                    <p id="ldb-copa-preview-hero-text"></p>
                                    <button type="button" id="ldb-copa-preview-buy-now"></button>
                                </section>
                                <aside class="ldb-copa-fake-side">
                                    <div id="ldb-copa-preview-product-one"></div>
                                    <div id="ldb-copa-preview-product-two"></div>
                                    <div id="ldb-copa-preview-product-three"></div>
                                </aside>
                            </div>
                        </div>
                        <p class="ldb-copa-modal-note" id="ldb-copa-preview-note"></p>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * @param array<string,mixed> $options
     */
    private function render_toggle(string $key, string $label, array $options, string $icon = ''): void
    {
        $id = 'ldb-copa-' . sanitize_html_class(str_replace('_', '-', $key));
        ?>
        <label class="ldb-copa-toggle-row" for="<?php echo esc_attr($id); ?>">
            <span class="ldb-copa-toggle-label">
                <?php if ($icon !== ''): ?><span class="ldb-copa-toggle-icon" aria-hidden="true"><?php echo esc_html($icon); ?></span><?php endif; ?>
                <?php echo esc_html($label); ?>
            </span>
            <span class="ldb-copa-switch">
                <input type="checkbox" id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr(self::OPTION_NAME); ?>[<?php echo esc_attr($key); ?>]" value="1" <?php checked(!empty($options[$key])); ?> />
                <span class="ldb-copa-slider" aria-hidden="true"></span>
            </span>
        </label>
        <?php
    }

    /**
     * @param array<string,mixed> $options
     */
    private function render_number(string $key, string $label, array $options, float $min, float $max, float $step, string $description = ''): void
    {
        $id = 'ldb-copa-' . sanitize_html_class(str_replace('_', '-', $key));
        $rawValue = (float) ($options[$key] ?? 0);
        $value = ($step < 1) ? rtrim(rtrim(number_format($rawValue, 2, '.', ''), '0'), '.') : (string) (int) $rawValue;
        ?>
        <div class="ldb-copa-field">
            <label for="<?php echo esc_attr($id); ?>"><strong><?php echo esc_html($label); ?></strong></label>
            <input
                type="number"
                min="<?php echo esc_attr((string) $min); ?>"
                max="<?php echo esc_attr((string) $max); ?>"
                step="<?php echo esc_attr((string) $step); ?>"
                id="<?php echo esc_attr($id); ?>"
                name="<?php echo esc_attr(self::OPTION_NAME); ?>[<?php echo esc_attr($key); ?>]"
                value="<?php echo esc_attr($value); ?>"
            />
            <?php if ($description !== ''): ?>
                <p class="description"><?php echo esc_html($description); ?></p>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * @param array<string,mixed> $options
     */
    private function render_range(string $key, string $label, array $options, int $min, int $max, string $suffix = ''): void
    {
        $id = 'ldb-copa-' . sanitize_html_class(str_replace('_', '-', $key));
        $value = (int) ($options[$key] ?? 0);
        ?>
        <div class="ldb-copa-field ldb-copa-range-row">
            <label for="<?php echo esc_attr($id); ?>"><strong><?php echo esc_html($label); ?></strong></label>
            <div class="ldb-copa-range-control">
                <input class="ldb-copa-range" type="range" min="<?php echo esc_attr((string) $min); ?>" max="<?php echo esc_attr((string) $max); ?>" id="<?php echo esc_attr($id); ?>" name="<?php echo esc_attr(self::OPTION_NAME); ?>[<?php echo esc_attr($key); ?>]" value="<?php echo esc_attr((string) $value); ?>" data-suffix="<?php echo esc_attr($suffix); ?>" />
                <output><?php echo esc_html((string) $value . $suffix); ?></output>
            </div>
        </div>
        <?php
    }
}

register_activation_hook(__FILE__, static function (): void {
    if (get_option(LDB_Copa_Do_Mundo_Plugin::OPTION_NAME, null) === null) {
        add_option(LDB_Copa_Do_Mundo_Plugin::OPTION_NAME, LDB_Copa_Do_Mundo_Plugin::defaults());
    }
});

LDB_Copa_Do_Mundo_Plugin::instance();
