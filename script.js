// --- SCRIPT FOR QUEST 3 ---

// This function will initialize all the JS for the scrolling site
function startQuest3() {    /* --- This is the new code for the menu button --- */
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Function to update the menu button icon
    function updateMenuButtonIcon(isOpen) {
      if (isOpen) {
        // X icon
        menuButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
      } else {
        // Hamburger icon
        menuButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      }
    }

    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('menu-open');
        mobileMenu.classList.toggle('menu-open');
        updateMenuButtonIcon(!isOpen);
      });

      // Close mobile menu when any navigation link is clicked
      const mobileMenuLinks = mobileMenu.querySelectorAll('a[href^="#"]');
      mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('menu-open');
          updateMenuButtonIcon(false);
        });
      });
    }
    /* --- End of new code --- */

    // --- 1. LENIS SMOOTH SCROLL SETUP ---
    const lenis = new Lenis();
// ...
    // Sync anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            lenis.scrollTo(this.getAttribute('href'));
        });
    });

    // --- 2. THREE.JS 3D BACKGROUND SETUP ---
    let scene, camera, renderer, mesh;
    let clock = new THREE.Clock();
    const heroText = document.getElementById('hero-text');

    function initThree() {
        scene = new THREE.Scene();
        
        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        const canvas = document.getElementById('bg-3d');
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true // Transparent background
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 3D Object (Icosahedron - like a heart)
        const shape = new THREE.Shape();
const x = 0, y = 0;

// Define the heart path
shape.moveTo( x + 0.5, y + 0.5 );
shape.bezierCurveTo( x + 0.5, y + 0.5, x + 0.4, y, x, y );
shape.bezierCurveTo( x - 0.6, y, x - 0.6, y + 0.7,x - 0.6, y + 0.7 );
shape.bezierCurveTo( x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9 );
shape.bezierCurveTo( x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7 );
shape.bezierCurveTo( x + 1.6, y + 0.7, x + 1.6, y, x + 1, y );
shape.bezierCurveTo( x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5 );

// Settings to extrude the 2D shape into 3D
const extrudeSettings = { 
    depth: 0.25, // How thick the heart is
    bevelEnabled: true, 
    bevelSegments: 5, 
    steps: 1, 
    bevelSize: 0.1, 
    bevelThickness: 0.1 
};

// Create the 3D geometry from the 2D shape
const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

// Scale and center the geometry so it rotates nicely
geometry.scale(0.8, 0.8, 0.8);
geometry.center(); // This is important!

// Use MeshNormalMaterial - it's colorful and doesn't require lights!
const material = new THREE.MeshNormalMaterial({
    flatShading: false // Make it smooth
}); 
mesh = new THREE.Mesh(geometry, material);

// --- FIX: Rotate the heart 180 degrees to be right-side up ---
mesh.rotation.z = Math.PI; // Math.PI is 180 degrees

scene.add(mesh);

        // Handle window resizing
        window.addEventListener('resize', onWindowResize, false);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    // --- 3. INTERSECTION OBSERVER (Fade-in on scroll) ---
    const revealElements = document.querySelectorAll(".reveal-on-scroll");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            } else {
                // Optional: remove class to re-animate when scrolling back up
                entry.target.classList.remove("is-visible");
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });


    // --- 4. MAIN ANIMATION LOOP (Tied to Lenis) ---
    // This is the most important part.
    // We run Lenis, our 3D render, and parallax all in ONE animation frame.
    function animate(time) {
        // 1. Run Lenis
        lenis.raf(time);
        
        // 2. Animate 3D object
        if (mesh) {
            const elapsedTime = clock.getElapsedTime();
            mesh.rotation.x = elapsedTime * 0.1;
            mesh.rotation.y = elapsedTime * 0.15;
        }

        // 3. Apply Parallax to Hero Text
        // 'lenis.scroll' gives us the current scroll position
        if (heroText) {
            // Move the hero text up at 40% of the scroll speed
            heroText.style.transform = `translateY(${lenis.scroll * 0.4}px)`;
            // Fade it out as it scrolls up
            heroText.style.opacity = 1 - (lenis.scroll / (window.innerHeight / 1.5));
        }
        
        // 4. Render the 3D scene
        if (renderer) {
            renderer.render(scene, camera);
        }
        
        // 5. Continue the loop
        requestAnimationFrame(animate);
    }

    // Start everything!
    initThree();
    requestAnimationFrame(animate);
}


