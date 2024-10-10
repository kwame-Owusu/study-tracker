import * as clack from '@clack/prompts';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

// Path to the subjects file
const SUBJECTS_FILE = path.resolve('./subjects.json');

// Load subjects from file
function loadSubjects() {
  try {
    if (fs.existsSync(SUBJECTS_FILE)) {
      const data = fs.readFileSync(SUBJECTS_FILE, 'utf-8');
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (err) {
    console.log('Error reading subjects file:', err);
    return [];
  }
}

// Save subjects to file
function saveSubjects(subjects) {
  try {
    const jsonContent = JSON.stringify(subjects, null, 2);
    fs.writeFileSync(SUBJECTS_FILE, jsonContent, 'utf-8');
    console.log("Subjects saved successfully.");
  } catch (err) {
    console.log("Error saving subjects:", err);
  }
}

function displayLogo(type) {
  const logo = `
        ╔═════════════════════════════╗
        ║    Study Session Timer      ║
        ╚═════════════════════════════╝
`;

  const end = `
        ╔═════════════════════════════╗
        ║ Thank you for studying 👋   ║ 
        ╚═════════════════════════════╝
`;

  console.log(type === 'start' ? logo : end);
}

function saveData(subject, sessionLength) {
  const capitalizeSubject = subject.toUpperCase();
  const dataRecord = {
    "session length": `${sessionLength} mins`,
    "date": new Date().toDateString(),
    "time": new Date().toLocaleTimeString()
  };

  const outputPath = "./session-data.json";
  let records = {};

  // Read existing data from the file
  fs.readFile(outputPath, 'utf8', (err, data) => {
    if (!err) {
      try {
        records = JSON.parse(data);
      } catch (parseErr) {
        console.log("Error parsing JSON data:", parseErr);
      }
    } else if (err.code !== 'ENOENT') {
      console.log("An error occurred while reading the file:", err);
      return;
    }

    // Add the new record under the appropriate subject
    if (!records[capitalizeSubject]) {
      records[capitalizeSubject] = [];
    }
    records[capitalizeSubject].push(dataRecord);

    // Convert the updated records object back to JSON
    const jsonContent = JSON.stringify(records, null, 2);

    // Write the updated JSON object to the file
    fs.writeFile(outputPath, jsonContent, (err) => {
      if (err) {
        console.log("An error occurred while writing JSON to file:", err);
        return;
      }
      console.log("Data file saved successfully.");
    });
  });
}

async function askToContinue() {
  return await clack.confirm({
    message: 'Do you want to start another study session?',
  });
}

function startTimer(duration) {
  let timer = duration * 60; // Convert minutes to seconds
  console.clear();
  const spinner = ora().start();

  const countdown = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const display = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    spinner.text = `Time left: ${display}`;
    if (timer < 0) {
      clearInterval(countdown);
      spinner.succeed(displayLogo("end"));
      // Ask if the user wants to continue after the timer ends
      askToContinue().then((shouldContinue) => {
        if (shouldContinue) {
          console.clear();
          main(); // Restart the main function for a new session
        } else {
          displayLogo("end");
        }
      });
    }
    timer--;
  }, 1000);
}

async function intro_question() {
  return await clack.confirm({
    message: 'Do you want to add a new Subject?',
  });
}

async function main() {
  clack.intro(displayLogo("start"));

  // Load existing subjects from file
  let subjects = loadSubjects();

  // Ask if the user wants to add a new subject
  const addNewSubject = await intro_question();

  if (addNewSubject) {
    const newSubject = await clack.text({
      message: 'Enter the name of the new subject:',
      placeholder: 'e.g. Physics',
      validate(value) {
        if (value.length === 0) return 'Value is required!';
      },
    });

    if (clack.isCancel(newSubject)) {
      clack.cancel('Operation cancelled.');
      process.exit(0);
    }

    // Add the new subject to the subjects list and save it
    subjects.push({ value: newSubject, label: newSubject });
    saveSubjects(subjects); // Save the updated subjects list to file
  }

  if (subjects.length === 0) {
    console.log("No subjects available. Please add a subject.");
    process.exit(0);
  }

  const subject = await clack.select({
    message: 'Pick a subject.',
    options: subjects,  // Use updated subjects list
  });

  if (clack.isCancel(subject)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  const sessionLength = await clack.text({
    message: 'How long will you be studying (in minutes)?',
    placeholder: 'e.g. 30',
    initialValue: '1',
    validate(value) {
      if (value.length === 0) return 'Value is required!';
      if (isNaN(value) || value <= 0) return 'Please enter a valid number.';
    },
  });

  if (clack.isCancel(sessionLength)) {
    clack.cancel('Operation cancelled.');
    process.exit(0);
  }

  saveData(subject, sessionLength);

  const s = clack.spinner();
  s.start(`Starting session: Studying ${subject} for ${sessionLength} mins.`);

  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a brief wait
  s.stop('Session started, data saved successfully.');

  startTimer(parseInt(sessionLength));
}

// Run main function to start the application
main();
