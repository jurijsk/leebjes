(function () {
	var controls = yk.ui.controls;
	var events = yk.Events;
	var app = yk.App;

	controls.Window = function (controlId) {

		var publish = function () {
			this.getElement = getElement;
			this.getId = getId;
			this.addOnResize = addOnResize;
			this.addOnClick = addOnClick;
			app.registerControl(this, getId());
		};

		var getElement = function () { return window; };
		var getId = function () { return controlId; };

		var resizeHandler = events.NullHandler;
		var addOnResize = function (callback) {
			resizeHandler = resizeHandler.isReal() ? resizeHandler : new events.Handler(this, 'resize', true);
			resizeHandler.add(callback);
		};

		var clickHandler = events.NullHandler;
		var addOnClick = function (callback) {
			clickHandler = clickHandler.isReal() ? clickHandler : new events.Handler(this, 'click', true);
			clickHandler.add(callback);
		};

		publish.apply(this);
	};
})();