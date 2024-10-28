// Name for the visualisation to appear in the menu bar.
let name = 'British Food Attitudes';
// Each visualisation must have a unique ID with no special
// characters.
let id = 'british-food-attitudes';

// Property to represent whether data has been loaded.
let loaded = false;
// Create a new pie chart object.
let pie;
// Preload the data. This function is called automatically by the
// gallery when a visualisation is added.
function preload() {
  let self = this;
  this.data = loadTable(
    './data/food/attitudes-transposed.csv', 'csv', 'header',
    // Callback function to set the value
    // this.loaded to true.
    function(table) {
      self.loaded = true;
    });
}

function setup(){
  if (!this.loaded) {
    console.log('Data not yet loaded');
    return;
  }
  createCanvas(1024, 576);
  pie = new PieChart(width / 2, height / 2, width * 0.4);

  // Create a select DOM element.
  this.select = createSelect();
  this.select.position(350, 700);

  // Fill the options with all company names.
  let questions = this.data.columns;
  // First entry is empty.
  for (let i = 1; i < questions.length; i++) {
    this.select.option(questions[i]);
  }
}

function destroy() {
  this.select.remove();
}

  
  

 function draw(){
  if (!this.loaded) {
    console.log('Data not yet loaded');
    return;
  }

  // Get the value of the company we're interested in from the
  // select item.
  let question = this.select.value();

  // Get the column of raw data for question.
  let col = this.data.getColumn(question);

  // Convert all data strings to numbers.
  col = stringsToNumbers(col);

  // Copy the row labels from the table (the first item of each row).
  let labels = this.data.getColumn(0);

  // Colour to use for each category.
  let colours = [
      color(0,204,0),
      color(51,255,51),
      color(255,255,51),
      color(255,153,51),
      color(255,51,51)
  ];

  // Make a title.
  let title = question;

  // Draw the pie chart!
  pie.draw(col, labels, colours, title);
}
