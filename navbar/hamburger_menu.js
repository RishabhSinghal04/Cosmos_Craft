// @ts-check

/**
 * Toggle navigation menu open/close and handle outside clicks.
 * @param {Element | null} toggle 
 * @param {Element | null} navCenter 
 */
function menuToggle(toggle, navCenter) {
    if (!toggle || !navCenter) {
        document.body.insertAdjacentHTML('beforeend', '<p>Menu toggle or nav center not found</p>');
        return;
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent outside click handler from firing
        toggle.classList.toggle('active');
        navCenter.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-center a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navCenter.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target instanceof Element && !target.closest('nav')) {
            toggle.classList.remove('active');
            navCenter.classList.remove('active');
        }
    });
}

const toggle = document.querySelector('.menu-toggle');
const navCenter = document.querySelector('.nav-center');
menuToggle(toggle, navCenter);