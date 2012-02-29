(function () {

	var namespace = yk.bp.data;
	var Group = namespace.Group;
	///Collection is a very basic class aimed to store nodes and cache groups
	namespace.Collection = function () {
		var publish = function () {
			this._type = "Collection";
			this.add = add; //adds node or few
			this.remove = remove;
			this.getNodes = getNodes;
			this.getCount = getCount; //nodes array length
			this.getGroup = getGroup; //or group by 
			this.fromHash = fromHash;
			this.indexOf = indexOf;
		};

		var updateGroups = function (newNodes) {
			for (var group in groups) {
				groups[group].add(newNodes);
			}
		};

		var nodes = [];

		var add = function (newNodes) {
			if (newNodes instanceof Array) {
				nodes = nodes.concat(newNodes);
			} else {
				nodes.push(newNodes);
			}
			updateGroups(newNodes);
			return this;
		};

		var remove = function (node) {
			var index = nodes.indexOf(node);
			if (index == -1) {
				return index;
			}
			nodes.splice(index, 1);
		}

		var getNodes = function () {
			return nodes;
		};

		var getCount = function () {
			return nodes.length;
		};

		var groups = {};
		var getGroup = function (groupingFunc) {
			var group = groups[groupingFunc];
			if (!group) {
				group = new Group(groupingFunc);
				group.add(nodes);
				groups[groupingFunc] = group;
			}
			return group;
		};

		var fromHash = function (hash) {
			for (var i in hash) {
				add(hash[i]);
			}
			return this;
		};

		var indexOf = function (node) {
			return nodes.indexOf(node);
		};

		publish.apply(this);
	};
})();