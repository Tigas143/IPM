// Support variables & functions (DO NOT CHANGE!)

let student_ID_form, display_size_form, start_button;                  // Initial input variables
let student_ID, display_size;                                          // User input parameters

// Prints the initial UI that prompts that ask for student ID and screen size
function drawUserIDScreen(initial_screen)
{ 
  background(color(0,0,0));                                          // sets background to black
  image(initial_screen, 0,236);
  
  textFont("Arial", 16);
    fill(color(238, 75, 43));
    textAlign(LEFT);
  text("ATTENTION!", 470, 90);
  fill(color(255));
  text("Use 16 inches or higher for a better", 400, 120);
  text("experience", 400, 140);
  textFont("Arial", 16);
    fill(color(255));
    textAlign(LEFT);
    text("How to Play:", 380, 250);
    text("At the bottom of the screen it will appear", 380, 280)
  text("a word, you must find that word amongst ",380, 300);
  text("the other ones as fast as you can!", 380, 320); 
  text("on the screen you will find 10 categories.", 380, 340);
  text("The letters on each one correspond to", 380, 360);
  text("the first 2 letters of the words you can", 380, 380);
  text("find in them ", 380, 400);
  
  textFont("Arial", 25);
  textStyle(BOLD);
  fill(color(104, 189, 232));
  text("How fast can you be?", 400, 450);
  // Text prompt
  main_text = createDiv("Insert your student number and display size");
  main_text.id('main_text');
  main_text.position(10, 10);
  
  // Input forms:
  // 1. Student ID
  let student_ID_pos_y_offset = main_text.size().height + 40;         // y offset from previous item
  
  student_ID_form = createInput('');                                 // create input field
  student_ID_form.position(200, student_ID_pos_y_offset);
  
  student_ID_label = createDiv("Student number (int)");              // create label
  student_ID_label.id('input');
  student_ID_label.position(10, student_ID_pos_y_offset);
  
  // 2. Display size
  let display_size_pos_y_offset = student_ID_pos_y_offset + student_ID_form.size().height + 20;
  
  display_size_form = createInput('');                              // create input field
  display_size_form.position(200, display_size_pos_y_offset);
  
  display_size_label = createDiv("Display size in inches");         // create label
  display_size_label.id('input');
  display_size_label.position(10, display_size_pos_y_offset);
  
  // 3. Start button
  start_button = createButton('START');
  start_button.mouseReleased(startTest);
  start_button.position(width/2 - start_button.size().width/2, height/3 - start_button.size().height/2);
}

// Verifies if the student ID is a number, and within an acceptable range
function validID()
{
  if(parseInt(student_ID_form.value()) < 200000 && parseInt(student_ID_form.value()) > 1000) return true
  else 
  {
    alert("Please insert a valid student number (integer between 1000 and 200000)");
	return false;
  }
}

// Verifies if the display size is a number, and within an acceptable range (>13")
function validSize()
{
  if (parseInt(display_size_form.value()) < 50 && parseInt(display_size_form.value()) >= 13) return true
  else
  {
    alert("Please insert a valid display size (between 13 and 50)");
    return false;
  }
}

// Starts the test (i.e., target selection task)
function startTest()
{
  if (validID() && validSize())
  {
    // Saves student and display information
    student_ID = parseInt(student_ID_form.value());
    display_size = parseInt(display_size_form.value());

    // Deletes UI elements
    main_text.remove();
    student_ID_form.remove();
    student_ID_label.remove();
    display_size_form.remove();
    display_size_label.remove();
    start_button.remove();  

    // Goes fullscreen and starts test
    fullscreen(!fullscreen());
  }
}

// Randomize the order in the targets to be selected
function randomizeTrials()
{
  trials = [];      // Empties the array
    
  // Creates an array with random items from the "legendas" CSV
  for (var i = 0; i < NUM_OF_TRIALS; i++) trials.push(floor(random(legendas.getRowCount())));

  print("trial order: " + trials);   // prints trial order - for debug purposes
}