(function () {
	var namespace = yk.bp.data;
	console.log(namespace);
	var Collection = namespace.Collection;
	var Page = namespace.Page;
	var Node = namespace.Node;
	var Line = namespace.Line;
	var Document = namespace.Document;
	var Style = namespace.Style;

	var FONT_FACTOR = namespace.FONT_FACTOR;
	var HEIGHT_FACTOR = namespace.HEIGHT_FACTOR;


	namespace.DocumentBuilder = function (xhrResponse) {
		var publish = function () {
			this._type = "DocumentBuilder";
			this.getDocument = getDocument;
			if (_DEBUG) {
			}
		};

		var parseResponse = function (xhrResponse) {
			var doc;
			if (xhrResponse.responseXML.documentElement.nodeName == "parsererror") {
				console.log("we have a parseerror, whatever that means");
				//debugger; //change to createDocumentFragment;
				var div = document.createElement('div');
				div.id = 'data_doc';
				div.style.display = 'none';
				div.innerHTML = xhrResponse.responseText;
				document.body.appendChild(div);
				doc = document.body;
			} else {
				doc = xhrResponse.responseXML;
			}
			return doc;
		};

		var getElements = function (xmlDoc, elementTag) {
			return Array.prototype.concat.apply([], xmlDoc.getElementsByTagName(elementTag));
		};

		var createFonts = function (fontElements) {
			var fonts = {};
			var length = fontElements.length;
			for (var i = 0; i < length; i++) {
				var element = fontElements[i];
				fonts[element.id] = { id: parseInt(element.id), size: parseInt(element.getAttribute('size')) };
			}
			return fonts;
		};

		var createPagesHash = function (pageElements) {
			var pages = {};

			var length = pageElements.length;
			var element = null;
			for (var i = 0; i < length; i++) {
				element = pageElements[i];
				var page = new Page(
						parseInt(element.getAttribute("number"))
						, parseInt(element.getAttribute("width"))
						, parseInt(element.getAttribute("height")));
				pages[page.getNumber()] = page;
			}
			return pages;
		};

		//If page contains fontspec then all inner text nodes will be wrapped into those fontspec'es
		//beacause pdf2xml generates <fontspec ../> instead of <fontspec ..></fontspec> and ff behaviour 
		var getPageNumber = function (node) {
			var pageNumber = null;
			var parent = node;
			do {
				parent = parent.parentNode;
				pageNumber = parseInt(parent.getAttribute("number"));
				if (isNaN(pageNumber)) {
					if (parent.nodeName != "FONTSPEC") {
						debugger;
					}
					continue;
				} else {
					return pageNumber;
				}
			} while (true);
		};

		///Wraps natural text elements with Node objects
		var createNodes = function (nodeElements, fonts, out_styles) {
			var len = nodeElements.length;
			var pageNumber = 0;
			var current = null;
			var prevParent = null;
			var nodes = [];
			var node = null;
			for (var i = 0; i < len; i++) {
				current = nodeElements[i];
				if (prevParent != current.parentNode) {
					prevParent = current.parentNode;
					pageNumber = getPageNumber(current);
				}

				var font = fonts[current.getAttribute("font")];
				var lineHeigth = parseInt(current.getAttribute("height"));
				var styleHash = FONT_FACTOR * font.id + HEIGHT_FACTOR * lineHeigth;

				var style = out_styles[styleHash];
				if (!style) {
					style = new Style(font, lineHeigth);
				}

				if (_DEBUG && style.getHash() != styleHash) {
					debugger;
				}

				out_styles[styleHash] = style;


				node = new Node(current, pageNumber, style);
				current.setAttribute('bottom', node.getBottom());
				nodes.push(node);
			}
			return nodes;
		};


		var leftAscSorter = function (a, b) {
			return -(b.left - a.left);
		};

		var nullFont = { id: -1, size: undefined };
		var headNullNode = { top: -1, left: -1, width: -1, height: -1, font: nullFont, pageNumber: -1, parentNode: { insertBefore: dummy, removeChild: dummy} };
		var tailNullNode = { top: -1, left: -1, width: -1, height: -1, font: nullFont, pageNumber: -1, parentNode: { insertBefore: dummy, removeChild: dummy} };


		var bottomGrouper = function (node) {
			return node.getBottom();
		};

		var pageGrouper = function (node) {
			return node.getPageNumber();
		};

		var createLinkedList = function (nodesArray, pages, lines, nodes) {
			var previous = null;
			var current = null;
			var spacing = null;
			var prevLine = new Line();
			var totalLineCount = 0;
			var nodesColection = new Collection();
			var linesArray = [];
			nodesColection.add(nodesArray);
			var pagesGroup = nodesColection.getGroup(pageGrouper);
			for (var pageNumber in pages) {
				var page = pages[pageNumber];

				var lineNumber = 0;
				var cell = pagesGroup.getCell(pageNumber);
				if (!cell) {
					continue;
				}
				var group = cell.getGroup(bottomGrouper);
				var pageLines = [];
				var lineCells = group.getValuesSortedAsc();
				var lineCount = lineCells.length;
				for (var j = 0; j < lineCount; j++) {
					lineNumber++;
					var cell = lineCells[j];

					if (lineNumber == 1) {
						spacing = undefined;
					} else {
						spacing = cell.getValue() - previous.bottom;
					}

					prevLine.setAfterSpacing(spacing);

					var lineNodes = cell.getNodes();
					if (cell.getCount() > 1) {
						lineNodes.sort(leftAscSorter);
					}
					for (var colIndex = 0; colIndex < lineNodes.length; colIndex++) {
						current = lineNodes[colIndex];
						nodes.add(current);
						current.setLineNumber(lineNumber);
						current.setColumnNumber(colIndex + 1);
						previous = current;
					}
					var line = new Line(pageNumber, lineNumber);
					line.addNodes(lineNodes);
					line.setBeforeSpacing(spacing);
					pageLines.push(line);
					prevLine = line;
				}
				totalLineCount += lineCount;
				page.addLines(pageLines);
				linesArray = linesArray.concat(pageLines);
			}
			lines.add(linesArray);
			nodesArray = nodes.getNodes();
			var head = nodesArray[0];
			previous = head;
			var length = nodesArray.length;

			for (var i = 0; i < length; i++) {
				current = nodesArray[i];
				current.previous = previous;
				previous.next = current;
				previous = current;
			}

			head.previous = headNullNode;
			current.next = tailNullNode;

			return head;
		};

		var xmlDocument = null;
		var doc = null;
		(function (xhrResponse) {
			xmlDocument = parseResponse(xhrResponse);
			var fonts = createFonts(getElements(xmlDocument, 'fontspec'));
			var pagesHash = createPagesHash(getElements(xmlDocument, 'page'));

			var out_styles = {};
			var nodesArray = createNodes(getElements(xmlDocument, 'text'), fonts, out_styles);

			var out_nodes = new Collection();
			var out_lines = new Collection();
			var head = createLinkedList(nodesArray, pagesHash, out_lines, out_nodes);

			var pages = new Collection();
			pages.fromHash(pagesHash);

			doc = new Document(out_styles, pages, out_lines, out_nodes);

		})(xhrResponse);


		var getDocument = function () {
			return doc;
		};

		publish.apply(this);
	};
	console.dir(namespace);
})();