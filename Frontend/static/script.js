let stopTyping = false;
document.addEventListener('DOMContentLoaded', async function () {
    const resultbox = document.querySelector('.resultbox')
    const voiceBtn = document.querySelector('.voiceBtn');
    const searchbar = document.querySelector('.searchbar')
    const clearBtn = document.querySelector('.clearBtn')

    if (clearBtn) {
        console.log("Clear button found")
        clearBtn.addEventListener('click', async function () {
            resultbox.innerHTML = ""
            stopTyping = true;
        })
    }

    if (searchbar) {
        searchbar.addEventListener('keydown', async function (event) {
            if (event.key === 'Enter') {  // Check if Enter key is pressed
                event.preventDefault();  // Prevent default form submission or any other default behavior

                // Clear the resultbox before displaying new response
                userTxt = searchbar.value
                // Trigger the bot response function
                let botResponse = await getBotResponse(userTxt);

                if (botResponse) {
                    // Display the bot's response with a typing effect
                    stopTyping = false
                    await typeEffect(resultbox, botResponse);
                } else {
                    resultbox.innerHTML = 'Error: No response received from the bot.';
                }

                // Clear the searchbar after getting the response
                searchbar.value = '';
            }
        });
    }

    let mediaRecorder;
    let audioChunks = [];

    if (voiceBtn) {
        console.log("Voice Btn found");

        voiceBtn.addEventListener('click', async () => {
            if (!mediaRecorder || mediaRecorder.state === "inactive") {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    mediaRecorder = new MediaRecorder(stream);

                    mediaRecorder.onstart = () => {
                        audioChunks = [];
                        console.log("Recording started...");
                        voiceBtn.style.backgroundColor = "yellow";
                    };

                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };

                    mediaRecorder.onstop = async () => {
                        console.log("Recording stopped.");
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        voiceBtn.style.backgroundColor = "";
                        voiceBtn.textContent = "🎙️";  // Reset icon after stopping
                        const audioArrayBuffer = await audioBlob.arrayBuffer();
                        const audioBytes = new Uint8Array(audioArrayBuffer);
                        let { User_Voice, Bot_Voice } = await sendVoiceData(audioBytes);
                        console.log(User_Voice)
                        searchbar.value = User_Voice
                        stopTyping = false
                        await typeEffect(resultbox, Bot_Voice);
                    };

                    mediaRecorder.start();

                } catch (error) {
                    console.error("Error accessing microphone: ", error);
                }
            } else if (mediaRecorder.state === "recording") {
                mediaRecorder.stop();
            }
        });
    }

    // Get references to the elements
    const pdfBtn = document.getElementById('pdfBtn');
    const pdfInput = document.getElementById('pdfInput');
    const imageBtn = document.getElementById('imageBtn');
    const imageInput = document.getElementById('imageInput');
    const urlBtn = document.getElementById('urlBtn');
    const urlInput = document.getElementById('urlInput');
    const sendBtn = document.getElementById('sendBtn');

    let currentInput = '';

    // When the PDF button is clicked
    pdfBtn.onclick = function () {
        pdfInput.click(); // Trigger the hidden PDF input
    };

    // When a PDF is selected
    pdfInput.onchange = function () {
        currentInput = pdfInput.files[0]; // Get the selected PDF file
        sendBtn.style.display = 'block'; // Show the send button
        
    };

    // When the Image button is clicked
    imageBtn.onclick = function () {
        imageInput.click(); // Trigger the hidden Image input
    };

    // When an Image is selected
    imageInput.onchange = function () {
        currentInput = imageInput.files[0]; // Get the selected Image file
        sendBtn.style.display = 'block'; // Show the send button
        console.log("is it 1",currentInput instanceof File)
    };

    // When the URL button is clicked
    urlBtn.onclick = function () {
        urlInput.style.display = 'block'; // Show the URL input box
        urlInput.focus(); // Focus on the URL input box
    };

    // When the URL input changes
    urlInput.onchange = function () {
        currentInput = urlInput.value; // Get the entered URL
        sendBtn.style.display = 'block'; // Show the send button
    };


    sendBtn.onclick = async function () {
        console.log("Sending to AI:", currentInput);
        console.log("is it 2",currentInput instanceof File)

        if (currentInput.type === "application/pdf") {
            const loadingInterval = await showLoadingDots(resultbox);
            let botpdfres = await getBotPdfResponse(currentInput);
            console.log(botpdfres)
            currentInput = '';
            pdfInput.value = '';
            sendBtn.style.display = 'none';
            await stopLoadingDots(loadingInterval, resultbox);
            stopTyping = false
            await typeEffect(resultbox, botpdfres);
        }
        else if (currentInput.type === "image/jpeg") {
            const loadingInterval = await showLoadingDots(resultbox);
            try {
                
                let botImgRes = await getBotImgResponse(currentInput);
                console.log(botImgRes);
                await stopLoadingDots(loadingInterval, resultbox);
                resultbox.innerHTML = ''; // Clear previous content

                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-container';
                resultbox.appendChild(imgContainer);

                const imgElement = document.createElement('img');
                imgElement.src = URL.createObjectURL(currentInput); // Create a URL for the selected file
                console.log(currentInput instanceof File)
                console.log("Image url:",URL.createObjectURL(currentInput) )
                imgElement.alt = "Uploaded Image";
                imgElement.style.maxWidth = '100%';
                imgElement.style.maxHeight = '400px';

                imgContainer.appendChild(imgElement);
                

                const responseContainer = document.createElement('div');
                responseContainer.className = 'response-text';
                resultbox.appendChild(responseContainer);


                imgElement.onload = async () => {
                    stopTyping = false;
                    await typeEffect(responseContainer, botImgRes);
                };
            } catch (error) {
                console.error('Error fetching image response:', error);
                await stopLoadingDots(loadingInterval, resultbox);
            }
        }
        else {
            const loadingInterval = await showLoadingDots(resultbox);
            let boturlRes = await getBoturlResponse(currentInput)
            console.log(boturlRes)
            urlInput.style.display = 'none';
            urlInput.value = '';
            currentInput = '';
            sendBtn.style.display = 'none';
            await stopLoadingDots(loadingInterval, resultbox);
            stopTyping = false
            await typeEffect(resultbox, boturlRes);
        }




        // currentInput = '';
        // sendBtn.style.display = 'none';
        // urlInput.style.display = 'none';
        // urlInput.value = ''; 
        // pdfInput.value = ''; 
        // imageInput.value = ''; 
    };

});


