<?php
/**
 * Removes World Cup Decorations options when the plugin is uninstalled.
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

delete_option('ldb_copa_do_mundo_options');
