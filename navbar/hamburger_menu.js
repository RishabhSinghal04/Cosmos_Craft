// @ts-check

/**
 * Toggle navigation menu open/close and handle outside clicks.
 * @param {HTMLElement | null} toggle 
 * @param {HTMLElement | null} navCenter 
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

/**
 * @param {HTMLElement | null} nav
 * @param {HTMLElement | null} navCenter
 */
function updateNavHeight(nav, navCenter) {
    if (!nav || !navCenter) { return; }
    const height = nav.offsetHeight + "px";
    navCenter.style.top = height;
}

/**@type {HTMLElement | null} */
const nav = document.querySelector("nav");
/**@type {HTMLElement | null} */
const toggle = document.querySelector('.menu-toggle');
/**@type {HTMLElement | null} */
const navCenter = document.querySelector('.nav-center');
menuToggle(toggle, navCenter);

window.addEventListener("resize", () => updateNavHeight(nav, navCenter));
updateNavHeight(nav, navCenter);