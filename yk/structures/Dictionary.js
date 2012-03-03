(function () {
	var namespace = yk.structures;

	namespace.Dictionary = function () {
		var publish = function () {
			this.add = add;
			this.getValue = getValue;
		};

		var keys = [];
		var values = [];

		var add = function (key, value) {
			if (keys.indexOf(key) != -1) {
				throw new Error("Key already presented in collection");
			}
			keys.push(key);
			values.push(value);

		};

		var getValue = function (key) {
			var index = keys.indexOf(key);
			if (index == -1) {
				return null;
			}
			return values[index];
		};

		(function () {
			publish.apply(this);
		}).apply(this);
	};
})();