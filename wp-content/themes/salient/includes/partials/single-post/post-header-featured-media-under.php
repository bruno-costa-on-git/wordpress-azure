<?php
/**
 * Post header featured media under title
 *
 * @package Salient WordPress Theme
 * @subpackage Partials
 * @version 13.1
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $nectar_options;

$nectar_post_format = get_post_format();
if( null === $nectar_post_format || false === $nectar_post_format ) {
  $nectar_post_format = 'default';
}

$bg_alignment   = get_post_meta($post->ID, '_nectar_page_header_bg_alignment', true);
$load_animation = (isset($nectar_options['blog_header_load_in_animation']) ) ? $nectar_options['blog_header_load_in_animation'] : 'none'; 
$parallax_bg    = (isset($nectar_options['blog_header_scroll_effect']) && 'parallax' === $nectar_options['blog_header_scroll_effect'] ) ? true : false;
$hide_featrued  = (isset($nectar_options['blog_hide_featured_image'] ) ) ? $nectar_options['blog_hide_featured_image'] : false;
?>

<div class="row hentry featured-media-under-header" data-animate="<?php echo esc_attr($load_animation); ?>">
  <div class="featured-media-under-header__content">
    <div class="featured-media-under-header__cat-wrap">
    <?php get_template_part( 'includes/partials/single-post/post-categories' ); ?>
    </div>

    <h1 class="entry-title"><?php the_title(); ?></h1>

    <div class="featured-media-under-header__meta-wrap nectar-link-underline-effect">
    <?php get_template_part( 'includes/partials/single-post/post-meta-fields' ); ?>
    </div>

    <?php 
    $parallax_attrs = ''; 
    $bg_classname = array('post-featured-img','page-header-bg-image');

    if( $parallax_bg && !in_array($nectar_post_format,array('video','audio')) ) {
      $parallax_attrs = 'data-n-parallax-bg="true" data-parallax-speed="subtle"';
      $bg_classname[] = 'parallax-layer';
    }

    $custom_bg = apply_filters('nectar_page_header_bg_val', get_post_meta($post->ID, '_nectar_header_bg', true));
    $has_image = (empty($custom_bg) && !has_post_thumbnail($post->ID)) ? 'false' : 'true';
    if( in_array($nectar_post_format, array('link','quote')) ) {
      $has_image = 'false';
    }
    
    ?>
  </div>
  <?php if( $hide_featrued !== '1' ) { ?>
  <div class="featured-media-under-header__featured-media"<?php echo ' ' . $parallax_attrs; ?> data-has-img="<?php echo esc_attr($has_image); ?>" data-align="<?php echo esc_attr($bg_alignment); ?>" data-format="<?php echo esc_attr($nectar_post_format); ?>">
    <?php if( 'default' === $nectar_post_format || 'image' === $nectar_post_format ) { 
              
        $selector = '.featured-media-under-header__featured-media .post-featured-img';
      
        if( !empty($custom_bg) ) {
          echo nectar_responsive_page_header_css($custom_bg, $selector);
          echo '<span class="'.esc_attr(implode(' ', $bg_classname)).'" style="background-image: url('.esc_attr($custom_bg).')"></span>';
        }
        else {
          $image_id = get_post_thumbnail_id($post->ID);
          if( $image_id ) {
            echo nectar_responsive_page_header_css($image_id, $selector);
            echo '<span class="'.esc_attr(implode(' ', $bg_classname)).'" style="background-image: url('.get_the_post_thumbnail_url( $post->ID, 'full' ).')"></span>';
          }
        }

    }
    // Video.
    else if( 'video' === $nectar_post_format ) {
      get_template_part( 'includes/partials/blog/media/video-player' );
    }
    // Audio.
    else if( 'audio' === $nectar_post_format ) {
      get_template_part( 'includes/partials/blog/media/audio-player' );
    }
    ?>
  </div>
  <?php } // hide featured. ?>
</div>