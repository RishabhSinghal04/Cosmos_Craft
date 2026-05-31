// @ts-check

/**
 * Attach preview behavior to a gallery box
 * @param {Element} galleryBox 
 */
function galleryBoxPreview(galleryBox) {
    if (!galleryBox) return;

    galleryBox.addEventListener('click', () => {
        const modal = document.getElementById('gallery-modal');
        if (!modal) return;

        const modalImage = document.getElementById('gallery-modal-image');
        const modalText = document.getElementById('gallery-modal-text');

        // Get image and text from clicked box
        const imgEl = galleryBox.querySelector('img');
        const textEl = galleryBox.querySelector('.gallery-box-text');

        if (modalImage instanceof HTMLImageElement && imgEl instanceof HTMLImageElement) {
            modalImage.src = imgEl.src;
        }
        if (modalText && textEl) {
            modalText.innerHTML = textEl.innerHTML;
        }

        modal.style.display = 'flex'; // Show modal
    });
}

// Close modal (X button)
const closeBtn = document.querySelector('.gallery-modal-close');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('gallery-modal');
        if (modal) modal.style.display = 'none';
    });
}

// Close when clicking outside content
const modal = document.getElementById('gallery-modal');
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Attach preview to all gallery boxes
const galleryBoxes = document.querySelectorAll('.gallery-box');
if (galleryBoxes.length > 0) {
    galleryBoxes.forEach(galleryBoxPreview);
}