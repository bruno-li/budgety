/*jshint esversion: 6 */ 



// BUDGET CONTROLLER
var budgetController = (function(){
    //private properties. Not accessible outside the function


// return an object that will be available to be used outside this function. This can be done because of Closures.


}());

// UI CONTROLLER
var UIController = (function(){

    //object to store the query selector fields from the html document
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    // return a public method with an object with the values from the UI input fields
    return {
        getInput: function(){
            return {
            // will be either inc or exp from the html document value attribute
            type: document.querySelector(DOMstrings.inputType).value,
            // input text field from html to add an description for an expense
             description: document.querySelector(DOMstrings.inputDescription).value,
            // add a value amount field
             value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        // method to return the DOMstring object
        getDOMstrings: function(){
            return DOMstrings;
        }
    }
}());



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    //get the object DOMstring from the UI controller
    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function(){
        // 1. get field input data
        var input = UICtrl.getInput();
        console.log(input);
        //2. add the item to the budget controller

        //3. add the item to the UI

        //4. calculate the budget

        //5. Display the budget on the ui
    };

    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    // Global document for return press. .which is for older broweserd that dosent support .keycode
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
          ctrlAddItem();
        }
    });
})(budgetController,UIController);