async function sendVoiceData(audioBytes) {
    console.log("Sending voice data to server...");
    try {
        const response = await fetch('/api/get_voice_response_from_whisper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            body: audioBytes,
        });

        const data = await response.json();
        console.log("Server response:", data);
        return {
            User_Voice: data.User_Voice,
            Bot_Voice: data.Bot_Voice
        }
    } catch (error) {
        console.log("Error getting response:", error);
    }
}


async function getBoturlResponse(url) {
    console.log("Sending url data to server...");
    try {
        const response = await fetch('/api/get_url_response_from_llm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        });

        const data = await response.json();
        console.log("Server response:", data);
        return data.BotUrl

    } catch (error) {
        console.log("Error getting response:", error);
    }
}


async function getBotResponse(message) {
    console.log("Sending text data to server...");
    try {
        const response = await fetch('/api/get_text_response_from_llm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        });

        const data = await response.json();
        console.log("Server response:", data);
        return data.BotTxt

    } catch (error) {
        console.log("Error getting response:", error);
    }
}

async function typeEffect(element, text) {
    const typingSpeed = 50;
    let i = 0;
    while (i < text.length && !stopTyping) {
        element.innerHTML += text.charAt(i);
        i++;
        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
    }
}

async function getBotPdfResponse(pdfFile) {
    const formData = new FormData();
    formData.append('file', pdfFile);

    try {
        const response = await fetch('/api/get_pdf_response_from_llm', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result.botResTxt;

    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}

async function showLoadingDots(element) {
    return new Promise((resolve) => {
        let dots = '';
        const interval = setInterval(() => {
            dots += '.';
            if (dots.length > 3) {
                dots = '';
            }
            element.innerText = `Processing${dots}`;
        }, 500);

        resolve(interval);
    });
}

async function stopLoadingDots(interval, element) {
    clearInterval(interval);
    element.innerText = '';
}

async function getBotImgResponse(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
        const response = await fetch('/api/get_image_response_from_llm', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result.botImgResTxt;

    } catch (error) {
        console.error('Error during fetch:', error);
        throw error;
    }
}
