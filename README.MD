# Study Session CLI Timer

A simple CLI application that helps you track your study sessions by setting a countdown timer and saving the session details in a JSON file. The app also plays a sound when the session ends and shows colorful CLI outputs using Node.js libraries like `chalk` and `ora`.

## Features

- ASCII art greeting on the console.
- Get user input for study subject and time.
- Countdown timer displayed on the console.
- After the session ends, data is saved to a JSON file.
- Plays a sound to notify when the session ends.
- Colorful CLI output using `chalk` and loading spinner with `ora`.

## Prerequisites

You need to have Node.js and npm installed on your machine.

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Navigate to project Directory:

```bash
cd study-session-timer
```

3. Install the required dependencies:

```bash
  npm install
```

## Example Code Flow
╔═════════════════════════════╗
║ Study Session Timer         ║
╚═════════════════════════════╝

What subject are you studying? Math
How many minutes do you plan to study? 25
You will study Math for 25 minutes.
Time left: 25:59
