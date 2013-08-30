// var friends = '[["Rok Kralj",311.0021136042848,{"bike":15.453,"car":20.3,"bicycle":12.7,"train":1.7977324365584}],["Jon Premik",1265.0021136042848,{"car":45.3,"bicycle":698.456,"train":51.7977324365584}],["Roman Avsec",-2045.0021136042848,{"bike":15.453,"car":21345.3,"bicycle":12.7,"train":12.7977324365584}]]';
// friends = JSON.parse(friends);
// for (friend in friends) {
	// alert(friends[friend]);
// }
var listView = Ti.UI.createListView();
var sections = [];

var natureSection = Ti.UI.createListSection({ headerTitle: 'Nature lovers'});
var natureDataSet = [
    {properties: { title: 'Joze lare'}},
    {properties: { title: 'Miha tovo'}},
];
natureSection.setItems(natureDataSet);
sections.push(natureSection);

var badSection = Ti.UI.createListSection({ headerTitle: 'They could do better...'});
var badDataSet = [
    {properties: { title: 'Joze lare'}},
    {properties: { title: 'Miha tovo'}},
];
badSection.setItems(badDataSet);
sections.push(badSection);

listView.sections = sections;
$.friendsWindow.add(listView);