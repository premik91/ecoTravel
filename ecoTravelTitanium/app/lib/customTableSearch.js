setSearch = function(s,t) {
	s.addEventListener("change", function(e) {
		if (!t.origData) {
			t.origData = t.data[0].rows;
		}
		newDataRows = [];
		if (!e.value) {
			t.setData(t.origData);
		} else {
			for (row in t.origData) {
				if (t.origData[row].filterText && t.origData[row].filterText.toLowerCase().indexOf(e.value.toLowerCase()) != -1) {
					newDataRows.push(t.origData[row]);
				}
			}
			t.setData(newDataRows);
		}
	});	
	
	return s;
};

exports.setSearch = setSearch;