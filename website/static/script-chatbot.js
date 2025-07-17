// const chatMessages = document.getElementById("chat-messages");
// const userInput = document.getElementById("user-input");
// const imageUpload = document.getElementById("image-upload");
// const previewWrapper = document.getElementById('image-preview-wrapper');
// const preview = document.getElementById('image-preview');
// const removeBtn = document.getElementById('remove-image-btn');

// // Send message on Enter key press (without shift)
// userInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         const text = userInput.value;
//         userInput.value = "";
//         sendMessage(text);
//     }
// });

// async function sendMessage(preFilledText = null) {
//     const text = preFilledText !== null ? preFilledText.trim() : userInput.value.trim();
//     const file = imageUpload.files[0];

//     if (!text && !file) return;

//     userInput.disabled = true;
//     showTypingIndicator();

//     try {
//         let imageData = file ? await readFileAsDataURL(file) : null;
//         addMessage("user", text, imageData);

//         const formData = new FormData();
//         if (text) formData.append("text", text);
//         if (file) formData.append("image", file);

//         const response = await fetch("/chatbot-response", {
//             method: "POST",
//             body: formData
//         });

//         if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

//         const data = await response.json();
//         addMessage("bot", data.response || "⚠️ Bot response error");

//         // --- Merge: fetch /get-response and update #bot-message if present ---
//         fetch('/get-response')
//           .then(response => response.json())
//           .then(data => {
//             // const botMsgElem = document.getElementById('bot-message');
//             // if (botMsgElem) {
//             //     botMsgElem.innerHTML = data.bot_response;
//             // }
//           });
//         // ---------------------------------------------------------------------

//         // Add this: update #bot-message if present with the main response as well
//         const botMsgElem = document.getElementById('bot-message');
//         if (botMsgElem && data.response) {
//             botMsgElem.innerHTML = data.response;
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         addMessage("bot", "❌ There was an error processing your request.");
//     }finally {
//         userInput.value = "";
//         imageUpload.value = "";
        
//         // Hide image preview and reset
//         preview.src = "";
//         previewWrapper.style.display = "none";
    
//         userInput.disabled = false;
//         hideTypingIndicator();
//     }
    
    
// }
// let currentUtterance = null; // Track current speech utterance globally

// function addMessage(sender, text, imageData = null) {
//     const messageDiv = document.createElement("div");
//     messageDiv.className = `message ${sender}`;

//     const contentDiv = document.createElement("div");
//     contentDiv.className = "message-content";

//     if (imageData) {
//         const img = document.createElement("img");
//         img.src = imageData;
//         img.className = "message-image";
//         contentDiv.appendChild(img);
//     }

//     if (text) {
//         const textDiv = document.createElement("div");
//         textDiv.innerHTML = text;
//         contentDiv.appendChild(textDiv);

//         // If sender is bot, add combined Speak/Stop button
//         if (sender === "bot") {
//             const speakStopBtn = document.createElement("button");
//             speakStopBtn.innerHTML = '<img src= "../static/speaker.svg"/>';
//             speakStopBtn.className = "speak-stop-button";
//             // Custom TTS button style
//             speakStopBtn.style.cssText = `
//                 background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
//                 color: #fff;
//                 padding: 0;
//                 border: none;
//                 border-radius: 12px 12px 12px 0;
//                 margin: 2px 0 2px 8px;
//                 cursor: pointer;
//                 transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
//                 box-shadow: 0 4px 12px rgba(40,60,120,0.12);
//                 width: 36px;
//                 height: 36px;
//                 display: inline-flex;
//                 align-items: center;
//                 justify-content: center;
//                 outline: none;
//                 position: relative;
//             `;
//             speakStopBtn.onmouseover = () => {
//                 speakStopBtn.style.background = currentUtterance
//                     ? "linear-gradient(135deg, #ff5858 0%, #f09819 100%)"
//                     : "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";
//                 speakStopBtn.style.transform = "scale(1.08)";
//                 speakStopBtn.style.boxShadow = "0 6px 18px rgba(40,60,120,0.18)";
//             };
//             speakStopBtn.onmouseout = () => {
//                 speakStopBtn.style.background = currentUtterance
//                     ? "linear-gradient(135deg, #ff5858 0%, #f09819 100%)"
//                     : "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)";
//                 speakStopBtn.style.transform = "scale(1)";
//                 speakStopBtn.style.boxShadow = "0 4px 12px rgba(40,60,120,0.12)";
//             };
//             speakStopBtn.onclick = () => {
//                 if (currentUtterance) {
//                     // If speaking, stop it
//                     window.speechSynthesis.cancel();
//                     currentUtterance = null;
//                     speakStopBtn.style.background = "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)";
//                 } else {
//                     // If not speaking, start it
//                     window.speechSynthesis.cancel();
//                     currentUtterance = new SpeechSynthesisUtterance(textDiv.innerText);
//                     currentUtterance.lang = "en-US";
//                     currentUtterance.pitch = 1;
//                     currentUtterance.rate = 1;
//                     currentUtterance.volume = 1;
//                     speakStopBtn.style.background = "linear-gradient(135deg, #ff5858 0%, #f09819 100%)";
                    
