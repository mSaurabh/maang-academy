/**
 * Day 2: Container With Most Water Animation
 * Visualizes the two-pointer approach for finding maximum container area
 */

// Animation state
let animationState = {
    canvas: null,
    ctx: null,
    heights: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    left: 0,
    right: 0,
    maxWater: 0,
    steps: 0,
    isAnimating: false
};

/**
 * Initialize the animation
 */
function initContainerAnimation() {
    animationState.canvas = document.getElementById("canvas");
    if (!animationState.canvas) {
        console.error('Canvas element not found');
        return;
    }

    animationState.ctx = animationState.canvas.getContext("2d");
    animationState.right = animationState.heights.length - 1;

    // Attach event listeners
    const playBtn = document.getElementById("playBtn");
    const resetBtn = document.getElementById("resetBtn");

    if (playBtn) {
        playBtn.addEventListener("click", animateContainer);
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", resetContainer);
    }

    // Initial draw
    resetContainer();
}

/**
 * Draw the current state of the container visualization
 */
function drawContainer() {
    const { ctx, canvas, heights, left, right, maxWater, steps } = animationState;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = 60;
    const spacing = 15;
    const startX = 40;
    const baseY = 300;
    const scale = 25;

    // Draw bars
    for (let i = 0; i < heights.length; i++) {
        const x = startX + i * (barWidth + spacing);
        const h = heights[i] * scale;

        // Bar color: green for left pointer, red for right pointer, blue for others
        ctx.fillStyle = i === left ? "#4CAF50" : i === right ? "#F44336" : "#90CAF9";
        ctx.fillRect(x, baseY - h, barWidth, h);

        // Height number on top of bar
        ctx.fillStyle = "#333";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(heights[i], x + barWidth / 2, baseY - h - 8);

        // Pointer labels
        if (i === left || i === right) {
            ctx.fillStyle = i === left ? "#2E7D32" : "#C62828";
            ctx.font = "bold 16px Arial";
            ctx.fillText(i === left ? "L" : "R", x + barWidth / 2, baseY + 20);
        }
    }

    // Draw water area
    if (left < right) {
        const minH = Math.min(heights[left], heights[right]);
        const leftX = startX + left * (barWidth + spacing);
        const rightX = startX + right * (barWidth + spacing);
        const width = rightX - leftX;
        const waterH = minH * scale;

        // Water fill
        ctx.fillStyle = "rgba(33,150,243,0.3)";
        ctx.fillRect(leftX, baseY - waterH, width + barWidth, waterH);

        // Area calculation
        const area = minH * (right - left);
        ctx.fillStyle = "#1976D2";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Area = " + area, (leftX + rightX + barWidth) / 2, baseY - waterH / 2);

        // Update UI elements
        const currentEl = document.getElementById("current");
        const maxEl = document.getElementById("max");

        if (currentEl) currentEl.textContent = area;

        animationState.maxWater = Math.max(maxWater, area);
        if (maxEl) maxEl.textContent = animationState.maxWater;
    }

    // Update steps counter
    const stepsEl = document.getElementById("steps");
    if (stepsEl) stepsEl.textContent = steps;
}

/**
 * Animate the two-pointer algorithm
 */
async function animateContainer() {
    if (animationState.isAnimating) return;

    animationState.isAnimating = true;
    const playBtn = document.getElementById("playBtn");
    if (playBtn) playBtn.disabled = true;

    while (animationState.left < animationState.right) {
        drawContainer();
        await new Promise(resolve => setTimeout(resolve, 1000));

        animationState.steps++;

        // Move pointer: if left height is smaller, move left; otherwise move right
        if (animationState.heights[animationState.left] < animationState.heights[animationState.right]) {
            animationState.left++;
        } else {
            animationState.right--;
        }
    }

    drawContainer();
    animationState.isAnimating = false;

    if (playBtn) {
        playBtn.disabled = false;
        playBtn.textContent = "✅ Done";
    }
}

/**
 * Reset the animation to initial state
 */
function resetContainer() {
    animationState.left = 0;
    animationState.right = animationState.heights.length - 1;
    animationState.maxWater = 0;
    animationState.steps = 0;
    animationState.isAnimating = false;

    const playBtn = document.getElementById("playBtn");
    if (playBtn) {
        playBtn.disabled = false;
        playBtn.textContent = "▶️ Play";
    }

    drawContainer();
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initContainerAnimation);
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initContainerAnimation,
        animateContainer,
        resetContainer
    };
}
