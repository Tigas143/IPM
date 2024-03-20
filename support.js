// Support variables & functions (DO NOT CHANGE!)

let student_ID_form, display_size_form, start_button;                  // Initial input variables
let student_ID, display_size;                                          // User input parameters

// Prints the initial UI that prompts that ask for student ID and screen size
function drawUserIDScreen(initial_screen)
{ 
  background(color(0,0,0));                                          // sets background to black
  image(initial_screen, 0,230);
  
  textFont("Arial", 20);
    fill(color(238, 75, 43));
    textStyle(BOLD);
    textAlign(LEFT);
  text("ATENÇÃO!", 470, 50);
  
  textFont("Arial", 16);
  textAlign(LEFT);
  fill(color(255, 255, 0));
  textStyle(NORMAL);
  text("O tempo começa apenas após clicares", 400, 80);
  text("na PRIMEIRA CIDADE!", 400, 100);
  text("Aproveita os momentos iniciais para", 400, 140);
  text("explorar as categorias e te familiarizares", 400, 160);
  text("com o jogo ;)", 400, 180);
  textFont("Arial", 16);
    fill(color(255));
    textAlign(LEFT);
    text("Como jogar:", 380, 250);
    text("No fundo do ecrã irá aparecer uma", 380, 280)
  text("palavra. Deves encontrá-la entre as",380, 300);
  text("outras O MAIS RÁPIDO QUE", 380, 320); 
  text("CONSEGUIRES! No ecrã estão presentes", 380, 340);
  text("18 categorias. Cada letra nelas escrita", 380, 360);
  text("corresponde à ÚLTIMA LETRA da palavra", 380, 380);
  text("que nelas podes encontrar.", 380, 400);
  
  textFont("Arial", 25);
  textStyle(BOLD);
  fill(color(104, 189, 232));
  text("O quão rápido és?", 430, 450);
  textStyle(NORMAL);
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
  start_button.position(width/2.4 - start_button.size().width/2, height/3 - start_button.size().height/2);
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