// --- SCRIPT FOR QUEST 1 ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Clue Data ---
    const newClues = {
        '1': "I'm the 1st letter of a plant with petals. (F)",
        '2': "I'm the 2nd letter of the color 'yellow'. (L)",
        '3': "I'm the 1st letter of an animal that hoots at night. (O)",
        '4': "I'm the 1st letter of a 7-day period. (W)",
        '5': "I'm the 2nd letter of 'green'. (E)",
        '6': "I'm the 1st letter of a color in the rainbow. (R)"
    };
    const FINAL_CODE = "FLOWER";

    // --- DOM Elements (Quest 1) ---
    const quest1Wrapper = document.getElementById('quest-1-wrapper');
    const clueItems = document.querySelectorAll('.clue-item');
    const modal = document.getElementById('clueModal');
    const modalContent = document.getElementById('modalContent');
    const clueText = document.getElementById('clueText');
    const closeModalBtn = document.getElementById('closeModal');
    
    const codeForm = document.getElementById('codeForm');
    const codeInput = document.getElementById('codeInput');
    const messageArea = document.getElementById('messageArea');

    const puzzleBox = document.getElementById('puzzle-box');
    
    const congratsModal = document.getElementById('congratsModal');
    const congratsModalContent = document.getElementById('congratsModalContent');
    const continueButton = document.getElementById('continueButton');

    // --- DOM Elements (Quest 3) ---
    const quest3Wrapper = document.getElementById('quest-3-wrapper');


    // --- Functions (Quest 1) ---
    function showClue(clueId) {
        clueText.textContent = newClues[clueId] || "No clue here! Try another.";
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }

    function closeModal() {
        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        
        // Allow animation to finish before hiding
        setTimeout(() => {
            modal.classList.add('pointer-events-none');
            modal.classList.remove('opacity-100');
            modalContent.classList.remove('scale-100');
        }, 300);
    }

    // New function to show the congrats modal
    function showCongratsModal() {
        congratsModal.classList.remove('opacity-0', 'pointer-events-none');
        congratsModal.classList.add('opacity-100');
        congratsModalContent.classList.remove('scale-95');
        congratsModalContent.classList.add('scale-100');
    }

    // This function now transitions to Quest 3
    function goToQuest3() {
        // Hide modal
        congratsModal.classList.add('opacity-0');
        congratsModalContent.classList.add('scale-95');
        
        setTimeout(() => {
            congratsModal.classList.add('pointer-events-none');
            congratsModal.classList.remove('opacity-100');
            congratsModalContent.classList.remove('scale-100');
        }, 300);

        // Hide puzzle (page 1)
        quest1Wrapper.style.display = 'none';
        
        // Prep body for Quest 3
        document.body.className = 'antialiased'; // Base class
        document.body.classList.add('quest-3-body'); // Add new styles

        // Show quest 3
        quest3Wrapper.classList.remove('hidden');

        // Start the Quest 3 JavaScript
        startQuest3();
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const guess = codeInput.value.trim().toUpperCase();

        if (guess === FINAL_CODE) {
            // Show success screen
            messageArea.textContent = ""; // Clear any error messages
            showCongratsModal(); // Show the new congrats pop-up
        } else {
            messageArea.textContent = "Not quite! Try again! 🤔";
            messageArea.style.color = '#dc2626'; // Red
            // Wiggle animation on input
            codeInput.classList.add('animate-shake');
            setTimeout(() => {
                codeInput.classList.remove('animate-shake');
            }, 500);
        }
    }

    // --- Event Listeners (Quest 1) ---
    // Check if clueItems exist before adding listeners (they only exist on quest 1)
    if (clueItems.length > 0) {
        clueItems.forEach(item => {
            // Add clue item styles dynamically
            item.classList.add(
                'bg-white', 'rounded-xl', 'shadow-lg', 'p-4', 'md:p-6', 'text-4xl', 'md:text-5xl', 
                'cursor-pointer', 'transition-all', 'duration-300', 
                'hover:scale-110', 'hover:shadow-xl', 'hover:bg-brand-pink-light',
                'animate-pulse-slow'
            );
            item.style.animationDelay = `${Math.random() * -4}s`;

            // Add click listener
            item.addEventListener('click', () => {
                showClue(item.dataset.clue);
            });
        });
    }

    // Check for other elements before adding listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (event) => {
            // Close if clicking on the background
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    if (codeForm) {
        codeForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (continueButton) {
        // Add new listener for the continue button
        continueButton.addEventListener('click', goToQuest3);
    }
});