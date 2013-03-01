/*global Backbone _ $ ENTER_KEY*/
var app = app || {};

$(function () {
	'use strict';

	// People Item Views
	// --------------

	// The DOM element for a People item...
	app.PeopleView = Backbone.View.extend({

		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#people-template').html()),

		// The DOM events specific to an item.
		events: {
			'click .destroy':	'clear'
		},

		// Listen for change and re-render incase of remove.
		initialize: function () {
			this.listenTo(this.model, 'destroy', this.remove);
		},

		// Re-render the list of people on the right.
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}
	});
	
	// The DOM element for People selector...
	app.PeopleSelect = Backbone.View.extend({

		tagName:'option',
		// Cache the template function for a single item.
		template: _.template($('#people-options-template').html()),

		// Listen for change and re-render incase of remove.
		initialize: function () {
			this.listenTo(this.model, 'destroy', this.remove);
		},

		// Re-render the options for assignment.
		render: function () {
			this.attributes={value: this.model.attributes.name};
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}
	});
	
});
