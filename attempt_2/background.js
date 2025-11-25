chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "ON",
  });
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "search") {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       chrome.tabs.sendMessage(tabs[0].id, { action: "search", query: request.query }, function () {});
//     });
//   }
// });
