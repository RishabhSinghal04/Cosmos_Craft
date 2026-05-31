// @ts-check

/**
 * Toggle dark theme on body when clicking the toggle button.
 * @param {Element | null} themeToggle - Theme toggle button element
*/
function switchTheme(themeToggle) {
    if (!themeToggle) {
        console.warn("Theme toggle not found");
        return;
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
    }

    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        document.body.classList.toggle('dark-theme');

        // Save preference
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

const themeToggle = document.querySelector('.theme-toggle');
switchTheme(themeToggle)