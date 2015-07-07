// This file shows how we create public and private variables,
// functions, and objects within the CUI namespace.
(function($)
{
	// This makes sure the component's namespace is defined. After this
	// call you can safely reference and extend CUI.Component without
	// having to check that it exists.
	CUI.Utils.define("CUI.Component");


	// This is a private variable. If you need to store a single value
	// across calls to different methods in your component, you can use
	// private variables for that.
	var myVariable = "";


	// This is a private function. You can use them to implement the functionality
	// of your component. The public methods just serve as an API that uses the
	// private functions for doing the heavy lifting.
	function myPrivateFunction(element)
	{
		// do something to the element.
	}


	// This is a private object. Sometimes you need more than just a function or
	// set of functions to encapsulate the functionality, so you can create an
	// entire object type to manage the state and contain the functionality
	// associated with the component.
	var Component = function(element, params)
	{
		// this is the instance of the object.
		var component = {};

		// this is a private variable within the object.
		var myPrivateVariable = 4;

		// this is a private function within the object.
		function myPrivateFunction()
		{
		}

		// this is a public variable of the object.
		component.myPublicVariable = 100;

		// this is a public method of the object.
		component.myPublicMethod = function()
		{
		};

		return component;
	};


	// This is a public variable within the CUI namespace. This could be used
	// to define a default value or a setting that will apply to all calls
	// made to methods in this namespace (assuming it makes sense to expose
	// the value directly).
	CUI.Component.myPublicVariable = 5;


	// These are the public methods for your component. They are all placed
	// in the CUI namespace using this format:
	//
	//     CUI.ComponentName.methodName
	//
	// CUI is all caps, the component names are "upper" camel case and the
	// method names are "lower" camel case.
	//
	// The public methods in the CUI namespace provide access to the
	// functionality that's implemented in the component's private functions
	// and objects. We can use this to keep things organized - the CUI methods
	// check for required parameters or provide default values and the private
	// methods do the work (knowing that required parameters will be present).
	//
	// The CUI namespace methods will often be passed a jQuery object or possibly
	// a selector string. The methods will be responsible for converting strings
	// to jQuery objects and, when it makes sense, calling a private function on
	// each of the matched elements.
	//
	// This is a public method that calls a private function on the set of
	// matched elements.
	CUI.Component.myMethod = function(elements)
	{
		// if a selector string is passed in, select those elements.
		elements = $(elements);

		myPrivateFunction(elements);
	};

	// This is a public method that calls the private function for each element
	// in the set. This way your private function can assume that it's passed a
	// single element and doesn't have to deal with iterating over the set for
	// each operation it does.
	CUI.Component.anotherMethod = function(elements)
	{
		elements = $(elements);

		elements.each(function()
		{
			var element = $(this);

			myPrivateFunction(element);
		});
	};

	// This method creates an instance of our private object type for
	// each element in the set. Each element stores a reference to the
	// object so we can reference it later and to make sure we don't
	// create two objects for the same element.
	CUI.Component.someMethod = function(elements)
	{
		elements = $(elements);

		elements.each(function()
		{
			var element = $(this);

			// make sure we haven't created a Component object for this element yet.
			if(element.data("cui-component"))
				return;

			// create the object.
			var component = Component(element);

			// store a reference to the object.
			element.data("cui-component", component);
		});
	};

	// This method uses the existing instances of the private object to invoke
	// a method of the private object for each element in the set.
	CUI.Component.someOtherMethod = function(elements)
	{
		elements = $(elements);

		elements.each(function()
		{
			// get a reference to this element's Component object.
			var element = $(this);
			var component = element.data("cui-component");

			component.myPublicMethod();
		});
	};


	// Each component is responsible for creating its own initialization
	// events. When possible, we should do this by using event delegation
	// instead of attaching events directly to elements - this way we
	// don't have to do any initialization later if more elements are
	// created after this initialization code runs.
	$(document).on("click", "[data-cui-component]", function()
	{
		console.log("You clicked on an instance of this component.");
	});

	// If you need to do some initialization on document ready, you can
	// create that event too:
	$(document).ready(function()
	{
		console.log("This is the document.ready initialization for CUI.Component");
	});


	// Other things to note:
	//
	//  - All data attributes used by a component are namespaced using the component's
	//    name, so all data attributes for CUI.Component would start with "data-cui-component".
	//  - Not every component will need all of the things seen here - some components will
	//    have some private functions but not any private object types. Some might not even
	//    have any public methods in the CUI namespace, their functionality is handled through
	//    the event handlers it creates.
	//  - The CUI namespace is for methods that people might call to use the component. Our
	//    documentation for these methods should be just about all you'd need to know to use
	//    the component. Also, the CUI namespace methods should not be helpers or intermediate
	//    steps to perform processing - that should all be handled through private functions.
	//  - Private functions that are found to be useful across components may be moved to the
	//    CUI.Utils namespace so all other components may make use of them.

})(jQuery);