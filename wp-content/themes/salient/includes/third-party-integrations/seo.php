<?php
/**
 * Third party SEO integrations.
 *
 *
 * @package Salient WordPress Theme
 * @version 13.1
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if( !function_exists('salient_wpbakery_rank_math_seo_image_filter') ) {
  function salient_wpbakery_rank_math_seo_image_filter( $images, $id ) {
    
      $post = get_post( $id );

      if ( $post && strpos( $post->post_content, '[vc_row' ) !== false ) {
        preg_match_all( '/(?:image_url|image_1_url|image_2_url)\=\"([^\"]+)\"/', $post->post_content, $matches );
        foreach ( $matches[1] as $m ) {
          $ids = explode( ',', $m );
          foreach ( $ids as $id ) {
            if ( (int) $id ) {
              $images[] = array(
                'src' => wp_get_attachment_url( $id ),
                'title' => get_the_title( $id ),
              );
            }
          }
        }
      }
    

    return $images;
  }
}

add_filter( 'rank_math/sitemap/urlimages', 'salient_wpbakery_rank_math_seo_image_filter', 10, 2 );
