// /* Received returnSearchInfo message, set badge text with number of results */
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if(request.message == 'returnSearchInfo') {
//     chrome.browserAction.setBadgeText({
//       'text': String(request.numResults),
//       'tabId': sender.tab.id
//     })
//   }
// })