//                     currentUtterance.onend = () => {
//                         currentUtterance = null;
//                         speakStopBtn.style.background = "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)";
//                     };
                    
//                     window.speechSynthesis.speak(currentUtterance);
//                 }
//             };

//             // Add a subtle shadow ring on focus for accessibility
//             speakStopBtn.onfocus = () => {
//                 speakStopBtn.style.boxShadow = "0 0 0 3px #a0c4ff, 0 4px 12px rgba(40,60,120,0.12)";
//             };
//             speakStopBtn.onblur = () => {
//                 speakStopBtn.style.boxShadow = "0 4px 12px rgba(40,60,120,0.12)";
//             };

//             contentDiv.appendChild(speakStopBtn);
//         }
//     }

//     messageDiv.appendChild(contentDiv);
//     chatMessages.appendChild(messageDiv);

//     // Always keep typing indicator at the bottom
//     moveTypingIndicatorToBottom();

//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// function readFileAsDataURL(file) {
//     return new Promise((resolve) => {
//         const reader = new FileReader();
//         reader.onload = (e) => resolve(e.target.result);
//         reader.readAsDataURL(file);
//     });
// }

// function showTypingIndicator() {
//     // Remove any existing indicator
//     const existing = document.querySelector(".typing-indicator");
//     if (existing) existing.remove();

//     const typing = document.createElement("div");
//     typing.classList.add("typing-indicator");

//     for (let i = 0; i < 3; i++) {
//         const dot = document.createElement("span");
//         dot.classList.add("typing-dot");
//         typing.appendChild(dot);
//     }

//     chatMessages.appendChild(typing);
//     chatMessages.scrollTop = chatMessages.scrollHeight;
// }

// function hideTypingIndicator() {
//     const existing = document.querySelector(".typing-indicator");
//     if (existing) existing.remove();
// }

// function moveTypingIndicatorToBottom() {
//     const indicator = document.querySelector(".typing-indicator");
//     if (indicator) {
//         chatMessages.appendChild(indicator);
//         chatMessages.scrollTop = chatMessages.scrollHeight;
//     }
// }

// function toggleMenu() {
//     const menu = document.getElementById("hamburgerMenu");
//     if (menu) {
//         menu.classList.toggle("active");
//     }
// }

// function hideMenu() {
//     const menu = document.getElementById("hamburgerMenu");
//     if (menu) {
//         menu.classList.remove("active");
//     }
// }

// function voice() {
//     const recognition = new webkitSpeechRecognition();
//     recognition.lang = "en-GB";
//     recognition.interimResults = false; // Optional: prevent partial results

//     const inputField = document.getElementById("user-input");
//     const indicator = document.getElementById("listening-indicator");

//     indicator.style.display = "block"; // Show "Listening..." indicator

//     recognition.onresult = function (event) {
//         const transcript = event.results[0][0].transcript;
//         inputField.value = transcript;
//         indicator.style.display = "none"; // Hide after setting value
//     };

