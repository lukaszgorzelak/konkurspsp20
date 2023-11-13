'use strict';

(function () {

	// Global variables
	var
		userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$window = $(window),
		$html = $("html"),

		isDesktop = $html.hasClass("desktop"),
		isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
		isMacOs = navigator.platform.match(/(Mac)/i),
		isRtl = $html.attr("dir") === "rtl",
		isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		isNoviBuilder = false,

		plugins = {
			rdNavbar:         $( ".rd-navbar" ),
			maps:             $( ".google-map-container" ),
			rdMailForm:       $( ".rd-mailform" ),
			rdInputLabel:     $( ".form-label" ),
			regula:           $( "[data-constraints]" ),
			owl:              $( ".owl-carousel" ),
			swiper:           $( ".swiper-slider" ),
			lightGallery:     $( "[data-lightgallery='group']" ),
			lightGalleryItem: $( "[data-lightgallery='item']" ),
			pageLoader:       $( "#page-loader" ),
			vide:             $( ".vide_bg" ),
			customWaypoints:  $( '[data-custom-scroll-to]' ),
			captcha:          $( '.recaptcha' ),
			materialParallax: $( ".parallax-container" ),
			copyrightYear:    $( '.copyright-year' ),
		};

	// Is Mac os
	if ( isMacOs ) $html.addClass( 'mac-os' );

	// Is Firefox
	if ( isFirefox ) $html.addClass( 'firefox' );

	// IE Polyfills
	if ( isIE ) {
		if ( isIE < 10 ) $html.addClass( "lt-ie-10" );
		if ( isIE < 11 ) $html.addClass( "ie-10" );
		if ( isIE === 11 ) $html.addClass( "ie-11" );
		if ( isIE === 12 ) $html.addClass( "ie-edge" );
	}


	/**
	 * Plugin initialization wrapper
	 * @param condition
	 * @param trueCallback
	 * @param falseCallback
	 */
	function initPlugin( condition, trueCallback, falseCallback ) {
		if ( condition && trueCallback instanceof Function ) trueCallback();
		else if ( falseCallback instanceof Function ) falseCallback();
	}

	/**
	 * toggleSwiperInnerVideos
	 * @description  toggle swiper videos on active slides
	 */
	function toggleSwiperInnerVideos(swiper) {
		var prevSlide = $(swiper.slides[swiper.previousIndex]),
			nextSlide = $(swiper.slides[swiper.activeIndex]),
			videos,
			videoItems = prevSlide.find("video");

		for (var i = 0; i < videoItems.length; i++) {
			videoItems[i].pause();
		}

		videos = nextSlide.find("video");
		if (!isNoviBuilder && videos.length) {
			videos.get(0).play();
			videos.css({'visibility': 'visible', 'opacity': '1'});
		}
	}

	/**
	 * toggleSwiperCaptionAnimation
	 * @description  toggle swiper animations on active slides
	 */
	function toggleSwiperCaptionAnimation(swiper) {
		var
			prevSlide = $(swiper.container).find("[data-caption-animate]"),
			nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
			delay,
			duration,
			nextSlideItem,
			prevSlideItem,
			i;

		for (i = 0; i < prevSlide.length; i++) {
			prevSlideItem = $(prevSlide[i]);

			prevSlideItem.removeClass("animated")
				.removeClass(prevSlideItem.attr("data-caption-animate"))
				.addClass("not-animated");
		}

		for (i = 0; i < nextSlide.length; i++) {
			nextSlideItem = $(nextSlide[i]);
			delay = nextSlideItem.attr("data-caption-delay");
			duration = nextSlideItem.attr('data-caption-duration');

			var tempFunction = function (nextSlideItem, duration) {
				return function () {
					nextSlideItem
						.removeClass("not-animated")
						.addClass(nextSlideItem.attr("data-caption-animate"))
						.addClass("animated");

					if (duration) {
						nextSlideItem.css('animation-duration', duration + 'ms');
					}
				};
			};

			setTimeout(tempFunction(nextSlideItem, duration), delay ? parseInt(delay, 10) : 0);
		}
	}

	/**
	 * makeWaypointScroll
	 * @description  init smooth anchor animations
	 */
	function makeWaypointScroll(obj) {
		var $this = $(obj);
		if (!isNoviBuilder) {
			$this.on('click', function (e) {
				e.preventDefault();
				$("body, html").stop().animate({
					scrollTop: $("#" + $(this).attr('data-custom-scroll-to')).offset().top
				}, 1000, function () {
					$window.trigger("resize");
				});
			});
		}
	}

	/**
	 * initSwiperWaypoints
	 * @description  toggle waypoints on active slides
	 */
	function initSwiperWaypoints(swiper) {
		var prevSlide = $(swiper.container),
			nextSlide = $(swiper.slides[swiper.activeIndex]);

		prevSlide
			.find('[data-custom-scroll-to]')
			.each(function () {
				var $this = $(this);
				makeWaypointScroll($this);
			});

		nextSlide
			.find('[data-custom-scroll-to]')
			.each(function () {
				var $this = $(this);
				makeWaypointScroll($this);
			});
	}

	/**
	 * initOwlCarousel
	 * @description  Init owl carousel plugin
	 */
	function initOwlCarousel(c) {
		var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
			values = [0, 576, 768, 992, 1200, 1600],
			responsive = {};

		for (var j = 0; j < values.length; j++) {
			responsive[values[j]] = {};
			for (var k = j; k >= -1; k--) {
				if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
					responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
				}
				if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
					responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
				}
				if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
					responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
				}
			}
		}

		// Enable custom pagination
		if (c.attr('data-dots-custom')) {
			c.on("initialized.owl.carousel", function (event) {
				var carousel = $(event.currentTarget),
					customPag = $(carousel.attr("data-dots-custom")),
					active = 0;

				if (carousel.attr('data-active')) {
					active = parseInt(carousel.attr('data-active'), 10);
				}

				carousel.trigger('to.owl.carousel', [active, 300, true]);
				customPag.find("[data-owl-item='" + active + "']").addClass("active");

				customPag.find("[data-owl-item]").on('click', function (e) {
					e.preventDefault();
					carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
				});

				carousel.on("translate.owl.carousel", function (event) {
					customPag.find(".active").removeClass("active");
					customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
				});
			});
		}

		c.owlCarousel({
			autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
			loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
			items: 1,
			rtl: isRtl,
			center: c.attr("data-center") === "true",
			dotsContainer: c.attr("data-pagination-class") || false,
			navContainer: c.attr("data-navigation-class") || false,
			mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
			nav: c.attr("data-nav") === "true",
			dots: c.attr("data-dots") === "true",
			dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
			animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
			animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
			responsive: responsive,
			navText: function () {
				try {
					return JSON.parse(c.attr("data-nav-text"));
				} catch (e) {
					return [];
				}
			}(),
			navClass: function () {
				try {
					return JSON.parse(c.attr("data-nav-class"));
				} catch (e) {
					return ['owl-prev', 'owl-next'];
				}
			}()
		});
	}

	/**
	 * @desc Initialize the gallery with set of images
	 * @param {object} itemsToInit - jQuery object
	 * @param {string} addClass - additional gallery class
	 */
	function initLightGallery(itemsToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemsToInit).lightGallery({
				thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
				selector: "[data-lightgallery='item']",
				autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
				pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
				addClass: addClass,
				mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
				loop: $(itemsToInit).attr("data-lg-loop") !== "false",
				showThumbByDefault: false
			});
		}
	}

	/**
	 * @desc Initialize the gallery with one image
	 * @param {object} itemToInit - jQuery object
	 * @param {string} addClass - additional gallery class
	 */
	function initLightGalleryItem(itemToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemToInit).lightGallery({
				selector: "this",
				addClass: addClass,
				counter: false,
				youtubePlayerParams: {
					modestbranding: 1,
					showinfo: 0,
					rel: 0,
					controls: 0
				},
				vimeoPlayerParams: {
					byline: 0,
					portrait: 0
				}
			});
		}
	}

	/**
	 * isScrolledIntoView
	 * @description  check the element whas been scrolled into the view
	 */
	function isScrolledIntoView(elem) {
		if (!isNoviBuilder) {
			return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
		}
		else {
			return true;
		}
	}

	/**
	 * @desc Calls a function when element has been scrolled into the view
	 * @param {object} element - jQuery object
	 * @param {function} func - init function
	 */
	function lazyInit( element, func ) {
		var scrollHandler = function () {
			if ( ( !element.hasClass( 'lazy-loaded' ) && ( isScrolledIntoView( element ) ) ) ) {
				func.call();
				element.addClass( 'lazy-loaded' );
			}
		};

		scrollHandler();
		$window.on( 'scroll', scrollHandler );
	}

	/**
	 * @desc Google map function for getting latitude and longitude
	 */
	function getLatLngObject(str, marker, map, callback) {
		var coordinates = {};
		try {
			coordinates = JSON.parse(str);
			callback(new google.maps.LatLng(
				coordinates.lat,
				coordinates.lng
			), marker, map)
		} catch (e) {
			map.geocoder.geocode({'address': str}, function (results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();

					callback(new google.maps.LatLng(
						parseFloat(latitude),
						parseFloat(longitude)
					), marker, map)
				}
			})
		}
	}

	/**
	 * @desc Initialize Google maps
	 */
	function initMaps() {
		var key;

		for ( var i = 0; i < plugins.maps.length; i++ ) {
			if ( plugins.maps[i].hasAttribute( "data-key" ) ) {
				key = plugins.maps[i].getAttribute( "data-key" );
				break;
			}
		}

		$.getScript('//maps.google.com/maps/api/js?'+ ( key ? 'key='+ key + '&' : '' ) +'sensor=false&libraries=geometry,places&v=quarterly', function () {
			var head = document.getElementsByTagName('head')[0],
				insertBefore = head.insertBefore;

			head.insertBefore = function (newElement, referenceElement) {
				if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
					return;
				}
				insertBefore.call(head, newElement, referenceElement);
			};
			var geocoder = new google.maps.Geocoder;
			for (var i = 0; i < plugins.maps.length; i++) {
				var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
				var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
				var center = plugins.maps[i].getAttribute("data-center") || "New York";

				// Initialize map
				var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
					zoom: zoom,
					styles: styles,
					scrollwheel: false,
					center: {lat: 0, lng: 0}
				});

				// Add map object to map node
				plugins.maps[i].map = map;
				plugins.maps[i].geocoder = geocoder;
				plugins.maps[i].keySupported = true;
				plugins.maps[i].google = google;

				// Get Center coordinates from attribute
				getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
					mapElement.map.setCenter(location);
				});

				// Add markers from google-map-markers array
				var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");

				if (markerItems.length){
					var markers = [];
					for (var j = 0; j < markerItems.length; j++){
						var markerElement = markerItems[j];
						getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function(location, markerElement, mapElement){
							var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
							var info = markerElement.getAttribute("data-description") || "";
							var infoWindow = new google.maps.InfoWindow({
								content: info
							});
							markerElement.infoWindow = infoWindow;
							var markerData = {
								position: location,
								map: mapElement.map
							};
							if (icon){
								markerData.icon = icon;
							}
							var marker = new google.maps.Marker(markerData);
							markerElement.gmarker = marker;
							markers.push({markerElement: markerElement, infoWindow: infoWindow});
							marker.isActive = false;
							// Handle infoWindow close click
							google.maps.event.addListener(infoWindow,'closeclick',(function(markerElement, mapElement){
								var markerIcon = null;
								markerElement.gmarker.isActive = false;
								markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
								markerElement.gmarker.setIcon(markerIcon);
							}).bind(this, markerElement, mapElement));


							// Set marker active on Click and open infoWindow
							google.maps.event.addListener(marker, 'click', (function(markerElement, mapElement) {
								if (markerElement.infoWindow.getContent().length === 0) return;
								var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
								for (var k =0; k < markers.length; k++){
									var markerIcon;
									if (markers[k].markerElement === markerElement){
										currentInfoWindow = markers[k].infoWindow;
									}
									gMarker = markers[k].markerElement.gmarker;
									if (gMarker.isActive && markers[k].markerElement !== markerElement){
										gMarker.isActive = false;
										markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
										gMarker.setIcon(markerIcon);
										markers[k].infoWindow.close();
									}
								}

								currentMarker.isActive = !currentMarker.isActive;
								if (currentMarker.isActive) {
									markerIcon = markerElement.getAttribute("data-icon-active");
									if ( markerIcon || mapElement.getAttribute("data-icon-active")) {
										currentMarker.setIcon(markerIcon);
									}

									currentInfoWindow.open(map, marker);
								}else{
									markerIcon = markerElement.getAttribute("data-icon");
									if ( markerIcon || mapElement.getAttribute("data-icon")) {
										currentMarker.setIcon(markerIcon);
									}
									currentInfoWindow.close();
								}
							}).bind(this, markerElement, mapElement))
						})
					}
				}
			}
		});
	}

	/**
	 * attachFormValidator
	 * @description  attach form validation to elements
	 */
	function attachFormValidator(elements) {
		var i;
		for (i = 0; i < elements.length; i++) {
			var o = $(elements[i]), v;
			o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
			v = o.parent().find(".form-validation");
			if (v.is(":last-child")) {
				o.addClass("form-control-last-child");
			}
		}

		elements.on('input change propertychange blur', function (e) {
			var $this = $(this), results;

			if (e.type !== "blur") {
				if (!$this.parent().hasClass("has-error")) {
					return;
				}
			}

			if ($this.parents('.rd-mailform').hasClass('success')) {
				return;
			}

			if ((results = $this.regula('validate')).length) {
				for (i = 0; i < results.length; i++) {
					$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
				}
			} else {
				$this.siblings(".form-validation").text("").parent().removeClass("has-error")
			}
		}).regula('bind');

		var regularConstraintsMessages = [
			{
				type: regula.Constraint.Required,
				newMessage: "The text field is required."
			},
			{
				type: regula.Constraint.Email,
				newMessage: "The email is not a valid email."
			},
			{
				type: regula.Constraint.Numeric,
				newMessage: "Only numbers are required"
			},
			{
				type: regula.Constraint.Selected,
				newMessage: "Please choose an option."
			}
		];


		for (i = 0; i < regularConstraintsMessages.length; i++) {
			var regularConstraint = regularConstraintsMessages[i];

			regula.override({
				constraintType: regularConstraint.type,
				defaultMessage: regularConstraint.newMessage
			});
		}
	}

	/**
	 * isValidated
	 * @description  check if all elemnts pass validation
	 */
	function isValidated(elements, captcha) {
		var results, errors = 0;

		if (elements.length) {
			for (var j = 0; j < elements.length; j++) {

				var $input = $(elements[j]);
				if ((results = $input.regula('validate')).length) {
					for (var k = 0; k < results.length; k++) {
						errors++;
						$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
					}
				} else {
					$input.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}

			if (captcha) {
				if (captcha.length) {
					return validateReCaptcha(captcha) && errors === 0
				}
			}

			return errors === 0;
		}
		return true;
	}

	/**
	 * validateReCaptcha
	 * @description  validate google reCaptcha
	 */
	function validateReCaptcha(captcha) {
		var captchaToken = captcha.find('.g-recaptcha-response').val();

		if (captchaToken.length === 0) {
			captcha
				.siblings('.form-validation')
				.html('Please, prove that you are not robot.')
				.addClass('active');
			captcha
				.closest('.form-wrap')
				.addClass('has-error');

			captcha.on('propertychange', function () {
				var $this = $(this),
					captchaToken = $this.find('.g-recaptcha-response').val();

				if (captchaToken.length > 0) {
					$this
						.closest('.form-wrap')
						.removeClass('has-error');
					$this
						.siblings('.form-validation')
						.removeClass('active')
						.html('');
					$this.off('propertychange');
				}
			});

			return false;
		}

		return true;
	}


	// Initialize scripts that require a loaded window
	$window.on( 'load', function () {
		// Page loader
		initPlugin( plugins.pageLoader.length > 0 && !isNoviBuilder, function () {
			plugins.pageLoader.fadeOut( 'slow' );
			$window.trigger( "resize" );
		}, function () {
			plugins.pageLoader.remove();
		});

		// Vide
		initPlugin( plugins.vide.length, function () {
			for ( var i = 0; i < plugins.vide.length; i++ ) {
				var $element = $(plugins.vide[i]),
					options = $element.data('vide-options'),
					path = $element.data('vide-bg');

				if ( !isMobile ) {
					$element.vide( path, options );

					var
						videObj = $element.data('vide').getVideoObject(),
						scrollHandler = (function( $element ) {
							if ( isScrolledIntoView( $element ) ) this.play();
							else this.pause();
						}).bind( videObj, $element );

					scrollHandler();
					if ( isNoviBuilder ) videObj.pause();
					else document.addEventListener( 'scroll', scrollHandler );
				} else {
					$element.css({ 'background-image': 'url('+ path +'.jpg)' });
				}
			}
		});
	} );


	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;

		/**
		 * onloadCaptchaCallback
		 */
		window.onloadCaptchaCallback = function () {
			for (var i = 0; i < plugins.captcha.length; i++) {
				var $capthcaItem = $(plugins.captcha[i]);

				grecaptcha.render(
					$capthcaItem.attr('id'),
					{
						sitekey: $capthcaItem.attr('data-sitekey'),
						size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
						theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
						callback: function () {
							$('.recaptcha').trigger('propertychange');
						}
					}
				);
				$capthcaItem.after("<span class='form-validation'></span>");
			}
		};


		// Copyright Year (Evaluates correct copyright year)
		initPlugin( plugins.copyrightYear.length, function () {
			plugins.copyrightYear.text( initialDate.getFullYear() );
		});

		// Owl carousel
		initPlugin( plugins.owl.length, function () {
			for (var i = 0; i < plugins.owl.length; i++) {
				var c = $(plugins.owl[i]);
				plugins.owl[i].owl = c;

				initOwlCarousel(c);
			}
		});

		// Google maps
		initPlugin( plugins.maps.length, function () {
			lazyInit( plugins.maps, initMaps );
		});

		// UI To Top
		initPlugin( isDesktop && !isNoviBuilder, function () {
			$().UItoTop({
				easingType: 'easeOutQuart',
				containerClass: 'ui-to-top'
			});
		});

		// RD Navbar
		initPlugin( plugins.rdNavbar.length, function () {
			var aliaces, i, j, len, values, responsiveNavbar;

			aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
			values = [0, 576, 768, 992, 1200, 1600];
			responsiveNavbar = {};

			for (i = j = 0, len = values.length; j < len; i = ++j) {
				if (!responsiveNavbar[values[i]]) {
					responsiveNavbar[values[i]] = {};
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
					responsiveNavbar[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
					responsiveNavbar[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
					responsiveNavbar[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
				}
				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
					responsiveNavbar[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
				}
				if (isNoviBuilder) {
					responsiveNavbar[values[i]]['stickUp'] = false;
				} else if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
					responsiveNavbar[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
				}

				if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
					responsiveNavbar[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
				}
			}


			plugins.rdNavbar.RDNavbar({
				anchorNav: !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive: responsiveNavbar,
				callbacks: {
					onStuck: function () {
						var navbarSearch = this.$element.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
						}
					},
					onDropdownOver: function () {
						return !isNoviBuilder;
					},
					onUnstuck: function () {
						if (this.$clone === null)
							return;

						var navbarSearch = this.$clone.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
							navbarSearch.trigger('blur');
						}

					}
				}
			});
		});

		// Swiper
		initPlugin( plugins.swiper.length, function () {
			var i, j;
			for (i = 0; i < plugins.swiper.length; i++) {
				var s = $(plugins.swiper[i]);
				var pag = s.find(".swiper-pagination"),
					next = s.find(".swiper-button-next"),
					prev = s.find(".swiper-button-prev"),
					bar = s.find(".swiper-scrollbar"),
					swiperSlide = s.find(".swiper-slide");

				for (j = 0; j < swiperSlide.length; j++) {
					var
						$this = $(swiperSlide[j]),
						url = $this.attr("data-slide-bg");

					if (url) {
						$this.css({
							"background-image": "url(" + url + ")",
							"background-size": "cover"
						})
					}
				}


				swiperSlide.end()
					.find("[data-caption-animate]")
					.addClass("not-animated")
					.end()
					.swiper({
						autoplay: isNoviBuilder ? null : s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
						direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
						effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
						speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
						keyboardControl: s.attr('data-keyboard') === "true",
						mousewheelControl: s.attr('data-mousewheel') === "true",
						mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
						nextButton: next.length ? next.get(0) : null,
						prevButton: prev.length ? prev.get(0) : null,
						pagination: pag.length ? pag.get(0) : null,
						paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
						paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
							return '<span class="' + className + '">' + (index + 1) + '</span>';
						} : null : null,
						scrollbar: bar.length ? bar.get(0) : null,
						scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
						scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
						loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
						simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
						onTransitionStart: function (swiper) {
							toggleSwiperInnerVideos(swiper);
						},
						onTransitionEnd: function (swiper) {
							toggleSwiperCaptionAnimation(swiper);
						},
						onInit: function (swiper) {
							toggleSwiperInnerVideos(swiper);
							toggleSwiperCaptionAnimation(swiper);
							initSwiperWaypoints(swiper);

							$(window).on('resize', function () {
								swiper.update(true);
							});
						}
					});
			}
		});

		// RD Input Label
		initPlugin( plugins.rdInputLabel.length, function () {
			plugins.rdInputLabel.RDInputLabel();
		});

		// Regula
		initPlugin( plugins.regula.length, function () {
			attachFormValidator(plugins.regula);
		});

		// Google ReCaptcha
		initPlugin( plugins.captcha.length, function () {
			$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
		});

		// RD Mailform
		initPlugin( plugins.rdMailForm.length, function () {
			var i,
				msg = {
					'MF000': 'Successfully sent!',
					'MF001': 'Recipients are not set!',
					'MF002': 'Form will not work locally!',
					'MF003': 'Please, define email field in your form!',
					'MF004': 'Please, define type of your form!',
					'MF254': 'Something went wrong with PHPMailer!',
					'MF255': 'Aw, snap! Something went wrong.'
				};

			for (i = 0; i < plugins.rdMailForm.length; i++) {
				var $form = $(plugins.rdMailForm[i]),
					formHasCaptcha = false;

				$form.attr('novalidate', 'novalidate').ajaxForm({
					data: {
						"form-type": $form.attr("data-form-type") || "contact",
						"counter": i
					},
					beforeSubmit: function () {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
							inputs = form.find("[data-constraints]"),
							output = $("#" + form.attr("data-form-output")),
							captcha = form.find('.recaptcha'),
							captchaFlag = true;

						output.removeClass("active error success");

						if (isValidated(inputs, captcha)) {

							// veify reCaptcha
							if (captcha.length) {
								var captchaToken = captcha.find('.g-recaptcha-response').val(),
									captchaMsg = {
										'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
										'CPT002': 'Something wrong with google reCaptcha'
									};

								formHasCaptcha = true;

								$.ajax({
									method: "POST",
									url: "bat/reCaptcha.php",
									data: {'g-recaptcha-response': captchaToken},
									async: false
								})
									.done(function (responceCode) {
										if (responceCode !== 'CPT000') {
											if (output.hasClass("snackbars")) {
												output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

												setTimeout(function () {
													output.removeClass("active");
												}, 3500);

												captchaFlag = false;
											} else {
												output.html(captchaMsg[responceCode]);
											}

											output.addClass("active");
										}
									});
							}

							if (!captchaFlag) {
								return false;
							}

							form.addClass('form-in-process');

							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
								output.addClass("active");
							}
						} else {
							return false;
						}
					},
					error: function (result) {
						if (isNoviBuilder)
							return;

						var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
							form = $(plugins.rdMailForm[this.extraData.counter]);

						output.text(msg[result]);
						form.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}
					},
					success: function (result) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
							output = $("#" + form.attr("data-form-output")),
							select = form.find('select');

						form
							.addClass('success')
							.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}

						result = result.length === 5 ? result : 'MF255';
						output.text(msg[result]);

						if (result === "MF000") {
							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active success");
							}
						} else {
							if (output.hasClass("snackbars")) {
								output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active error");
							}
						}

						form.clearForm();

						if (select.length) {
							select.select2("val", "");
						}

						form.find('input, textarea').trigger('blur');

						setTimeout(function () {
							output.removeClass("active error success");
							form.removeClass('success');
						}, 3500);
					}
				});
			}
		});

		// lightGallery
		initPlugin( plugins.lightGallery.length, function () {
			for (var i = 0; i < plugins.lightGallery.length; i++) {
				initLightGallery(plugins.lightGallery[i]);
			}
		});

		// lightGallery item
		initPlugin( plugins.lightGalleryItem.length, function () {
			// Filter carousel items
			var notCarouselItems = [];

			for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
				if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length && !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length && !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
					notCarouselItems.push(plugins.lightGalleryItem[z]);
				}
			}

			plugins.lightGalleryItem = notCarouselItems;

			for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
				initLightGalleryItem(plugins.lightGalleryItem[i]);
			}
		});

		// Custom Waypoints
		initPlugin( plugins.customWaypoints.length && !isNoviBuilder, function () {
			for (var i = 0; i < plugins.customWaypoints.length; i++) {
				var $this = $(plugins.customWaypoints[i]);
				makeWaypointScroll($this);
			}
		});

		// Material Parallax
		initPlugin( plugins.materialParallax.length, function () {
			if (!isNoviBuilder && !isIE && !isMobile) {
				plugins.materialParallax.parallax();
			} else {
				for (var i = 0; i < plugins.materialParallax.length; i++) {
					var parallax = $(plugins.materialParallax[i]),
						imgPath = parallax.data("parallax-img");

					parallax.css({
						"background-image": 'url(' + imgPath + ')',
						"background-size": "cover"
					});
				}
			}
		});

	});
	//Konkurs kartki świąteczne
	function showMessage(){
		// Pobierz element komunikatu
		var votedMessageContainer = document.getElementById('votedMessage');
	
		// Wyświetl komunikat, jeśli użytkownik próbuje oddać drugi głos
		votedMessageContainer.style.display = 'block';
	
		// Pobierz aktualny odstęp górnego marginesu (margin-top) elementu komunikatu
		var marginTop = parseInt(window.getComputedStyle(votedMessageContainer).marginTop, 10);
	
		// Przewiń do elementu komunikatu z dodatkowym odstępem (100 pikseli) do góry
		window.scrollTo({
		  top: votedMessageContainer.offsetTop - marginTop - 100,
		  behavior: 'smooth'
		});
	}
	
	function showMessageThanks(){
		// Pobierz element komunikatu
		var votedMessageContainer = document.getElementById('thanksMessage');
	
		// Wyświetl komunikat, jeśli użytkownik próbuje oddać drugi głos
		votedMessageContainer.style.display = 'block';
	
		// Pobierz aktualny odstęp górnego marginesu (margin-top) elementu komunikatu
		var marginTop = parseInt(window.getComputedStyle(votedMessageContainer).marginTop, 10);
	
		// Przewiń do elementu komunikatu z dodatkowym odstępem (100 pikseli) do góry
		window.scrollTo({
		  top: votedMessageContainer.offsetTop - marginTop - 100,
		  behavior: 'smooth'
		});
	}
	
	
	// Wysyłanie nowej karty
	
	// Aktualizacja URL serwera
	const baseUrl = 'https://capslo-001-site1.atempurl.com';
	
	document.addEventListener('DOMContentLoaded', function () {
		const form = document.getElementById('sendNewCard');
		const cardPhotoInput = document.getElementById('card_photo');
	  
		cardPhotoInput.addEventListener('change', function () {
		  // Aktualizuj podgląd obrazu lub wykonaj inne operacje po zmianie pliku
		});
	  
		form.addEventListener('submit', function (event) {
		  event.preventDefault();
	  
		  const cardName = document.getElementById('card_name').value;
		  const cardPhoto = cardPhotoInput.files[0];
	  
		  const formData = new FormData();
		  formData.append('ImageData', cardPhoto);  // Użyj nazwy z pola card_name
		  formData.append('ImageName', cardName + '.jpg');
	  
		  
	  
		  fetch(`${baseUrl}/Photo/Add`, {
			method: 'POST',
			body: formData,
		  })
			.then(function (response) {
			  console.log('Odpowiedź serwera:', response);
	  
			  if (!response.ok) {
				throw new Error('Wystąpił błąd podczas wysyłania danych');
			  }
	  
			  return response.json();
			})
			.then(function (data) {
			  console.log('Dane zostały wysłane pomyślnie');
			  console.log('Odpowiedź serwera (JSON):', data);
			})
			.catch(function (error) {
			  console.error('Błąd podczas wysyłania żądania:', error);
			});
		});
	  });
	
	// Funkcja do dodawania punktu
	document.addEventListener('DOMContentLoaded', function () {
		var baseUrl = 'https://capslo-001-site1.atempurl.com'; // Zmień na swoje potrzeby
		var pageLoader = document.getElementById('page-loader');
		var cardsWrapper = document.getElementById('allCardsWrapper');
	  
		// Funkcja do pokazywania i ukrywania loadera
		function toggleLoader(showLoader) {
		  pageLoader.style.display = showLoader ? 'block' : 'none';
		}
	  
		// Funkcja do uzyskiwania unikalnego identyfikatora użytkownika
		function getUserId() {
		  var userId = localStorage.getItem('user_id');
		  if (!userId) {
			userId = 'user_' + Math.random().toString(36).substring(7);
			localStorage.setItem('user_id', userId);
		  }
		  return userId;
		}
	  
		// Funkcja do oznaczania użytkownika jako oddającego głos
		function markUserAsVoted(userId) {
		  localStorage.setItem(`user_vote_${userId}`, 'true');
		}
	  
		// Funkcja do sprawdzania, czy użytkownik oddał już głos
		function hasUserAlreadyVoted(userId) {
		  const hasVoted = localStorage.getItem(`user_vote_${userId}`);
		  return hasVoted === 'true';
		}
	  
		// Funkcja do dodawania punktu
		function addPoint(imageId, currentPoints) {
		  const userId = getUserId();
		  const hasUserVoted = hasUserAlreadyVoted(userId);
	  
		  if (!hasUserVoted) {
			var updatedPoints = currentPoints + 1;
	  
			// Sprawdź, czy użytkownik oddał już głos
			fetch(`${baseUrl}/Point/${imageId}/AddPoint`, {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			  },
			  body: JSON.stringify({
				points: updatedPoints,
				userId: userId,
			  }),
			})
			  .then(function (response) {
				if (!response.ok) {
				  showMessage();
				  throw new Error('Błąd podczas dodawania punktu');
				}
	  
				console.log('Punkt został pomyślnie dodany');
	  
				markUserAsVoted(userId);
	  
				getAllCards();
				showMessageThanks();
			  })
			  .catch(function (error) {
				console.error('Błąd:', error.message);
			  });
		  } else {
			showMessage();
		  }
		}
	  
		// Funkcja do pobierania wszystkich kart
		function getAllCards() {
		  toggleLoader(true);
	  
		  var allCardsWrapper = document.getElementById('allCardsWrapper');
		  allCardsWrapper.innerHTML = '<p class="text-center">Ładowanie kart świątecznych...</p>';
	  
		  fetch(`${baseUrl}/Photo/GetAllImagesWithPoints`, {
			method: 'GET',
			headers: {
			  'accept': '*/*'
			}
		  })
			.then(function (response) {
			  if (!response.ok) {
				throw new Error('Błąd podczas pobierania danych');
			  }
			  return response.json();
			})
			.then(function (data) {
			  allCardsWrapper.innerHTML = '';
	  
			  data.forEach(function (card) {
				var cardDiv = document.createElement('div');
				cardDiv.className = 'col-md-4 col-xl-3';
				cardDiv.id = card.imageId;
	  
				var cardLink = document.createElement('a');
				cardLink.className = 'thumb-modern';
				cardLink.setAttribute('data-lightgallery', 'item');
				cardLink.href = `https://capslo-001-site1.atempurl.com/images/${card.fileName}`;
	  
				var figure = document.createElement('figure');
	  
				var img = document.createElement('img');
				img.src = `https://capslo-001-site1.atempurl.com/images/${card.fileName}`;
				img.alt = '';
				img.width = 472;
				img.height = 355;
	  
				var caption = document.createElement('p');
				caption.textContent = card.imageName.replace(/\.[^/.]+$/, ''); // Usunięcie rozszerzenia pliku
	  
				caption.style.margin = '0'; // Dodanie stylu margin: 0
	  
				var overlay = document.createElement('div');
				overlay.className = 'thumb-modern__overlay';
	  
				var rateDiv = document.createElement('div');
				rateDiv.className = 'rate';
	  
				var rateNumber = document.createElement('div');
				rateNumber.className = 'rate_number';
				rateNumber.textContent = card.points;
	  
				var rateThumb = document.createElement('div');
				rateThumb.className = 'rate_thumb';
	  
				rateThumb.addEventListener('click', function () {
				  if (!rateThumb.classList.contains('voted')) {
					addPoint(card.imageId, card.points);
					rateThumb.classList.add('voted');
				  }
				});
	  
				var thumbsUpIcon = document.createElement('i');
				thumbsUpIcon.className = 'fa fa-thumbs-up';
				thumbsUpIcon.setAttribute('aria-hidden', 'true');
	  
				rateThumb.appendChild(thumbsUpIcon);
	  
				rateDiv.appendChild(rateNumber);
				rateDiv.appendChild(rateThumb);
	  
				figure.appendChild(img);
				cardLink.appendChild(figure);
				cardLink.appendChild(overlay);
	  
				cardDiv.appendChild(cardLink);
				cardDiv.appendChild(caption);
				cardDiv.appendChild(rateDiv);
	  
				allCardsWrapper.appendChild(cardDiv);
			  });
	  
			 // Po dodaniu kart do DOM, zainicjuj lightGallery
			 var galleryItems = document.querySelectorAll('[data-lightgallery="group"]');
			 if (galleryItems.length > 0) {
			   initLightGallery(allCardsWrapper, 'twoja-dodatkowa-klasa');
			 }
	 
			 // Po dodaniu kart do DOM, zainicjuj lightGalleryItem
			 var galleryItemItems = document.querySelectorAll('[data-lightgallery="item"]');
			 if (galleryItemItems.length > 0) {
			   initLightGalleryItem(allCardsWrapper, 'twoja-dodatkowa-klasa');
			 }
	  
			  toggleLoader(false);
			})
			.catch(function (error) {
			  console.error('Błąd:', error.message);
			  toggleLoader(false);
			});
		}
	  
		getAllCards();
	  });
	//
	
}());


  

