(function () {
	var namespace = yk.bp.data;

	var Cell = namespace.Cell;

	namespace.Group = function (groupingFunc) {
		var publish = function () {
			this._type = "Group";
			this.add = add; //node or nodes

			this.getCount = getCount;

			this.getCells = getCells;
			this.getCellsArray = getCellsArray;
			this.getCell = getCell;
			this.getValuesCount = getValuesCount;

			this.getValuesSortedAsc = getValuesSortedAsc;
			this.getValuesSortedDesc = getValuesSortedDesc;

			this.getFrequencySortedDesc = getFrequencySortedDesc;
			this.getMostFrequentCell = getMostFrequentCell;
			this.getFrequencySortedAsc = getFrequencySortedAsc;


			this.getMinValueCell = getMinValueCell;
			this.getMaxValueCell = getMaxValueCell;
			this.simplify = simplify;
			///returns all nodes in the group
			this.getNodes = getNodes;
			this.getFunc = getFunc;
			this.getRawStr = getRawStr;
		};
		var func = groupingFunc;
		var nodes = [];
		var cells = {};
		var cellsArr = [];
		var raw = [];
		var add = function (newNodes) {
			var prevLen = nodes.length;
			nodes = nodes.concat(newNodes);
			var newLen = nodes.length;

			if (prevLen == newLen) {
				return;
			}
			nullArrays();

			var cell = null;
			var value = 0;
			var node = null;
			for (var i = prevLen; i < newLen; i++) {
				node = nodes[i];
				value = groupingFunc(node);
				raw.push(value);
				if (cells[value]) {
					cell = cells[value];
				} else {
					cell = new Cell(this, value);
					cells[value] = cell;
					cellsArr.push(cell);
				}
				cell.add(node);
			}
		};

		var getRawStr = function () {
			return raw.join(',');
		};

		var getCount = function () {
			return nodes.length;
		};

		var getCells = function () {
			return cells;
		};

		var getCellsArray = function () {
			return cellsArr;
		};

		var getCell = function (value) {
			return cells[value];
		};

		var getValuesCount = function () {
			return cellsArr.length;
		};

		var nullArrays = function () {
			valuesSortedAsc = null;
			valuesSortedDesc = null;
			frequencySortedDesc = null;
			frequencySortedAsc = null;
		};


		var byValueDesc = function (a, b) { return b.getValue() - a.getValue(); };
		var byValueAsc = function (a, b) { return -(b.getValue() - a.getValue()); };

		var valuesSortedAsc = null;
		var valuesSortedDesc = null;

		var getValuesSortedAsc = function () {
			if (valuesSortedAsc) {
				return valuesSortedAsc;
			}
			valuesSortedAsc = cellsArr.concat([]);
			valuesSortedAsc.sort(byValueAsc);
			return valuesSortedAsc;
		};

		var getValuesSortedDesc = function () {
			if (valuesSortedDesc) {
				return valuesSortedDesc;
			}
			valuesSortedDesc = cellsArr.concat([]);
			valuesSortedDesc.sort(byValueDesc);
			return valuesSortedDesc;
		};

		var byFrequencyDesc = function (a, b) { return b.getCount() - a.getCount(); };
		var byFrequencyAsc = function (a, b) { return -(b.getCount() - a.getCount()); };
		var frequencySortedDesc = null;
		var getFrequencySortedDesc = function () {
			if (!frequencySortedDesc) {
				frequencySortedDesc = cellsArr.concat([]);
				frequencySortedDesc.sort(byFrequencyDesc);
			}

			return frequencySortedDesc;
		};

		var frequencySortedAsc = null;
		var getFrequencySortedAsc = function () {
			if (!frequencySortedAsc) {
				frequencySortedAsc = cellsArr.concat([]);
				frequencySortedAsc.sort(byFrequencyAsc);
			}
			return frequencySortedAsc;
		};


		var getFrequencySorted = function (ascending) {
			return ascending ? getFrequencySortedAsc() : getFrequencySortedDesc();
		};

		var getMostFrequentCell = function () {
			return getFrequencySortedDesc()[0];
		};


		//implemplement getters and and most & less Frequent methods


		var getMinValueCell = function () {
			return getValuesSortedAsc()[0];
		};

		var getMaxValueCell = function () {
			return getValuesSortedDesc()[0];
		};

		//i dont like this idea but it seams like 'inadvertent error' here and i need to correct it
		//this will simplify the chale of frequencies distribution
		var simplify = function (window, ascending) {
			var flap = Math.floor(window / 2);

			var cellsSorted = getFrequencySorted(ascending);
			var visitedValues = {};
			var cell;
			var neighbors = {};
			var counts = [];
			var value;

			var newCells = {};
			var newCellsArr = [];
			for (var i = 0; i < cellsSorted.length; i++) {
				cell = cellsSorted[i];
				value = cell.getValue();

				if (visitedValues[value]) {
					continue;
				}
				visitedValues[value] = true;
				newCells[value] = cell;
				newCellsArr.push(cell);

				for (var j = 1; j <= flap; j++) {
					if (visitedValues[value - j]) {
						continue;
					}
					var neighborCell = getCell(value - j);
					if (neighborCell) {
						visitedValues[neighborCell.getValue()] = true;
						cell.add(neighborCell.getNodes());
					}
				}

				for (var j = 1; j <= flap; j++) {
					if (visitedValues[value + j]) {
						continue;
					}
					var neighborCell = getCell(value + j);
					if (neighborCell) {
						visitedValues[neighborCell.getValue()] = true;
						cell.add(neighborCell.getNodes());
					}
				}
			}

			cells = newCells;
			cellsArr = newCellsArr;
			nullArrays();
		};

		var getNodes = function () {
			return nodes;
		};

		var getFunc = function () {
			return func;
		};


		publish.apply(this);
	};

})();