/// <reference path="Intelisense.js" />
/// <reference path="global.js" />
/// <reference path="events.js" />
(function () {
	var events = yk.Events;

	events.DOMLESS = 'domless';
	events.IO = 'io';
	events.Handler = function (control, eventName, useCapture, preventDefault) {
		var publish = function () {
			this._type = "Handler";
			this.isReal = function () { return true; }
			this.add = add;
			this.remove = remove;
			this.fire = fire;
		};


		var callbacks = null;
		var controlArray = null;
		var add = function (callback) {
			if (!callbacks) {
				callbacks = [];
				
				switch (eventName) {
					case events.DOMLESS:
						preventDefault = false;
						break;
					case events.IO:
						return;
						//throw new Error("Use events.IoHandler to subscribe on input output events");
					default:
						var element = control.getElement();
						events.bind(element, eventName, fire, useCapture);
				}
				controlArray = [control];
			}
			callbacks.push(callback);
		};

		var fire = function () {
			if (!callbacks) return false;
			var args = Array.prototype.concat.apply(controlArray, arguments);
			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].apply(null, args);
			};

			if (preventDefault) {
				var event = arguments.length > 0 ? arguments[0] : {};
				events.preventDefault(event);
				return false;
			}
		};

		var remove = function (callback) {
			var index = callbacks.indexOf(callback);
			if (index == -1) {
				return index;
			}
			callback.splice(index, 1);
			return index;
		};
		publish.apply(this);
	};

	events.NullHandler = new function () {
		this.isReal = function () { return false; };
		this.add = function () { throw new Error("This handler is just a dummy"); };
		this.remove = function () { throw new Error("This handler is just a dummy"); };
		this.fire = dummy;
	};

	events.bind = function (element, eventName, callback, useCapture) {
		useCapture = typeof useCapture != 'undedined' ? useCapture : true;
		eventName = (eventName.substring(0, 2) == 'on') ? eventName.substring(2) : eventName;
		if (document.addEventListener) {
			element.addEventListener(eventName, callback, useCapture);
		} else {
			element.attachEvent('on' + eventName, callback);
		}
	};

	events.preventDefault = function (event) {
		if (event && event.preventDefault) {
			event.preventDefault();
		} else if (window.event && window.event.returnValue) {
			window.eventReturnValue = false;
		}
	};
	events.cancel = function (event) {
		event.cancelBubble = true;
		if (event.stopPropagation) event.stopPropagation();
		return false;
	};

	events.target = function (event) {
		event = event || window.event;
		var t = event.target || event.srcElement;
		if (t.nodeType == Element.prototype.TEXT_NODE) { // defeat Safari bug
			t = t.parentNode;
		}
		return t;
	};

})();
