$(document).ready(function(){
    $(function() {
        $.scrollify({
            section : ".slide",
            sectionName : ".slide",
            interstitialSection : "",
            easing: "easeOutExpo",
            scrollSpeed: 1100,
            offset : 0,
            scrollbars: false,
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
    
    enquire.register("screen and (max-width: 1025px)", function() {});
	// Variables
	var controller,
		$navItem = $('.nav-items li').not('.active'),
		$navTrigger = $('.nav-trigger'),
		$navItemLink = $('.nav-items a'),
		getTriggersDown = $('.slide-pos'),
		triggersDown = [],
		getTriggersUp = $('.slide-pos-reverse'),
		triggersUp = [],
		$slideIn = $('.slide.active'),
		$logo = $('.logo'),
		$main = $('#main'),
		$body = $('body'),
		$slide = $('.slide'),
		$nav = $('nav'),
		$layers = $('#layers'),
		introAnimationTl = new TimelineMax(),
        typed;


	// triggers on the way down
	$.each(getTriggersDown, function(key, value){

		var id = '#'+value.id;
		triggersDown.push(id);
		//console.log(triggersDown[key]);

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

	// triggers on the way up
	$.each(getTriggersUp, function(key, value){

		var id = '#'+value.id;
		triggersUp.push(id);
		//console.log(triggersUp[key]);

	});

	enquire.register("screen and (min-width: 1025px)", {

		match: function(){

			//console.log('init ScrollMagic');
			initScrollMagic();

		},
		unmatch: function(){

			//console.log('disable ScrollMagic');
			controller.destroy(true);
			$('*').removeAttr('style');

		}

	});

	function initScrollMagic(){

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

		// Navigation timeline
		var navTl = new TimelineMax();

		// move navigation right by 26px for each item
		$navItem.each(function(){

			var slideHREF = $(this).find('a').attr('href'),
				slideID = slideHREF.substr(slideHREF.length -7),
				moveNav = TweenMax.to($('.nav-active'), 1, {x: '+=26', ease:Linear.easeNone});

			// add individual tweens to the timeline
			navTl.add(moveNav, slideID);

		});

		// Scene 2 - move navigation
		var navScene = new ScrollMagic.Scene({
			triggerElement: $navTrigger,
			duration: '800%'
		})
		.setTween(navTl)
		.addTo(controller);

		// Scene 3 - trigger the right animation on the way DOWN
		triggersDown.forEach(function(triggerDown, index){

			var triggerTransitionToNext = new ScrollMagic.Scene({
				triggerElement: triggerDown,
				triggerHook: 0.6
			})
			.on('enter', function(e){

				//console.log('crossfade to next '+triggerDown);
				var $slideOut = $('.slide.active'),
					slideIndex = triggerDown.substring(6,8),
					$slideIn = $('#slide'+slideIndex),
					direction = e.scrollDirection;
				
				//console.log(e.scrollDirection);
				crossFade($slideOut, $slideIn, direction, slideIndex);

			})
			 .addIndicators({
			 	name: 'triggerDown',
			 	indent: 520,
			 	colorStart: 'yellow',
			 	colorTrigger: 'yellow'
			 })
			.addTo(controller);


		});

		// Scene 4 - trigger the right animation on the way UP
		triggersUp.forEach(function(triggerUp, index){

			var triggerTransitionToPrev = new ScrollMagic.Scene({
				triggerElement: triggerUp,
				triggerHook: 0.49
			})
			.on('leave', function(e){

				//console.log('crossfade to previous '+triggerUp);
				var $slideOut = $('.slide.active'),
					slideIndex = triggerUp.substring(6,8),
					$slideIn = $('#slide'+slideIndex),
					direction = e.scrollDirection;
				
                if(slideIndex !== 02 ) {
                    typed.destroy();
                }
                
				//console.log(e.scrollDirection);
				crossFade($slideOut, $slideIn, direction, slideIndex);

			})
			 .addIndicators({
			 	name: 'triggerUp',
			 	indent: 110,
			 	colorStart: 'black',
			 	colorTrigger: 'black'
			 })
			.addTo(controller);


		});

		function init(){

			setTimeout(function(){

				//prevents body from flickering
				TweenMax.set($body, {autoAlpha: 1});

				// animate first slide in
				animationIn($slideIn);

			}, 500);
			
		}

		init();

		// cross fade
		function crossFade($slideOut, $slideIn, direction, slideIndex){

			var slideOutID = $slideOut.attr('id').substring(5, 7),
				slideInID = $slideIn.attr('id').substring(5, 7),

				// slide out
				$slideOutBcg = $slideOut.find('.bcg-color'),
				$slideOutTitle = $slideOut.find('.title .fade-txt'),
				$slideOutNumber = $slideOut.find('.title-section'),
                $slideOutProjects = $slideOut.find('.projects-listing'),
                $slideOutOptions = $slideOut.find('.projects-options'),
				$slideInBcg = $slideIn.find('.bcg-color'),
				$slideInTitle = $slideIn.find('.title .fade-txt'),
				$slideInNumber = $slideIn.find('.title-section'),
				$slideInBcgWhite = $slideIn.find('.primary .bcg'),
				slideInValue = $slideInNumber.attr('data-value'),
                $slideInProjects = $slideIn.find('.projects-listing'),
                $slideInOptions = $slideIn.find('.projects-options'),
                $skillsPanel = $slideIn.find('.container'),
                $skillsProgressBars= $slideIn.find('.progress-bar')
				;

            console.log("projects listing: " + $slideOutProjects + "and projects out: " + $slideInProjects);
			// Update nav
			updateNav(slideOutID, slideInID);

			// remove class active from all slides
			TweenMax.set($slide, {className: '-=active'});

			// add class active to the current slide
			TweenMax.set($('#slide'+slideIndex), {className: '+=active'});

			/* THIS IS THE MOST FUN PART OF THE WHOLE PROJECT :D */
			// cross fade timeline
			var crossFadeTl = new TimelineMax();

			crossFadeTl
				.set($slideIn, {autoAlpha: 1})
				.set([$slideInTitle, $slideInNumber, $slideInBcgWhite], {autoAlpha: 0})
				.to([$slideOutTitle, $slideOutNumber, $layers], 0.3, {autoAlpha: 0, ease: Linear.easeNone})
				.set($main, {className: 'slide'+slideInID+'-active'})
				.add('countingUp')
				.to($slideInBcgWhite, 0.3, {autoAlpha: 1, ease:Linear.easeNone}, 'countingUp-=0.4')
				.staggerFromTo($slideInTitle, 0.3, {autoAlpha: 0, x: '-=20'}, {autoAlpha: 1, x: 0, ease:Power1.easeOut}, 0.1, 'countingUp+=1.1')
                ;

			//crossFadeTl.timeScale(0.5);
            
            
			// count up or scramble text
			if(slideInID == 09) {

				// scramble text
				var scrambleTextTl = new TimelineMax();
				scrambleTextTl.to($slideInNumber, 1.4, {scrambleText: 'Share', autoAlpha: 1, ease:Power1.easeOut});

				crossFadeTl.add(scrambleTextTl, 'countingUp');

			} else {
//				// count up
//				var countUpText = new TimelineMax({paused: true});
//
//				// fade number in
//				countUpText.to($slideInNumber, 1.2, {autoAlpha: 1, ease:Linear.easeNone, onUpdate: updateValue, onUpdateParams: ['{self}', slideInValue, $slideInNumber]});
//
//				var countUpTl = new TimelineMax();
//				countUpTl.to(countUpText, 1, {progress: 1, ease:Power3.easeOut});
//
//				crossFadeTl.add(countUpTl, 'countingUp');

			}
            
            if(slideInID == 02) {
                var slideAboutMeTl = new TimelineMax();
                slideAboutMeTl
                    .fromTo($slideInNumber, 0.4, {autoAlpha:0, x: '-=30'}, {scrambleText: 'ABOUT ME', autoAlpha: 1, x: 0, ease:Power1.easeOut});
                 //.about-me-title  
                 typed = new Typed('.about-me-title', {
                   strings: ["First sentence.", "Second sentence."],
                   typeSpeed: 30
                 });
                
                crossFadeTl.add(slideAboutMeTl, 'countingUp');
            }  else {
                $('.about-me-title').text("");
//                var cursor = document.querySelector('.typed-cursor');
//                cursor.parentNode.removeChild(cursor);
                
            }
            if(slideInID == 04) {

                var projectsListing = new TimelineMax();
                projectsListing
                    .fromTo($slideInNumber, 0.4, {autoAlpha: 0, x: '-=30'}, {scrambleText: 'PROJECTS', autoAlpha: 1, x: 0, ease:Power1.easeOut})
                    .fromTo($slideInOptions, 0.4, {autoAlpha: 0, x: '-=20'}, {autoAlpha: 1, x: 0, ease: Power4.easeInOut})
                    .staggerFromTo($slideInProjects, 0.3, {autoAlpha: 0}, {autoAlpha: 1,
                    ease: Power1.easeOut}, 0.1);
                
                
                

                // scramble text
                crossFadeTl.add(projectsListing, 'countingUp');

            } else {
                var projectsListingOut = new TimelineMax();
                projectsListingOut
                .to($slideOutOptions, 0.4, {autoAlpha: 0, ease:Power1.easeOut}) 
                .staggerFromTo($slideOutProjects, 0.3, {autoAlpha: 1, ease: Power1.easeOut}, {autoAlpha: 0,
                    }, 0.1);
                
          
                crossFadeTl.add(projectsListingOut, 'countingUp-=1.5');
            }
            
            
            if(slideInID == 03) {
                var slideEducation = new TimelineMax();
                slideEducation
                    .fromTo($slideInNumber, 0.4, {autoAlpha:0, x: '-=30'}, {scrambleText: 'EDUCATION', autoAlpha: 1, x: 0, ease:Power1.easeOut});
                
                crossFadeTl.add(slideEducation, 'countingUp');
            } 
            
            if(slideInID == 05) {
               
//                skillsTrigger();
                var skillsTimeline = new TimelineMax({onComplete:skillsTrigger()});
                    skillsTimeline
                    .fromTo($skillsPanel, 0.4, {autoAlpha: 0},{autoAlpha: 1, ease:Power4.easeInOut})
                    .staggerFromTo($skillsProgressBars, 0.3, {autoAlpha: 0}, {autoAlpha: 1,
                    ease: Power1.easeOut}, 0.1);
                        
                
                crossFadeTl.add(skillsTimeline, 'countingUp');
            }
            
            // Animating PROJECTS Listing
            

			// colored background tween up/down
			if (direction == 'FORWARD') {

				var tweenBcg = TweenMax.fromTo(
					$slideInBcg, 0.7, 
					{autoAlpha: 0}, 
					{
						autoAlpha: 1, 
						ease:Linear.easeNone,
						onComplete: hideOldSlide,
						onCompleteParams: [$slideOut]
					}
				);

				crossFadeTl.add(tweenBcg, 'countingUp-=0.3');

			} else {

				var tweenBcg = TweenMax.to(
					$slideOutBcg, 0.7,  
					{
						autoAlpha: 0, 
						ease:Linear.easeNone,
						onComplete: hideOldSlide,
						onCompleteParams: [$slideOut]
					}
				);

				crossFadeTl.add(tweenBcg, 'countingUp-=0.3');

			}

			// fade in svg on the first slide
			if(slideInID == 01){

				var fadeInSVG = TweenMax.to($layers, 0.3, {autoAlpha: 1, ease:Linear.easeNone});

				// make the animation faster
				introAnimationTl.timeScale(1.8);

				// include fade and intro animation
				crossFadeTl.add([fadeInSVG,introAnimationTl], 'countingUp+=1.4');

			}
		}

		function hideOldSlide($slideOut){
			TweenMax.set($slideOut, {autoAlpha: 0});
		}

        // Function with digits effect 
		function updateValue(tl, slideInValue, $slideInNumber){

			var newValue = parseInt(tl.progress() * slideInValue);

			// don't include % for the initial slide
			if(slideInValue == 100){

				$slideInNumber.text(newValue);

			} else {

				$slideInNumber.text(newValue+'%'); 
                //not good for the first and last slide
            }

		}

		function updateNav(slideOutID, slideInID){
			// remove active class from all dots
			$('.nav-items li').removeClass('active');

			// add active class to the new active slide
			TweenMax.set($('.nav-items li.nav-item'+slideInID), {className: '+=active'});
		}

		// animate slide IN
		function animationIn($slideIn){

			// svg logo animation
			// using DrawSVGPlugin, that I can't distribute through the course files, but will include the reference in the html

			var $layer = $('.layer'),
				$svgBase = $('#base'),
				$svgPath = $('#base path'),
				$awwwLogo = $('.awww-logo');

			introAnimationTl
				.from($svgPath, 1.2, {drawSVG: '0%', ease:Power2.easeInOut})
				.from($awwwLogo, 0.3, {autoAlpha: 0}, '-=0.3')
				.from([$svgBase, $awwwLogo], 1.2, {y: -115, ease:Power4.easeInOut}, "+=0.2")
				.add('fade')
				.staggerFrom($layer, 2, {autoAlpha: 0, y: -10, ease:Power4.easeInOut}, 0.2, 'fade-=1.5');

			var $slideInNumber = $slideIn.find('.title-section'),
				$slideInTitle = $slideIn.find('.fade-txt'),
				$primaryBcg = $slideIn.find('.primary .bcg'),
				$whiteBcg = $slideIn.find('.bcg-white'),
                transitionInTl = new TimelineMax();

			transitionInTl
				.set([$slide, $slideInNumber, $nav, $logo], {autoAlpha: 0})
				.set($slideIn, {autoAlpha: 1})
				.set($whiteBcg, {scaleX: 1})
				.set($primaryBcg, {scaleX: 0})
				.to($whiteBcg, 0.4, {scaleX: 0.63, ease:Power2.easeIn})
				.to($primaryBcg, 0.4, {scaleX: 1, ease:Power2.easeOut, clearProps: 'all'})
				.add('fadeInLogo')
				.to($whiteBcg, 0.6, {scaleX: 0, ease:Power4.easeIn}, 'fadeInLogo+=0.3')
				.to([$logo, $slideInNumber], 0.2, {autoAlpha: 1, ease:Linear.easeNone}, 'fadeInLogo-=0.2')
				.staggerFrom($slideInTitle, 0.3, {autoAlpha: 0, x: '-=60', ease:Power1.easeOut}, 0.1, 'fadeInLogo+=0.9')
				.add(introAnimationTl, 'fadeInLogo+=1')
				.fromTo($nav, 0.3, {y: -15, autoAlpha: 0}, {autoAlpha: 1, y: 0, ease:Power1.easeOut}, 'fadeInLogo+=3.5')
				;

			//transitionInTl.timeScale(3);
              

		}
        
        function skillsTrigger() {
            jQuery('.progress-bar').each(function() {
              jQuery(this).find('.progress-content').animate({
                width:jQuery(this).attr('data-percentage')
              },2000);
              jQuery(this).find('.progress-number-mark').animate(
                {left:jQuery(this).attr('data-percentage')},
                {
                 duration: 2000,
                 step: function(now, fx) {
                   var data = Math.round(now);
                   jQuery(this).find('.percent').html(data + '%');
                 }
              });  
            });
        }
        

		$navItemLink.click(function(e){

			e.preventDefault();

			//scroll to the right position
			var slideInIndex = $(e.target).attr('href').substring(6,8),
				offset = $('div#slide'+slideInIndex+'-pos').offset().top,
				wH = window.innerHeight,
				finalOffset = offset-(wH*0.4);

			//console.log(wH, offset, finalOffset);

			// move window to the correct position
			TweenLite.to(window, 0.7, {scrollTo: finalOffset, ease:Power4.easeOut});

		});
        
        
        
	}

});














