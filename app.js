/*jshint esversion: 6 */

// BUDGET CONTROLLER
var budgetController = (function() {
	// Function constructor to create objects from user input data
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	// store the data as an object
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		// store the total of the exp and inc
		totals: {
			exp: 0,
			inc: 0
		}
	};
	// returns a public method with the data
	return {
		addItem: function(type, des, val) {
			var newItem, ID;
			// Crete unique ID variable that will be added to every user input
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// check if user input is expenses or income and creates an object
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}
			// push the newItem object to our data structure
			data.allItems[type].push(newItem);

			// then return the element
			return newItem;
		},
    //testing purpose
		testing: function() {
			console.log(data);
		}
	};
})();

// UI CONTROLLER
var UIController = (function() {
	//object to store the query selector fields from the html document
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};

	// return a public method with an object with the values from the UI input fields
	return {
		getInput: function() {
			return {
				// will be either inc or exp from the html document value attribute
				type: document.querySelector(DOMstrings.inputType).value,
				// input text field from html to add an description for an expense
				description: document.querySelector(DOMstrings.inputDescription).value,
				// add a value amount field
				value: document.querySelector(DOMstrings.inputValue).value
			};
		},

		// method to return the DOMstring object
		getDOMstrings: function() {
			return DOMstrings;
		}
	};
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
	//get the object DOMstring from the UI controller
	var DOM = UICtrl.getDOMstrings();

	// function for event listeners
	var setupEventListeners = function() {
		// retrive the queryselectors fields from ui controller module
		var DOM = UICtrl.getDOMstrings();
		// event listener to when user click the add button
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		// Global document for return press. .which is for older broweserd that dosent support .keycode
		document.addEventListener('keypress', function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};

	var ctrlAddItem = function() {
		var input, newItem;
		// 1. get field input data
		input = UICtrl.getInput();
		//2. add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		//3. add the item to the UI

		//4. calculate the budget

		//5. Display the budget on the ui
	};

	return {
		// return a method with the eventlisteners
		init: function() {
			setupEventListeners();
			console.log('app has started');
		}
	};
})(budgetController, UIController);

// start our app to set up event listeners
controller.init();
