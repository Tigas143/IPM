// Bake-off #2 -- Seleção em Interfaces Densas
// IPM 2023-24, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 18 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 58;      // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = false;  // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM; 
const NUM_OF_TRIALS       = 12;     // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas;                       // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  

// Study control parameters (DO NOT CHANGE!)
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Common variables
const NUMBER_CATEGORIES = 10;
const NUMBER_TARGETS = 80;
const SELECTED = 2;
const UNSELECTED = 1;
let curr_selected_cat = -1;        // current selected category
var initial_screen;
var right_answer;
var screen_height;
var screen_width;


// Target list and layout variables
let targets               = [];
const GRID_ROWS           = 8;      // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS        = 10;     // We divide our 80 targets in a 8x10 grid

// Categories
const BA = [1,14,19, 26,21, 52,33, 54,56,36,58,80, 37, 79,46,41, 49, 65,42, 66, 68, 75, 72, 28, 29, 34];
const BE = [2, 3, 11, 12, 30, 40, 43, 57, 67, 77];
const BI = [13, 22, 32, 48, 62, 70, 71, 73, 78];
const BU = [8, 9, 10, 18, 23, 35, 39, 45, 47, 59];
const BO = [4, 5, 15, 50];
const BR = [6, 7, 16, 17, 20, 27, 31, 44, 51, 60, 61, 64, 76];
const BL = [55];
const BN = [69];
const BH = [25, 38, 53];
const BY = [24];

// List of categories
let catList = [BA, BE, BI, BU, BO, BR, BL, BN, BH, BY]

let categories             = [];     // Category List
let catlabels = ["Ba", "Be", "Bi", "Bu" , "Bo", "Br", "Bl", "Bn", "Bh", "By"];

let num_targets_cat=[26,10,9,10,4,13,1,1, 3, 1];  // number of targets per category

// Ensures important data is loaded before the program starts
function preload()
{
  // id,name,...
  legendas = loadTable('legendas.csv', 'csv', 'header');
}

