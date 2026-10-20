// ==========================================================================
// ES6 Local Storage State Core Mapping Engine
// ==========================================================================
let tasks = JSON.parse(localStorage.getItem('gg_tasks')) || [
    { id: 1, text: "Open up the platform and review my day's layout.", completed: true },
    { id: 2, text: "Take a deep three-second breath before starting work.", completed: false }
];

let journalEntries = JSON.parse(localStorage.getItem('gg_journal')) || [];
let currentTheme = localStorage.getItem('gg_theme') || 'light';
let loginStreak = parseInt(localStorage.getItem('gg_streak')) || 1;

// Constant Reference Matrix for Prompts & Affirmations
const prompts = [
    "What is a small victory from today that you can extend gratitude for?",
    "Name a trait or choice you made recently that makes you feel proud.",
    "What is a space in your life where you need to extend yourself more grace?",
    "If you can accomplish just one micro-task today without judgement, what would it be?",
    "Recall a quote or verse that made you feel safe, calm, and grounded."
];
let currentPromptIndex = 0;

// ==========================================================================
// Central Lifecycle Execution Listener
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTasks();
    renderJournal();
    updateStreak();
});

// ==========================================================================
// Light & Dark Theme Controller Interface Engine
// ==========================================================================
const initTheme = () => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        
        btn.addEventListener('click', () => {
            currentTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            localStorage.setItem('gg_theme', currentTheme);
            btn.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        });
    }
};

// ==========================================================================
// Dynamic Navigation View Switcher (Exposed cleanly to Global Scope)
// ==========================================================================
window.switchTab = (tabId) => {
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const targetPane = document.getElementById(`${tabId}Tab`);
    if (targetPane) targetPane.classList.add('active');
    
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
};

// ==========================================================================
// Task Control & Data Mutation Mapping Pipelines
// ==========================================================================
const renderTasks = () => {
    const list = document.getElementById('taskList');
    if (!list) return;
    list.innerHTML = '';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-left">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Remove</button>
        `;
        list.appendChild(li);
    });
    calculateProgress();
    localStorage.setItem('gg_tasks', JSON.stringify(tasks));
};

window.addTask = () => {
    const input = document.getElementById('taskInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });
    input.value = '';
    renderTasks();
};

window.toggleTask = (id) => {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
    renderTasks();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
};

const calculateProgress = () => {
    const percentLabel = document.getElementById('progressPercent');
    const barFill = document.getElementById('progressBarFill');
    
    if (!percentLabel || !barFill) return;

    if (tasks.length === 0) {
        percentLabel.textContent = '0%';
        barFill.style.width = '0%';
        return;
    }
    const completedCount = tasks.filter(t => t.completed).length;
    const percentage = Math.round((completedCount / tasks.length) * 100);
    
    percentLabel.textContent = `${percentage}%`;
    barFill.style.width = `${percentage}%`;
};

// ==========================================================================
// Journal Entry Reflection Vector Managers
// ==========================================================================
window.rotatePrompt = () => {
    const promptDisplay = document.getElementById('promptDisplay');
    if (!promptDisplay) return;
    currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
    promptDisplay.textContent = prompts[currentPromptIndex];
};

const renderJournal = () => {
    const list = document.getElementById('journalList');
    if (!list) return;
    list.innerHTML = '';
    
    if (journalEntries.length === 0) {
        list.innerHTML = `<p style="font-size: 0.9rem; color: var(--text-muted); font-style: italic;">No logged reflections yet. Your safe history window will generate below.</p>`;
        return;
    }

    journalEntries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'journal-entry-card';
        div.innerHTML = `
            <div class="entry-meta">${entry.date}</div>
            <div class="entry-body">${entry.text}</div>
        `;
        list.appendChild(div);
    });
    localStorage.setItem('gg_journal', JSON.stringify(journalEntries));
};

window.saveJournalEntry = () => {
    const textarea = document.getElementById('journalInput');
    if (!textarea) return;
    const text = textarea.value.trim();
    if (!text) return;

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const todayStr = new Date().toLocaleDateString('en-US', options);

    journalEntries.unshift({
        id: Date.now(),
        date: todayStr,
        text
    });
    textarea.value = '';
    renderJournal();
};

// ==========================================================================
// Time-bound Login Streak Calibration Module
// ==========================================================================
const updateStreak = () => {
    const lastLoginDate = localStorage.getItem('gg_last_login');
    const todayStr = new Date().toDateString();
    const streakLabel = document.getElementById('streakCount');

    if (lastLoginDate !== todayStr) {
        if (lastLoginDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastLoginDate === yesterday.toDateString()) {
                loginStreak += 1;
            } else {
                loginStreak = 1; 
            }
        }
        localStorage.setItem('gg_streak', loginStreak);
        localStorage.setItem('gg_last_login', todayStr);
    }
    if (streakLabel) {
        streakLabel.textContent = loginStreak;
    }
};
