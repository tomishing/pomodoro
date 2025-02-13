const readline = require('readline'); // Import the readline module for handling user input
const { exec } = require('child_process'); // Import exec to trigger GUI notifications

// Create an interface for reading and writing in the terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Set the duration for work and break periods (in seconds)
let workTime = 25 * 60; // 25 minutes
let breakTime = 5 * 60; // 5 minutes
let cycleCount = 0; // Track the number of Pomodoro cycles

// Function to format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to show GUI notification
function showNotification(title, message) {
    const command = `notify-send "${title}" "${message}"`;
    exec(command, (error) => {
        if (error) {
            console.error("Notification failed: ", error);
        }
    });
}

// Function to start a countdown timer
function startTimer(duration, callback) {
    let timeLeft = duration;

    const interval = setInterval(() => {
        process.stdout.clearLine(); // Clear the current line in the terminal
        process.stdout.cursorTo(0); // Move cursor to the beginning of the line
        process.stdout.write(`Time Left: ${formatTime(timeLeft)}`); // Display remaining time

        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(interval); // Stop the timer
            console.log('\nTime is up!');
            callback(); // Execute the next step
        }
    }, 1000); // Update every second
}

// Function to check if 4 cycles are completed
function checkCycleCompletion() {
    if (cycleCount % 4 === 0) {
        rl.question('\nYou have completed 4 Pomodoro cycles. Do you want to continue? (yes/no): ', (answer) => {
            if (answer.toLowerCase() === 'yes') {
                startPomodoro();
            } else {
                console.log('Pomodoro session ended. Have a great rest!');
                rl.close();
            }
        });
    } else {
        startPomodoro();
    }
}

// Function to start the Pomodoro cycle
function startPomodoro() {
    cycleCount++; // Increment cycle count
    console.log(`Starting Pomodoro Cycle #${cycleCount}! Work for ${workTime / 60} minutes.`);
    startTimer(workTime, () => {
        console.log("\nTime for a break!");
        showNotification("Pomodoro Timer", "Time for a break! Take a short rest."); // GUI Notification
        startTimer(breakTime, () => {
            console.log(`\nBreak over! Completed ${cycleCount} cycle(s).`);
            showNotification("Pomodoro Timer", "Break is over! Time to get back to work."); // GUI Notification
            checkCycleCompletion(); // Check if 4 cycles are completed
        });
    });
}

// Prompt the user to start the timer
rl.question('Press Enter to start Pomodoro Timer...', () => {
    startPomodoro();
});

