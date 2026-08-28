let userName = '';

const themeToggleBtn = document.getElementById('theme-toggle');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

// Modal Elements
const welcomeModal = document.getElementById('welcome-modal');
const nameForm = document.getElementById('name-form');
const userNameInput = document.getElementById('user-name-input');
const skipBtn = document.getElementById('skip-btn');

// Start Conversation Helper
function initializeChat(name) {
    userName = name.trim();
    welcomeModal.style.display = 'none';

    const greeting = userName 
        ? `Hello ${userName}, I'm Elisha. Welcome to Growth and Grace. How are you feeling today?`
        : `Hello, I'm Elisha. Welcome to Growth and Grace. How are you feeling today?`;

    addMessage(greeting, 'bot-message');
}

// Modal Form Submission
nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    initializeChat(userNameInput.value);
});

// Skip Button Action
skipBtn.addEventListener('click', () => {
    initializeChat('');
});

// Dark/Light Theme Switcher
themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.body.removeAttribute('data-theme');
        themeToggleBtn.textContent = '🌙 Dark';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️ Light';
    }
});

// Chat Functionality
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user-message');
    userInput.value = '';

    setTimeout(() => {
        const response = getElishaResponse(message.toLowerCase());
        addMessage(response, 'bot-message');
    }, 600);
});

function addMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getElishaResponse(input) {
    const namePrefix = userName ? `${userName}, ` : '';

    if (input.includes('sad') || input.includes('down') || input.includes('unhappy')) {
        return `${namePrefix}I hear you, and it's completely okay to feel sad sometimes. Growth often happens in quiet moments. Give yourself grace today.`;
    } else if (input.includes('anxious') || input.includes('stressed') || input.includes('overwhelmed')) {
        return `${namePrefix}take a deep breath with me. Inhale strength, exhale tension. You don't have to carry everything at once. What's one small thing you can let go of right now?`;
    } else if (input.includes('happy') || input.includes('good') || input.includes('great')) {
        return `That brings warmth to my heart${userName ? `, ${userName}` : ''}! Celebrate those moments of joy and lightness—they are true blessings of grace.`;
    } else if (input.includes('angry') || input.includes('mad') || input.includes('frustrated')) {
        return `${namePrefix}frustration is heavy to hold. It's okay to feel upset. Try to acknowledge the feeling without letting it consume your peace.`;
    } else {
        return `Thank you for sharing that with me${userName ? `, ${userName}` : ''}. Remember to treat yourself with patience and kindness as you navigate these thoughts.`;
    }
}
