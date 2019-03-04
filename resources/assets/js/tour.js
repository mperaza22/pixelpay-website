/**
 * Product tour manager based on js-cookie and intro.js
 *
 * @author Ademir Mazer Junior <mazer@torzer.com>
 */

if (typeof extendObj === undefined || typeof extendObj === 'undefined') {
    function extendObj(obj, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key))
                obj[key] = src[key];
        }
        return obj;
    }
}

/**
 * jsProductTour constructor initializes variables, steps, configs, loads the cookie
 * information with the last seen version of the slides and force the cookie persistence
 *
 * @param string user Name of the user to be used as namespace for the cookie
 * @param array steps Array with the slides to show
 * @param JsonObject options @see introjs
 * @returns {Tour}
 */
var Tour = function(user, steps, options) {
    if ( ! steps ) {
        throw new Error("Steps are required to instantiate Tour");
    }

    var iconNext = '<svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" stroke="#3326AF" stroke-width="1.5" stroke-linejoin="round" stroke-miterlimit="10"><circle class="arrow-icon--circle" cx="16" cy="16" r="15.12"></circle><path class="arrow-icon--arrow" d="M16.14 9.93L22.21 16l-6.07 6.07M8.23 16h13.98"></path></g></svg>',
		iconPrev = '<svg class="arrow-icon arrow-rotated" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" stroke="#3326AF" stroke-width="1.5" stroke-linejoin="round" stroke-miterlimit="10"><circle class="arrow-icon--circle" cx="16" cy="16" r="15.12"></circle><path class="arrow-icon--arrow" d="M16.14 9.93L22.21 16l-6.07 6.07M8.23 16h13.98"></path></g></svg>',
		iconDone = '<svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g fill="none" stroke="#3326AF" stroke-width="1.5" stroke-linejoin="round" stroke-miterlimit="10"><circle class="arrow-icon--circle" cx="16" cy="16" r="15.12"></circle><path class="arrow-icon--arrow" d="M14.8,20.8l-5.1-3.5M22.8,10.3l-8.1,11.4"></path></g></svg>';

    this.steps = steps;
    this.stepsToShow = [];
    this.step_showing = -1;
    this.complete = false;

    this.user = user || undefined;

    this.cookie = {last_version_seen: 0};

    // this.cookie = extendObj(this.cookie, Cookies.getJSON(this.cookieNamespace()));

    this.options = {
    	showBullets: false,
		keyboardNavigation: true,
		showStepNumbers: false,
		scrollToElement: true,
		// exitOnOverlayClick: false,
		scrollTo: 'tooltip',
		scrollPadding: 20,
		prevLabel: iconPrev + ' atras',
		nextLabel: 'siguiente ' + iconNext,
		skipLabel: 'saltar',
		doneLabel: 'finalizar' + iconDone,

        hidePrev: true,
        hideNext: true,
        hideSkip: true,
        highlightClass: 'highlight-tour-element',
        tooltipClass: 'tour-custom',
    };
    this.options = extendObj(this.options, options);

    // force save to persist cookie
    this.saveLastVersionSeen();
};

/**
 * Defines the cookie namespace based on the user passed to constructor
 *
 * @returns {String}
 */
Tour.prototype.cookieNamespace = function() {
    namespace = this.user || 'guest';
    return 'tour_' + namespace;
}

/**
 * Evaluate the steps that must be shown based on cookie informations for this user.
 * Sets the stepsToShow propertie of the tour object.
 *
 * @returns {Array|Tour.steps}
 */

Tour.prototype.canUse = function (access){
	if(!access)
		return;

	if(!this.options.access)
		return true;

	if(typeof access === 'string')
		access = [access];

	for(key in access){
		if(this.options.access.indexOf(access[key]) > -1)
			return true;
	}

	return;
}

Tour.prototype.getStepsToShowByLastSeen = function() {
    var welcome;
    var bye;

    for (var key in this.steps) {
    	if(this.steps[key].access && !this.canUse(this.steps[key].access))
			continue;

        if (this.steps[key].welcome) {
            welcome = this.steps[key];
        } else if (this.steps[key].bye) {
            bye = this.steps[key];
        } else if (this.cookie.last_version_seen < this.steps[key].version) {
            this.stepsToShow.push(this.steps[key]);
        }
    }

    if (this.stepsToShow.length > 0) {
    	if(welcome)
        	this.stepsToShow.unshift(welcome);

        if(bye)
        	this.stepsToShow.push(bye);
    }

    return this.stepsToShow;
};

/**
 * Save the cookie with the information to be used in the next page reload
 *
 * @returns {undefined}
 */
Tour.prototype.saveLastVersionSeen = function() {
    var version_seen;

    // welcome only save again to persist cookie if a F5 is pressed
    if (this.step_showing >= 0 ) {
        if (this.stepsToShow[this.step_showing].bye) {
            version_seen = this.stepsToShow[this.step_showing - 1].version;
        } else {
            version_seen = this.stepsToShow[this.step_showing].version;
        }
    }

    if (version_seen) {
        this.cookie.last_version_seen = version_seen;
    }

    Cookies.set(this.cookieNamespace(), this.cookie, { expires: 365 * 3 });
}

/**
 * Remove the cookie to refresh the tour
 *
 * @returns {undefined}
 */
Tour.prototype.cookieRefresh = function() {
    Cookies.remove(this.cookieNamespace());
}

/**
 * Start the tour, after check if there is any slide to be shown.
 *
 * @param JsonObject startOptions {force: false}
 * @returns {undefined}
 */
Tour.prototype.start = function(startOptions) {
    // prepare the steps to show based on the cookies with the
    // last seen information in this machine
    if (startOptions != undefined && startOptions.force === true) {
        this.stepsToShow = this.steps;
        options = {
            steps: this.steps
        };
    } else {
        options = {
            steps: this.getStepsToShowByLastSeen()
        };
    }

    // if there is no step or if there is only welcome and bye steps
    // return because we do not nothing to show
    if (options.steps.length == 0) {
        return;
    }

    var intro = introJs();

    options = extendObj(options, this.options);

    var me = this;
    intro.setOptions(options)
        .onafterchange(function(element, step, direction) {
        	if(direction && direction == 'forward'){
            	me.saveLastVersionSeen();
            	me.step_showing++;
        	}

            if(direction && direction == 'backward')
            	me.step_showing--;

            if(step.action !== 'undefined' && step.action != null && typeof (step.action) === 'function')
            	step.action(element, step, direction, intro);

        }).onexit(function() {
            me.saveLastVersionSeen();
        }).oncomplete(function(element, step) {
            me.complete = true;
            me.saveLastVersionSeen();

            if(step.done !== 'undefined' && step.done != null && typeof (step.done) === 'function')
            	step.done(element, step, intro);

            if(step.redirect !== 'undefined' && step.redirect != null)
            	window.location.href = step.redirect;
        }).start();
};
