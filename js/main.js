

/** 
 * Created by: Troy Francis
 * Date: 05/04/19
 * 
 * Todo App
 * version: 1.0
 *
 */


   
let appData = {};
let userData;
let tasks = [];
let username = "";
const mainViewPane = document.getElementById('mainview');
const newTaskInputField = document.getElementById("tasktext");
const loginPane = document.getElementById('login');

/**
 *Fades in the element that is passed into it
 *
 * @param {'HTML'} element
 */
function fadeIn(element){

    const tick = function () { 

        //The HTML element's opacity is set to 0 by default. 
        //returns the numeric value of the element's opacity and increment it by 0.1
        element.style.opacity = +element.style.opacity + 0.1; 

        //Slowly incerments element's opacity by 0.1 each time setTimeout calls tick, fading in the element slowing.
        //Stops when the opacity is more than or equal to 1 
        if (+element.style.opacity < 1) {
            setTimeout(tick, 16);
        }
    };

    tick();
    
}



/**
 *Displays the main UI of the app while loading in data from the appData object or from the browser
 *
 * @param {'STRING'} username The username entered by the user and initialized in appData/userData object
 */
function showMainViewPane(username){

    //Fades in the main UI
    mainViewPane.style.display = 'block';
    fadeIn(mainViewPane);
    
    //Checks if both the user property (passed through the username parameter) and the userData object are defined
    //userData object is initialized when the browser loads it's saved appData object into it 
    if (username !== "" && typeof userData === 'object') {
        document.querySelector('#mainview .user').textContent = 'Hi, ' + username;
        
        //Displays the list of tasks saved in the browser.
        for(i = 0; i<userData.taskList.length; i++){
            addTask(userData.taskList[i]);
        }
    }else if (username !== ""){
        document.querySelector('#mainview .user').textContent = 'Hi, ' + username;
    }
    
    
    //Displays the current date in a user friendly format
    const showCurrentDate = function (){
        let now = new Date();
        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            timezone: 'UTC'
        };

        document.querySelector('.date h5').textContent = now.toLocaleDateString('en-GB', options);
    };

    showCurrentDate();
}


/**
 *Clears all whitespace, validates the input text length, throws a specific error message to the user 
 *and returns true if the inputed text pass or false if it didnt
 *
 * @param {'STRING'} inputText Text from user input
 * @returns {'BOOLEAN'} True if text validated successfully, false if it didnt
 */
function inputValidation(inputText){
    
    let status = true;
    inputText = inputText.trim();
    switch(inputText){
        case (inputText == null || inputText == undefined ? inputText: false):
            status = false;
            alertMessage('error', 'empty','login');
        break;
        
        case (inputText.length < 2 ? inputText: false):
            status = false;
            alertMessage('error', 'too-short','login');
        break;

        default:
            status = true;
    }
    
    return status;
}

/**
 *Adds a row of tasks along with it's associated ID attributes 
 *
 * @param {'STRING'} inputText Text from the 'Add Task' input field
 */
function addTask(inputText) {

    let list = document.querySelector("#list .row .list");
    let task =  inputText;

    //Finds all the task currently created, then initializes the variable with the total amount. 
    let totalTaskItems = document.querySelectorAll('.list-item').length; 

    //Adds 1 to the total amount of tasks created, then uses the number to intialize a new ID attribute value for the new task
    let taskID = totalTaskItems++; 

    //Creates a new row of task. Inserts a task ID to the Save, Delete, and Radio buttons.   
    list.insertAdjacentHTML('afterbegin',
        '<div class="row list-item">'+
            '<div class="col-sm-1 no-margin">'+
                '<div class="radio-btn" id="task-'+taskID+'"></div>'+
            '</div>'+
            '<div class="col-sm-9">'+
                '<input type="text" class="list-input list-input-w-value">'+
            '</div>'+    
            '<div class="col-sm-2 add-edit-btns">'+
                '<ul class="list-unstyled">'+
                    '<li><a href="#" class="save-btn" id="'+taskID+'">Save</a></li>'+
                    '<li><a href="#" class="delete-btn" id="delete-item-'+taskID+'"><i class="far fa-trash-alt"></i></a></li>'+
                '</ul>'+    
            '</div>'
        +'</div>'
    );

    document.querySelector('input.list-input-w-value').value= task;
    
    //adds a new key/value to the tasks array 
    tasks.push(inputText);
    
    //replaces the existing 'appData' array with the updated 'tasks' array.
    appData.taskList = tasks;
       
}


/**
 *Edits the tasks
 *
 * @param {'STRING'} text
 * @param {'NUMBER'} taskId
 * @returns {'OBJECT'} returns the updated appData object
 */
function editTask(text, taskId){
    
    //de-incremented to match the indexes of 'appData.taskList' object array
    taskId--;

    appData.taskList[taskId] = text;

    return appData;
}



/**
 *
 *
 * @param {'NUMBER'} taskId
 * @returns {'OBJECT'} returns the appData
 */
