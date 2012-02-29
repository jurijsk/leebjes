/// <reference path="../IO/Printer.js" />
(function () {
	var namespace = yk.bp.Pages;

	var Printer = yk.bp.IO.Printer;

	namespace.Viewer = function (configuration) {

		var publish = function () {
			this._type = "Viewer";
		};



		publish.apply(this);
	};
})();