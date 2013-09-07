var args = arguments[0];
var title = $.title;
var row = $.row;
var field = args.control;
field.right = '5dp';

title.text = args.title;
field.value = args.value;
field.hintText = args.hintText;

$.row.add(field);

exports.getId = function() {
	return args.id;
}
exports.getValue = function() {
	return field.value;
}