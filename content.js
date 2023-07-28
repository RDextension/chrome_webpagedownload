// This script is injected into the webpage and can access the DOM

// Function to extract the HTML from the webpage
function extractHTML() {
    return document.documentElement.outerHTML;
}

// Function to extract the text from the webpage
function extractText() {
    return document.body.innerText;
}

// Function to extract the URLs of the images on the webpage
function extractImages() {
    let images = document.images;
    let imageUrls = [];
    for (let i = 0; i < images.length; i++) {
        imageUrls.push(images[i].src);
    }
    return imageUrls;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extract') {
        let text = extractText();
        let imageUrls = extractImages();
        let html = extractHTML();
        sendResponse({text: text, imageUrls: imageUrls, html: html});
    }
});