//     recognition.onend = function () {
//         // In case onresult didn't fire (e.g., silence), still hide
//         if (indicator.style.display !== "none") {
//             indicator.style.display = "none";
//         }
//     };

//     recognition.onerror = function (event) {
//         console.error("Speech recognition error:", event.error);
//         indicator.style.display = "none";
//     };

//     recognition.start();
// }


// document.getElementById('image-upload').addEventListener('change', function () {
//     const file = this.files[0];
//     const preview = document.getElementById('image-preview');

//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             preview.src = e.target.result;
//             preview.style.display = 'block';
//         };
//         reader.readAsDataURL(file);
//     } else {
//         preview.src = '';
//         preview.style.display = 'none';
//     }
// });
// imageUpload.addEventListener('change', function () {
//     const file = this.files[0];

//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             preview.src = e.target.result;
//             previewWrapper.style.display = 'block';
//         };
//         reader.readAsDataURL(file);
//     } else {
//         previewWrapper.style.display = 'none';
//         preview.src = '';
//     }
// });

// removeBtn.addEventListener('click', function () {
//     imageUpload.value = '';
//     previewWrapper.style.display = 'none';
//     preview.src = '';
// });
//     var canvas = document.getElementById("canvas"),
//         ctx = canvas.getContext('2d');

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     var stars = [],
//     //ay that contains the stars
//         FPS = 30, // Frames per second
//         x = 100, // Number of stars
//         mouse = {
//         x: 0,
//         y: 0
//         };  // mouse location

//     // Push stars to array

//     for (var i = 0; i < x; i++) {
//     stars.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         radius: Math.random() * 1 + 1,
//         vx: Math.floor(Math.random() * 50) - 25,
//         vy: Math.floor(Math.random() * 50) - 25
//     });
//     }

//     // Draw the scene

//     function draw() {
//         ctx.clearRect(0,0,canvas.width,canvas.height);
        
//         ctx.globalCompositeOperation = "lighter";
        
//         for (var i = 0, x = stars.length; i < x; i++) {
//           var s = stars[i];
        
//           ctx.fillStyle = "#00e600"; // Green color
//           ctx.beginPath();
//           ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
//           ctx.fill();
//           ctx.fillStyle = 'black';
//           ctx.stroke();
//         }

//     ctx.beginPath();
//     for (var i = 0, x = stars.length; i < x; i++) {
//         var starI = stars[i];
//         ctx.moveTo(starI.x,starI.y); 
//         if(distance(mouse, starI) < 150) ctx.lineTo(mouse.x, mouse.y);
//         for (var j = 0, x = stars.length; j < x; j++) {
//         var starII = stars[j];
//         if(distance(starI, starII) < 150) {
//             //ctx.globalAlpha = (1 / 150 * distance(starI, starII).toFixed(1));
//             ctx.lineTo(starII.x,starII.y); 
//         }
//         }
//     }
//     ctx.lineWidth = 0.05;
//     ctx.strokeStyle = 'white';
//     ctx.stroke();
//     }

//     function distance( point1, point2 ){
//     var xs = 0;
//     var ys = 0;
    
//     xs = point2.x - point1.x;
//     xs = xs * xs;
    
//     ys = point2.y - point1.y;
//     ys = ys * ys;
    
//     return Math.sqrt( xs + ys );
//     }

//     // Update star locations

//     function update() {
//     for (var i = 0, x = stars.length; i < x; i++) {
//         var s = stars[i];
    
//         s.x += s.vx / FPS;
//         s.y += s.vy / FPS;
        
//         if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
//         if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
//     }
//     }

//     canvas.addEventListener('mousemove', function(e){
//     mouse.x = e.clientX;
//     mouse.y = e.clientY;
//     });

//     // Update and draw

//     function tick() {
//     draw();
//     update();
//     requestAnimationFrame(tick);
//     }

//     tick();

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const imageUpload = document.getElementById("image-upload");
const previewWrapper = document.getElementById('image-preview-wrapper');
const preview = document.getElementById('image-preview');
const removeBtn = document.getElementById('remove-image-btn');
const voices = window.speechSynthesis.getVoices();
const selectedVoice = voices.find(voice => voice.name === "Google US English") || voices[3];

