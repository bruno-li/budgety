/*jshint esversion: 6 */ 



// BUDGET CONTROLLER
var budgetController = (function(){
    //private properties. Not accessible outside the function


// return an object that will be available to be used outside this function. This can be done because of Closures.


}());

// UI CONTROLLER
var UIController = (function(){
    
}());



// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function(){
        // 1. get field input data

        //2. add the item to the budget controller

        //3. add the item to the UI

        //4. calculate the budget

        //5. Display the budget on the ui
    };

    document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);

    // Global document for return press. .which is for older broweserd that dosent support .keycode
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
          ctrlAddItem();
        }
    });
})(budgetController,UIController);