chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download') {
    let urls = request.urls;

    function downloadNext() {
      if (urls.length > 0) {
        let url = urls.pop();

        chrome.tabs.create({url: url}, (tab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === tab.id && changeInfo.status === 'complete') {
              chrome.tabs.onUpdated.removeListener(listener);

              chrome.scripting.executeScript({
                target: {tabId: tab.id},
                function: () => {
                  let pageName = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase(); // use the tab title as the folder name
                  let text = document.body.innerText;
                  let html = document.documentElement.outerHTML;
                  let images = Array.from(document.images).map(img => img.src);

                  return {pageName, text, html, images};
                },
              }, (results) => {
                if (chrome.runtime.lastError) {
                  // An error occurred :(
                  console.error(chrome.runtime.lastError);
                } else {
                  let {pageName, text, html, images} = results[0].result;

                  // Download the images
                  images.forEach((imageUrl, index) => {
                    chrome.downloads.download({
                      url: imageUrl,
                      filename: `${pageName}/image${index}.jpg`  // Save images in a folder named after the page
                    });
                  });

                  // Download the text
                  let textBlob = new Blob([text], {type: 'text/plain'});
                  let textUrl = URL.createObjectURL(textBlob);
                  chrome.downloads.download({
                    url: textUrl,
                    filename: `${pageName}/text.txt`  // Save text in a folder named after the page
                  });

                  // Download the HTML
                  let htmlBlob = new Blob([html], {type: 'text/html'});
                  let htmlUrl = URL.createObjectURL(htmlBlob);
                  chrome.downloads.download({
                    url: htmlUrl,
                    filename: `${pageName}/page.html`  // Save HTML in a folder named after the page
                  });
                }

                // Move on to the next URL
                downloadNext();
              });
            }
          });
        });
      }
    }

    downloadNext();
  }
});
