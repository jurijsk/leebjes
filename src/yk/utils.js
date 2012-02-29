(function () {
	var utils = yk.utils;
	var events = yk.Events;

	utils.ge = function (id) {
		return document.getElementById(id);
	};

	utils.using = function (arg) { return arg };

	utils.gc = function (name) {
		//should return  control by its name
	};

	//Indicated dom readiness
	utils.isDomReady = function () {
		return document.readyState == "complete";
	};

	utils.waitDom = function (onReady) {
		if (utils.isDomReady()) { //if dom is ready when ensureDomReady is called, then nothing to do here, it is an usual func call
			return onReady;
		}
		return function () { //otherwise we add additional check 
			//there should be some arguments we have no idea about, but we need to pass then to original onReady
			if (utils.isDomReady()) { //check again it could be that dom was loaded while request was made
				onReady.apply(this, arguments);
				return;
			}
			var args = arguments; //store current function call to pass then to onReady later.
			events.bind(window, 'load', function () { onReady.apply(this, args); });
		}
	};

	utils.norm = function (etalon, opt) {
		if (etalon === null || typeof etalon === "undefined") {
			etalon = {};
		}
		if (opt instanceof Array) { return opt; } //esli opt massiv nenado copirovat' elementy iz etalona
		if (typeof etalon == 'object') {
			opt = opt || (etalon instanceof Array ? [] : {}); //opt ostanetsja opt esli on ok
		} else {
			return opt || etalon; //a esli ok ne ok to vozvrasheeem primitivnyj opt
		}

		if (opt instanceof Array) { //no esli byl undefined, to copirovat; nuzhno
			if (!(etalon instanceof Array)) { throw new Error("invalid types"); } //nichego ne podelaesh
			for (var i = 0; i < etalon.length; i++) {
				opt.push(utils.norm(etalon[i], opt[i])); //mozhet stoit v te zhe indeksy vstavljat'
			}
		} else {
			if (etalon instanceof Array) { throw new Error("invalid types"); } //nichego ne podelaesh
			for (var prop in etalon) {
				if (etalon[prop] instanceof Object) {
					opt[prop] = utils.norm(etalon[prop], opt[prop]);
				} else {
					opt[prop] = prop in opt ? opt[prop] : etalon[prop];
				}
			}
		}
		return opt;
	};

	utils.notImplemented = function () { throw new Error("function is not implemented yet. Sorry."); };
	utils.dummy = function () { };


	//should be somewhere else

	utils.getStyle = function (element) {
		if (window.getComputedStyle) {
			return window.getComputedStyle(element, "");
		} else if (element.currentStyle) {
			return element.currentStyle;
		}
	};

	utils.console = console || { log: function () { } };
})();