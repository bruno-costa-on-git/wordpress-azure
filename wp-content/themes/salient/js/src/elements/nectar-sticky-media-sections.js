/**
 * Salient "Sticky Media Sections" script file.
 *
 * @package Salient
 * @author ThemeNectar
 */
/* global Waypoint */
/* global anime */

(function ($) {

  "use strict";

  function NectarStickyMedia(el) {

    this.$el = el;
    this.$mediaSections = this.$el.find('.nectar-sticky-media-section__featured-media');
    this.$contentSections = this.$el.find('.nectar-sticky-media-section__content');

    this.usingFrontEndEditor = (window.nectarDOMInfo && window.nectarDOMInfo.usingFrontEndEditor) ? true : false;
    this.direction = 'down';
    this.prevScroll = 0;

    this.events();

  }

  var proto = NectarStickyMedia.prototype;

  proto.events = function () {

    if (this.usingFrontEndEditor) {
      this.rebuildMedia();
    }

    if (!(window.nectarDOMInfo && window.nectarDOMInfo.usingMobileBrowser && window.nectarDOMInfo.winW < 1000)) {
      this.observe();
      this.trackDirection();
      this.verticallyCenter();
      $(window).on('resize', this.verticallyCenter.bind(this));
    }

  };

  proto.verticallyCenter = function() {

    if( !window.nectarDOMInfo ) {
      return;
    }

    var navHeight = 0;

    if( $('body').is('[data-header-format="left-header"]') ||
        $('body').is('[data-hhun="1"]') ||
        $('#header-outer').length > 0 && $('#header-outer').is('[data-permanent-transparent="1"]') ||
        $('.page-template-template-no-header-footer').length > 0 ||
        $('.page-template-template-no-header').length > 0) {

      navHeight = 0;

    } else {
       navHeight = ( $('#header-space').length > 0 ) ? $('#header-space').height() : 0;
    }

    if( window.nectarDOMInfo.adminBarHeight > 0 ) {
      navHeight += window.nectarDOMInfo.adminBarHeight;
    }


    var vertCenter = (window.nectarDOMInfo.winH - this.$mediaSections.height())/2 + navHeight/2;
    this.$el[0].style.setProperty('--nectar-sticky-media-sections-vert-y', vertCenter + "px");
  };


  proto.trackDirection = function () {

    if (window.nectarDOMInfo.scrollTop > this.prevScroll) {
      this.direction = 'down';
    } else {
      this.direction = 'up';
    }

    this.prevScroll = window.nectarDOMInfo.scrollTop;

    window.requestAnimationFrame(this.trackDirection.bind(this));
  };


  proto.observe = function () {

    var that = this;

    this.sections = Array.from(this.$contentSections.find('> div'));
    
    if ('IntersectionObserver' in window) {

      if (!(window.nectarDOMInfo.usingMobileBrowser && window.nectarDOMInfo.winW < 1000)) {

        this.observer = new IntersectionObserver(function (entries) {

          entries.forEach(function (entry) {


            var target = (that.direction === 'down') ? that.getTargetSection(entry) : entry.target

            if (that.shouldUpdate(entry)) {

              if (!(window.nectarDOMInfo.scrollTop == 0 && that.direction === 'down')) {

                var index = $(target).index();
                var $activeSection = that.$mediaSections.find('> .nectar-sticky-media-section__media-wrap:eq(' + index + ')');
                var $activeMobileSection = that.$contentSections.find('> .nectar-sticky-media-section__content-section:eq(' + index + ')');

                that.$mediaSections.find('> .nectar-sticky-media-section__media-wrap').removeClass('active');
                $activeSection.addClass('active');
                
                if( $activeSection.find('video.no-loop').length > 0 && window.nectarDOMInfo.winW > 999 ) {
                  that.playSectionVideo($activeSection.find('video.no-loop')[0]);
                }
                if( $activeMobileSection.find('video.no-loop').length > 0 && window.nectarDOMInfo.winW < 1000 ) {
                  that.playSectionVideo($activeMobileSection.find('video.no-loop')[0]);
                }

              }

            }

          });

        }, {
          rootMargin: '-45% 0% -45% 0%',
          threshold: 0
        });

        // Observe each section.
        this.$contentSections.find('> div').each(function () {
          that.observer.observe($(this)[0]);
        });

      } // don't trigger on mobile.

      else {
        // Mobile.
        this.mobileObserver = new IntersectionObserver(function (entries) {

          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              
              var index = $(entry.target).index();
              var $activeSection = that.$contentSections.find('> .nectar-sticky-media-section__content-section:eq(' + index + ')');

              if( $activeSection.find('video.no-loop').length > 0 ) {
                that.playSectionVideo($activeSection.find('video.no-loop')[0]);
              }
              that.mobileObserver.unobserve(entry.target);
            }

          });

        },{
          rootMargin: '-5% 0% -5% 0%',
          threshold: 0
        });

        // Observe each section.
        this.$contentSections.find('> div').each(function () {
          that.mobileObserver.observe($(this)[0]);
        });

      }

    } // if intersection observer. 
  };


  proto.playSectionVideo = function(video) {
    video.pause();
    video.currentTime = 0;
    video.play();
  };


  proto.getTargetSection = function (entry) {

    var index = this.sections.findIndex(function (tab) {
      return tab == entry.target
    });

    if (index >= this.sections.length - 1) {
      return entry.target
    } else {
      return this.sections[index + 1]
    }
  }


  proto.shouldUpdate = function (entry) {

    if (this.direction === 'down' && !entry.isIntersecting) {
      return true;
    }

    if (this.direction === 'up' && entry.isIntersecting) {
      return true;
    }

    return false;
  }


  proto.rebuildMedia = function () {

    var that = this;
    var mediaSections = [];

    this.$contentSections.find('.nectar-sticky-media-section__content-section').each(function (i) {
      // WPBakery duplicates media so we need to reduce it back to the current latest chosen item.
      if ($(this).find('.nectar-sticky-media-content__media-wrap').length > 1) {
        $(this).find('.nectar-sticky-media-content__media-wrap').each(function (i) {
          if (i > 0) {
            $(this).remove();
          }
        });
      }
      mediaSections[i] = $(this).find('.nectar-sticky-media-content__media-wrap').clone();
      mediaSections[i].removeClass('nectar-sticky-media-content__media-wrap').addClass('nectar-sticky-media-section__media-wrap');
    });

    that.$mediaSections.html(' ');

    mediaSections.forEach(function (el) {
      that.$mediaSections.append(el);
    });

    $(window).trigger('salient-lazyloading-image-reinit');

  };


  var mediaSections = [];
  function nectarStickyMediaInit() {

    mediaSections = [];

    $('.nectar-sticky-media-sections').each(function (i) {
      mediaSections[i] = new NectarStickyMedia($(this));
    });
  }

  $(document).ready(function () {

    nectarStickyMediaInit();

    $(window).on('vc_reload', function () {
      setTimeout(nectarStickyMediaInit, 200);
    });

  });


})(jQuery);