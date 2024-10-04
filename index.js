import readlineSync from 'readline-sync';
import chalk from 'chalk';
import fs  from  'fs';
import ora from 'ora';


function saveData(subject, sessionLength) {

  let dataRecord = {
    "study subject": subject,
    "session length": `${sessionLength} mins`,
    "date": new Date().toDateString(),
    "time" : `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  };

  const outputPath = "./study-session-data.json";

  // Initialize records as an array
  let records = [dataRecord];

  // Check if the file exists and read it
  fs.readFile(outputPath, 'utf8', (err, data) => {
    if (!err) {
     
      try {
        const existingRecords = JSON.parse(data);
        if (Array.isArray(existingRecords)) {
          records = existingRecords.concat(records); // Merge new record with existing records
        }
      } catch (parseErr) {
        console.log("Error parsing JSON data:", parseErr);
      }
    } else {
      if (err.code !== 'ENOENT') {
        console.log("An error occurred while reading the file:", err);
        return;
      }
    }

    // Convert the updated records array back to JSON
    const jsonContent = JSON.stringify(records, null, 2);

    // Write the updated JSON array to the file
    fs.writeFile(outputPath, jsonContent, (err) => {
      if (err) {
        console.log("An error occurred while writing JSON to file:", err);
        return;
      }
      console.log("Data file saved successfully.");
    });
  
  });
}


function displayLogo(type) {

  const logo = chalk.bold(`
        ╔═════════════════════════════╗
        ║    Study Session Timer      ║
        ╚═════════════════════════════╝
`);

  const end = chalk.bold(`
        ╔═════════════════════════════╗
        ║      Session Complete!      ║ 
        ╚═════════════════════════════╝
`);

  const goodbye = chalk.bold(`
        ╔═════════════════════════════╗
        ║ Thank you for studying 👋   ║ 
        ╚═════════════════════════════╝
`);

  // Log based on the type
  switch(type) {
      case 'start':
          console.log(logo);
          break;
      case 'end':
          console.log(end);
          break;
      case 'goodbye':
          console.log(goodbye);
          break;
      default:
          console.log('Invalid type. Please use "start", "end", or "goodbye".');
          break;
  }
}

function startTimer(duration) {
  let timer = duration * 60; // Convert minutes to seconds
  const spinner = ora('Study session in progress...').start(); // Start the spinner
  console.clear();

  const countdown = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const display = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
    spinner.text = `Time left: ${display}`;
    if (timer < 0) {
      clearInterval(countdown);
      spinner.succeed(); // Stop the spinner with success message
      displayLogo("end");
      askToContinue();
    }
    timer--; 
  }, 1000);
}

function askToContinue() {
  const response = readlineSync.question('Do you want to start another study session? (yes/no): ').trim().toLowerCase();
  
  if (response === 'yes' || response === 'y') {
    runStudySession(); // Restart the study session
  } else {
    displayLogo("goodbye");
    process.exit(); 
  }
}

// Main function to run the study session
function runStudySession() {
  displayLogo("start")
  const subject = readlineSync.question('What are you studying? ');
  
  let study_length;
  while (true) {
    study_length = readlineSync.question('How many minutes do you want to study? ');
    if (!isNaN(study_length) && study_length.trim() !== "") {
      break;
    } else {
      console.log("Please enter a valid number for study length.");
    }
  }
  
  console.log(`You are going to study ${subject} for ${study_length} mins.`);
  saveData(subject, study_length);
  startTimer(parseInt(study_length));
}

// Start the study session
runStudySession();

