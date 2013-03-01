/*global Backbone _ $ ENTER_KEY*/
var app = app || {};

$(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'keypress #new-todo': 'createTodoOnEnter',
			'keypress #new-person': 'createPersonOnEnter',
			'click #clear-completed': 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
			this.allCheckbox = this.$('#toggle-all')[0];
			this.$input = this.$('#new-todo');
			this.$person = this.$('#new-person');
			this.$assignment = this.$('#assign-to');
			this.$footer = this.$('#footer');
			this.$main = this.$('#main');
			this.$people = this.$('#people');

			this.listenTo(app.Todos, 'add', this.addOne);
			this.listenTo(app.Todos, 'reset', this.addAll);
			this.listenTo(app.Todos, 'change:completed', this.filterOne);
			this.listenTo(app.Todos, 'filter', this.filterAll);
			this.listenTo(app.Todos, 'all', this.render);

			app.Todos.fetch();
			
			//Fetching and adding people.
			this.listenTo(app.Peoples, 'add', this.addPerson);
			this.listenTo(app.Peoples, 'reset', this.addAllPeople);
			
			app.Peoples.fetch();
		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = app.Todos.completed().length;
			var remaining = app.Todos.remaining().length;

			if (app.Todos.length) {
				this.$main.show();
				this.$footer.show();

				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.TodoFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.allCheckbox.checked = !remaining;
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (todo) {
			var view = new app.TodoView({ model: todo });
			$('#todo-list').append(view.render().el);
		},

		// Add all items in the **Todos** collection at once.
		addAll: function () {
			this.$('#todo-list').html('');
			app.Todos.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			app.Todos.each(this.filterOne, this);
		},

		// Generate the attributes for a new Todo item.
		newAttributes: function () {
			console.log(this.$assignment.val().trim());
			return {
				title: this.$input.val().trim(),
				order: app.Todos.nextOrder(),
				completed: false,
				assigned: this.$assignment.val().trim()
			};
		},

		// If you hit return in the main input field, create new **Todo** model,
		// persisting it to *localStorage*.
		createTodoOnEnter: function (e) {
			if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
				return;
			}

			app.Todos.create(this.newAttributes());
			this.$input.val('');
		},
		
		//Adding a person. Need to modify 2 views, the people list and the people selector.
		addPerson: function (people) {
			var view = new app.PeopleView({ model: people });
			var option = new app.PeopleSelect({model : people });
			$('#people-list').append(view.render().el);
			$('#assign-to').append(option.render().el);
		},

		//Add all the people at once. Used when loading page.
		addAllPeople: function () {
			this.$('#people-list').html('');
			app.Peoples.each(this.addPerson, this);
		},
		
		//Generate new person on enter.
		createPersonOnEnter: function(e) {
			if (e.which !== ENTER_KEY || !this.$person.val().trim()) {
				return;
			}
			app.Peoples.create({ name: this.$person.val().trim() });
			this.$person.val('');
		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(app.Todos.completed(), 'destroy');
			return false;
		},

		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;

			app.Todos.each(function (todo) {
				todo.save({
					'completed': completed
				});
			});
		}
	});
});
