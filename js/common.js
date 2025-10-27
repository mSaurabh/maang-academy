/**
 * MAANG Pattern Academy - Common JavaScript
 * Shared functionality across all lesson pages
 */

'use strict';

// ============================================
// Solution Toggle Functionality
// ============================================
/**
 * Toggle visibility of a solution element
 * @param {string} id - The ID of the solution element to toggle
 * @param {Event} event - The click event object
 * @returns {void}
 */
function toggleSolution(id, event) {
    const solution = document.getElementById(id);
    if (!solution) {
        console.error(`Solution with id '${id}' not found`);
        return;
    }

    if (!event?.target) {
        console.error('Invalid event object passed to toggleSolution');
        return;
    }

    solution.classList.toggle('show');
    const btn = event.target;
    btn.textContent = solution.classList.contains('show')
        ? 'Hide Solution'
        : 'Show Solution';
}

// ============================================
// Progress Tracking
// ============================================
const ProgressTracker = {
    /**
     * Get current progress from localStorage
     * @returns {{completedDays: number[], patternsLearned: number, problemsSolved: number}} Progress object
     */
    getProgress() {
        try {
            const storedProgress = localStorage.getItem('maangProgress');
            if (storedProgress) {
                const parsed = JSON.parse(storedProgress);
                // Validate structure
                return {
                    completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays : [],
                    patternsLearned: typeof parsed.patternsLearned === 'number' ? parsed.patternsLearned : 0,
                    problemsSolved: typeof parsed.problemsSolved === 'number' ? parsed.problemsSolved : 0
                };
            }
        } catch (error) {
            console.error('Error parsing progress from localStorage:', error);
        }

        // Return default structure
        return {
            completedDays: [],
            patternsLearned: 0,
            problemsSolved: 0
        };
    },

    /**
     * Save progress to localStorage
     * @param {{completedDays: number[], patternsLearned: number, problemsSolved: number}} progress - Progress object to save
     * @returns {boolean} True if saved successfully, false otherwise
     */
    saveProgress(progress) {
        try {
            localStorage.setItem('maangProgress', JSON.stringify(progress));
            return true;
        } catch (error) {
            console.error('Error saving progress to localStorage:', error);
            return false;
        }
    },

    /**
     * Mark a day as completed
     * @param {number} dayNumber - The day number (1, 2, 3, etc.)
     * @param {number} [patternsCount=1] - Number of patterns learned in this day
     * @param {number} [problemsCount=0] - Number of problems in this day
     * @returns {boolean} True if day was newly completed, false if already completed
     */
    markDayComplete(dayNumber, patternsCount = 1, problemsCount = 0) {
        // Validate inputs
        if (typeof dayNumber !== 'number' || dayNumber < 1) {
            console.error('Invalid dayNumber:', dayNumber);
            return false;
        }

        const progress = this.getProgress();

        // Check if day is already completed
        if (progress.completedDays.includes(dayNumber)) {
            return false;
        }

        // Mark day as complete
        progress.completedDays.push(dayNumber);

        // Accumulate patterns and problems (not max, but total)
        progress.patternsLearned = Math.max(progress.patternsLearned, patternsCount);
        progress.problemsSolved = Math.max(progress.problemsSolved, problemsCount);

        this.saveProgress(progress);
        return true;
    },

    /**
     * Check if a day is completed
     * @param {number} dayNumber - The day number to check
     * @returns {boolean} True if day is completed, false otherwise
     */
    isDayCompleted(dayNumber) {
        const progress = this.getProgress();
        return progress.completedDays.includes(dayNumber);
    },

    /**
     * Reset all progress (useful for testing)
     * @returns {void}
     */
    resetProgress() {
        try {
            localStorage.removeItem('maangProgress');
        } catch (error) {
            console.error('Error resetting progress:', error);
        }
    }
};

// ============================================
// Smooth Scrolling for Navigation
// ============================================
/**
 * Initialize smooth scrolling for anchor links
 * @returns {void}
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    for (const anchor of anchorLinks) {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const href = anchor.getAttribute('href');

            if (!href || href === '#') {
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// ============================================
// Auto-Initialize on Page Load
// ============================================
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // Initialize smooth scrolling if there are anchor links
        const hasAnchorLinks = document.querySelector('a[href^="#"]');
        if (hasAnchorLinks) {
            initSmoothScroll();
        }
    });
}

// ============================================
// Module Exports (for CommonJS/Node.js)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleSolution,
        ProgressTracker,
        initSmoothScroll
    };
}
