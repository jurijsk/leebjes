(function () {
	var namespace = yk.bp.data;

	var Handler = yk.Events.Handler;
	var NullHandler = yk.Events.NullHandler;
	var DOMLESS = yk.Events.DOMLESS;

	var PAGE_FACTOR = namespace.PAGE_FACTOR;
	var LINE_FACTOR = namespace.LINE_FACTOR;
	var COLUMN_FACTOR = namespace.COLUMN_FACTOR;



	namespace.Node = function (node, pageNumber, style) {
		var publish = function () {
			this._type = "Node";
			this.getTop = getTop;
			this.getLeft = getLeft;
			this.getBottom = getBottom;
			this.getHeight = getHeight;
			this.getRight = getRight;
			this.getText = getText;
			this.setColumnNumber = setColumnNumber;
			this.getPageNumber = getPageNumber;
			this.getColumnNumber = getColumnNumber;
			this.setLineNumber = setLineNumber;
			this.isRemoved = isRemoved;
			this.remove = remove;
			this.addOnRemoved = addOnRemoved;
			this.getInnerElements = getInnerElements;
			this.replace = replace;
			this.getStyle = getStyle;
			this.getHash = getHash;
			this.getParent = getParent;
			this.setParent = setParent;
			updateHash();
			if (_DEBUG) {
				this.node = node;
				this.pageNumber = pageNumber;
				this.top = top;
				this.left = left;
				this.right = right;
				this.width = width;
				this.height = height;
				this.style = style;
				this.text = text.substr(0, 50);
				this.bottom = bottom;
				this.hash = hash;
			}
		};
		var top = parseInt(node.getAttribute("top"));
		var left = parseInt(node.getAttribute("left"));
		var width = parseInt(node.getAttribute("width"));
		var height = parseInt(node.getAttribute("height"));
		var text = node.innerHTML;
		var bottom = top + style.getSize();
		var right = left + width;

		var lineNumber = 0;
		var columnNumber = 0;

		var hash = 0;

		var updateHash = function () {
			hash = PAGE_FACTOR * pageNumber + LINE_FACTOR * lineNumber + COLUMN_FACTOR * columnNumber + style.getHash();
		};

		var getHash = function () {
			return hash;
		};


		var getTop = function () {
			return top;
		};

		var getLeft = function () {
			return left;
		};

		var getBottom = function () {
			return bottom;
		};

		var getRight = function () {
			return right;
		};

		var getHeight = function () {
			return height;
		};

		var getPageNumber = function () {
			return pageNumber;
		};

		var getText = function () {
			return node.innerHTML;
		};

		var getInnerElements = function () {
			return
		};

		var setColumnNumber = function (value) {
			columnNumber = value;
			updateHash();
		};
		var getColumnNumber = function () {
			return columnNumber;
		};

		var setLineNumber = function (value) {
			lineNumber = value;
			updateHash();
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

		var getInnerElements = function () {
			return Array.prototype.concat.apply([], node.childNodes);
		};


		var replace = function (oldElement, newElement) {
			var innerElements = getInnerElements();
			if (innerElements.indexOf(oldElement) == -1) {
				debugger;
				return -1;
			}
			node.replaceChild(newElement, oldElement);
		};

		var getStyle = function () {
			return style;
		};

		var parent = null;
		var getParent = function () {
			return parent;
		};
		var setParent = function (value) {
			parent = value;
		};

		publish.apply(this);
	};
})();