// Send message on Enter key press (without shift)
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const text = userInput.value;
        userInput.value = "";
        sendMessage(text);
    }
});

async function sendMessage(preFilledText = null) {
    const text = preFilledText !== null ? preFilledText.trim() : userInput.value.trim();
    const file = imageUpload.files[0];

    if (!text && !file) return;

    userInput.disabled = true;
    showTypingIndicator();

    try {
        let imageData = file ? await readFileAsDataURL(file) : null;
        addMessage("user", text, imageData);

        const formData = new FormData();
        if (text) formData.append("text", text);
        if (file) formData.append("image", file);

        // ✅ Add selected model from dropdown
        const modelSelect = document.getElementById("model");
        if (modelSelect) {
            const selectedModel = modelSelect.value;
            formData.append("model", selectedModel);
        }

        const response = await fetch("/chatbot-response", {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const data = await response.json();
        addMessage("bot", data.response || "⚠️ Bot response error");

        // Optional fetch to update other parts
        fetch('/chatbot-response')
          .then(response => response.json())
          .then(data => {
            const botMsgElem = document.getElementById('bot-message');
            if (botMsgElem && data.bot_response) {
                botMsgElem.innerHTML = data.bot_response;
            }
          });

        const botMsgElem = document.getElementById('bot-message');
        if (botMsgElem && data.response) {
            botMsgElem.innerHTML = data.response;
        }
    } catch (error) {
        console.error("Error:", error);
        addMessage("bot", "❌ There was an error processing your request.");
    } finally {
        userInput.value = "";
        imageUpload.value = "";
        preview.src = "";
        previewWrapper.style.display = "none";
        userInput.disabled = false;
        hideTypingIndicator();
    }
}

let currentUtterance = null;

function addMessage(sender, text, imageData = null) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    if (imageData) {
        const img = document.createElement("img");
        img.src = imageData;
        img.className = "message-image";
        contentDiv.appendChild(img);
    }

    if (text) {
        const textDiv = document.createElement("div");
        textDiv.innerHTML = text;
        contentDiv.appendChild(textDiv);

        if (sender === "bot") {
            const speakStopBtn = document.createElement("button");
            speakStopBtn.innerHTML = '<img src= "../static/speaker.svg"/>';
            speakStopBtn.className = "speak-stop-button";
            speakStopBtn.style.cssText = `
                // background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
                color: #fff;
          
                border: none;
                border-radius: 12px 12px 12px 12px;
                margin: 2px 0 2px 8px;
                cursor: pointer;
                transition: box-shadow 0.2s, transform 0.2s, background 0.2s;
                box-shadow: 0 4px 12px rgba(40,60,120,0.12);
                width: 36px;
                height: 36px;
                display: inline-flex;
                align-items: left;
                justify-content: center;
                outline: none;
                position: relative;
                background:transparent;
                margin-left:90%;
            `;
            speakStopBtn.onmouseover = () => {
                // speakStopBtn.style.background = currentUtterance
                //     ? "linear-gradient(135deg, #ff5858 0%, #f09819 100%)"
                //     : "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";
                speakStopBtn.style.transform = "scale(1.08)";
                speakStopBtn.style.boxShadow = "0 6px 18px rgba(40,60,120,0.18)";
            };
            speakStopBtn.onmouseout = () => {
                // speakStopBtn.style.background = currentUtterance
                //     // ? "linear-gradient(135deg, #ff5858 0%, #f09819 100%)"
                //     // : "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)";
                speakStopBtn.style.transform = "scale(1)";
                speakStopBtn.style.boxShadow = "0 4px 12px rgba(40,60,120,0.12)";
            };
            speakStopBtn.onclick = () => {
                if (currentUtterance) {
                    window.speechSynthesis.cancel();
                    currentUtterance = null;
         
                } else {
                    window.speechSynthesis.cancel();
                    const voices = window.speechSynthesis.getVoices();
                    const selectedVoice = voices[10]
            
                    currentUtterance = new SpeechSynthesisUtterance(textDiv.innerText);
                    currentUtterance.voice = selectedVoice;
                    currentUtterance.lang = "en-IN";
                    currentUtterance.pitch = 1.4;
                    currentUtterance.rate = 1;
                    currentUtterance.volume = 1;
            
                    // x
            
                    currentUtterance.onend = () => {
                        currentUtterance = null;
                        
                    };
            
                    window.speechSynthesis.speak(currentUtterance);
                }
            };
            

            speakStopBtn.onfocus = () => {
                // speakStopBtn.style.boxShadow = "0 0 0 3px #a0c4ff, 0 4px 12px rgba(40,60,120,0.12)";
            };
            speakStopBtn.onblur = () => {
                speakStopBtn.style.boxShadow = "0 4px 12px rgba(40,60,120,0.12)";
            };

            contentDiv.appendChild(speakStopBtn);
        }
    }

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    moveTypingIndicatorToBottom();
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

function showTypingIndicator() {
    const existing = document.querySelector(".typing-indicator");
    if (existing) existing.remove();

    const typing = document.createElement("div");
    typing.classList.add("typing-indicator");

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.classList.add("typing-dot");
        typing.appendChild(dot);
    }

    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const existing = document.querySelector(".typing-indicator");
    if (existing) existing.remove();
}

function moveTypingIndicatorToBottom() {
    const indicator = document.querySelector(".typing-indicator");
    if (indicator) {
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function toggleMenu() {
    const menu = document.getElementById("hamburgerMenu");
    if (menu) {
        menu.classList.toggle("active");
    }
}

function hideMenu() {
    const menu = document.getElementById("hamburgerMenu");
    if (menu) {
        menu.classList.remove("active");
    }
}

function voice() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-GB";
    recognition.interimResults = false;

    const inputField = document.getElementById("user-input");
    const indicator = document.getElementById("listening-indicator");

    indicator.style.display = "block";

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        inputField.value = transcript;
        indicator.style.display = "none";
    };

    recognition.onend = function () {
        if (indicator.style.display !== "none") {
            indicator.style.display = "none";
        }
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        indicator.style.display = "none";
    };

    recognition.start();
}

document.getElementById('image-upload').addEventListener('change', function () {
    const file = this.files[0];
    const preview = document.getElementById('image-preview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
});

imageUpload.addEventListener('change', function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            previewWrapper.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewWrapper.style.display = 'none';
        preview.src = '';
    }
});

