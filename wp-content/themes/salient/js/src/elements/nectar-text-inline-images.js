/**
 * Salient "Text With Inline Images" script file.
 *
 * @package Salient
 * @author ThemeNectar
 */
/* global Waypoint */
/* global anime */

(function( $ ) {

    "use strict";

    function NectarTextInlineImages(el) {
        this.$el = el;
        this.$markers = this.$el.find('.nectar-text-inline-images__marker');
        this.positionImages();
        this.events();
    }

    NectarTextInlineImages.prototype.positionImages = function() {

        var that = this;
  
        this.$markers.each(function(i) {
           
            var $image = $(this).find('img');

            if( $image.length > 0 ) {

              var imageRect = $image[0].getBoundingClientRect();
     
              $(this)[0].style.width = imageRect.width  + 'px';

            }
        });

        this.$el.addClass('nectar-text-inline-images--calculated');

    };

    NectarTextInlineImages.prototype.events = function () {
        
      var that = this;

        $(window).on('resize', this.positionImages.bind(this));
        $(window).on('nectar-waypoints-reinit', this.waypoint.bind(this));

        //$(document).ready(function(){
          that.waypoint();
        //});
    };

    NectarTextInlineImages.prototype.waypoint = function () {

        var waypoints = [];

        this.$markers.each(function(i) {
            var $that = $(this);
            waypoints[i] = new Waypoint({
                element: $(this)[0],
                handler: function () {
    
                    $that.addClass('animated-in');
                    waypoints[i].destroy();
                },
                offset: 'bottom-in-view'
            });
        });

    };


   // $(document).ready(function(){
        
        var textWithImgEls = [];

        function initInlineImages() {
            textWithImgEls = [];
            $('.nectar-text-inline-images').each(function(i){
                textWithImgEls[i] = new NectarTextInlineImages($(this));
            });
        }
        initInlineImages();
        $(window).on('vc_reload', function(){
            setTimeout(initInlineImages,200); 
        });

        
    //});

})( jQuery );