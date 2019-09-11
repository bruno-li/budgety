/*jshint esversion: 6 */

// BUDGET CONTROLLER
var budgetController = (function() {
	// Function constructor to create objects from user input data
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	//prototype of expense
	Expense.prototype.calculatePercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round(this.value / totalIncome * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;

		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
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
		},
		budget: 0,
		percentage: -1
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
		//method to delete an item
		deleteItem: function(type, id) {
			var ids, index;

			// map will return a new array
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			//find the index to delete on the new array of ids
			index = ids.indexOf(id);
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		// method to calculate budget
		calculateBudget: function() {
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			// calculate the percentage of the income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
			} else {
				// -1 means non existent
				data.percentage = -1;
			}
		},
		calculatePercentage: function() {
			data.allItems.exp.forEach(function(cur) {
				cur.calculatePercentage(data.totals.inc);
			});
		},

		getPercentage: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			return allPerc;
		},

		// method to get budget
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		//testing purpose
		testing: function() {
			console.log(data);
		}
	};
})();

///////////////////////////////////////////////////////

// UI CONTROLLER
var UIController = (function() {
	//object to store the query selector fields from the html document
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(num,type){

			var numSplit, int, dec, type;
			/* 
			insert + or - before number
			only 2 decimal points allowed
			add comma when number becomes a thousand
			*/

			num = Math.abs(num);
			num = num.toFixed(2);
			
			// store the intenger and decimal points in an array
			numSplit = num.split('.');

			int = numSplit[0];
			if(int.length > 3) {
				int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,3);
			}

			dec = numSplit[1];


			return 	(type === 'exp' ? sign ='-' : sign = '+')  + ' ' + int + '.' + dec;

		};
			// function to loop through a node list
			var nodeListForEach = function(list, callback) {
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
			};

	// public method with an object with the values from the UI input fields
	return {
		// store the input from the UI
		getInput: function() {
			return {
				// will be either inc or exp from the html document value attribute
				type: document.querySelector(DOMstrings.inputType).value,
				// input text field from html to add an description for an expense
				description: document.querySelector(DOMstrings.inputDescription).value,
				// add a value amount field
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		// populate the UI with HTML markup with the data received from UI
		addListItem: function(obj, type) {
			var html, newHtml, element;
			// create html string with placeholders (%id),(%description%) and (%value%). Depending if it's an income or expense
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html =
					'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
			} else if (type === 'exp') {
				element = DOMstrings.expenseContainer;
				html =
					'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// replace the placeholder text with the data we received from the UI
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));

			//insert the html to the DOM as a child of the expense of income container
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},

		// clear fields input fields after user add a value
		clearFields: function() {
			var fields;
			// selects the input value and create a list
			fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

			// trick slice method to return a array from the list of element returned by fields variable. slice method only accepts an Array, but we can call its prototype with the call method.
			fieldsArr = Array.prototype.slice.call(fields);

			// loop through the array and set the current element value to empty after adding a value
			fieldsArr.forEach(function(current, index, array) {
				current.value = '';
			});
			// set the focus back to description input field after adding a value
			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);

			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');

			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			// display the correct percentage on the UI
			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

		

			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},

		displayDate: function(){
			var now,year,month,months;
			now = new Date();
			months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
			month = now.getMonth();
			year = now.getFullYear();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '+ year;
		},

		changeType: function(){
			// create a node list
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue
			);
			nodeListForEach(fields, function(cur){
				cur.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

		},
		

		// method to return available DOM elements
		getDOMstrings: function() {
			return DOMstrings;
		}
	};
})();

///////////////////////////////////////////////////////

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
		// set up event listener in the parent element
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
	};

	var updateBudget = function() {
		// 1. Calculate budget
		budgetCtrl.calculateBudget();
		// 2. Return the budget
		var budget = budgetCtrl.getBudget();
		// 3. Display budget on the UI
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function() {
		// 1 calculate percentages
		budgetCtrl.calculatePercentage();
		// 2 read percentages from the budget controller
		var percentages = budgetCtrl.getPercentage();
		// 3 update the UI with the new percentages
		UIController.displayPercentages(percentages);
	};

	var ctrlAddItem = function() {
		var input, newItem;
		// 1. get field input data
		input = UICtrl.getInput();

		// Checks for user input, cant be emtpy, not a number and has to be higher than 0
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			//2. add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//3. add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			//4. clear fields after input
			UICtrl.clearFields();

			//5. calculate and update budget
			updateBudget();

			//6 calculate and update percentages
			updatePercentages();
		}
	};

	// get the target element from the event object
	var ctrlDeleteItem = function(event) {
		var itemID, splidID, type, ID;
		// traverse the DOM
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1 delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);
			// 2 delete the item from the UI
			UICtrl.deleteListItem(itemID);
			// 3 update and show the new budget
			updateBudget();
			// 4 calculate and update percentages
			updatePercentages();
		}
	};

	return {
		// return a method with the eventlisteners
		init: function() {
			setupEventListeners();
			UICtrl.displayDate();
			console.log('app has started');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
		}
	};
})(budgetController, UIController);

// start our app to set up event listeners
controller.init();
