(function () {
	var namespace = yk.bp.data;

	var Collection = namespace.Collection;
	var PAGE_FACTOR = namespace.PAGE_FACTOR;

	namespace.Page = function (number, width, height) {
		var publish = function () {
			this._type = "Page";
			this.getNumber = getNumber;
			this.addNodes = addNodes;
			this.getNodes = getNodes;
			this.addLines = addLines;
			this.getLines = getLines;
			this.getGroup = getGroup;
			this.isBlank = isBlank;
			this.clear = clear;
			this.getHash = getHash;
			if (_DEBUG) {
				this.number = number;
				this.width = width;
				this.height = height;
				this.hash = hash;
			}
		};

		var getNumber = function () {
			return number;
		};

		var nodes = new Collection();
		var addNodes = function (newNodes) {
			newNodes = [].concat(newNodes);
			var length = newNodes.length;
			for (var i = 0; i < length; i++) {
				newNodes[i].addOnRemoved(onNodeRemoved);
			}
			nodes.add(newNodes);
		};


		var onNodeRemoved = function (node) {
			var index = nodes.indexOf(node);
			if (index == -1) {
				return;
			}
			//nodes.remove(node);
		};

		var lines = new Collection();
		var addLines = function (newLines) {
			newLines = [].concat(newLines);
			var length = newLines.length;
			var newNodes = [];
			for (var i = 0; i < length; i++) {
				newNodes = newNodes.concat(newLines[i].getNodes());
			}
			addNodes(newNodes);

			var length = newLines.length;
			for (var i = 0; i < length; i++) {
				newLines[i].addOnRemoved(onLineRemoved);
				newLines[i].addOnAbandoned(onLineAbandoned);
			}

			lines.add(newLines);
		};

		var onLineRemoved = function (line) {
			var index = lines.indexOf(line);
			if (index == -1) {
				return;
			}
			//lines.remove(line);

		};

		var onLineAbandoned = function (line) {
			line.remove();
		};


		var getNodes = function () {
			return nodes.getNodes();
		};

		var getLines = function () {
			return lines.getNodes();
		};

		var getGroup = function (func) {
			return nodes.getGroup(func);
		};

		var isBlank = function () {
			return getNodes().length == 0;
		};

		var clear = function () {
			var oldNodes = nodes.getNodes();

			var length = oldNodes.length;

			for (var i = 0; i < length; i++) {
				oldNodes[i].removeOnRemoved(onNodeRemoved);
			}
			nodes = new Collection();
			lines = new Collection();
		};

		var hash = PAGE_FACTOR * number;
		var getHash = function () {
			return hash;
		};

		publish.apply(this);
	};
})();