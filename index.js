document.addEventListener('DOMContentLoaded', function () {
    var playButton = document.getElementById('playButton');
    var popover = document.getElementById('popover-default');
    var audioContext;
    var source;
    var isPlaying = false;
    var popoverTimeout;
    var audioBuffer;
    var loadingOverlay = document.getElementById('loadingOverlay');
    var loadingMessage = document.createElement('p');
    loadingMessage.style.color = 'white';
    loadingMessage.style.marginTop = '10px';
    loadingMessage.style.fontFamily = "'Plus Jakarta Sans', sans-serif";
    loadingOverlay.appendChild(loadingMessage);

    function showLoadingOverlay(message) {
        loadingOverlay.style.display = 'flex';
        loadingMessage.textContent = message;
        document.querySelector('.content').style.display = 'none';
    }

    function hideLoadingOverlay() {
        loadingOverlay.style.display = 'none';
        document.querySelector('.content').style.display = 'block';
    }

    function loadAudio() {
        return new Promise((resolve, reject) => {
            showLoadingOverlay("Please wait while the audio is being prepared...");
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            fetch('FinalMusic.m4a')
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
                .then(buffer => {
                    audioBuffer = buffer;
                    resolve();
                })
                .catch(error => {
                    console.error('Error loading audio:', error);
                    reject(error);
                });
        });
    }

    function loadBackgroundImage() {
        return new Promise((resolve, reject) => {
            showLoadingOverlay("Please wait while the images are being set up...");
            var img = new Image();
            img.onload = function () {
                document.body.style.backgroundImage = "url('" + img.src + "')";
                resolve();
            };
            img.onerror = reject;
            img.src = 'https://images.pexels.com/photos/913807/pexels-photo-913807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
        });
    }

    function loadSignature() {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = 'img.png'; // Adjust this to the correct path of your signature image
        });
    }

    function toggleAudio() {
        var playIcon = document.getElementById('playIcon');
        var pauseIcon = document.getElementById('pauseIcon');
        var loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'spinner';
        loadingSpinner.style.width = '24px';
        loadingSpinner.style.height = '24px';
        loadingSpinner.style.border = '3px solid #f3f3f3';
        loadingSpinner.style.borderTop = '3px solid #3498db';
        loadingSpinner.style.borderRadius = '50%';
        loadingSpinner.style.animation = 'spin 1s linear infinite';

        function showLoading() {
            playIcon.classList.add('hidden');
            pauseIcon.classList.add('hidden');
            playButton.appendChild(loadingSpinner);
        }

        function hideLoading() {
            if (playButton.contains(loadingSpinner)) {
                playButton.removeChild(loadingSpinner);
            }
        }

        if (!source) {
            showLoading();
            source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = true;
            source.connect(audioContext.destination);
            source.start();
            isPlaying = true;
            hideLoading();
            pauseIcon.classList.remove('hidden');
            showPopover();
        } else if (isPlaying) {
            audioContext.suspend();
            isPlaying = false;
            pauseIcon.classList.add('hidden');
            playIcon.classList.remove('hidden');
        } else {
            showLoading();
            audioContext.resume().then(() => {
                isPlaying = true;
                hideLoading();
                pauseIcon.classList.remove('hidden');
                showPopover();
            });
        }
    }

    function showPopover() {
        popover.classList.remove('invisible', 'opacity-0');
        popover.classList.add('visible', 'opacity-100');

        clearTimeout(popoverTimeout);
        popoverTimeout = setTimeout(() => {
            popover.classList.remove('visible', 'opacity-100');
            popover.classList.add('invisible', 'opacity-0');
        }, 4000);
    }

    // Load all assets
    showLoadingOverlay("Initializing...");
    Promise.all([
        loadBackgroundImage().then(() => loadSignature()),
        loadAudio()
    ])
        .then(() => {
            hideLoadingOverlay();
        })
        .catch(error => {
            console.error('Error loading assets:', error);
            hideLoadingOverlay(); // Hide loading overlay even if there's an error
        });

    playButton.addEventListener('click', toggleAudio);

    // Contact and Credits modal functionality
    const contactModal = document.getElementById('contactModal');
    const contactLink = document.getElementById('contactLink');
    const closeModal = document.getElementById('closeModal');
    const contactSvg = document.getElementById('contactSvg');

    const creditsModal = document.getElementById('creditsModal');
    const creditsLink = document.getElementById('creditsLink');
    const closeCreditsModal = document.getElementById('closeCreditsModal');

    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.remove('hidden');
    });

    contactSvg.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        contactModal.classList.add('hidden');
    });

    creditsLink.addEventListener('click', (e) => {
        e.preventDefault();
        creditsModal.classList.remove('hidden');
    });

    closeCreditsModal.addEventListener('click', () => {
        creditsModal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.add('hidden');
        }
        if (e.target === creditsModal) {
            creditsModal.classList.add('hidden');
        }
    });
});



// //Copy restruction
// document.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
// });

// document.addEventListener('copy', function (e) {
//     e.preventDefault();
//     alert('Copying text is not allowed on this page.');
// });

// //DMR win&Max
// document.addEventListener('keydown', function (e) {
//     // Disable F12 key (developer tools)
//     if (e.keyCode === 123) {
//         e.preventDefault();
//     }
//     // Disable Ctrl+Shift+I and Ctrl+Shift+J (developer tools) for Windows
//     if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
//         e.preventDefault();
//     }
//     // Disable Command+Option+I and Command+Option+J (developer tools) for macOS
//     if (e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 74)) {
//         e.preventDefault();
//     }
//     // Disable Ctrl+U (view source) for Windows
//     if (e.ctrlKey && e.keyCode === 85) {
//         e.preventDefault();
//     }
//     // Disable Command+Option+U (view source) for macOS
//     if (e.metaKey && e.altKey && e.keyCode === 85) {
//         e.preventDefault();
//     }
// });


// //Screenshot restriction to some extent
// document.addEventListener('keyup', function (e) {
//     if (e.key === 'PrintScreen') {
//         navigator.clipboard.writeText('');
//         alert('Screenshots are not allowed on this page.');
//     }
// });

// //Ctr+P restriction win&Mac
// document.addEventListener('keydown', function (e) {
//     // Check for Ctrl+P on Windows and Command+P on macOS
//     if ((e.ctrlKey && e.key === 'p') || (e.metaKey && e.key === 'p')) {
//         e.preventDefault();
//         alert('Printing is disabled on this page.');
//     }
// });

// // script to disable right click on the page
// // document.addEventListener('DOMContentLoaded', function () {
// //     document.addEventListener('contextmenu', function (event) {
// //         event.preventDefault();
// //     });
// // });

// document.addEventListener('DOMContentLoaded', function () {
//     document.addEventListener('contextmenu', function (event) {
//         event.preventDefault();
//     });
// });
