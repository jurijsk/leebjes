(function () {
	var namespace = yk.bp.IO;
	namespace.Printer = function (caret) {
		var that = this;
		var publish = function () {
			this._type = "Printer";
			this.print = print;
			this.render = render;
			this.renderNode = renderNode;
		}

		var printStyle = function (style) {
			console.log("Style [%i] with %i instances is inline with %f prob. Style is used on %i pages. Style consists of:", style.getHash(), style.instanceCount, style.inline, style.pagesCountUsage);
			console.dir(style.composition);
		};

		var print = function (obj) {
			switch (obj._type) {
				case 'Group':
					printGroupTable(obj);
					break;
				case 'Style':
					printStyle(obj);
					break;
				default:
					console.log("Unsuported type. Paper Jam.");
			}
		};



		var printGroup = function (group) {
			var array = group.getFrequencySortedDesc();
			var cell;
			line("count", "value");
			for (var i = 0; i < array.length; i++) {
				cell = array[i];
				line(cell.getCount(), cell.getValue());
			}
		};

		var printGroupTable = function (group) {
			var array = group.getFrequencySortedDesc();
			var Row = function (count, value) { this.count = count; this.value = value; };
			var data = [];
			var len = array.length;
			for (var i = 0; i < len; i++) {
				cell = array[i];
				data.push(new Row(cell.getCount(), cell.getValue()));
			}
			console.table(data);
		};

		var line = function () {
			console.log(Array.prototype.concat.apply([], arguments).join("\t"));
			return that;
		};

		var renderNode = function (node, element) {
			element = element || caret;
			var nodeElement = document.createElement('span');
			nodeElement.innerHTML = node.getText();
			nodeElement.className = !node.isRemoved() ? "node" : "node-removed";
			element.appendChild(nodeElement);
		};

		var renderLine = function (line, element) {
			element = element || caret;
			var lineElement = document.createElement('div');
			lineElement.className = !line.isRemoved() ? "line" : "line-removed";

			var nodes = line.getNodes();
			var length = nodes.length;
			for (var i = 0; i < length; i++) {
				renderNode(nodes[i], lineElement);
			}
			element.appendChild(lineElement);

		};

		var renderPage = function (page, element) {
			element = element || caret;
			var pageElement = document.createElement('div');
			pageElement.className = "page";

			var lines = page.getLines();
			var length = lines.length;
			for (var i = 0; i < length; i++) {
				renderLine(lines[i], pageElement);
			}
			element.appendChild(pageElement);
		};

		var renderDocument = function (doc, element) {
			element = element || caret;
			var pages = doc.getPages().getNodes();
			var length = pages.length;
			for (var i = 0; i < length; i++) {
				renderPage(pages[i], element);
			}
		};

		var render = function (obj, element) {
			switch (obj._type) {
				case 'Node':
					renderNode(obj, element);
					break;
				case "Document":
					renderDocument(obj, element);
					break;
				default:
					console.log("Unsuported type. Paper Jam.");
			}
		};
		publish.apply(this);
	};

})();