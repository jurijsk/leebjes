(function () {
	var namespace = yk.bp.data;

	namespace.Document = function (styles, pages, lines, nodes) {
		var publish = function () {
			this._type = "Document";
			this.getStyles = getStyles;
			this.getPages = getPages;
			this.getPageCount = getPageCount;
			this.getLines = getLines;
			this.getNodes = getNodes;
			//this.remove = remove;
			if (_DEBUG) {

			}
		};

		var getStyles = function () {
			return styles;
		};

		var getPages = function () {
			return pages;
		};

		var getPageCount = function () {
			return getPages().getCount();
		};

		var getLines = function () {
			return lines;
		};

		var getNodes = function () {
			return nodes;
		};

		publish.apply(this);
	};
})();