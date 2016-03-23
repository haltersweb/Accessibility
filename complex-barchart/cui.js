(function () {
	// make sure the CUI object is defined.
	if (typeof window.CUI === "undefined") {
		window.CUI = {};
	}

	// make sure String.trim is defined.
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
		};
	}

	// make sure the CUI.Utils namespace is defined - this namespace
	// will contain functions that are useful for creating modules or
	// are shared across many modules.
	if (typeof window.CUI.Utils === "undefined") {
		CUI.Utils = {};
	}

	/**
	 * The define() method takes a namespace as a string and makes sure
	 * it exists. If you pass it "CUI.Overlays" it'll make sure the CUI
	 * object exists and that it contains a property called Overlays. If
	 * a piece of the namespace does not exist, it's created and assigned
	 * a value of {}. If a piece of the namespace does exist, it's left
	 * alone (so we don't overwrite anything that's already there).
	 */
	CUI.Utils.define = function (namespace) {
		var parts = namespace.split(".");

		// the top level context is the window object.
		var parent = window;

		// for each part of the namespace...
		for (var i = 0; i < parts.length; i++) {
			// add this part if the parent doesn't already contain it.
			if (typeof parent[parts[i]] === "undefined") {
				parent[parts[i]] = {};
			}

			parent = parent[parts[i]];
		}

		// I'm not sure why you'd need this but we might as well return something.
		return parent;
	};

	/**
	 * The getOptions() method reads the text from an element's data-options
	 * attribute and parses it as a CSS-like set of key-value pairs. If you have
	 * this attribute on an element:
	 * 
	 *     data-options="title: Sample Data; height: 240; ready: false"
	 * 
	 * You'll get back this object:
	 * 
	 *     {"title": "Sample Data", "height": 240, "ready": false}
	 * 
	 * The strings "true" and "false" are converted to booleans. Values that look
	 * like numbers are interpreted as numbers. All other values are treated as
	 * strings and whitespace is trimmed from them. Property names are left alone.
     * 
     * You can specify a component name to be used as a namespace to avoid conflicts
     * that may occur when one element has options used by more than one component.
     * For example, if an element is both an overlay and carousel and both of those
     * components have a "delay" option, you can put the carousel options in the
     * data-cui-carousel attribute and get the options this way:
     * 
     *     var options = CUI.Utils.getOptions(element, "carousel");
     * 
     * And the options will be read from the data-carousel attribute. If no
     * component name is provided, the options are read from data-options.
	 */
	CUI.Utils.getOptions = function (element, namespace) {
        element = $(element);

        if (!namespace) {
            namespace = "options";
        }

        var attribute = "data-" + namespace;

        // if the element doesn't have the attribute, return undefined.
        if (!element.attr(attribute)) {
            return {};
        }

		var data = {};
		var options = element.attr(attribute);
		var parts = options.split(";");

		function isNumber(n) {
			return !isNaN(n - 0) && n !== null && n !== "" && n !== false && n !== true;
		}

		for (var i = 0; i < parts.length; i++) {
			// if it's an empty string, skip it.
			if (!parts[i]) {
				continue;
			}

			var pair = parts[i].split(":");

			var name = pair[0].trim();
			var value = pair[1].trim();

			// try to interpret the value.
			if (value == "true") {
				data[name] = true;
			} else if (value == "false") {
				data[name] = false;
			} else if (isNumber(value)) {
				data[name] = +value;
			} else {
				data[name] = value;
			}
		}

		return data;
	};

	/**
	 * Merges together any number of objects. The resulting object has
	 * all properties contained by all objects that were given. The value
	 * for each property comes from the first object in the arguments list
	 * to contain that property.
	 */
	CUI.Utils.merge = function () {
		var merged = {};

		// get the list of all property names.
		var properties = {};

		for (var i = 0; i < arguments.length; i++) {
			for (var p in arguments[i]) {
				properties[p] = true;
			}
		}

		// for each property, get a value for the merged object.
		for (var p in properties) {
			// check the arguments in order for an object containing this property.
			for (var i = 0; i < arguments.length; i++) {
				var object = arguments[i];
				
				// if the object has the property, we take its value and move on
				// to the next property.
				if (typeof object[p] != "undefined") {
					merged[p] = object[p];
					break;
				}
			}
		}
		return merged;
	};

    /**
     * The template() function is used to create templates. The input is
     * an element ID or the raw template text and the output is a function
     * that stamps out copies of the template text. If the input is an
     * element ID, it's inner HTML is used as the template text.
     * 
     * Here's an example:
     * 
     *     var template = CUI.Utils.template("<span>Step {0} of {1}</span>");
     *     var html = template(index, steps.length);
     * 
     * The call to CUI.Utils.template returns a function that takes two
     * arguments, since the template text has two markers ({0} and {1}).
     * The first parameter is used to replace all occurrences of {0} (there
     * can be more than one) and the second parameter replaces {1}. The
     * function returns the result of these string replacements.
     * 
     * This lets you avoid wrtiting code that pieces together HTML and, if
     * you choose to pass in element IDs, it lets you store the template text
     * in the DOM instead of in your JS code.
     * 
     * The second parameter is an object that's a set of options. The
     * possible options are:
	 * 
	 *  - showNulls: If true, null values will be shown as "null" in the
	 *               output. By default this is false and null values will
	 *               be replaced with empty strings in the output.
	 * 
	 */
    CUI.Utils.template = function (text, options) {
        if (!options) {
			options = {};
		}

		// if the parameter is an element ID, use the element's HTML as the template.
		var element = document.getElementById(text);
		if (element != null) {
			text = element.innerHTML;
		}

		// make and return a function that performs string replacements on the template.
		return function () {
			var args = arguments;

			// if we shouldn't show nulls, set all null values to empty strings.
			if (!options.showNulls) {
				for (var i = 0; i < args.length; i++) {
					if (args[i] === null) {
						args[i] = "";
					}
				}
			}

			return text.replace(/{(\d+)}/g, function (match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
    };

}());