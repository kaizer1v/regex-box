/* Received returnSearchInfo message, set badge text with number of results */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.message == 'returnSearchInfo') {
    chrome.browserAction.setBadgeText({
      'text': String(request.numResults),
      'tabId': sender.tab.id
    });
  }
});


// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//   chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//     console.log(response.farewell);
//   });
// });
