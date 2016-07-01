(function ($) {
	// This makes sure the component's namespace is defined. After this
	// call you can safely reference and extend CUI.Component without
	// having to check that it exists.
	CUI.Utils.define("CUI.Barchart");

	// Defines the barchart object
	var Barchart = function (element, params) {
		var barchart = {};

		// General barchart variables
		var max = parseInt(params.max, 10),
			step = parseFloat(params.increment),
			yUnit = params.unit,
			highestValue = 0,
			scale = 0,
			stepWidth = 0;

		// Variables for the data usage charts
		var timeframe = params.timeframe, // "monthly" or "daily"
			dataplans = []; // array allows for a different data plan for each data point in a monthly chart

		// Calculates pixel value from data value as a function of the width of a step.
		// Ensures that the bars and the grid align.
		function scaleValue (value) {
			var stepsCount = value / step;
			return stepWidth * stepsCount;
		}

		// Rounds value up to nearest chart increment
		function roundUp (value, step) {
			return Math.ceil(value / step) * step;
		}

		// Separating this out because it includes the data usage.
		function getHighestValue () {
			$(element).find('[data-value]').each(function (index) {
				var value = parseFloat($(this).attr('data-value'));
				// If doing the monthly chart, also work the data plan into this.
				if (timeframe === 'monthly') {
					var planlimit = parseInt($('thead th:eq(' + index + ')').attr('data-plan'), 10);
					if (planlimit > highestValue) {
						highestValue = planlimit;
					}
				}
				if (value > highestValue) {
					highestValue = value;
				}
			});
		}

		// Finds the highest values in order to determine the Y scale, maximum and increments of the chart.
		function getLimits () {

			// Find the highest value.
			getHighestValue();

			// Calculate the best increment if it's not specified.
			if (step === 0) {
				// Arbitrary list of accepted increments.
				var increments = [0.25,0.5,1,2,5,10,25,50,100,200,500,1000];
				var stepsCounts = [];
				// If max is specified, and it's higher than the highest value, use it to calculate the best increment.
				if (max > highestValue) {
					highestValue = max;
				}
				for (var i = 0; i < increments.length; i++) {
					// We're looking for the increment that results in lowest number of steps -- but at least 4.
					var stepCount = highestValue / increments[i];
					stepsCounts.push(stepCount);
					if (stepCount < 3) {
						step = (i === 0) ? 0 : increments[i-1];
						break;
					}
				}
			}

			// If the max value isn't specified, use the highest value and the increment to calculate the max.
			if ( max === 0 ) {
				max = roundUp(highestValue, step);
			}

			// Set scale of px/unit based on fixed height of the element
			scale = $(element).height() / max;
			stepWidth = Math.floor(step * scale);
		}

		// Builds the X axis labels out of the table head
		function buildXAxis () {
			// Sets the width of each bar to a percentage based on number of columns
			var barCount = $(element).find('thead th').length;
			$(element).find('th, td').css('width', Math.floor(100/barCount) + '%');
			// If there are less than 4 columns, make the entire table narrower so that we don't have huge bars
			if (barCount < 4) {
				$(element).find('table').css('width', (barCount * 25) + '%');
			}
			$(element).find('thead')
			// Hides the table head
			.addClass('screen-reader-text')
			// Copies the contents of the table head into a new table foot that becomes the X axis labels
			.after('<tfoot role="presentation">' + $(element).find('thead').html() + '</tfoot>');
			// Disable tabs on the head links and hide from screen readers
			$(element).find('thead a').attr('tabindex', '-1').attr('aria-hidden', 'true');

			// add the height of the footer to the bottom margin of the parent element or panel
			var $parentElement = $(element).closest('.cui-panel');
			if ($parentElement.length === 0) {
				$parentElement = $(element).parent();
			}
			var footerHeight = $(element).find('tfoot').outerHeight();
			$parentElement.after('<div style="height:' + footerHeight + 'px;"></div>');
		}

		// Builds background delineating the steps
		function drawYAxis () {
			var stepsCount = max / step;
			$(element).find('table').before('<div class="cui-barchart-bg" aria-hidden="true"></div>');
			for (var i = stepsCount; i > 0; i--) {
				// Don't label increments < 1
				if ( step*i >= 1 ) {
					$(element).find('.cui-barchart-bg').append('<div class="increment" data-grid-value="' + step*i + '" style="height:' + scaleValue(step) + 'px;"><span class="label">' + step*i + yUnit + '</span></div>');
				} else {
					$(element).find('.cui-barchart-bg').append('<div class="increment" data-grid-value="' + step*i + '" style="height:' + scaleValue(step) + 'px;"></div>');
				}
			}
		}

		// Sets each bar to a pixel height corresponding to the data-value attribute.
		function setBars () {
			$(element).find('[data-value]').each(function () {
				var value = parseFloat($(this).attr('data-value')),
					stepsCount = value / step,
					stepDim = scaleValue(step);
				$(this).css('height', stepsCount * stepDim + 'px')
				//$(this).css('height', scaleValue(value) + 'px')
				// The top margin defines the empty space between the top of the chart and the top of each bar.
				.css('margin-top', $(element).height() - $(this).height());
				//.css('margin-top', scaleValue(max - value));
				// Wrap the value label so we can style it
				$(this).wrapInner('<span class="label screen-reader-text"></span>');
			});
		}

		function getDataUsage () {
			$(element).find('[data-value]').each(function (index) {
				var planlimit = parseInt($('thead th:eq(' + index + ')').attr('data-plan'), 10);
				// A value of zero or "<1GB" should appear as a "bump". An empty value should appear as no bar.
				// Here we have arbitrarily specified a bump 5px tall.
				$(this).filter('[data-value="0"], [data-value="<1GB"]').attr('data-value', 5 / scale);
				$(this).filter('[data-value=""]').attr('data-value', '0');

				// Add data plan to array of plans
				dataplans.push(planlimit);
				// Make the data plan the max value if it's higher than any of the data values
				if (timeframe === "monthly") {
					if (planlimit > max) {
						max = roundUp(planlimit, step);
					}
				}
			});
			// Check to see if there's only one data plan value. If there is, include only the one value in the array.
			var sortedPlans = dataplans.slice(0).sort(function (a,b) {return a - b;});
			if (sortedPlans[0] === sortedPlans [sortedPlans.length - 1]) {
				dataplans = [sortedPlans[0]];
			}
		}

		function markDataUsage () {
			var totalUsage = 0,
				planlimit,
				singleGBHeight,
				singleGBShortHeight = "";
			// Mark the 1GB line if max <= 25 and there isn't already a 1GB line
			if (max <= 25 && step > 1) {
				singleGBHeight = scaleValue(1);
				if (singleGBHeight < 20) {
					singleGBShortHeight = " short";
				}
				$(element).find('.cui-barchart-bg').append('<div class="increment extra-increment" style="height:' + singleGBHeight + 'px;"><span class="label' + singleGBShortHeight + '">1' + yUnit + '</span></div>');
			}

			$(element).addClass('cui-barchart').find('[data-value]').each(function (index) {
				// Get the value and plan limit
				var value = parseFloat($(this).attr('data-value'));
				if (dataplans.length > 1) {
					planlimit = dataplans[index];
				} else {
					planlimit = dataplans[0];
				}
				// Skip all this if the planlimit = 0 (unlimited plan)
				if (planlimit > 0) {
					// Calculate the value as a function of the number of steps
					var stepsCount = planlimit / step;
					var stepDim = scaleValue(step);
					var barHeight = stepsCount * stepDim;
					// Treatment for Monthly data chart
					if (timeframe === 'monthly') {
						if (dataplans.length > 1) {
							// Mark the data plan limit for the bar
							$(this).before('<span class="planlimit" style="margin-bottom:' + barHeight + 'px;"><span class="label">' + planlimit + yUnit + '</span></span>');
							//$(this).before('<span class="planlimit" style="margin-bottom:' + scaleValue(planlimit) + 'px;"><span class="label">' + planlimit + yUnit + '</span></span>');
						} else {
							// Mark the data plan limit for the entire chart (execute once only)
							if (index === 0) {
								$(element).find('.cui-barchart-bg').append('<span class="planlimit" style="margin-bottom:' + barHeight + 'px;"><span class="label">' + planlimit + yUnit + '</span></span>')
								//$(element).find('.cui-barchart-bg').append('<span class="planlimit" style="margin-bottom:' + scaleValue(planlimit) + 'px;"><span class="label">' + planlimit + yUnit + '</span></span>')
								// Hide border and label for increments that duplicate the plan limit
								.find('[data-grid-value=' + planlimit + ']').css('border', 'none').find('.label').addClass('screen-reader-text');
							}
						}
						// Highlight the overage area
						if (value > planlimit) {
							var overage = value - planlimit;
							$(this).append('<span class="overage" style="height:' + scaleValue(overage) + 'px;"></span>');
						}
					} else
					// Treatment for Daily data chart
					if (timeframe === 'daily') {
						if ( totalUsage > planlimit ) {
							$(this).addClass('overage');
						}
						totalUsage = totalUsage + value;
					}
				}
			});
			// put a nice margin on top of the graph
			$(element).css('margin-top', scaleValue(step));
		}

		// Public function that converts the table into a chart.
		barchart.drawChart = function () {
			// This class sets the styles for the bars. Adding it here keeps the styles from appearing if the javascript doesn't run.
			// Remove the table's fallback css
			$(element).addClass('cui-barchart').removeClass('cui-table');
			// Gets the maximum data value and sets the px/data scale
			getLimits();
			// Gets the data limit values and resets the max and scale if need be
			getDataUsage();
			// Copies the thead into the tfoot to use as axis labels and sets the bar width
			buildXAxis();
			// Sets the height of the bars depending on data value
			setBars();
			// Draws elements representing the Y axis and gridlines
			drawYAxis();
			// Draws elements for data limit and overages
			markDataUsage();
		};

		return barchart;
	};

	// the methods in the CUI.Barchart namespace are what developers will
	// use to access the module and interact with the barchart object.
	CUI.Barchart.init = function (elements, settings) {
		elements = $(elements);

		if(!settings) {
			settings = {};
		}

		elements.each(function () {
			var element = $(this),
				defaults,
				options,
				params;

			// Allow query string barchart=disable
			if (window.location.href.indexOf("barchart=disable") >= 0) {
				return;
			}

			// make sure we haven't initialized this element already.
			if(element.data("cui-barchart") instanceof Barchart) {
				return;
			}

			// these are the default settings.
			defaults = {max:0, increment:0, unit:""};
			// these are the settings from the data-options attribute.
			options = CUI.Utils.getOptions(element);

			// Check if the max property is blank and take it out
			if (options.max === "") {
				options.max = defaults.max;
			}

			// merge the defaults, options, and specified settings.
			params = CUI.Utils.merge(settings, options, defaults);
			// create the barchart object and store a reference to it.
			barchart = new Barchart(element, params);
			element.data("cui-barchart", barchart);

			barchart.drawChart();
		});
	};

	CUI.Barchart.createRandomDailyChartData = function (element) {
		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		function getRandomFloat(min, max) {
			return (Math.random() * (max - min) + min).toFixed(2);
		}
		// Fake data for daily chart
		var makeHead = CUI.Utils.template('<th scope="col" data-plan="300">{0}</th>'),
			makeBar = CUI.Utils.template('<td><span data-value="{0}">{0}GB out of {1}GB</span></td>');
		for (var i = 0; i < 31; i++) {
			var day = i + 1;
			// if (i == 0) {
			// usage = "0";
			// } else {
			//	var usage = getRandomFloat(0, 1);
			var usage = getRandomInt(0, 32);
			// }
			var limit = 1;
			$(element).find('thead tr').append(makeHead(day));
			$(element).find('tbody tr').append(makeBar(usage, limit));
		}
	};

	// Initialize bar charts on document ready
	$(document).ready(function () {
		//CUI.Barchart.createRandomDailyChartData('.daily-chart');
		CUI.Barchart.init("[data-component=barchart]");
	});

}(jQuery));