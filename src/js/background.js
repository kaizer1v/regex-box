// will run as soon as chrome is loadeds
console.log('background console print');


/* Received returnSearchInfo message, set badge text with number of results */
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log(request)

  // if(request.message == 'returnSearchInfo') {
  //   chrome.browserAction.setBadgeText({
  //     'text': String(request.numResults),      // setting a blue tab button on the extension
  //     'tabId': sender.tab.id
  //   })
  // }
// })