function removeTask(taskId){
    
    //de-incremented to match the indexes of appData.taskList object array
    taskId--; 
    
    //Converts the NodeList generated from 'getElementByClassName' to an array so that array methods and properties can be used
    let tasks = Array.from(document.getElementsByClassName('list-item'));
    let itemToRemoveID = 'delete-item-';
    
    //'splice' methods removes the array item at the index passed (taskId) and returns an array populated with that item.
    //Therefore the logic checks if the task in 'appData.taskList' array was removed before removing the task on the screen, then returns the updated 'appData'  
    if (Array.isArray(appData.taskList.splice(taskId, 1))){
        
        //increments to match the index of the row of task on screen
        taskId++;

        //was not necessary but converted the taskId value (a number) into a string before concatenating it and recreating the class attr value
        itemToRemoveID = itemToRemoveID + String(taskId);

        //The NodeList and all its properties were indexed individually in the 'tasks' array. 
        //Therefore each index of 'tasks' is a 'list-item' node with their respective children. 
        //This loop goes through each index and checks for a string that matches the delete-item-id
        for (let i = 0; i < tasks.length; i++){
            if (tasks[i].innerHTML.includes(itemToRemoveID)){
                tasks[i].style.display = 'none';
            }
        }

        //console.log(itemToRemoveID);
        return appData;
    }else{
        return false;
    }
    
    
}



/**
 *Clears the input field
 *
 * @param {'STRING'} textField
 */
function clearInputField(textField){
    textField.value = "";
}



/**
 *Generates and displays an alert message to the user based on certain actions they take
 *
 * @param {'STRING'} type
 * @param {'STRING'} flag
 */
function alertMessage(type,flag){
    
    alert = document.querySelector('.alert-message');
    
    if (type == 'error'){
    
        alert.classList.add('text-danger');

        switch (flag) {

            case 'save':
                msg = 'Todo could not save your task. Please refresh the page and try again';
                break;

            case 'add':
                msg = 'Task could not be added. Please refresh the page and try again';
                break;

            case 'input':
                msg = 'Please enter a username';
                break;

            case 'too-short':
                msg = 'Please a minimum of 2 characters';
                break;

            default:
                msg = 'An error occur.Please refresh the page and try again';
        }
    }else if(type == 'success'){

        alert.classList.add('text-success');
        
        switch (flag){

            case 'save':
                msg = 'Task saved';
                break;
            
            case 'remove':
                msg = 'Task removed';
                break;

            case 'complete':
                msg = 'Task completed'
                break;
            
            default:
                msg = 'Success';
                
        }
    }
    
    
    alert.textContent = msg;
    alert.style.opacity = 1;
    
    setTimeout( 
        function(){
            if(alert.style.opacity = 1){
                alert.style.opacity = 0;
                alert.textContent = "";
            }else{
                alert.style.opacity = 1;
            }

            if (alert.className == 'alert-message text-danger'){
                alert.classList.remove('text-danger');
            }else if (alert.className == 'alert-message text-success'){
                alert.classList.remove('text-success');
            }

        }, 
        3000 
    );
}



/**
 *Saves the appData object to the browser
 *
 * @param {'OBJECT'} data
 * @returns {'BOOLEAN'} true/false based on whether or not appData was successfully stored in the browser
 */
function saveTasks(data){
   
    let saveStatus = false;
    
   //if appData object does not exist in the browser then save the new appData object
    if(!sessionStorage.getItem('appData')){
        try {

            //convert appData object to JSON format because 'sessionStorage.setItem' only accepts strings as a value    
            sessionStorage.setItem('appData', JSON.stringify(data));
            saveStatus = true;

        } catch (error) {
            console.log(error.message);
            alertMessage('error','save');
        }
       
    }else{
        
        try{
            //initializes variable obj with the appData object from the browser
            let obj = JSON.parse(sessionStorage.getItem('appData'));

            //sets the username from the object generated from current browser data (obj) to the passed object username variable (data)
            //this ensures that the username is stored along with the tasks
            data.user = obj.user;
            
            sessionStorage.setItem('appData', JSON.stringify(data));
            saveStatus = true;

        } catch(error){
            console.log(error.message);
            alertMessage('error','save');
        }
        
        
    }

    return saveStatus;
    
    
}

// #### FUNCTION END ####

/**
 * ================================
 * SESSION STATE 
 * ================================
 * 
 * Displays either the 'loginPane' or 'MainViewPane' depending on the status of the 'appData' object in the browser
 * 
 * TODO: 
 *  Try replacing the userData with appData. Then follow through with changing the remaining code to reflect the change
 */

if(!sessionStorage.getItem('appData')){
    loginPane.style.display = 'block';
}else{
    loginPane.style.display = 'none';
    userData = JSON.parse(sessionStorage.getItem('appData'));
    appData.user = userData.user;
    showMainViewPane(userData.user);
}

// #### SESSION STATE END ####



/**
 * ===========================
 * EVENT HANDLING
 * ===========================
 */

/**
 * LOGIN AND MAIN UI PANE SWITCHING
 * 
 * User enters and submits their name on the login page. Once validated, the 'MainView' pane fades in
 */

let loginBtn = document.getElementById('loginbtn');
let loginInput = document.querySelector('#login input');

