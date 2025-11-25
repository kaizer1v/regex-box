document.addEventListener("DOMContentLoaded", () => {
  let searchInput = document.getElementById("search-input");
  let searchButton = document.getElementById("search-button");

  searchButton.addEventListener("click", () => {
    console.log('searched for')
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "search", query: searchInput.value }, function () {});
    });
  });
});
