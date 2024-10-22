# Study Session CLI Timer

A simple CLI application that helps you track your study sessions by setting a countdown timer and saving the session details in a JSON file.
using [clack](https://www.npmjs.com/package/@clack/prompts?activeTab=readme), [ora](https://www.npmjs.com/package/ora) and NodeJS.

## Features

- art greeting on the console.
- Get user input for study subject and time.
- data is saved to a JSON file, by subject matter.
- Countdown timer displayed on the console.


## Prerequisites
You need to have NodeJS and npm installed on your machine.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kwame-Owusu/study-tracker.git
   ```
2. Navigate to project Directory:

```bash
cd study-tracker/
```

3. Install the required dependencies:

```bash
  npm install
  node study.js
```

## Example Code Flow

```bash
╔═════════════════════════════╗
║    Study Session Timer      ║
╚═════════════════════════════╝

What subject are you studying? > Maths
How many minutes do you plan to study? > 25

You will study Maths for 25 minutes.
Starting the timer now...
Time left: 25:59

```