// fetch('https://capslo-001-site1.atempurl.com/Photo/GetAllImagesWithPoints', {
//   method: 'GET',
//   headers: {
//     'accept': '*/*'
//   }
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));
 

  //Delete

//   document.addEventListener('DOMContentLoaded', function () {
// 	// Wstaw odpowiedni identyfikator obrazu, który chcesz usunąć
// 	var imageIdToDelete = 'd6c2ed49-9bd4-49b7-a4e3-84ed3c9ddd7e';
	
// 	// Aktualizacja URL serwera
// 	var baseUrl = 'https://capslo-001-site1.atempurl.com';
  
// 	// Utworzenie obiektu żądania DELETE
// 	fetch(`${baseUrl}/Photo/${imageIdToDelete}`, {
// 	  method: 'DELETE',
// 	  headers: {
// 		'Accept': 'application/json',
// 		'Content-Type': 'application/json'
// 	  },
// 	})
// 	.then(function (response) {
// 	  if (!response.ok) {
// 		throw new Error('Błąd podczas usuwania zdjęcia');
// 	  }
// 	  console.log('Zdjęcie zostało pomyślnie usunięte');
// 	})
// 	.catch(function (error) {
// 	  console.error('Błąd:', error.message);
// 	});
//   });
  
//   fetch('https://capslo-001-site1.atempurl.com/Photo/GetAllImagesWithPoints', {
// 	method: 'GET',
// 	headers: {
// 	  'accept': '*/*'
// 	}
//   })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => console.error('Error:', error));
  