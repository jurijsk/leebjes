(function () {

	var namespace = yk.bp.data;

	namespace.Cell = function (parentGroup, value) {
		var publish = function () {
			this._type = "Cell";
			this.add = add;
			this.getValue = getValue;
			this.getCount = getCount;
			this.getNodes = getNodes;
			this.getCollection = getCollection;
			this.getGroup = getGroup;
			this.setProperty = setProperty;
			this.setNodesProperty = setNodesProperty;

			this.groupBy = getGroup;
		};

		var collection = new namespace.Collection();

		var getValue = function () {
			return value;
		};

		var getNodes = function () {
			return collection.getNodes();
		};

		var getCollection = function () {
			return collection;
		};

		var add = function (node) {
			collection.add(node);
			return this;
		};

		var getCount = function () {
			return collection.getCount();
		};

		var getGroup = function (groupingFunc) {
			return collection.getGroup(groupingFunc);
		};

		var properties = {};
		var setProperty = function (name, value) {
			properties[name] = value;
		};

		var setNodesProperty = function (property, value) {
			var nodes = collection.getNodes();
			var len = nodes.length;
			for (var i = 0; i < len; i++) {
				var node = nodes[i];
				node[property] = value;
				node.setAttribute(property, value);
			}
		};

		publish.apply(this);
	};

})();