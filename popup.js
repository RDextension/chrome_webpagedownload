document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('download').addEventListener('click', () => {
        let urls = document.getElementById('urls').value.split('\n');
        chrome.runtime.sendMessage({action: 'download', urls: urls});
    });
});
