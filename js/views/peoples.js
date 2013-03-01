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

		// Listen for change and re-render incase of remove.
		initialize: function () {
			this.listenTo(this.model, 'destroy', this.remove);
		},

		// Re-render the options for assignment.
		// The options only have a value attribute and inner html.
		// We can't assign the value attribute through a template so just assign it through backbone,
		// and then no need for a template for the option.
		render: function () {
			this.attributes={value: this.model.attributes.name};
			
			this.$el.html(this.model.attributes.name);
			return this;
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		clear: function () {
			this.model.destroy();
		}
	});
	
});
