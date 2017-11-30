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
        
        
    // === Filling Up the arrays
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
                
            crossFade($slideOut, $slideIn, direction, slideIndex);
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
    
    //Init Project
    init();
    
    // CrossFade
    function crossFade($slideOut, $slideIn, direction, slideIndex) {
        var slideOutID = $slideOut.attr('id').substring(5,7),
            slideInID = $slideIn.attr('id').substring(5,7),
            // Slide OUT BCG vars
            slideOutBcg = $slideOut.find('.bcg-color'),
            $slideOutTitle = $slideOut.find('.title .fade-txt'),
            $slideOutNumber = $slideOut.find('.number'),
            
            // Slide In BCG vars
            slideInBcg = $slideIn.find('.bcg-color'),
            $slideInTitle = $slideIn.find('.title .fade-txt'),
            $slideInNumber = $slideIn.find('.number'),
            $slideInBcgWhite = $slideIn.find('.primary .bcg');
        
        console.log("====== SLIDES for NAV ======");
        console.log("This is slide out ID: " + slideOutID);
        console.log("This is slide in ID: " + slideInID);
        
        //Update Nav
        updateNav(slideOutID, slideInID);
        
        //Removing active class from all slides
        TweenMax.set($slide, {className: '-=active'});
        
        //Add aclass active to current slide
        TweenMax.set('#slide' + slideIndex, {className: '+=active'});
        
        //Cross fade timeline ==========================
        var crossFadeTl = new TimelineMax();
        
        crossFadeTl
                  .set($slideIn, {autoAlpha: 1})
                  .set([$slideInNumber, $slideInTitle, $slideInBcgWhite], {autoAlpha: 0})
                  .to([$slideOutTitle, $slideOutNumber], 0.3, {autoAlpha: 0, ease:Linear.easeNone})
                  .set($main, {className: 'slide' + slideInID + '-active'})
                  .set($slideInNumber, {text: '0'})
                  .to($slideInNumber, 1.2, {autoAlpha: 1, ease:Linear.easeNone});
        
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
            .to($primaryBcg, 0.4, {scaleX: 1, ease: Power2.easeOut, clearProps: 'all'})
            .add('fadeInLogo') 
            .to($dgreyBcg, 0.6, {scaleX: 0, ease: Power4.easeIn}, 'fadeInLogo+=0.3')
            .to([$logo, $slideInNumber], 0.2, {autoAlpha: 1, ease:Linear.easeNone}, 'fadeInLogo-=0.2')
            .staggerFrom($slideInTitle, 0.3, {autoAlpha: 0, x: '-=60', ease: Power1.easeOut}, 0.1, 'fadeInLogo+=0.9')
            .fromTo($nav, 0.3, {y: -15, autoAlpha: 0, }, { autoAlpha: 1, y: 0, ease: Power1.easeOut}, 'fadeInLogo+=1.5')
            .add('countingUp')
            ;
            //        transitionInTl.timeScale(2);
        
            var countUpText = new TimelineMax({paused: true});
        
        
            //fade Number in
            countUpText
                .to($slideInNumber, 1.2, {autoAlpha: 0, ease:Linear.easeNone, onUpdate: updateValue, onUpdateParams: ['{self}', 95, $slideInNumber]});
                
            var countUpTl = new TimelineMax();
                countUpTl.to(countUpText, 1, {progress: 1, ease: Power3.easeOut});
            
            // Adding =COUNT UP to the crossfade TL
//            crossFadeTl.add(countUpTl, 'countingUp');
        
            
        }
    
    function updateValue(tl, slideInValue, $slideInNumber) {
        var newValue = parseInt(tl.progress() * slideInValue);
        
        if(slideInValue == 100) {
            $slideInNumber.text(newValue);
        } else {
            $slideInNumber.text(newValue + '%');
        }
        
    } 
    
    function updateNav(slideOutID, slideInID) {
        // Remove active class from all dots
        $('.nav-items li').removeClass('active');
        
        // Add active classto new active item
        TweenMax.set($('.nav-items li.nav-item' + slideInID), {className: '+=active'});
        
    }
    
});
