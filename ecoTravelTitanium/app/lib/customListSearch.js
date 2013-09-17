setSearch = function(s,t) {
	s.addEventListener("focus", function(e) {
		s.setShowCancel(true, { animated: true });
	});
	
	s.addEventListener("blur", function(e) {
		s.setShowCancel(false, { animated: true });
	});
	
	s.addEventListener("cancel", function(e) {
		s.setValue("");
		s.blur();
		t.setItems(t.origData);
	});
	
	s.addEventListener("change", function(e) {
		if (!t.origData) {
			t.origData = t.data;
		}
		newDataRows = [];
		if (!e.value) {
			t.setItems(t.origData);
		} else {
			for (row in t.origData) {
				Ti.API.TFinfo(row);
				if (t.origData[row].name.text && t.origData[row].name.text.toLowerCase().indexOf(e.value.toLowerCase()) != -1) {
					newDataRows.push(t.origData[row]);
				}
			}
			t.setItems(newDataRows);
		}
	});	
	
	return s;
};

exports.setSearch = setSearch;