// games.js - 90s Blockbuster Style Interaction

document.addEventListener('DOMContentLoaded', function() {
    // Game data - replace with your actual game data
    const games = {
        game1: {
            title: "shrink",
            description: "Escape from the lab before you shrink too small!",
            image: "../Images/shrink.png",
            tags: ["Action", "Adventure", "Puzzle"],
            playLink: "#game1",
            devRamblingsLink: "../HTML/ramblings/shrink.html" // Updated link
        },
        game2: {
            title: "The Dwelling Afar",
            description: "Locked in a lonely fishing cabin, use your wits to escape The Dwelling Afar.",
            image: "../Images/fire.png",
            tags: ["RPG", "Adventure", "Fantasy"],
            playLink: "#game2",
            devRamblingsLink: "../HTML/ramblings/dwelling.html" // Updated link
        },
        game3: {
            title: "Contained Cargo",
            description: 'Perform scientific tests on the "cargo". However, whatever you do... keep it contained.',
            image: "../Images/fire.png",
            tags: ["Shooter", "Arcade", "Sci-Fi"],
            playLink: "#game3",
            devRamblingsLink: "../HTML/ramblings/cargo.html" // Updated link
        },
        game4: {
            title: "Dall of Cuty",
            description: "Slaughter endless hordes of zombies, while racking up points to upgrade your equipment and escape the cursed lands.",
            image: "../Images/doc.png",
            tags: ["Platformer", "Puzzle", "Pixel Art"],
            playLink: "#game4",
            devRamblingsLink: "../HTML/ramblings/doc.html" // Updated link
        },
        game5: {
            title: "bergs",
            description: "berg",
            image: "../Images/fire.png",
            tags: ["berg", "berg", "berg"],
            playLink: "#game5",
            devRamblingsLink: "../HTML/ramblings/bergs.html" // Updated link
        },
        game6: {
            title: "Sonder: Reflections",
            description: "Take up the role of a taxi driver, listen to the customers conversations and respond accordingly.",
            image: "../Images/sonder.png",
            tags: ["Survival", "Horror", "Action"],
            playLink: "#game6",
            devRamblingsLink: "../HTML/ramblings/sonder.html" // Updated link
        },
        game7: {
            title: "My Little Balloon Stand",
            description: "Run a little balloon stand. Hey, that robot really likes balloons.",
            image: "../Images/fire.png",
            tags: ["Puzzle", "Logic", "Casual"],
            playLink: "#game7",
            devRamblingsLink: "../HTML/ramblings/balloon.html" // Updated link
        },
        game8: {
            title: "Supermarket of the Dead",
            description: "Defend your supermarket from the zombie onslaught, but you better keep scanning those items, the mags aren't free.",
            image: "../Images/sotd.png",
            tags: ["Fighting", "Versus", "Action"],
            playLink: "#game8",
            devRamblingsLink: "../HTML/ramblings/sotd.html" // Updated link
        },
        game9: {
            title: "Unfinished Puzzle Game.",
            description: "My homage to Resident Evil. Unfinished, unrushed. Ready when it's ready.",
            image: "../Images/fire.png",
            tags: ["Adventure", "Retro", "Open World"],
            playLink: "#game9",
            devRamblingsLink: "../HTML/wordle.html" // Updated link
        }
    };

    // Game box click event
    const gameBoxes = document.querySelectorAll('.game-box');
    const modal = document.getElementById('game-details-modal');
    const closeButton = document.querySelector('.close-button');
    const gameDetailsContent = document.getElementById('game-details-content');

    gameBoxes.forEach(box => {
        box.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game');
            const game = games[gameId];
            
            // Update modal content
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
            
            // Show modal with retro VHS effect
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Add VHS scan effect
            const vhsEffect = document.createElement('div');
            vhsEffect.classList.add('vhs-effect');
            modal.appendChild(vhsEffect);
            
            // Remove VHS effect after animation
            setTimeout(() => {
                if (modal.contains(vhsEffect)) {
                    modal.removeChild(vhsEffect);
                }
            }, 1000);
        });
    });

    // Close modal when clicking X
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add retro hover effect to game boxes
    gameBoxes.forEach(box => {
        box.addEventListener('mouseover', function() {
            // Add VHS scan line effect
            const scanLine = document.createElement('div');
            scanLine.classList.add('scan-line');
            this.appendChild(scanLine);
            
            // Remove scan line after animation
            setTimeout(() => {
                if (this.contains(scanLine)) {
                    this.removeChild(scanLine);
                }
            }, 300);
        });
    });
    
    // Add some retro animation to the page load
    document.body.classList.add('page-load');
    setTimeout(() => {
        document.body.classList.remove('page-load');
    }, 1000);
    
    // Add CSS for the VHS and scan line effects, the new button, and Comic Sans font
    const style = document.createElement('style');
    style.textContent = `
        /* Change all font to Comic Sans */
        body, h1, h2, h3, p, div, span, a, button, input, textarea, .game-description, .game-title, .tag {
            font-family: "Comic Sans MS", cursive, sans-serif !important;
        }
        
        /* Override any specific font settings */
        .blockbuster-header h1, #game-details-content h2, .play-button, .dev-ramblings-button {
            font-family: "Comic Sans MS", cursive, sans-serif !important;
        }
        
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

        .button-container {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }

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