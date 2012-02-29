/// <reference path="../global.js" />
(function () {
	var app = yk.App;
	var events = yk.Events;

	var namespace = yk.devices;

	//var devices = using(root.Devices);
	namespace.Mouse = function () {
		var listeners = null;
		var moveHandler = null;
		var pos = { x: 0, y: 0 };
		var hoverDelay = 200;
		var hoverTimeoutId = null;
		var hoveredElement = null;

		//publishing of methods intended to be public
		var publish = function () {
			this.getDocumentPosition = getPos;
			this.getElementPosition = getElementPosition;
			this.getX = getX;
			this.getY = getY;
			this.addOnHover = addOnHover;
			this.addOnWheel = addOnWheel;
			this.whoIsHovered = whoIsHovered;

			this.addOnLeave = addOnLeave;

		};

		var getPos = function () {
			
			return pos;
		};

		var getElementPosition = function (element, event) {
			var pos = getPos();
			if (event) {
				pos = calcPos(event);
			}
			var elementPos = screen.getDocumentPosition(element);
			return { 'x': pos.x - elementPos.x, 'y': pos.y - elementPos.y };
		};

		var getX = function () {
			return pos.x;
		};
		var getY = function () {
			return pox.y;
		};

		var enteredElement = null;
		var enterListeners = null;
		var addOnEnter = function (listener, callback) {
			if (!enterListeners) {
				enterListeners = {};
			}
			enterListeners[listener.getId()] = { 'control': listener, 'callback': callback };
		};



		var leaveListeners = null;
		var addOnLeave = function (listener, callback) {
			if (!leaveListeners) {
				leaveListeners = {};
			}
			leaveListeners[listener.getId()] = { 'control': listener, 'callback': callback };
		};


		//it's posible to optimize here at the expense of enter event.
		var fireOnLeave = function (leavedControl) {
			if (!leaveListeners) {
				return;
			}

			if (!leavedControl) {
				return;
			}
			
			var listenerMeta = leaveListeners[leavedControl.getId()];
			if (!listenerMeta) {
				return;
			}

			var args = Array.prototype.concat.apply([], arguments);
			listenerMeta.callback.apply(null, args);
		};

		var hoverListeners = null;
		var addOnHover = function (callback) {
			if (!hoverListeners) {
				hoverListeners = {};
			}
			hoverListeners[listener.getId()] = { 'control': listener, 'callback': callback };
		};

		var whoIsHovered = function () {
			if (new Date().getTime() - moveStamp >= hoverDelay) {
				return app.getControl(enteredElement);
			}
		};

		var onMove = function (event) {
			pos = calcPos(event);
			resetHover(event);
		};

		var onOver = function (event) {

			pos = calcPos(event);

			var target = events.target(event);

			var enteredControl = app.getControl(target);

			var leavedControl = null;
			if (enteredElement) {
				leavedControl = app.getControl(enteredElement);
			}
			enteredElement = target;


			if (enteredControl == leavedControl) {
				return;
			}
			fireOnLeave(leavedControl, event);
		};

		var wheelListeners = null;
		var addOnWheel = function (listener, callback) {
			if (!wheelListeners) {
				wheelListeners = {};
			}
			wheelListeners[listener.getId()] = { control: [listener], callback: callback || listener.onEvent };
		};

		var fireOnWheel = function (event) {
			if (!wheelListeners) { return false };
			var affected = whoIsHovered();
			if (!affected) { return false; }
			var accfectedListenerMeta = wheelListeners[affected.getId()];
			if (!accfectedListenerMeta) { return false; }

			var args = Array.prototype.concat.apply(accfectedListenerMeta.control, arguments);
			accfectedListenerMeta.callback.apply(null, args);
		};




		var calcPos = function (event) {
			var x = 0;
			var y = 0;
			var e = event || window.event;

			if (e.pageX) {
				x = e.pageX;
				y = e.pageY;
			} else if (e.clientX || e.clientY) {
				x = e.clientX + document.body.scrollLeft
			           + document.documentElement.scrollLeft;
				y = e.clientY + document.body.scrollTop
			        + document.documentElement.scrollTop;
			}
			var pos = { 'x': x, 'y': y };
			return pos;
		};

		var moveStamp = new Date().getTime();
		var resetHover = function (event) {
			moveStamp = new Date().getTime();
			if (hoverListeners) {
				clearTimeout(hoverTimeoutId);
				hoverTimeoutId = setTimeout(fireOnHover, hoverDelay, event);
			}
		};

		var fireOnHover = function (event) {
			notImplemented();
		};

		var onWheel = function (event) {
			fireOnWheel(event);
		};

		///constructor
		(function () {
			events.bind(document, 'mousemove', onMove);
			events.bind(document, 'mouseover', onOver); //if hover changed by scrolling or zooming. Fired on load;

			events.bind(document, 'mousewheel', onWheel);
			events.bind(document, 'DOMMouseScroll', onWheel);

			publish.apply(this);
		}).apply(this);
	};



	var Keyboard = new function () {
		//private fields 
		var KeyCodes = {
			Enter: 13
		};
		//publishing of methods intended to be public
		var publish = function () {
			this.KeyCodes = KeyCodes;
		};




		//methods goes here

		///constructor
		(function () {

			publish.apply(this);
		}).apply(this);
	};


	namespace.Screen = function () {
		var publish = function () {
			this.getDocumnetViewportSize = getDocumnetViewportSize;
			this.getElementSize = getElementSize;
			this.getDocumentRectangle = getDocumentRectangle;
			this.getDocumentPosition = getDocumentPosition;
			this.getParentPosition = getParentPosition;
		};


		var getDocumnetViewportSize = function () {
			var dimensions = { width: 0, height: 0 };
			dimensions.width = document.documentElement.clientWidth;
			dimensions.height = document.documentElement.clientHeight;
			return dimensions;
		};

		var getElementSize = function (element) {
			var dimensions = { 'width': element.clientWidth, 'height': element.clientHeight };
			return dimensions;
		};

		var getDocumentRectangle = function (element) {
			var rect = { 'x': 0, 'y': 0, 'width': 0, 'height': 0 };

			var location = getDocumentPosition(element);
			rect.x = location.x;
			rect.y = location.y;

			var size = getElementSize(element);
			rect.width = size.width;
			rect.height = size.height;
			return rect;
		};

		var getDocumentPosition = function (element) {
			var x = 0;
			var y = 0;

			var current = element;

			while (current) {
				x += current.offsetLeft;
				y += current.offsetTop;
				current = current.offsetParent;
			}

			return { 'x': x, 'y': y };
		};

		var getParentPosition = function (element) {
			var x = element.offsetLeft;
			var y = element.offsetTop;
			return { 'x': x, 'y': y };
		};

		publish.apply(this);
	};

	//var mouse = new namespace.Mouse();
	var screen = new namespace.Screen();

})();