/*jshint esversion: 6 */

// BUDGET CONTROLLER
var budgetController = (function () {
    // Function constructor to create objects from user input data
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
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
        addItem: function (type, des, val) {
            var newItem, ID;
            // Crete unique ID variable that will be added to every user input
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // check if user input is expenses or income and creates an object
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }
            // push the newItem object to our data structure
            data.allItems[type].push(newItem);

            // then return the element
            return newItem;
        },
        //testing purpose
        testing: function () {
            console.log(data);
        }
    };
})();

///////////////////////////////////////////////////////

// UI CONTROLLER
var UIController = (function () {
    //object to store the query selector fields from the html document
    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list"
    };

    // public method with an object with the values from the UI input fields
    return {
        // store the input from the UI
        getInput: function () {
            return {
                // will be either inc or exp from the html document value attribute
                type: document.querySelector(DOMstrings.inputType).value,
                // input text field from html to add an description for an expense
                description: document.querySelector(DOMstrings.inputDescription).value,
                // add a value amount field
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        // populate the UI with HTML markup with the data received from UI
        addListItem: function (obj, type) {
            var html, newHtml, element;
            // create html string with placeholders (%id),(%description%) and (%value%). Depending if it's an income or expense
            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html =
                    '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
            } else if (type === "exp") {
                element = DOMstrings.expenseContainer;
                html =
                    '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the placeholder text with the data we received from the UI
            newHtml = html.replace("%id%", obj.id);
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            //insert the html to the DOM as a child of the expense of income container
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },

        // clear fields input fields after user add a value
        clearFields: function () {
            var fields,

                // selects the input value and create a list
                fields = document.querySelectorAll(
                    DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            // trick slice method to return a array from the list of element returned by fields variable. slice method only accepts an Array, but we can call its prototype with the call method.
            fieldsArr = Array.prototype.slice.call(fields);

            // loop through the array and set the current element value to empty after adding a value
            fieldsArr.forEach(function (current, index, array) {
                current.value = '';
            });
            // set the focus back to description input field after adding a value
            fieldsArr[0].focus();
        },

        // method to return available DOM elements
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

///////////////////////////////////////////////////////

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
    //get the object DOMstring from the UI controller
    var DOM = UICtrl.getDOMstrings();

    // function for event listeners
    var setupEventListeners = function () {
        // retrive the queryselectors fields from ui controller module
        var DOM = UICtrl.getDOMstrings();
        // event listener to when user click the add button
        document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
        // Global document for return press. .which is for older broweserd that dosent support .keycode
        document.addEventListener("keypress", function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function () {
        var input, newItem;
        // 1. get field input data
        input = UICtrl.getInput();
        //2. add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        //4. clear fields after input
        UICtrl.clearFields();
        //5. calculate the budget

        //6. Display the budget on the ui
    };

    return {
        // return a method with the eventlisteners
        init: function () {
            setupEventListeners();
            console.log("app has started");
        }
    };
})(budgetController, UIController);

// start our app to set up event listeners
controller.init();
