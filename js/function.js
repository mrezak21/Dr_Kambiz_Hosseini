(function ($) {
    "use strict";
	
	var $window = $(window); 
	var $body = $('body');
	var isRTL = document.documentElement.getAttribute('dir') === 'rtl'; 

	/* Preloader Effect */
	$window.on('load', function(){
		$(".preloader").fadeOut(600);
	});

	/* Sticky Header */	
	if($('.active-sticky-header').length){
		$window.on('resize', function(){
			setHeaderHeight();
		});

		function setHeaderHeight(){
	 		$("header.main-header").css("height", $('header .header-sticky').outerHeight());
		}	
	
		$window.on("scroll", function() {
			var fromTop = $(window).scrollTop();
			setHeaderHeight();
			var headerHeight = $('header .header-sticky').outerHeight()
			$("header .header-sticky").toggleClass("hide", (fromTop > headerHeight + 100));
			$("header .header-sticky").toggleClass("active", (fromTop > 600));
		});
	}	
	
	/* Slick Menu JS */
	$('#menu').slicknav({
		label : '',
		prependTo : '.responsive-menu'
	});

	if($("a[href='#top']").length){
		$(document).on("click", "a[href='#top']", function() {
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return false;
		});
	}

	/* Image Coparision JS */
	if ($('.transformation_image').length) {
		$(".transformation_image").twentytwenty({
			no_overlay: true,
		});
	}

	/* Hero Slider Layout JS */
	const hero_slider_layout = new Swiper('.hero-slider-layout .swiper', {
		slidesPerView : 1,
		speed: 1000,
		spaceBetween: 0,
		loop: true,
		autoplay: {
			delay: 4000,
		},
		pagination: {
			el: '.hero-pagination',
			clickable: true,
		},
	});

	/* Skill Bar */
	if ($('.skills-progress-bar').length) {
		$('.skills-progress-bar').waypoint(function() {
			$('.skillbar').each(function() {
				$(this).find('.count-bar').animate({
				width:$(this).attr('data-percent')
				},2000);
			});
		},{
			offset: '70%'
		});
	}

	/* Progress Bar */
	if ($('.circle').length){	
		$('.circle').each(function() {			
			var el = $(this).circleProgress({value: 0});
			
			var rawValue = $(this).data('value'); 
				var progressValue = rawValue >= 1 ? 1 : rawValue;
				var progressBarOptions = {
					startAngle: -1.6,
					size: 170,
					thickness: 6,
					fill: {
						color: window.getComputedStyle($(this)[0]).color 
					}
				};

			new Waypoint({
			  element: el.get(0),
			  handler: function() {
				// Initialize the progress bar
				el.circleProgress($.extend({}, progressBarOptions, {
					value: el.data('value')  
				})).on('circle-animation-progress', function(event, progress, stepValue) {
					
					var displayValue = Math.round(stepValue * 100); 
					$(this).find('.progress_value .pro_data').text(displayValue);
				});
					
				this.destroy();
			  },
			  offset: '80%'
			});			
		});		
	}

	/* Youtube Background Video JS */
	if ($('#herovideo').length) {
		var myPlayer = $("#herovideo").YTPlayer();
	}

	/* Init Counter */
	if ($('.counter').length) {
		$('.counter').counterUp({ delay: 6, time: 3000 });
	}

	/* Image Reveal Animation */
	if ($('.reveal').length) {
        gsap.registerPlugin(ScrollTrigger);
        let revealContainers = document.querySelectorAll(".reveal");
        revealContainers.forEach((container) => {
            let image = container.querySelector("img");
			if (!image) {
				return;
			}

			gsap.set(image, {
				transformOrigin: isRTL ? "right center" : "left center",
			});

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
					start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
            tl.set(container, {
                autoAlpha: 1
            });
            tl.from(container, {
				duration: 1,
                xPercent: isRTL ? 100 : -100,
                ease: "power2.out"
            });
            tl.from(image, {
				duration: 1,
                xPercent: isRTL ? -100 : 100,
                scale: 1,
                ease: "power2.out"
            }, "-=1");
        });

		ScrollTrigger.refresh();
    }

	/* Text Effect Animation */
	if ($('.text-anime-style-1').length) {
		let staggerAmount 	= 0.05,
			translateXValue = 0,
			delayValue 		= 0.5,
			textXFrom		= isRTL ? -20 : 20,
		   animatedTextElements = document.querySelectorAll('.text-anime-style-1');
		
		animatedTextElements.forEach((element) => {
			let animationSplitText = new SplitText(element, { type: "chars, words" });
				gsap.from(animationSplitText.words, {
				duration: 1,
				delay: delayValue,
				x: textXFrom,
				autoAlpha: 0,
				stagger: staggerAmount,
				scrollTrigger: { trigger: element, start: "top 85%" },
				});
		});		
	}
	
	if ($('.text-anime-style-2').length) {				
		let	 staggerAmount 		= 0.03,
			 translateXValue	= isRTL ? -20 : 20,
			 delayValue 		= 0.1,
			 easeType 			= "power2.out",
			 animatedTextElements = document.querySelectorAll('.text-anime-style-2');
		
		animatedTextElements.forEach((element) => {
			// In RTL (Persian) split by words to keep cursive letters joined.
			let animationSplitText = new SplitText(element, { type: isRTL ? "words" : "chars, words" });
			let animationTargets = isRTL ? animationSplitText.words : animationSplitText.chars;
				gsap.from(animationTargets, {
					duration: 1,
					delay: delayValue,
					x: translateXValue,
					autoAlpha: 0,
					stagger: isRTL ? 0.12 : staggerAmount,
					ease: easeType,
					scrollTrigger: { trigger: element, start: "top 85%"},
				});
		});		
	}
	
	if ($('.text-anime-style-3').length) {		
		let	animatedTextElements = document.querySelectorAll('.text-anime-style-3');
		
		 animatedTextElements.forEach((element) => {
			//Reset if needed
			if (element.animation) {
				element.animation.progress(1).kill();
				element.split.revert();
			}

			// In RTL (Persian) split by words to keep cursive letters joined.
			element.split = new SplitText(element, {
				type: isRTL ? "lines,words" : "lines,words,chars",
				linesClass: "split-line",
			});
			gsap.set(element, { perspective: 400 });

			let animationTargets = isRTL ? element.split.words : element.split.chars;

			gsap.set(animationTargets, {
				opacity: 0,
				x: isRTL ? "-50" : "50",
			});

			element.animation = gsap.to(animationTargets, {
				scrollTrigger: { trigger: element,	start: "top 90%" },
				x: "0",
				y: "0",
				rotateX: "0",
				opacity: 1,
				duration: 1,
				ease: Back.easeOut,
				stagger: isRTL ? 0.12 : 0.02,
			});
		});		
	}

	/* Parallaxie js */
	var $parallaxie = $('.parallaxie');
	if($parallaxie.length && ($window.width() > 991))
	{
		if ($window.width() > 768) {
			$parallaxie.parallaxie({
				speed: 0.55,
				offset: 0,
			});
		}
	}

	/* Zoom Gallery screenshot */
	$('.gallery-items').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom',
		image: {
			verticalFit: true,
		},
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
			  return element.find('img');
			}
		}
	});

	/* Contact form validation */
	var $contactform = $("#contactForm");
	$contactform.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			submitForm();
		}
	});

	function submitForm(){
		/* Ajax call to submit form */
		$.ajax({
			type: "POST",
			url: "form-process.php",
			data: $contactform.serialize(),
			success : function(text){
				if (text === "success"){
					formSuccess();
				} else {
					submitMSG(false,text);
				}
			}
		});
	}

	function formSuccess(){
		$contactform[0].reset();
		submitMSG(true, "Message Sent Successfully!")
	}

	function submitMSG(valid, msg){
		if(valid){
			var msgClasses = "h4 text-success";
		} else {
			var msgClasses = "h4 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Contact form validation end */

	/* Appointment form validation */
	var $appointmentForm = $("#appointmentForm");
	$appointmentForm.validator({focus: false}).on("submit", function (event) {
		if (!event.isDefaultPrevented()) {
			event.preventDefault();
			submitappointmentForm();
		}
	});

	function submitappointmentForm(){
		/* Ajax call to submit form */
		$.ajax({
			type: "POST",
			url: "form-appointment.php",
			data: $appointmentForm.serialize(),
			success : function(text){
				if (text === "success"){
					appointmentformSuccess();
				} else {
					appointmentsubmitMSG(false,text);
				}
			}
		});
	}

	function appointmentformSuccess(){
		$appointmentForm[0].reset();
		appointmentsubmitMSG(true, "Message Sent Successfully!")
	}

	function appointmentsubmitMSG(valid, msg){
		if(valid){
			var msgClasses = "h3 text-success";
		} else {
			var msgClasses = "h3 text-danger";
		}
		$("#msgSubmit").removeClass().addClass(msgClasses).text(msg);
	}
	/* Appointment form validation end */

	/* Animated Wow Js */	
	new WOW().init();

	/* Popup Video */
	if ($('.popup-video').length) {
		$('.popup-video').magnificPopup({
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: true
		});
	}

	/* Our Service List Start */
	var $services_list = $('.services-list');
	if ($services_list.length) {
		var $service_item = $services_list.find('.service-item');

		if ($service_item.length) {
			$service_item.on({
				mouseenter: function () {
					if (!$(this).hasClass('active')) {
						$service_item.removeClass('active'); 
						$(this).addClass('active'); 
					}
				},
				mouseleave: function () {
					// Optional: Add logic for mouse leave if needed
				}
			});
		}
	}
	/* Our Service List End */

	/* Testimonial Boxes Active Start */
	var $testimonial_boxes = $('.testimonial-boxes');
	if ($testimonial_boxes.length) {
		var $testimonial_item = $testimonial_boxes.find('.testimonial-item');

		if ($testimonial_item.length) {
			$testimonial_item.on({
				mouseenter: function () {
					if (!$(this).hasClass('active')) {
						$testimonial_item.removeClass('active'); 
						$(this).addClass('active'); 
					}
				},
				mouseleave: function () {
					// Optional: Add logic for mouse leave if needed
				}
			});
		}
	}
	/* Testimonial Boxes Active End */
	
})(jQuery);