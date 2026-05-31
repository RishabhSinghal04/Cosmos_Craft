// @ts-check

/**
 * Highlights matched text in a string.
 * @param {string} text
 * @param {string} query
 * @returns {string}
 */
function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Gets all searchable items from the gallery.
 * @returns {Array<{title: string, desc: string, tags: string, img: string, element: Element}>}
 */
function getSearchableItems() {
    const selectors = ['.gallery-box[data-title]', '.event[data-title]'];
    const items = selectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
    return Array.from(items).map(item => ({
        title: item.getAttribute('data-title') || '',
        desc: item.querySelector('p')?.textContent || '',
        tags: item.getAttribute('data-tags') || '',
        img: item.querySelector('img')?.src || '',
        element: item
    }));
}

/**
 * @typedef {Object} SearchResult
 * @property {string} title
 * @property {string} desc
 * @property {string} tags
 * @property {string} img
 * @property {Element} element
 */

/**
 * Searches items based on query.
 * @param {string} query
 * @returns {Array<SearchResult>}
 */
function searchItems(query) {
    if (!query.trim()) return [];
    const items = getSearchableItems();
    const q = query.toLowerCase();

    return items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.tags.toLowerCase().includes(q)
    );
}

/**
 * Renders search results into dropdown.
 * @param {Array<SearchResult>} results
 * @param {string} query
 */
function renderResults(results, query) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (results.length === 0) {
        container.innerHTML = `<div class="search-no-results">No results for "${query}"</div>`;
        container.classList.add('visible');
        return;
    }

    container.innerHTML = results.map(item => `
        <div class="search-result-item" data-title="${item.title}">
          <img src="${item.img}" alt="${item.title}">
          <div class="search-result-text">
            <span class="search-result-title">
              ${highlightMatch(item.title, query)}
            </span>
            <span class="search-result-desc">
              ${highlightMatch(item.desc, query)}
            </span>
          </div>
        </div>
    `).join('');

    container.classList.add('visible');

    // Click on result: scroll to item and close search
    container.querySelectorAll('.search-result-item').forEach(resultEl => {
        resultEl.addEventListener('click', () => {
            const title = resultEl.getAttribute('data-title');
            const matchedItem = getSearchableItems().find(i => i.title === title);
            if (matchedItem) {
                matchedItem.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                matchedItem.element.classList.add('highlight'); // Optional: highlight the box
                setTimeout(() => matchedItem.element.classList.remove('highlight'), 2000);
            }
            closeSearch();
        });
    });
}

function closeSearch() {
    const searchBox = document.getElementById('searchBox');
    const searchInput = /** @type {HTMLInputElement | null} */ (document.getElementById('searchInput'));
    const searchResults = document.getElementById('searchResults');
    const nav = document.querySelector('nav');

    searchBox?.classList.remove('expanded');
    nav?.classList.remove('search-active');
    searchResults?.classList.remove('visible');
    if (searchInput) searchInput.value = '';
}

function setupSearchBar() {
    const searchBox = document.getElementById('searchBox');
    const input = /** @type {HTMLInputElement | null} */ (document.getElementById('searchInput'));
    const cancelBtn = document.getElementById('cancelBtn');
    const searchResults = document.getElementById('searchResults');
    const nav = document.querySelector('nav');

    if (!searchBox || !input) return;

    // Expand search box on click
    searchBox.addEventListener('click', (e) => {
        if (e.target === cancelBtn) return;
        searchBox.classList.add('expanded');
        nav?.classList.add('search-active');
        input.focus();
    });

    // Cancel button
    cancelBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSearch();
    });

    // Search on input
    input.addEventListener('input', () => {
        const query = input.value.trim();

        if (!query) {
            searchResults?.classList.remove('visible');
            return;
        }

        const results = searchItems(query);
        renderResults(results, query);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchBox.closest('.search-container')?.contains(/** @type {Node} */(e.target))) {
            closeSearch();
        }
    });
}

function calcExpandedSearchBoxWidth() {
    const navCenterToggle = document.getElementById("menuToggle");
    const navBar = document.querySelector("nav");
    const navLeft = document.querySelector(".nav-left");
    const navRight = document.querySelector(".nav-right");
    const searchBox = document.querySelector(".search-box");

    /**
     * Get the full width of an element including margins.
     * @param {Element | null} el
     * @returns {number}
     */
    function getOuterWidth(el) {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const marginLeft = parseFloat(style.marginLeft) || 0;
        const marginRight = parseFloat(style.marginRight) || 0;
        return rect.width + marginLeft + marginRight;
    }

    function updateWidth() {
        if (!navBar || !searchBox) return;

        const width = window.innerWidth;
        const navBarRect = navBar.getBoundingClientRect();
        const navBarWidth = navBarRect.width;

        // Get navbar padding
        const navStyle = getComputedStyle(navBar);
        const navPaddingLeft = parseFloat(navStyle.paddingLeft) || 0;
        const navPaddingRight = parseFloat(navStyle.paddingRight) || 0;

        // Left side element depends on screen size
        const leftSideElement = (width > 768) ? navLeft : navCenterToggle;
        const leftSideWidth = getOuterWidth(leftSideElement);

        // Right side EXCLUDING search
        const rightItems = Array.from(navRight?.querySelectorAll("li") || [])
            .filter(li => !li.classList.contains("search-container"));
        const rightWidthWithoutSearch = rightItems.reduce(
            (sum, li) => sum + getOuterWidth(li), 0
        );

        // Get all gaps in the ul
        const ul = navBar.querySelector(".nav-right ul");
        let totalGap = 0;
        if (ul) {
            const navStyle = getComputedStyle(ul);
            const gap = parseFloat(navStyle.gap) || 0;
            const itemCount = rightItems.length + 1; // +1 for search container
            totalGap = gap * (itemCount - 1);
        }

        // Search box padding and border
        const searchStyle = getComputedStyle(searchBox);
        const searchPadding =
            (parseFloat(searchStyle.paddingLeft) || 0) +
            (parseFloat(searchStyle.paddingRight) || 0);
        const searchBorder =
            (parseFloat(searchStyle.borderLeftWidth) || 0) +
            (parseFloat(searchStyle.borderRightWidth) || 0);

        // Calculate available width with safety margin
        const safetyMargin = 40; // Extra space to prevent overlap
        const dynamicWidth = navBarWidth -
            leftSideWidth -
            rightWidthWithoutSearch -
            navPaddingLeft -
            navPaddingRight -
            totalGap -
            searchPadding -
            searchBorder -
            safetyMargin;

        // Clamp to reasonable values
        const finalWidth = Math.max(140, dynamicWidth);

        document.documentElement.style.setProperty("--dynamic-width", `${finalWidth}px`);

        console.log(
            "\nNavbar width =", navBarWidth,
            "\nLeft Width (with margins/padding) =", leftSideWidth,
            "\nRight Width without search (with margins/padding) =", rightWidthWithoutSearch,
            "\nDynamic Width =", dynamicWidth,
            "\nSerach Box Width =", document.querySelector(".search-box")?.getBoundingClientRect().width
        );
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);
}

calcExpandedSearchBoxWidth()
setupSearchBar();
