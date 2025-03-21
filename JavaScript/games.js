// games.js - Implements interactive retro-style effects on the Games page

document.addEventListener('DOMContentLoaded', function() {
    // Define game data with details for each game
    const games = {
        game1: {
            title: "shrink",
            description: "Escape from the lab before you shrink too small!",
            images: [
                "../Images/shrink/screen1.PNG", 
                "../Images/shrink/screen2.PNG", 
                "../Images/shrink/screen3.PNG",
                "../Images/shrink/shrink.gif"
            ],
            tags: ["Action", "Adventure", "Puzzle"],
            playLink: "https://cainetinyarms.itch.io/shrink",
            devRamblingsLink: "../HTML/ramblings/shrink.html"
        },
        game2: {
            title: "The Dwelling Afar",
            description: "Locked in a lonely fishing cabin, use your wits to escape The Dwelling Afar.",
            images: [
                "../Images/dwelling/screen1.PNG", 
                "../Images/dwelling/screen2.PNG", 
                "../Images/dwelling/screen3.PNG",
                "../Images/dwelling/dwelling.gif",
            ],
            tags: ["RPG", "Adventure", "Fantasy"],
            playLink: "https://cainetinyarms.itch.io/the-dwelling-afar",
            devRamblingsLink: "../HTML/ramblings/dwelling.html"
        },
        game3: {
            title: "Contained Cargo",
            description: 'Perform scientific tests on the "cargo". However, whatever you do... keep it contained.',
            images: [
                "../Images/cargo/screen1.PNG", 
                "../Images/cargo/screen2.PNG", 
                "../Images/cargo/screen3.PNG",
                "../Images/cargo/cargo.gif",
            ],
            tags: ["Shooter", "Arcade", "Sci-Fi"],
            playLink: "https://burnttoastdev.itch.io/contained-cargo",
            devRamblingsLink: "../HTML/ramblings/cargo.html"
        },
        game4: {
            title: "Dall of Cuty",
            description: "Slaughter endless hordes of zombies, while racking up points to upgrade your equipment and escape the cursed lands.",
            images: [
                "../Images/doc/screen1.PNG", 
                "../Images/doc/screen2.PNG", 
                "../Images/doc/screen3.PNG",
                "../Images/doc/doc.gif",
            ],
            tags: ["Platformer", "Puzzle", "Pixel Art"],
            playLink: "https://cainetinyarms.itch.io/dall-of-cuty",
            devRamblingsLink: "../HTML/ramblings/doc.html"
        },
        game5: {
            title: "bergs",
            description: "berg",
            images: [
                "../Images/bergs/screen1.PNG", 
                "../Images/bergs/screen2.PNG", 
                "../Images/bergs/screen3.PNG",
                "../Images/bergs/bergs.gif",
            ],
            tags: ["berg", "berg", "berg"],
            playLink: "https://www.newgrounds.com/portal/view/928130",
            devRamblingsLink: "../HTML/ramblings/bergs.html"
        },
        game6: {
            title: "Sonder: Reflections",
            description: "Take up the role of a taxi driver, listen to the customers conversations and respond accordingly.",
            images: [
                "../Images/sonder/screen1.PNG", 
                "../Images/sonder/screen2.PNG", 
                "../Images/sonder/sonder.gif",
            ],
            tags: ["Survival", "Horror", "Action"],
            playLink: "https://cainetinyarms.itch.io/sonder-reflections",
            devRamblingsLink: "../HTML/ramblings/sonder.html"
        },
        game7: {
            title: "My Little Balloon Stand",
            description: "Run a little balloon stand. Hey, that robot really likes balloons.",
            images: [
                "../Images/balloon/screen1.PNG", 
                "../Images/balloon/screen2.PNG", 
                "../Images/balloon/screen3.PNG",
                "../Images/balloon/balloon.gif",
            ],
            tags: ["Puzzle", "Logic", "Casual"],
            playLink: "https://cainetinyarms.itch.io/my-little-balloon-stand",
            devRamblingsLink: "../HTML/ramblings/balloon.html"
        },
        game8: {
            title: "Supermarket of the Dead",
            description: "Defend your supermarket from the zombie onslaught, but you better keep scanning those items, the mags aren't free.",
            images: [
                "../Images/sotd/screen1.PNG",
                "../Images/sotd/screen2.PNG",
                "../Images/sotd/screen3.PNG",
                "../Images/sotd/sotd.gif"
            ],
            tags: ["Fighting", "Versus", "Action"],
            playLink: "https://cainetinyarms.itch.io/supermarket-of-the-dead",
            devRamblingsLink: "../HTML/ramblings/sotd.html"
        },
        game9: {
            title: "Endless Wordle.",
            description: "Wordle, but endless. Enough said.",
            images: [
                "../Images/wordle.PNG",
            ],
            tags: ["Adventure", "Retro", "Open World"],
            playLink: "../HTML/endlesswordle.html",
            devRamblingsLink: "../HTML/ramblings/endlesswordle.html"
        }
    };

    // Select all game box elements and modal elements for displaying game details
    const gameBoxes = document.querySelectorAll('.game-box');
    const modal = document.getElementById('game-details-modal');
    const closeButton = document.querySelector('.close-button');
    const gameDetailsContent = document.getElementById('game-details-content');

    // Store the current carousel slide index
    let currentSlideIndex = 0;

    // Function to display game details in modal with carousel
    function showGameDetails(gameId) {
        // Get the selected game data
        const game = games[gameId];
            
        // Reset current slide index
        currentSlideIndex = 0;
        
        // Generate carousel HTML
        let carouselHTML = `
            <div class="carousel-container">
                <div class="carousel-slides">
                    ${game.images.map((image, index) => 
                        `<div class="carousel-slide ${index === 0 ? 'active' : ''}">
                            <img src="${image}" alt="${game.title} Image ${index + 1}">
                        </div>`
                    ).join('')}
                </div>
                <div class="carousel-controls">
                    <button class="carousel-control prev-slide">&lt;</button>
                    <div class="carousel-indicators">
                        ${game.images.map((_, index) => 
                            `<span class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></span>`
                        ).join('')}
                    </div>
                    <button class="carousel-control next-slide">&gt;</button>
                </div>
            </div>
        `;
        
        // Generate modal content HTML
        let modalHTML = `
            <h2>${game.title}</h2>
            ${carouselHTML}
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
        
        // Add event listeners for carousel controls
        setupCarouselControls();
    }
    
    // Function to set up carousel controls
    function setupCarouselControls() {
        const prevButton = modal.querySelector('.prev-slide');
        const nextButton = modal.querySelector('.next-slide');
        const indicators = modal.querySelectorAll('.carousel-indicator');
        
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', function() {
                changeSlide('prev');
            });
            
            nextButton.addEventListener('click', function() {
                changeSlide('next');
            });
        }
        
        if (indicators.length > 0) {
            indicators.forEach(indicator => {
                indicator.addEventListener('click', function() {
                    const slideIndex = parseInt(this.getAttribute('data-slide'));
                    goToSlide(slideIndex);
                });
            });
        }
    }
    
    // Function to change slide
    function changeSlide(direction) {
        const slides = modal.querySelectorAll('.carousel-slide');
        const indicators = modal.querySelectorAll('.carousel-indicator');
        
        if (slides.length <= 1) return;
        
        // Remove active class from current slide
        slides[currentSlideIndex].classList.remove('active');
        indicators[currentSlideIndex].classList.remove('active');
        
        // Update slide index based on direction
        if (direction === 'next') {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        } else {
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        }
        
        // Add active class to new slide
        slides[currentSlideIndex].classList.add('active');
        indicators[currentSlideIndex].classList.add('active');
        
        // Add VHS static effect during slide change
        const carouselContainer = modal.querySelector('.carousel-container');
        const slideStatic = document.createElement('div');
        slideStatic.classList.add('vhs-static');
        slideStatic.classList.add('slide-static');
        carouselContainer.appendChild(slideStatic);
        
        // Flash static briefly
        slideStatic.classList.add('active');
        setTimeout(() => {
            slideStatic.classList.remove('active');
            setTimeout(() => {
                slideStatic.remove();
            }, 300);
        }, 200);
    }
    
    // Function to go to specific slide
    function goToSlide(slideIndex) {
        const slides = modal.querySelectorAll('.carousel-slide');
        const indicators = modal.querySelectorAll('.carousel-indicator');
        
        if (slideIndex === currentSlideIndex || slideIndex < 0 || slideIndex >= slides.length) return;
        
        // Remove active class from current slide
        slides[currentSlideIndex].classList.remove('active');
        indicators[currentSlideIndex].classList.remove('active');
        
        // Update slide index
        currentSlideIndex = slideIndex;
        
        // Add active class to new slide
        slides[currentSlideIndex].classList.add('active');
        indicators[currentSlideIndex].classList.add('active');
        
        // Add VHS static effect during slide change
        const carouselContainer = modal.querySelector('.carousel-container');
        const slideStatic = document.createElement('div');
        slideStatic.classList.add('vhs-static');
        slideStatic.classList.add('slide-static');
        carouselContainer.appendChild(slideStatic);
        
        // Flash static briefly
        slideStatic.classList.add('active');
        setTimeout(() => {
            slideStatic.classList.remove('active');
            setTimeout(() => {
                slideStatic.remove();
            }, 300);
        }, 200);
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
});