document.addEventListener('DOMContentLoaded', function () {
    var playButton = document.getElementById('playButton');
    var popover = document.getElementById('popover-default');
    var audioContext;
    var source;
    var isPlaying = false;
    var popoverTimeout;
    var audioBuffer;
    var loadingOverlay = document.getElementById('loadingOverlay');
    var loadingMessage = document.getElementById('loadingMessage');
    var errorOverlay = document.getElementById('errorOverlay');
    var dotAnimationInterval;
    var formOverlay = document.getElementById('formOverlay');
    var accessForm = document.getElementById('accessForm');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbxtyfYKXXIM_W6VcNGv3t7kjR9uMGA9iA-ojy6HnQBmw1mPLwu4wKuZQLdHZ0R4xxFohQ/exec';
    const form = document.forms['google-sheet']

    accessForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const accessKey = document.getElementById('accessKey').value;
        const accessKeyInput = document.getElementById('accessKey');

        const buttonText = document.getElementById('buttonText');
        const buttonArrow = document.getElementById('buttonArrow');
        const loadingSpinner = document.getElementById('loadingSpinner');
        buttonText.textContent = 'verifying Key...';
        buttonArrow.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    if (accessKey === 'WRINPGDV29V04') {
                        formOverlay.style.display = 'none';
                        initializeWebpage();
                    } else {
                        accessKeyInput.classList.add('invalid');
                        showInvalidkeyOverlay();
                    }
                } else {
                    throw new Error('Key Verification Failed! Try Again.');
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('An error occurred. Please try again.');
            })
            .finally(() => {
                // Reset button state
                buttonText.textContent = 'Continue';
                buttonArrow.classList.remove('hidden');
                loadingSpinner.classList.add('hidden');
            });
    });

    document.getElementById('accessKey').addEventListener('input', function () {
        this.classList.remove('invalid');
    });


    function initializeWebpage() {
        showLoadingOverlay("This will take a moment<br>Loading images");
        loadAllAssets();
    }

    function showLoadingOverlay(message) {
        loadingOverlay.style.display = 'flex';
        updateLoadingMessage(message);
        document.querySelector('.content').style.display = 'none';
        startDotAnimation();
    }

    let animatedChecks = new Set();

    function updateLoadingMessage(message) {
        // loadingMessage.style.animation = 'none';
        // loadingMessage.offsetHeight; // Trigger reflow
        // // loadingMessage.style.animation = 'slideUp 0.3s ease-out forwards';
        // loadingMessage.style.animation = '0.4s cubic-bezier(0.39, 0.58, 0.57, 1) 0s 1 normal forwards running slideUp';
        // loadingMessage.innerHTML = message;

        loadingMessage.style.animation = 'none';
        loadingMessage.offsetHeight; // Trigger reflow
        loadingMessage.style.animation = 'slideUp 0.6s ease-out forwards';

        // Create a temporary container
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = message;

        // Find all check mark images
        const checkImages = tempDiv.querySelectorAll('img[src="img/check.svg"]');
        checkImages.forEach((img, index) => {
            const checkId = `check-${message.split('<img').slice(0, index + 1).join('<img')}`;
            if (!animatedChecks.has(checkId)) {
                img.classList.add('check-icon');
                img.style.opacity = '0'; // Start invisible
                img.dataset.checkId = checkId;
            } else {
                img.style.opacity = '1'; // Make visible immediately for already animated checks
                img.classList.remove('check-icon');
            }
        });

        // Set the innerHTML
        loadingMessage.innerHTML = tempDiv.innerHTML;

        // Trigger the animation for each new check mark
        setTimeout(() => {
            const newCheckImages = loadingMessage.querySelectorAll('.check-icon[style*="opacity: 0"]');
            newCheckImages.forEach((img, index) => {
                setTimeout(() => {
                    img.style.opacity = '1';
                    animatedChecks.add(img.dataset.checkId);
                }, index * 100);
            });
        }, 300);

    }

    function startDotAnimation() {
        let dots = 0;
        clearInterval(dotAnimationInterval);
        dotAnimationInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            const dotsString = '.'.repeat(dots);
            const currentHTML = loadingMessage.innerHTML;
            const newHTML = currentHTML.replace(/\.{0,3}(<br>)?$/, '') + dotsString + '<br>';
            loadingMessage.innerHTML = newHTML;
        }, 500);
    }

    function stopDotAnimation() {
        clearInterval(dotAnimationInterval);
    }

    function animateFormIn() {
        const formContent = document.getElementById('formContent');
        formContent.classList.add('slide-in');
    }

    function hideLoadingOverlay() {
        loadingOverlay.style.display = 'none';
        loadingOverlay.style.animation = 'none';
        loadingMessage.style.animation = 'none';
        document.querySelector('.content').style.display = 'block';
        stopDotAnimation();
        animateFormIn();
    }

    function showErrorOverlay() {
        errorOverlay.style.display = 'flex';
        loadingOverlay.style.display = 'none';
        document.querySelector('.content').style.display = 'none';
        stopDotAnimation();
    }

    function showInvalidkeyOverlay() {
        const invalidkeyOverlay = document.getElementById('invalidkeyOverlay');
        const invalidkeyModal = document.getElementById('invalidkeyModal');
        invalidkeyOverlay.style.display = 'flex';
        invalidkeyModal.classList.remove('pop-up');

        // Force a reflow
        void invalidkeyModal.offsetWidth;

        // Add the animation class
        invalidkeyModal.classList.add('pop-up');
    }

    function loadAudio() {
        return new Promise((resolve, reject) => {
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
            img.src = 'img/img.png';
        });
    }

    function loadCheckImage() {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = 'img/check.svg';
        });
    }

    // function loadAllAssets() {
    //     Promise.all([
    //         loadBackgroundImage().then(() => {
    //             updateLoadingMessage(`Images are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Loading other assets`);
    //             return loadSignature();
    //         }).then(() => {
    //             updateLoadingMessage(`Images are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Assets are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Loading audio`);
    //             return loadAudio();
    //         }).then(() => {
    //             updateLoadingMessage(`Images are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Assets are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Audio is loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Finalizing`);
    //         })
    //     ]).then(() => {
    //         setTimeout(() => {
    //             hideLoadingOverlay();
    //         }, 1000);
    //     }).catch(error => {
    //         console.error('Error loading assets:', error);
    //         showErrorOverlay();
    //     });
    // }

    function loadAllAssets() {
        Promise.all([
            loadCheckImage(), loadSignature().then(() => {
                updateLoadingMessage(`Images are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Loading other assets`);
                return loadBackgroundImage();
            }).then(() => {
                updateLoadingMessage(`Images are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Assets are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Loading audio`);
                return loadAudio();
            }).then(() => {
                updateLoadingMessage(`Images are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Assets are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Audio is loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Finalizing`);
            })
        ]).then(() => {
            setTimeout(() => {
                hideLoadingOverlay();
            }, 1000);
        }).catch(error => {
            console.error('Error loading assets:', error);
            showErrorOverlay();
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

    // Load all assets with status updates
    showLoadingOverlay("This will take a moment<br>Loading Assets");

    Promise.all([
        loadCheckImage(), loadSignature().then(() => {
            updateLoadingMessage(`Assets are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>User Verification`);
            return loadBackgroundImage();
        }).then(() => {
            updateLoadingMessage(`Assets are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>User Verified<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Connecting to server`);
            return loadAudio();
        }).then(() => {
            updateLoadingMessage(`Assets are loaded<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>User Verified<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Connected to server<img src="img/check.svg" style="width: 20px; height: 20px; display: inline; vertical-align: middle; margin-left: 5px;" alt=""><br>Finalizing`);
        })
    ]).then(() => {
        setTimeout(() => {
            hideLoadingOverlay();
        }, 1000);
    }).catch(error => {
        console.error('Error loading assets:', error);
        showErrorOverlay();
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

function refreshPage() {
    location.reload();
}

function removeInvalidkeyOverlay() {
    const invalidkeyOverlay = document.getElementById('invalidkeyOverlay');
    const invalidkeyModal = document.getElementById('invalidkeyModal');

    invalidkeyModal.classList.remove('pop-up');
    invalidkeyOverlay.style.display = 'none';
}

//Copy restriction
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

document.addEventListener('copy', function (e) {
    e.preventDefault();
    alert('Copying text is not allowed on this page.');
});

//DMR win&Max
document.addEventListener('keydown', function (e) {
    // Disable F12 key (developer tools)
    if (e.keyCode === 123) {
        e.preventDefault();
    }
    // Disable Ctrl+Shift+I and Ctrl+Shift+J (developer tools) for Windows
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
        e.preventDefault();
    }
    // Disable Command+Option+I and Command+Option+J (developer tools) for macOS
    if (e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 74)) {
        e.preventDefault();
    }
    // Disable Ctrl+U (view source) for Windows
    if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
    }
    // Disable Command+Option+U (view source) for macOS
    if (e.metaKey && e.altKey && e.keyCode === 85) {
        e.preventDefault();
    }
});

//Screenshot restriction to some extent
document.addEventListener('keyup', function (e) {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots can not be taken.');
    }
});

//Ctr+P restriction win&Mac
document.addEventListener('keydown', function (e) {
    // Check for Ctrl+P on Windows and Command+P on macOS
    if ((e.ctrlKey && e.key === 'p') || (e.metaKey && e.key === 'p')) {
        e.preventDefault();
        alert('Printing is disabled on this page.');
    }
});

//script to disable right click on the page
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });
});

function convertToUpperCaseAndRemoveNumbers(inputField) {
            inputField.value = inputField.value
                .replace(/[^a-zA-Z\s]/g, "")
                .toUpperCase();
        }
        function convertToLowerCaseAndRemoveSpaces(inputField) {
            inputField.value = inputField.value
                .replace(/\s/g, "") // Remove all whitespace characters
                .replace(/[A-Z]/g, char => char.toLowerCase()); // Convert uppercase to lowercase
        }

        function removeSpaces(inputField) {
            inputField.value = inputField.value
                .replace(/\s/g, "");
        }
