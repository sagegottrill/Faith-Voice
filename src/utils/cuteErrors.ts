/**
 * Cute Error Messages for a friendlier UX
 */
const CUTE_ERRORS = [
    "Even Peter sank once. Let's try that again. 🌊",
    "The cloud is a bit cloudy today. Retrying... ☁️",
    "Waiting on a dove to bring the answer... 🕊️",
    "Must be a connection issue. Have faith! 🙏",
    "Silence in heaven for about half a second... try again? ⏳",
    "That crossed some wires. Let's untangle them. 🧵",
];

export function getCuteError(): string {
    return CUTE_ERRORS[Math.floor(Math.random() * CUTE_ERRORS.length)];
}

export function getCuteLoading(): string {
    const loaders = [
        "Consulting the scriptures...",
        "Searching the scrolls...",
        "Asking the cloud of witnesses...",
        "Flipping through pages...",
        "Seeking wisdom..."
    ];
    return loaders[Math.floor(Math.random() * loaders.length)];
}
