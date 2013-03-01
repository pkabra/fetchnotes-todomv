/*global Backbone*/
var app = app || {};

(function () {
	'use strict';

	// People Model
	// ----------

	// People Model store the person's name.
	app.People = Backbone.Model.extend({

		// Default attributes for the People
		defaults: {
			name: ''
		}
		
	});

}());
