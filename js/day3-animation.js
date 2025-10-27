/**
 * Day 3: Floyd's Cycle Detection Animation
 * Visualizes the tortoise and hare algorithm for cycle detection
 */

// Animation state
const cycleAnimationState = {
    canvas: null,
    ctx: null,
    animating: false,
    hasCycle: true,
    slowPos: 0,
    fastPos: 0,
    animationStep: 0,
    meetingPoint: -1,
    nodes: [
        { x: 100, y: 200, val: 1 },
        { x: 200, y: 200, val: 2 },
        { x: 300, y: 200, val: 3 },
        { x: 400, y: 200, val: 4 },
        { x: 500, y: 150, val: 5 },
        { x: 600, y: 200, val: 6 },
        { x: 500, y: 250, val: 7 },
        { x: 400, y: 250, val: 8 }
    ],
    cycleStartIndex: 2 // Cycle starts at node 3
};

/**
 * Initialize the cycle detection animation
 */
function initCycleAnimation() {
    const canvas = document.getElementById('cycleCanvas');
    if (!canvas) {
        console.error('Canvas element #cycleCanvas not found');
        return;
    }

    cycleAnimationState.canvas = canvas;
    cycleAnimationState.ctx = canvas.getContext('2d');

    // Initial draw
    drawCycleList();
}

/**
 * Draw a node on the canvas
 */
function drawNode(x, y, value, color = '#667eea', label = '') {
    const { ctx } = cycleAnimationState;

    // Draw circle
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw value
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(value, x, y);

    // Draw label
    if (label) {
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Arial';
        ctx.fillText(label, x, y + 50);
    }
}

/**
 * Draw an arrow between two points
 */
function drawArrow(fromX, fromY, toX, toY, curved = false) {
    const { ctx } = cycleAnimationState;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();

    if (curved) {
        // Draw curved arrow for cycle
        const midX = (fromX + toX) / 2;
        const midY = Math.max(fromY, toY) + 60;
        ctx.moveTo(fromX, fromY);
        ctx.quadraticCurveTo(midX, midY, toX, toY);
    } else {
        // Draw straight arrow
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
    }
    ctx.stroke();

    // Draw arrowhead
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - 10 * Math.cos(angle - Math.PI / 6), toY - 10 * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - 10 * Math.cos(angle + Math.PI / 6), toY - 10 * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = '#333';
    ctx.fill();
}

/**
 * Draw the complete linked list with current pointer positions
 */
function drawCycleList() {
    const { ctx, canvas, nodes, hasCycle, cycleStartIndex, slowPos, fastPos, meetingPoint, animationStep } = cycleAnimationState;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(hasCycle ? 'Linked List with Cycle' : 'Linked List without Cycle', canvas.width / 2, 30);

    // Draw arrows first
    for (let i = 0; i < nodes.length - 1; i++) {
        const from = nodes[i];
        const to = nodes[i + 1];
        drawArrow(from.x + 20, from.y, to.x - 20, to.y);
    }

    // Draw cycle arrow if enabled
    if (hasCycle) {
        const lastNode = nodes[nodes.length - 1];
        const cycleStart = nodes[cycleStartIndex];
        drawArrow(lastNode.x, lastNode.y + 20, cycleStart.x, cycleStart.y + 20, true);
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        let color = '#667eea';
        let label = '';

        // Highlight pointers
        if (i === slowPos && i === fastPos && meetingPoint === -1) {
            color = '#9b59b6';
            label = '🐢🐰';
        } else if (i === slowPos) {
            color = '#ff6b6b';
            label = '🐢 Slow';
        } else if (i === fastPos) {
            color = '#4facfe';
            label = '🐰 Fast';
        }

        if (meetingPoint !== -1 && i === meetingPoint) {
            color = '#27ae60';
            label = '🎯 MEET!';
        }

        drawNode(node.x, node.y, node.val, color, label);
    }

    // Draw status
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Step: ${animationStep}`, 20, 360);
    ctx.fillText(`Slow: Node ${nodes[slowPos].val}`, 20, 380);
    ctx.fillText(`Fast: Node ${nodes[fastPos].val}`, 200, 380);
}

/**
 * Animation frame - executes one step of the algorithm
 */
function cycleAnimationFrame() {
    const state = cycleAnimationState;

    if (!state.animating || state.meetingPoint !== -1) return;

    state.animationStep++;

    // Move slow pointer (1 step)
    if (state.hasCycle || state.slowPos < state.nodes.length - 1) {
        state.slowPos = (state.slowPos + 1) % state.nodes.length;
    }

    // Move fast pointer (2 steps)
    for (let i = 0; i < 2; i++) {
        if (!state.hasCycle && state.fastPos >= state.nodes.length - 1) {
            // Reached end, no cycle
            state.animating = false;
            updateAnimationStatus('✅ No cycle detected - Fast pointer reached the end!', '#27ae60');
            break;
        } else if (state.hasCycle) {
            state.fastPos = (state.fastPos + 1) % state.nodes.length;
        } else {
            state.fastPos++;
        }
    }

    // Check if pointers meet
    if (state.hasCycle && state.slowPos === state.fastPos && state.animationStep > 0) {
        state.meetingPoint = state.slowPos;
        state.animating = false;
        updateAnimationStatus('🔄 Cycle detected - Pointers met!', '#e74c3c');
    }

    drawCycleList();

    if (state.animating) {
        setTimeout(cycleAnimationFrame, 1000);
    }
}

/**
 * Update animation status message
 */
function updateAnimationStatus(text, color) {
    const statusEl = document.getElementById('animationStatus');
    if (statusEl) {
        statusEl.textContent = text;
        statusEl.style.color = color;
    }
}

/**
 * Start the animation
 */
function startAnimation() {
    const state = cycleAnimationState;

    if (state.animating) return;

    // Reset if animation already completed
    if (state.meetingPoint !== -1 || (!state.hasCycle && state.fastPos >= state.nodes.length - 1)) {
        resetAnimation();
    }

    state.animating = true;
    updateAnimationStatus('Animation running...', '#667eea');
    cycleAnimationFrame();
}

/**
 * Reset animation to initial state
 */
function resetAnimation() {
    const state = cycleAnimationState;

    state.animating = false;
    state.slowPos = 0;
    state.fastPos = 0;
    state.animationStep = 0;
    state.meetingPoint = -1;

    updateAnimationStatus('Ready to start', '#667eea');
    drawCycleList();
}

/**
 * Toggle cycle on/off
 */
function toggleCycle() {
    cycleAnimationState.hasCycle = !cycleAnimationState.hasCycle;
    resetAnimation();
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initCycleAnimation();
    });
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCycleAnimation,
        startAnimation,
        resetAnimation,
        toggleCycle
    };
}
