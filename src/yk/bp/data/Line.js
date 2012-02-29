(function () {
	var namespace = yk.bp.data;
	var Handler = yk.Events.Handler;
	var NullHandler = yk.Events.NullHandler;
	var DOMLESS = yk.Events.DOMLESS;

	var PAGE_FACTOR = namespace.PAGE_FACTOR;
	var LINE_FACTOR = namespace.LINE_FACTOR;

	var Collection = namespace.Collection;

	namespace.Line = function (pageNumber, lineNumber) {
		var publish = function () {
			this._type = "Line";

			this.addNodes = addNodes;
			this.getNodes = getNodes;
			this.setAfterSpacing = setAfterSpacing;
			this.setBeforeSpacing = setBeforeSpacing;
			this.addOnAbandoned = addOnAbandoned;
			this.isAbandoned = isAbandoned;
			this.isRemoved = isRemoved;
			this.getHash = getHash;
			this.getLineNumber = getLineNumber;
			this.remove = remove;
			this.addOnRemoved = addOnRemoved;
			this.registerMultiColumnLayoutComplaint = registerMultiColumnLayoutComplaint;
		};

		var nodes = new Collection();
		var addNodes = function (newNodes) {
			newNodes = [].concat(newNodes);
			var length = newNodes.length;
			for (var i = 0; i < length; i++) {
				var node = newNodes[i];
				node.setParent(this);
				node.addOnRemoved(onNodeRemoved);
			}
			nodes.add(newNodes);

			if (nodes.getCount() > 0) {
				abandoned = false;
			}
		};

		var onNodeRemoved = function (node) {
			var index = nodes.indexOf(node);
			if (index == -1) {
				return;
			}
			node.setParent(null);
			//nodes.remove(node);

			if (nodes.getCount() == 0) {
				abandonedHandler.fire();
			}
		};

		var abandonedHandler = NullHandler;
		var addOnAbandoned = function (callback) {
			abandonedHandler = abandonedHandler.isReal() ? abandonedHandler : new Handler(this, DOMLESS, true);
			abandonedHandler.add(callback);
		};

		var abandoned = false;
		var isAbandoned = function () {
			return abandoned;
		};

		var removeHandler = NullHandler;
		var addOnRemoved = function (callback) {
			removeHandler = removeHandler.isReal() ? removeHandler : new Handler(this, DOMLESS, true);
			removeHandler.add(callback);
		};

		var remove = function () {
			if (removed) {
				return;
			}
			removed = true;
			removeHandler.fire();
		};

		var removed = false;
		var isRemoved = function () {
			return removed;
		};

		var getNodes = function () {
			return nodes.getNodes();
		}; ;

		var setAfterSpacing = function (value) {
			var nodes = getNodes();
			var lenght = nodes.length;
			for (var i = 0; i < length; i++) {
				nodes[i].setAfterSpacing(value);
			}
		};

		var setBeforeSpacing = function (value) {
			var nodes = getNodes();
			var lenght = nodes.length;
			for (var i = 0; i < length; i++) {
				nodes[i].setBeforeSpacing(value);
			}
		};


		var hasMclc = false;
		var registerMultiColumnLayoutComplaint = function () {
			hasMclc = true;
		};

		var getLineNumber = function () {
			return lineNumber;
		};

		var hash = PAGE_FACTOR * pageNumber + LINE_FACTOR * lineNumber;
		var getHash = function () {
			return hash;
		};
		publish.apply(this);
	};


})();