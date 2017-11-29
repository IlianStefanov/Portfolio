$(document).ready(function(){

    // Scrolling intervals
    $(function() {
        $.scrollify({
            section : ".slide",
            sectionName : ".slide",
            interstitialSection : "",
            easing: "easeOutExpo",
            scrollSpeed: 1100,
            offset : 0,
            scrollbars: true,
            standardScrollElements: "",
            setHeights: true,
            overflowScroll: true,
            updateHash: true,
            touchScroll:true,
            before:function() {},
            after:function() {},
            afterResize:function() {},
            afterRender:function() {}
        });
    });

	// Variables
    var controller,
        $navItem = $('.nav-items li').not('.active'),
        $navTrigger = $('nav-trigger');
    
    // Init ScrollMagic Controller
    controller = new ScrollMagic.Controller();
    
  // Scene 1 - pin our main section
        var pinScene01 = new ScrollMagic.Scene({
            triggerElement: '#main',
            triggerHook: 0,
            duration: '900%'
        })
        .setPin("#main .pin-wrapper", {pushFollowers: false})
        .addTo(controller);
    $('.pin-wrapper').css({
           "position": 'fixed'
    });


    var navTL = new TimelineMax();
    
    // Move navigation left right by 26px 
    $navItem.each(function() {
        var slideHREF = $(this).find('a').attr('href'),
            slideID = slideHREF.substr(slideHREF.length - 7),
            moveNav = TweenMax.to($('.nav-active'), 1, {x: '+=26', ease:Linear.easeNone });
            
            // adding individual tweens to TL
            navTL.add(moveNav, slideID);
    });


    // =Scene 2
    var navScene = new ScrollMagic.Scene({
        triggerElement: $navTrigger,
        duration: '800%'
    })
    .setTween(navTL)
    .addTo(controller);
    
    
//    // =Scene 3 Changing the slides 
//    var slides = ['#slide01','#slide02', '#slide03', '#slide04','#slide05','#slide06','#slide07','#slide08','#slide09'];
//    
//    slides.each(function(e) {
//        var currentSlide = new ScrollMagic.Scene({
//            triggerElement: slides[e], 
//            duration: '50%'
//        })
//        .setClassToggle('slide', '.active')
//        .addTo(controller);
//    });
});
