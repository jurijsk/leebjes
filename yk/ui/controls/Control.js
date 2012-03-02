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

		};

		var getElement = function () { return element; };
		var getId = function () { return controlId; };

		var mouseMoveHandler = events.NullHandler;
		var addOnMouseMove = function (callback) {
			mouseMoveHandler = mouseMoveHandler.isReal() ? mouseMoveHandler : new events.Handler(this, 'mousemove');
			mouseMoveHandler.add(callback);
		};


		var addOnMouseLeave = function (callback) {
			app.getMouse().addOnLeave(this, callback);
		};

		(function () {
			controlId = controlId || element.id;
			app.registerControl(this, getId());
			publish.apply(this);
		}).apply(this);
	};
})();