// IFFE returning an anonymous function
var budgetController = (function(){
    //private properties. Not accessible outside the function
    var x = 23;
    var add = function(a){
        return x + a;
    }

// return an object that will be available to be used outside this function. This can be done because of Closures.
    return {
        publicTest: function(b) {
            return add(b);
        }
    }

}());

// UI Controller Module
var UIController = (function(){
    
}());



// App Controller Module. This is used to integrate budgedtController and UIController Modules
var controller = (function(budgetCtrl, UICtrl){
    var z = budgetCtrl.publicTest(5);
    
    return {
        anotherPublic: function(){
            console.log(z);
        }
    }
}(budgetController, UIController));