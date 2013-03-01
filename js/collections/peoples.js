/*global Backbone Store*/
var app = app || {};

(function () {
	'use strict';

	// People Collection
	// ---------------

	// The collection of people is backed by *localStorage* instead of a remote
	// server.
	var PeopleList = Backbone.Collection.extend({

		// Reference to this collection's model.
		model: app.People,

		// Save all of the todo items under the `"people"` namespace.
		localStorage: new Store('people-backbone'),

		// Keeping items in sequential order, as per todo items.
		nextOrder: function () {
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		// People are sorted by their original insertion order.
		comparator: function (people) {
			return people.get('order');
		}
	});

	// Create our global collection of **Todos**.
	app.Peoples = new PeopleList();

}());
