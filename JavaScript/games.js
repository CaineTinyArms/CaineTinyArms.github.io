// games.js - Implements interactive retro-style effects on the Games page

document.addEventListener('DOMContentLoaded', function() {
    // Define game data with details for each game
    const games = {
        game1: {
            title: "shrink",
            description: "Escape from the lab before you shrink too small!",
            image: "../Images/shrink.png",
            tags: ["Action", "Adventure", "Puzzle"],
            playLink: "#game1",
            devRamblingsLink: "../HTML/ramblings/shrink.html"
        },
        game2: {
            title: "The Dwelling Afar",
            description: "Locked in a lonely fishing cabin, use your wits to escape The Dwelling Afar.",
            image: "../Images/dwelling.png",
            tags: ["RPG", "Adventure", "Fantasy"],
            playLink: "#game2",
            devRamblingsLink: "../HTML/ramblings/dwelling.html"
        },
        game3: {
            title: "Contained Cargo",
            description: 'Perform scientific tests on the "cargo". However, whatever you do... keep it contained.',
            image: "../Images/cargo.png",
            tags: ["Shooter", "Arcade", "Sci-Fi"],
            playLink: "#game3",
            devRamblingsLink: "../HTML/ramblings/cargo.html"
        },
        game4: {
            title: "Dall of Cuty",
            description: "Slaughter endless hordes of zombies, while racking up points to upgrade your equipment and escape the cursed lands.",
            image: "../Images/doc.png",
            tags: ["Platformer", "Puzzle", "Pixel Art"],
            playLink: "#game4",
            devRamblingsLink: "../HTML/ramblings/doc.html"
        },
        game5: {
            title: "bergs",
            description: "berg",
            image: "../Images/bergs.png",
            tags: ["berg", "berg", "berg"],
            playLink: "#game5",
            devRamblingsLink: "../HTML/ramblings/bergs.html"
        },
        game6: {
            title: "Sonder: Reflections",
            description: "Take up the role of a taxi driver, listen to the customers conversations and respond accordingly.",
            image: "../Images/sonder.png",
            tags: ["Survival", "Horror", "Action"],
            playLink: "#game6",
            devRamblingsLink: "../HTML/ramblings/sonder.html"
        },
        game7: {
            title: "My Little Balloon Stand",
            description: "Run a little balloon stand. Hey, that robot really likes balloons.",
            image: "../Images/balloon.png",
            tags: ["Puzzle", "Logic", "Casual"],
            playLink: "#game7",
            devRamblingsLink: "../HTML/ramblings/balloon.html"
        },
        game8: {
            title: "Supermarket of the Dead",
            description: "Defend your supermarket from the zombie onslaught, but you better keep scanning those items, the mags aren't free.",
            image: "../Images/sotd.png",
            tags: ["Fighting", "Versus", "Action"],
            playLink: "#game8",
            devRamblingsLink: "../HTML/ramblings/sotd.html"
        },
        game9: {
            title: "Unfinished Puzzle Game.",
            description: "My homage to Resident Evil. Unfinished, unrushed. Ready when it's ready.",
            image: "../Images/fire.png",
            tags: ["Adventure", "Retro", "Open World"],
            playLink: "#game9",
            devRamblingsLink: "../HTML/wordle.html"
        },
        // New games for the second shelf
        game10: {
            title: "Endless Wordle",
            description: "Endless Wordle. Enough Said.",
            image: "../Images/fire.png",
            tags: ["Metroidvania", "Adventure", "Souls-like"],
            playLink: "../HTML/endlesswordle.html",
            devRamblingsLink: "../HTML/wordle.html"
        },
    };

    // Select all game box elements and modal elements for displaying game details
    const gameBoxes = document.querySelectorAll('.game-box');
    const modal = document.getElementById('game-details-modal');
    const closeButton = document.querySelector('.close-button');
    const gameDetailsContent = document.getElementById('game-details-content');

    // Select shelf navigation elements
    const prevShelfButton = document.getElementById('prev-shelf');
    const nextShelfButton = document.getElementById('next-shelf');
    const shelfDots = document.querySelectorAll('.shelf-dot');
    const shelfContainers = document.querySelectorAll('.shelf-container');
    const shelvesWrapper = document.querySelector('.shelves-wrapper');

    // Current shelf index
    let currentShelfIndex = 0;
    const totalShelves = shelfContainers.length;

    // Create VHS static effect element
    const vhsStatic = document.createElement('div');
    vhsStatic.classList.add('vhs-static');
    shelvesWrapper.appendChild(vhsStatic);

    // Flag to prevent multiple animations
    let isAnimating = false;

    // Function to change shelf with a 180° animation (90° + content change + 90°)
    function changeShelf(direction) {
        if (isAnimating) return; // Prevent multiple animations
        isAnimating = true;
        
        // Activate VHS static effect during transition
        vhsStatic.classList.add('active');
        
        // First half of the animation (0° to 90°)
        shelvesWrapper.style.animation = 'spin90First 0.4s ease-in-out forwards';
        
        // When the animation reaches 90 degrees, change the shelf content
        setTimeout(() => {
            // Remove active class from current shelf and dots
            shelfContainers[currentShelfIndex].classList.remove('active');
            shelfDots[currentShelfIndex].classList.remove('active');
            
            // Update current shelf index based on direction
            if (direction === 'next') {
                currentShelfIndex = (currentShelfIndex + 1) % totalShelves;
            } else {
                currentShelfIndex = (currentShelfIndex - 1 + totalShelves) % totalShelves;
            }
            
            // Add active class to new current shelf and dots
            shelfContainers[currentShelfIndex].classList.add('active');
            shelfDots[currentShelfIndex].classList.add('active');
            
            // Start second half of animation (90° to 180°)
            shelvesWrapper.style.animation = 'spin90Second 0.4s ease-in-out forwards';
        }, 400); // Time for first 90° rotation
        
        // After complete animation, clean up
        setTimeout(() => {
            shelvesWrapper.style.animation = '';
            vhsStatic.classList.remove('active');
            isAnimating = false;
        }, 800); // Total animation time
    }

    // Event listeners for shelf navigation buttons
    prevShelfButton.addEventListener('click', function() {
        changeShelf('prev');
    });

    nextShelfButton.addEventListener('click', function() {
        changeShelf('next');
    });

    // Event listeners for shelf indicator dots
    shelfDots.forEach(dot => {
        dot.addEventListener('click', function() {
            if (isAnimating) return; // Prevent clicks during animation
            
            const targetShelf = parseInt(this.getAttribute('data-shelf'));
            
            // Only change if not already on the target shelf
            if (targetShelf !== currentShelfIndex) {
                // Determine direction based on target shelf
                const direction = targetShelf > currentShelfIndex ? 'next' : 'prev';
                changeShelf(direction);
            }
        });
    });

    // Function to display game details in modal
    function showGameDetails(gameId) {
        // Get the selected game data
        const game = games[gameId];
        
        // Generate modal content HTML
        let modalHTML = `
            <h2>${game.title}</h2>
            <div class="game-screenshot">
                <img src="${game.image}" alt="${game.title} Screenshot">
            </div>
            <p class="game-description">${game.description}</p>
            <div class="game-tags">
                ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="button-container">
                <a href="${game.playLink}" class="play-button">PLAY GAME</a>
                <a href="${game.devRamblingsLink}" class="dev-ramblings-button">DEV RAMBLINGS</a>
            </div>
        `;
        
        // Update modal content and display it
        gameDetailsContent.innerHTML = modalHTML;
        modal.style.display = 'block';
        
        // Add a slight delay before fade-in animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    // Event listeners for game boxes
    gameBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game');
            showGameDetails(gameId);
        });
    });

    // Event listener for modal close button
    closeButton.addEventListener('click', function() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    });

    // Event listener to close modal when clicking outside the content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 500);
        }
    });

    // Function to initialize the page
    function initPage() {
        // Make sure first shelf is active
        shelfContainers[0].classList.add('active');
        shelfDots[0].classList.add('active');
    }

    // Initialize the page when content is loaded
    initPage();
});