import * as clack from '@clack/prompts';
import ora from 'ora';
import fs from 'fs';


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
  const lowerCaseSubject = subject.toLowerCase();
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
    if (!records[lowerCaseSubject]) {
      records[lowerCaseSubject] = [];
    }
    records[lowerCaseSubject].push(dataRecord);

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


async function main() {
  clack.intro(displayLogo("start"));

  const subject = await clack.text({
    message: 'What are you studying?',
    placeholder: 'e.g. Maths',
    validate(value) {
      if (value.length === 0) return 'Value is required!';
    },
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