//fadein effect on button when text is entered in the input field
loginInput.addEventListener('keyup',function(){
    
    if(loginInput.value !== ""){
        fadeIn(loginBtn);
        
    }else{
        loginBtn.style.opacity = '0';
    }
});


//Displays 'MainViewPane' when user clicks the 'Enter' button and their text is validated 
loginBtn.addEventListener('click',function(e){
    
    e.preventDefault();
    
    if(inputValidation(loginInput.value)){
        
        username = loginInput.value;
        appData.user = username;
        loginPane.style.display = 'none';
        if (loginPane.style.display == 'none') {
            showMainViewPane(username);
        }

    }

});


// ### LOGIN AND MAINVIEW PANE SWITCHING END ####



/**
 * ADD TASK EVENT HANDLER  
 * 
 * On a click or keypress event - adds a task to the 'appData' object and displays the list of task to the screen.
 */

//Click event to add the task
 document.getElementById("addtask").addEventListener('click', function(){
    
    if (inputValidation(newTaskInputField.value)){
        
        addTask(newTaskInputField.value);
        
        if (saveTasks(appData)) {
            clearInputField(newTaskInputField);
        } else {
            alertMessage('error', 'save');
        }
    }
    
    
    
});

//keypress event to add the tasks
newTaskInputField.addEventListener('keypress', function(e){
    let key = e.key;
    if(key == 'Enter'){

        if (inputValidation(newTaskInputField.value)){

            addTask(newTaskInputField.value);
            if (saveTasks(appData)) {
                clearInputField(newTaskInputField);
            } else {
                alertMessage('error', 'save');
            }
        }
        
        
    }
});

//#### ADD TASK EVENT HANDLER END #####


/**
 * TASK MANAGEMENT EVENT HANDLERS
 * 
 * Group of event handlers to update, delete or complete a task
 */

//Main click event listner to determine which functionality (update, delete or complete) to execute.
document.querySelector("#list").addEventListener('click', function(event){
    
    //Gets the HTML element that was clicked on within the list div and initializes the variable 'element' with that value
    let element = event.target;
    
    let saveBtnId;
    
    //#### Updating The Task ####

    //Checks if the element that was clicked on was an input element.  
    if(element.nodeName == 'INPUT'){
        
        //Finds the value of the id attribute that is a sibling of the input element
        saveBtnId = element.parentNode.nextSibling.firstChild.firstChild.firstChild.id;
        
        //Fires a keypress event hanlder on the input element
        element.addEventListener('keyup',function(){

            //Initialize the 'saveBtn' variable with the 'save' anchor that is a direct sibling of the input element that was clicked on
            let saveBtn = document.getElementById(saveBtnId);

            saveBtn.style.visibility = 'visible';
            
            saveBtn.addEventListener('click',function(e){
                e.preventDefault();
                
                //Try catch block to catch any exceptions and throw customized 'error occured' alert
                if (inputValidation(element.value)){
                    
                    //Updates the task and returns the updated appData object, then stores the updated appData in the browser          
                    if (saveTasks(editTask(element.value, saveBtnId))) {
                        
                        alertMessage('success', 'save');
                        
                    }
                
                }
                   
            
            }); 
             
            
        });

        element.addEventListener('blur',function(){
            
            document.addEventListener('click', function(event){
                //Hides the save btn when the user clicks outside the its associated input element
                if (event.target.textContent !== 'Save'){
                    document.getElementById(saveBtnId).style.visibility = 'hidden';
                }
            })
        });
    }
    //### Task Updating ENDS ###



    //### Deleting The Task ####

    //checks if the element clicked on has a parent element with the class name 'delete-btn'
    if (element.parentNode.className == 'delete-btn'){
        
        event.preventDefault();
        //console.log(element.parentNode.id.substr(12));
        //Strips the 12 characters of id attribute value, leaving a numerical id value of the delete btn
        let itemToDeleteID = element.parentNode.id.substr(12)

        
        if (saveTasks(removeTask(itemToDeleteID))){

            alertMessage('success','remove');
        }

    }
    //### Task Deleting END ####

    
    
    //###Completing The Task####

    //checks if the radio input element contains a class name 'radio-btn'
    if (element.classList.contains('radio-btn')){
        
        //Strips the 5 characters of id attribute value, leaving a numerical id value of the radio input element 
        let itemToCompleteId = element.id.substr(5);
        

        let completedTaskField = element.parentNode.nextSibling.firstChild;
        //console.log(completedTaskField);
        if (!completedTaskField.classList.contains('complete')){
            completedTaskField.classList.add('complete');
            element.classList.add('tick');
            alertMessage('success','complete');
        }else{
            completedTaskField.classList.remove('complete');
            element.classList.remove('tick');
        }
        
        
        //Checks if the browser is about to refresh
        window.addEventListener('beforeunload',function(event){
            // event.preventDefault();
            // event.returnValue = '';

            //Checks if 'complete' class name is present in the element
            if (completedTaskField.classList.contains('complete')){
               // console.log(itemToCompleteId);
               //Removes the task with the 'complete' class from the appData object and stores the updated object in the browser 
                saveTasks(removeTask(itemToCompleteId));
                
            }
            
        });

    }
    
});






