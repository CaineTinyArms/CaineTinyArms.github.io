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
            image: "../Images/fire.png",
            tags: ["RPG", "Adventure", "Fantasy"],
            playLink: "#game2",
            devRamblingsLink: "../HTML/ramblings/dwelling.html"
        },
        game3: {
            title: "Contained Cargo",
            description: 'Perform scientific tests on the "cargo". However, whatever you do... keep it contained.',
            image: "../Images/fire.png",
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
            image: "../Images/fire.png",
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
            image: "../Images/fire.png",
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
        }
    };

    // Select all game box elements and modal elements for displaying game details
    const gameBoxes = document.querySelectorAll('.game-box');
    const modal = document.getElementById('game-details-modal');
    const closeButton = document.querySelector('.close-button');
    const gameDetailsContent = document.getElementById('game-details-content');

    // When a game box is clicked, populate and show the modal with game details
    gameBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game');
            const game = games[gameId];
            
            // Update modal inner HTML with game details
            gameDetailsContent.innerHTML = `
                <h2>${game.title}</h2>
                <div class="game-screenshot">
                    <img src="${game.image}" alt="${game.title}">
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
            
            // Display the modal with a retro VHS effect
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Create and add a temporary VHS scan effect overlay
            const vhsEffect = document.createElement('div');
            vhsEffect.classList.add('vhs-effect');
            modal.appendChild(vhsEffect);
            
            // Remove the VHS effect after its animation completes
            setTimeout(() => {
                if (modal.contains(vhsEffect)) {
                    modal.removeChild(vhsEffect);
                }
            }, 1000);
        });
    });

    // Close the modal when the close button is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add a retro scan line effect when hovering over game boxes
    gameBoxes.forEach(box => {
        box.addEventListener('mouseover', function() {
            const scanLine = document.createElement('div');
            scanLine.classList.add('scan-line');
            this.appendChild(scanLine);
            setTimeout(() => {
                if (this.contains(scanLine)) {
                    this.removeChild(scanLine);
                }
            }, 300);
        });
    });
    
    // Add a page-load animation effect
    document.body.classList.add('page-load');
    setTimeout(() => {
        document.body.classList.remove('page-load');
    }, 1000);
    
    // Dynamically add CSS for VHS and scan line effects as well as styling for buttons
    const style = document.createElement('style');
    style.textContent = `
        /* Set font family for all text elements */
        body, h1, h2, h3, p, div, span, a, button, input, textarea, .game-description, .game-title, .tag {
            font-family: "Comic Sans MS", cursive, sans-serif !important;
        }
        
        /* Override specific fonts for headers and buttons */
        .blockbuster-header h1, #game-details-content h2, .play-button, .dev-ramblings-button {
            font-family: "Comic Sans MS", cursive, sans-serif !important;
        }
        
        /* Scan line effect styling */
        .scan-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: rgba(255, 255, 255, 0.3);
            animation: scanAnimation 0.3s linear forwards;
        }
        
        @keyframes scanAnimation {
            0% { top: 0; }
            100% { top: 100%; }
        }
        
        /* VHS effect overlay styling */
        .vhs-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                rgba(50, 50, 50, 0) 0%,
                rgba(50, 50, 50, 0.2) 50%,
                rgba(50, 50, 50, 0) 100%
            );
            background-size: 100% 2px;
            animation: vhsAnimation 0.5s linear forwards;
            pointer-events: none;
        }
        
        @keyframes vhsAnimation {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        
        /* Page load fade-in effect */
        .page-load {
            animation: pageLoadAnimation 1s ease-out;
        }
        
        @keyframes pageLoadAnimation {
            0% { opacity: 0; }
            20% { opacity: 0.2; }
            40% { opacity: 0.4; }
            60% { opacity: 0.6; }
            80% { opacity: 0.8; }
            100% { opacity: 1; }
        }

        /* Container for buttons in the modal */
        .button-container {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }

        /* Styling for the dev ramblings button */
        .dev-ramblings-button {
            display: inline-block;
            background-color: #ff5500;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            font-weight: bold;
            border: 2px solid #000;
            text-transform: uppercase;
            transition: all 0.3s ease;
        }

        .dev-ramblings-button:hover {
            background-color: #ff8800;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);
});