// Runs once at the start
function setup()
{
  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(0,0,0));        // sets background to black
    
    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255,255,255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
        
    // Draw all targets
	for (var i = 0; i<NUMBER_CATEGORIES; i++) categories[i].draw();
    
    // Draws the target label to be selected in the current trial. We include 
    // a black rectangle behind the trial label for optimal contrast in case 
    // you change the background colour of the sketch (DO NOT CHANGE THESE!)
    fill(color(0,0,0));
    rect(0, height - 40, width, 40);
 
    textFont("Arial", 20); 
    fill(color(255,255,255)); 
    textAlign(CENTER); 
    text(legendas.getString(trials[current_trial],1), width/2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() 
{
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets)
  {
    if(curr_selected_cat != -1)  // checks if at least one category is selected
    {
      for (var j=0; j< targets[curr_selected_cat].length; j++){
      // Check if the user clicked over one of the targets of the selected category
        if (targets[curr_selected_cat][j].clicked(mouseX, mouseY)) 
        {
        // Checks if it was the correct target
          if (targets[curr_selected_cat][j].id === trials[current_trial]) hits++;
          else
            misses++;

        
          current_trial++;                 // Move on to the next trial/target
          break;
        }
      }
    }

    for (var i = 0; i < NUMBER_CATEGORIES; i++)
    {
      if(categories[i].clicked(mouseX, mouseY))
      {
        categories[i].changeType(SELECTED);  // selects category
        curr_selected_cat = i;       // current selected category

        // makes sure no other categories are selected
        for(var j = 0; j < NUMBER_CATEGORIES; j++) {
          if(j != i) {
            categories[j].changeType(UNSELECTED);
          }
        }

        break;
      }
    }
    
    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS)
    {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2)
      {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest()
{
  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  // Shows the targets again
  draw_targets = true; 
}

function createTargets(displaycenter_x, displaycenter_y, t_width, t_height, margin, circle_size)
{
  // Colours
  WHITE = color(255);

  let buffer =[];
  
  for(var i=0; i < NUMBER_CATEGORIES; i++){
  
    let num = num_targets_cat[i];
    let target_x, target_y;
    let k=1;
    for(var j=1; j<=num; j++)
    {
      if (((i)%4)===0||((i)%4)===1){
        k=-1;
        target_x = screen_width/2-2.5*margin-2*circle_size-t_width/2;  
      }
      else{target_x = screen_width/2+2.5*margin+2*circle_size+t_width/2;}
      target_y = screen_height/2 - 2*circle_size - 2*margin + (Math.floor(i/4))*(1.5*t_height);
      
      switch (num) {
        case 2: // side by side;
          target_y += 1.5*t_height*(Math.floor((j-1)%3))-0.5*t_height;
          break;
        case 3: // triangle
          target_y += 1.5*t_height*(Math.floor((j-1)%3))-1.5*t_height;
          break;
        case 4: // square
          target_x += 1.1*t_width*((j-1)%2)*k;
          target_y += 1.5*t_height*(Math.floor((j-1)/2))-0.5*t_height;
          break;
        case 5:
        case 6:
        case 7:
          target_x += 1.1*t_width*((j-1)%2)*k;
          target_y += 1.5*t_height*(Math.floor((j-1)/2));
          if (i>3){ 
            target_y-=1.5*t_height;
            if (num===7) target_y-=0.5*t_height;
          }
          break;
        case 8:
          target_x += 1.1*t_width*((j-1)%2)*k;
          target_y += 1.5*t_height*(Math.floor((j-1)/2))-3*t_height;
          break;
        case 9:
          target_x += 1.1*t_width*((j-1)%3)*k;
          target_y += 1.5*t_height*(Math.floor((j-1)/3));
          if (i>3) target_y-=1.5*t_height;
        break;
        case 10:
          target_x += 1.1*t_width*((j-1)%3)*k;
          target_y += 1.5*t_height*(Math.floor((j-1)/3))-2*t_height;
        break;
        case 11:
          target_x += 1.1*t_width*((j-1)%3)*k;
          target_y += 1.5*t_height*(Math.floor((j-1)/3))-2*t_height;
        break;
        case 13:
          target_x += 1.1*t_width*((j-1)%3)*k;
          target_y += 1.5*t_height*(Math.floor((j-1)/3))-2*t_height;
        break;
        case 26:
          target_x += 1.1*t_width*((j-1)%3)*k;
          target_y += 1.3*t_height*(Math.floor((j-1)/3))-2*t_height
        break;
          
      }
        // creates target
        let label_id = catList[i][j-1];
        
        let target_label = legendas.getString(label_id-1, 1);
        
        let target = new Target(target_x, target_y, t_width, t_height,target_label, label_id, WHITE, i);
        buffer.push(target);
    }
    targets.push(buffer);
    buffer = [];
  }
}
// creates an array with all the categories
function createCategories(circle_size, margin)
{
  let i=0;
  while(i<7){
      // calculates positions
    for (var r = 0; r < 3; r++)
    {
      let cat_y, cat_x;
      cat_y = screen_height/2 - (2-r)*circle_size - (2-r)*margin;
      
      for (var c = 0; c < 4; c++)
      {
        cat_x = screen_width/2 - (1.5-c)*circle_size - (1.5-c)*margin;
      
        // adds category
        let category = new Category(cat_x, cat_y, circle_size, catlabels[i], 1, targets[i], r);
        categories.push(category);
        i++;
      }
    }
  }
}
// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() 
{
  if (fullscreen())
  {
    resizeCanvas(windowWidth, windowHeight);
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    screen_width   = display.width * 2.54 * PPCM;             // screen width
    screen_height  = display.height * 2.54 * PPCM;            // screen height

    let cat_size    = 2;                                // size of category's circle
    let margin = 0.3; 
    let target_width    = 3;                              
    let target_height    = 1.5;                          // size of circle that the categories surround

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    createTargets(screen_width/2, screen_height/2, target_width*PPCM, target_height*PPCM, margin * PPCM, cat_size*PPCM); // creates targets list
    createCategories(cat_size * PPCM, margin * PPCM);  // creates categories list

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}