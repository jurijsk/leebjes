/// <reference path="../../struct.js" />
/// <reference path="../../global.js" />
/// <reference path="../../utils.js" />
/// <reference path="../../events.js" />
/// <reference path="../../app.js" />
(function () {
	var controls = yk.ui.controls;
	var app = yk.App;
	var events = yk.Events;

	controls.Control = function (element, controlId) {

		var publish = function () {
			this.getElement = getElement;
			this.getId = getId;
			this.addOnMouseMove = addOnMouseMove;
			this.addOnMouseLeave = addOnMouseLeave;
			this.addOnMouseEnter = addOnMouseEnter;
			this.setElementProperty = setElementProperty;
		};

		var getElement = function () { return element; };
		var setElementProperty = function (name, value) {
			element.setAttribute(name, value);
		};

		var getId = function () { return controlId; };


		var mouseMoveHandler = events.NullHandler;
		var addOnMouseMove = function (callback) {
			mouseMoveHandler = mouseMoveHandler.isReal() ? mouseMoveHandler : new events.Handler(this, 'mousemove');
			mouseMoveHandler.add(callback);
		};


		var addOnMouseLeave = function (callback) {
			app.getMouse().addOnLeave(this, callback);
		};

		var addOnMouseEnter = function (callback) {
			app.getMouse().addOnEnter(this, callback);
		};

		(function () {
			controlId = controlId || element.id;
			setElementProperty('id', controlId);
			publish.apply(this);

			app.registerControl(this, getId());
		}).apply(this);
	};
})();