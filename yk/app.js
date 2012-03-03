/// <reference path="Intelisense.js" />
/// <reference path="events.js" />
/// <reference path="UI/Controls/Control.js" />
(function () {
	var events = yk.Events;
	var uicontrols = yk.ui.controls;
	var devices = yk.devices;
	var structures = yk.structures;
	var namespace = yk;

	namespace.App = new function () {


		var publish = function () {
			this.registerControl = registerControl;
			this.getControl = getControl;
			this.getWindow = getWindow;
			this.getMouse = getMouse;
			this.whoIsFocused = whoIsFocused;
			if (_DEBUG) {
				this._controls = controls;
			}
		};

		var registerControl = function (control, controlId) {
			controlId = controlId || control.getElement().id;
			controls[controlId] = control;
			controlsByElements.add(control.getElement(), control);
		};

		var getControl = function (element) {
			//var id = null;
			do {
				var control = controlsByElements.getValue(element);

				if (control) { return control; }

				//id = element.id || element.nodeName;
				//if (id in controls) {
				//	return controls[id];
				//}
				element = element.parentNode;
			} while (element);
			return null;
		};

		var getWindow = function () {
			return win;
		};


		var focusedControl = null;
		var whoIsFocused = function () {
			return focusedControl;
		};


		var mouse = null;
		var getMouse = function () {
			if (!mouse) {
				mouse = new devices.Mouse();
			}
			return mouse;
		};


		var clickHandler = null;
		var onClick = function (sender, event) {
			var target = events.target(event);
			var id = null;
			focusedControl = getControl(target);
		};


		var controls = [];
		var controlsByElements = null;
		var win = null;

		(function () {
			controlsByElements = new structures.Dictionary();
			publish.apply(this);

			waitDom(function () {
				win = new uicontrols.Window('win');
				win.addOnClick(onClick);
			})();
		}).apply(this);

	} ();
})();