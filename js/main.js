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
        $navTrigger = $('nav-trigger'),
        getTriggersDown = $('.slide-pos'),
        triggersDown = [],
        getTriggersUp = $('.slide-pos-reverse'),
        triggersUp = [],
        $slideIn = $('.slide.active'),
        $logo = $('.logo'),
        $main = $('#main'),
        $body = $('body'),
        $slide = $('.slide'),
        $nav = $('nav');
        
        
        
    $.each(getTriggersUp, function(key, value) {
        var idUp = '#' + value.id;
        triggersUp.push(idUp);
        console.log(triggersUp[key]);
    });
    
    $.each(getTriggersDown, function(key, value) {
        var id = '#'+ value.id;
        triggersDown.push(id);
        
        console.log(triggersDown[key]);
    });
    
    // triggersDown = [
	// 	"#slide02-pos",
	// 	"#slide03-pos",
	// 	"#slide04-pos",
	// 	"#slide05-pos",
	// 	"#slide06-pos",
	// 	"#slide07-pos",
	// 	"#slide08-pos",
	// 	"#slide09-pos"
	// ]
    
    
    
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
    
    $navItem.each(function() {
        var triggerSlide
    }); 
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
    
    
    
    // =Scene 3 Trigger the Right Animation DOWN
    triggersDown.forEach(function(triggerDown, index) {
        var triggerTransitionToNext = new ScrollMagic.Scene({
            triggerElement: triggerDown,
            triggerHook: 0.6
        })
        .on('enter', function(e) {
            var $slideOut = $('.slide.active'),
                slideIndex = triggerDown.substring(6,8),
                $slideIn = $('#slide' + slideIndex),
                direction = e.scrollDirection;
                console.log('=== DIRECTION ON SCROLL ===');
                console.log(direction);
                
            crossFade($slideOut, $slideIn, direction);
        })
        .addIndicators({
            name: 'trigger',
            indent: 520
        })
        .addTo(controller);
        
    });
    
     // =Scene 4 Trigger the Right Animation UP
    triggersUp.forEach(function(triggerUp, index) {
        var triggerTransitionToPrev = new ScrollMagic.Scene({
            triggerElement: triggerUp,
            triggerHook: 0.49
        })
        .on('leave', function(e) {
            console.log("crossfade to prev" + triggerUp)
        })
        .addIndicators({
            name: 'triggerUp',
            indent: 210,
            colorStart: 'black',
            colorTrigger: 'black'
        })
        .addTo(controller); 
    });
    
    function init() {
        setTimeout(function() {
            // Prevents body from flickering
            TweenMax.set($body, {autoAlpha: 1});
            // Trigger animation
            
            animationIn($slideIn);
        }, 500);
        
    }
    
    init();
    
    // CrossFade
    function crossFade($slideOut, $slideIn, direction) {
        
    } 
    
    // ANIMATING BIG NUMBER LEFT
    function animationIn($slideIn) {
        var $slideInNumber = $slideIn.find('.number'),
            $slideInTitle = $slideIn.find('.fade-txt'),
            $primaryBcg = $slideIn.find('.primary .bcg'),
            $dgreyBcg = $slideIn.find('.bcg-white'),
            transitionInTl = new TimelineMax();
        
        transitionInTl
            .set([$slide, $slideInNumber, $nav, $logo], { autoAlpha: 0 })
            .set($slideIn, { autoAlpha: 1 })
            .set($dgreyBcg, {scaleX:1})
            .set($primaryBcg, {scaleX:0})
            .to($dgreyBcg, 0.4, {scaleX: 0.63, ease: Power2.easeIn})
            .to($primaryBcg, 0.4, {scaleX: 1, ease: Power2.easeOut})
            .add('fadeInLogo') 
            .to($dgreyBcg, 0.6, {scaleX: 0, ease: Power4.easeIn})
    }
    
});
