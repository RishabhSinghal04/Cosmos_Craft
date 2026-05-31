// @ts-check

class Slideshow {
    /**
     * @param {Element} container 
     * @param {HTMLButtonElement} leftArrow 
     * @param {HTMLButtonElement} rightArrow 
     * @param {Element | null} counter 
     */
    constructor(container, leftArrow, rightArrow, counter) {
        this.container = container;
        this.leftArrow = leftArrow;
        this.rightArrow = rightArrow;
        this.counter = counter;
        this.totalSlides = container.querySelectorAll('img').length;
        this.currentIndex = 0;
        this.isScrolling = false;
        this.scrollTimeout = undefined;

        if (this.totalSlides === 0) {
            console.warn("No slides found in container");
            return; // stop setup
        }
        if (!this.leftArrow || !this.rightArrow) {
            console.warn("Navigation arrows not found");
            return;
        }

        this.bindEvents();
        this.goToSlide(0);
    }

    /**
     * Update the counter text to show current slide.
     * @param {number} index - The index of the slide to display.
     */
    updateCounter(index) {
        if (this.counter) this.counter.textContent = `${index + 1} / ${this.totalSlides}`;
    }

    /**
     * Scroll to a given slide index and update state.
     * @param {number} index - The index of the slide to display.
     */
    goToSlide(index) {
        this.isScrolling = true;
        this.container.scrollTo({ left: this.container.clientWidth * index, behavior: 'smooth' });
        this.currentIndex = index;
        this.updateCounter(index);
        setTimeout(() => (this.isScrolling = false), 500);
    }

    /**
     * Handle scroll events to sync counter with manual scrolling. 
     */
    handleScroll() {
        if (this.isScrolling) return;
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            const index = Math.round(this.container.scrollLeft / this.container.clientWidth);
            if (index !== this.currentIndex) {
                this.currentIndex = index;
                this.updateCounter(index);
            }
        }, 50);
    }

    /**
     *  Bind arrow and scroll event listeners.
     */
    bindEvents() {
        this.leftArrow.addEventListener('click', () => this.goToSlide(Math.max(0, this.currentIndex - 1)));
        this.rightArrow.addEventListener('click', () => this.goToSlide(Math.min(this.totalSlides - 1, this.currentIndex + 1)));
        this.container.addEventListener('scroll', () => this.handleScroll());
    }
}

// Usage
const slideshow = document.querySelector('.slideshow-container');
const arrows = /** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('.arrow'));
const counter = document.querySelector('.counter');

if (slideshow && arrows.length === 2) {
    new Slideshow(slideshow, arrows[0], arrows[1], counter);
}
