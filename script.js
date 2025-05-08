document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    menuToggle.addEventListener("click", function() {
        navMenu.classList.toggle("show"); 
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const accountBtn = document.getElementById("account-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");

    accountBtn.addEventListener("click", function (event) {
        event.stopPropagation(); 
        dropdownMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
        if (!accountBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const bioBoxes = document.querySelectorAll(".bio-box");
    let currentIndex = 0;
    let isAnimating = false;

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    // Function to show bio with animation
    function showBio(newIndex, direction) {
        if (isAnimating) return;
        isAnimating = true;

        const currentBox = bioBoxes[currentIndex];
        const nextBox = bioBoxes[newIndex];

        // Hide the current box with animation
        currentBox.style.opacity = "0";
        currentBox.style.transform = direction === "next" ? "translateX(-50px)" : "translateX(50px)";

        setTimeout(() => {
            currentBox.classList.remove("active");

            // Display and animate the new box
            nextBox.classList.add("active");
            nextBox.style.opacity = "1";
            nextBox.style.transform = "translateX(0)";

            currentIndex = newIndex;
            isAnimating = false;
        }, 500); // Wait for the current box to fade out before switching
    }

    // Event listeners for the prev and next buttons
    prevBtn.addEventListener("click", function () {
        let newIndex = (currentIndex - 1 + bioBoxes.length) % bioBoxes.length;
        showBio(newIndex, "prev");
    });

    nextBtn.addEventListener("click", function () {
        let newIndex = (currentIndex + 1) % bioBoxes.length;
        showBio(newIndex, "next");
    });

    // Initialize first box
    bioBoxes[currentIndex].classList.add("active");
});

function saveData() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="datetime-local"], input[type="radio"]:checked');
    let formData = {};

    inputs.forEach(input => {
        if (input.name) {
            formData[input.name] = input.value;
        }
    });

    const pageKey = window.location.pathname.split('/').pop();
    localStorage.setItem(pageKey, JSON.stringify(formData));
    alert("Form data saved!");
}

function clearData() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type === "text" || input.type === "datetime-local") {
            input.value = '';
        } else if (input.type === "radio") {
            input.checked = false;
        }
    });

    const pageKey = window.location.pathname.split('/').pop();
    localStorage.removeItem(pageKey);
    alert("Form data cleared!");
}

window.onload = function () {
    const pageKey = window.location.pathname.split('/').pop();
    const savedData = JSON.parse(localStorage.getItem(pageKey));

    if (savedData) {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.name in savedData) {
                if (input.type === "radio") {
                    if (input.value === savedData[input.name]) {
                        input.checked = true;
                    }
                } else {
                    input.value = savedData[input.name];
                }
            }
        });
    }
};

document.getElementById('photo-upload').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the first file
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const image = new Image();
            image.src = e.target.result;

            // Display the uploaded image in the preview
            const preview = document.getElementById('uploaded-photo-preview');
            preview.src = e.target.result;
            preview.style.display = 'block'; // Show the image
        };

        reader.readAsDataURL(file); // Convert the image to a data URL
    }
});

function downloadResult() {
    const element = document.getElementById('form');
    const imageElement = document.getElementById('uploaded-photo-preview'); // The uploaded photo preview
    const radioGroups = document.querySelectorAll('input[type="radio"]:checked');
    const radioButtonGroups = document.querySelectorAll('input[type="radio"]');
    const inspectorName = document.getElementById('inspector-name').value.trim();
    const designation = document.getElementById('designation').value.trim();
    const location = document.getElementById('location').value.trim();
    const inspectionTime = document.getElementById('inspection-time').value.trim();

    // Check if all radio buttons are answered (i.e., one per group of radio buttons)
    let allRadioAnswered = true;
    const radioNames = [...new Set([...radioButtonGroups].map(r => r.name))]; // Get unique radio button names (question groups)

    radioNames.forEach(name => {
        if (![...document.getElementsByName(name)].some(radio => radio.checked)) {
            allRadioAnswered = false;
        }
    });

    if (!allRadioAnswered) {
        alert('Please answer all the questions before generating the PDF.');
        return;
    }

    // Check if the input fields are filled
    if (!inspectorName || !designation || !location || !inspectionTime) {
        alert('Please fill in all the required input fields.');
        return;
    }

    // Check if an image is uploaded
    if (!imageElement.src) {
        alert('Please upload a photo before generating the PDF!');
        return;
    }

    const opt = {
        margin:       0.5,
        filename:     'myfile.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 1, scrollY: 0, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const storedUser = JSON.parse(localStorage.getItem(email));
    
    if (storedUser && storedUser.password === password) {
        sessionStorage.setItem("userRole", role);
        
        if (role === "inspector") {
            window.location.href = 'siservices.html';
        } else if (role === "representative") {
            window.location.href = 'crservices.html';
        } else {
            document.getElementById("error-message").innerText = "Invalid role selected";
        }
    } else {
        document.getElementById("error-message").innerText = "Invalid email or password";
    }
}

function signup() {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (email && password) {
        localStorage.setItem(email, JSON.stringify({ email, password }));
        
        alert("Account created successfully!");
        window.location.href = "index.html";
    } else {
        const messageEl = document.getElementById("signup-message");
        if (messageEl) {
            messageEl.innerText = "Please fill in all fields.";
        }
    }
}

function redirectToDocuments() {
    window.location.href = "documents.html";
}

function goHome() {
    const role = sessionStorage.getItem("userRole");
    if (role === "inspector") {
        window.location.href = "siservices.html";
    } else if (role === "representative") {
        window.location.href = "crservices.html";
    } else {
        window.location.href = "index.html";
    }
}

