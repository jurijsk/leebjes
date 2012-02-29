(function () {

	var namespace = yk.bp.data;
	var FONT_FACTOR = namespace.FONT_FACTOR;
	var HEIGHT_FACTOR = namespace.HEIGHT_FACTOR;

	namespace.Style = function (font, height) {
		var publish = function () {
			this._type = "Style";
			this.getSize = getSize;
			this.getHash = getHash;
			this.getFontId = getFontId;
			if (_DEBUG) {
				this.font = font;
				this.hash = hash;
			}
		};


		var getSize = function () {
			return font.size;
		};

		var getFontId = function () {
			return font.id;
		};

		var hash = FONT_FACTOR * font.id + HEIGHT_FACTOR * height;
		var getHash = function () {
			return hash;
		};

		publish.apply(this);
	};

})();