removeBtn.addEventListener('click', function () {
    imageUpload.value = '';
    previewWrapper.style.display = 'none';
    preview.src = '';
});

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [],
    FPS = 30,
    x = 100,
    mouse = { x: 0, y: 0 };

for (var i = 0; i < x; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1 + 1,
        vx: Math.floor(Math.random() * 50) - 25,
        vy: Math.floor(Math.random() * 50) - 25
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";

    for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.fillStyle = "#00e600";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.stroke();
    }

    ctx.beginPath();
    for (var i = 0; i < stars.length; i++) {
        var starI = stars[i];
        ctx.moveTo(starI.x, starI.y);
        if (distance(mouse, starI) < 150) ctx.lineTo(mouse.x, mouse.y);
        for (var j = 0; j < stars.length; j++) {
            var starII = stars[j];
            if (distance(starI, starII) < 150) {
                ctx.lineTo(starII.x, starII.y);
            }
        }
    }

    ctx.lineWidth = 0.05;
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function distance(point1, point2) {
    var xs = point2.x - point1.x;
    var ys = point2.y - point1.y;
    return Math.sqrt(xs * xs + ys * ys);
}

function update() {
    for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.x += s.vx / FPS;
        s.y += s.vy / FPS;

        if (s.x < 0 || s.x > canvas.width) s.vx = -s.vx;
        if (s.y < 0 || s.y > canvas.height) s.vy = -s.vy;
    }
}

canvas.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function tick() {
    draw();
    update();
    requestAnimationFrame(tick);
}

tick();