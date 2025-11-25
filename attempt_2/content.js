console.log('content script loaded')
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === "search") {
//     let query = request.query.toLowerCase();
//     let nodes = document.getElementsByTagName("*");

//     for (let i = 0; i < nodes.length; i++) {
//       let node = nodes[i];

//       if (node.nodeType === Node.TEXT_NODE && node.parentNode.tagName !== "SCRIPT") {
//         let text = node.nodeValue.toLowerCase();
//         let index = text.indexOf(query);

//         if (index >= 0) {
//           let span = document.createElement("span");
//           span.style.backgroundColor = "yellow";
//           span.textContent = text.substr(index, query.length);
//           console.log(span.textContent);

//           let before = document.createTextNode(text.substr(0, index));
//           let after = document.createTextNode(text.substr(index + query.length));

//           node.parentNode.insertBefore(before, node);
//           node.parentNode.insertBefore(span, node);
//           node.parentNode.insertBefore(after, node.nextSibling);

//           node.parentNode.removeChild(node);
//         }
//       }
//     }

//     sendResponse({});
//   }
// });
