chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  let regex;

  try {
    regex = new RegExp(req.input);
  } catch(e) {
    console.error(e)
    return false
  }

  // remove old highlights & highlight new matches again
  highlight_remove('mark.highlighted, mark.selected')
  highlight(regex, document.getElementsByTagName('body')[0])

  // sendResponse({ 'is_new_search': false })
})

/**
 * Search and highlight regex pattern within a given `el`
 */
let highlight = (regex, el=document.getElementsByTagName('body')[0]) => {
  let omit = /(html|title|iframe|meta|link|script|style|svg|audio|canvas|figure|video|select|input|textarea)/i
  // let results = []
  console.log(regex, '>>><<<<', el);

  /**
   * Return true if `el` is visible on browser, else false
   */
  let is_visible = (el) => {
    let style = window.getComputedStyle(el)
    return ((el.offsetParent !== null) || (style.display !== 'none'))
  }

  /**
   * Return true if `el` is expandable/collapsed, else false
   */
  let is_hidden = (el) => {
    return (el.nodeType === 1) && (el.hasChildNodes()) && (!omit.test(el.tagName)) && (is_visible(el))
  }

  let recur = (el) => {
    // if(searchInfo.length >= maxResults) {
    //   return;
    // }

    // if `el` type is a text, then
    if (el.nodeType === 3) {

      // check if the text matches the regex pattern
      var index = el.data.search(regex)

      // if regex matches the text, then
      if(index >= 0) {

        // extract the matched text into a new node using splitText
        let matchedText = el.data.match(regex)[0]
        let matchedTextNode = el.splitText(index)
        matchedTextNode.splitText(matchedText.length)

        // create new highlight element & append extracted text into it
        let mark = document.createElement('mark')
        mark.className = 'highlighted'
        mark.style.backgroundColor = 'red'
        mark.style.color = 'white'
        mark.appendChild(matchedTextNode.cloneNode(true))

        // replace the original matched text with the new mark node
        matchedTextNode.parentNode.replaceChild(mark, matchedTextNode)

        // searchInfo.highlightedNodes.push(mark);
        // searchInfo.length += 1;
        return 1
      }
    } else if(is_hidden(el)) {
      for(let i = 0; i < el.childNodes.length; ++i) {
        i += recur(el.childNodes[i])
      }
    }
    return 0
  }
  recur(document.getElementsByTagName('body')[0])
}
/**
 * https://j11y.io/javascript/find-and-replace-text-with-javascript/
 */
// let results = []
// function findAndReplace(searchText, searchNode) {
//   // if(!searchText || typeof replacement === 'undefined') {
//   //   // Throw error here if you want...
//   //   return;
//   // }
//   var regex = searchText,
//       childNodes = (searchNode || document.body).childNodes,
//       cnLength = childNodes.length,
//       excludes = 'html,head,style,title,link,meta,script,object,iframe';
//   while(cnLength--) {
//     var currentNode = childNodes[cnLength];
//     if(currentNode.nodeType === 1 && (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1) {
//       // if the node is a container, then search inside the container
//       findAndReplace(searchText, currentNode);
//     }
//     if(currentNode.nodeType !== 3 || !regex.test(currentNode.data)) {     // if no match, then continue to next node
//       continue;
//     }

//     // if currentNode is a `text`
//     let result_index = currentNode.data.search(regex)                // search within content of the element
//     if(result_index >= 0) {

//       let matchedText = currentNode.data.match(regex)[0]
//       let matchedTextNode = currentNode.splitText(result_index)
//       matchedTextNode.splitText(matchedText.length)
//       console.log(matchedTextNode);

//       let tag = document.createElement('mark')
//       tag.className = 'highlighted'
//       tag.style.backgroundColor = 'red'
//       tag.style.color = 'white'
//       tag.appendChild(matchedTextNode.cloneNode(true))    // create a deep copy of the node

//       matchedTextNode.parentNode.replaceChild(tag, matchedTextNode)
//       results.push(currentNode)
//     }
//     console.log(results);
//     return results
//   }
// }

/**
 * Clear all highlighting from page
 */
let highlight_remove = (q) => {
  let highlighted = document.body.querySelectorAll(q)
  highlighted.forEach((e) => {
    e.outerHTML = e.innerHTML
  })
}

/**
 * Select regex matched element
 */
let el_select = (index, get_next) => {
  if(results.length === 0) return
  results[index].className = 'highlighted'
  results[index].style.backgroundColor = green

  if(get_next) {
    if(index === length - 1) {
      index = 0;
    } else {
      index += 1;
    }
  } else {
    if(index === 0) {
      index = length - 1;
    } else {
      index -= 1;
    }
  }
  results[index].className = 'selected'
  results[index].style.backgroundColor = orange
  parentNode = results[index].parentNode;
  if(parentNode.nodeType === 1) {
    parentNode.focus()
  } else if(parentNode.parentNode.nodeType == 1) {
    parentNode.parentNode.focus()
  }
  // returnSearchInfo('selectNode')
  el_scroll_to(results[index])
}


/**
 * Scroll to `el`'s position on page
 */
let el_scroll_to = (el) => {
  el.scrollIntoView()
  let top = el.documentOffsetTop() - (window.innerHeight / 2)
  window.scrollTo(0, Math.max(top, window.pageYOffset - (window.innerHeight / 2)))
}

/**
 * Select next matched element
 */
let result_next = (highlightedColor, selectedColor) => {
  el_select(highlightedColor, selectedColor, true)
}

/**
 * Select previous matched element
 */
let result_prev = (highlightedColor, selectedColor) => {
  el_select(highlightedColor, selectedColor, false)
}




// /*** CONSTANTS ***/
// var ELEMENT_NODE_TYPE = 1;
// var TEXT_NODE_TYPE = 3;
// var UNEXPANDABLE = /(script|style|svg|audio|canvas|figure|video|select|input|textarea)/i;
// var HIGHLIGHT_TAG = 'highlight-tag';
// var HIGHLIGHT_CLASS = 'highlighted';
// var SELECTED_CLASS = 'selected';
// var DEFAULT_MAX_RESULTS = 500;
// var DEFAULT_HIGHLIGHT_COLOR = '#ffff00';
// var DEFAULT_SELECTED_COLOR = '#ff9900';
// var DEFAULT_TEXT_COLOR = '#000000';
// var DEFAULT_CASE_INSENSITIVE = false;
// /*** CONSTANTS ***/

// /*** GLOBAL VARIABLE ***/
// var searchInfo;


// /*** LIBRARY FUNCTIONS ***/
// Element.prototype.documentOffsetTop = () => {
//   return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
// };
// Element.prototype.visible = function() {
//   return (!window.getComputedStyle(this) || window.getComputedStyle(this).getPropertyValue('display') == '' ||
//          window.getComputedStyle(this).getPropertyValue('display') != 'none')
// }
// /*** LIBRARY FUNCTIONS ***/


// /*** FUNCTIONS ***/
// /* Initialize search information for this tab */
// function initSearchInfo(pattern) {
//   var pattern = typeof pattern !== 'undefined' ? pattern : '';
//   searchInfo = {
//     regexString : pattern,
//     selectedIndex : 0,
//     highlightedNodes : [],
//     length : 0
//   }
// }

// /* Send message with search information for this tab */
// function returnSearchInfo(cause) {
//   chrome.runtime.sendMessage({
//     'message' : 'returnSearchInfo',
//     'regexString' : searchInfo.regexString,
//     'currentSelection' : searchInfo.selectedIndex,
//     'numResults' : searchInfo.length,
//     'cause' : cause
//   })
// }

// /* Check if the given node is a text node */
// function isTextNode(node) {
//   return node && node.nodeType === TEXT_NODE_TYPE;
// }

// /* Check if the given node is an expandable node that will yield text nodes */

// /* Highlight all text that matches regex */
// function highlight(regex, highlightColor, selectedColor, textColor, maxResults) {
//   function highlightRecursive(node) {
//     if(searchInfo.length >= maxResults) {
//       return;
//     }
//     if(isTextNode(node)) {
//       var index = node.data.search(regex);
//       if(index >= 0 && node.data.length > 0) {
//         var matchedText = node.data.match(regex)[0];
//         var matchedTextNode = node.splitText(index);
//         matchedTextNode.splitText(matchedText.length);
//         var spanNode = document.createElement(HIGHLIGHT_TAG);
//         spanNode.className = HIGHLIGHT_CLASS;
//         spanNode.style.backgroundColor = highlightColor;
//         spanNode.style.color = textColor;
//         spanNode.appendChild(matchedTextNode.cloneNode(true));
//         matchedTextNode.parentNode.replaceChild(spanNode, matchedTextNode);
//         searchInfo.highlightedNodes.push(spanNode);
//         searchInfo.length += 1;
//         return 1;
//       }
//     } else if(isExpandable(node)) {
//         var children = node.childNodes;
//         for(var i = 0; i < children.length; ++i) {
//           var child = children[i];
//           i += highlightRecursive(child);
//         }
//     }
//     return 0;
//   }
//   highlightRecursive(document.getElementsByTagName('body')[0]);
// };

// /* Remove all highlights from page */
// function removeHighlight() {
//   while (node = document.body.querySelector(HIGHLIGHT_TAG + '.' + HIGHLIGHT_CLASS)) {
//     node.outerHTML = node.innerHTML;
//   }
//     while (node = document.body.querySelector(HIGHLIGHT_TAG + '.' + SELECTED_CLASS)) {
//     node.outerHTML = node.innerHTML;
//   }
// };

// /* Scroll page to given element */
// let scrollToElement = (element) => {
//     element.scrollIntoView()
//     let top = element.documentOffsetTop() - (window.innerHeight / 2)
//     window.scrollTo(0, Math.max(top, window.pageYOffset - (window.innerHeight / 2)))
// }

// /**
//  *  Select first regex match on page
//  * config = {
//  *   selected_class: 'selected'
//  *   selected_color: ''
//  * }
//  */
// let selectFirstNode = (selectedColor, selectedClass) => {
//   if(searchInfo.length > 0) {
//     searchInfo.highlightedNodes[0].className = selectedClass
//     searchInfo.highlightedNodes[0].style.backgroundColor = selectedColor

//     parentNode = searchInfo.highlightedNodes[0].parentNode
//     if(parentNode.nodeType === 1) {
//       parentNode.focus()
//     } else if (parentNode.parentNode.nodeType == 1) {
//       parentNode.parentNode.focus()
//     }
//     scrollToElement(searchInfo.highlightedNodes[0]);
//   }
// }

// /* Helper for selecting a regex matched element */
// function selectNode(highlightedColor, selectedColor, getNext) {
//   var length = searchInfo.length;
//   if(length > 0) {
//     searchInfo.highlightedNodes[searchInfo.selectedIndex].className = HIGHLIGHT_CLASS;
//     searchInfo.highlightedNodes[searchInfo.selectedIndex].style.backgroundColor = highlightedColor;
//       if(getNext) {
//         if(searchInfo.selectedIndex === length - 1) {
//           searchInfo.selectedIndex = 0;
//         } else {
//           searchInfo.selectedIndex += 1;
//         }
//       } else {
//         if(searchInfo.selectedIndex === 0) {
//           searchInfo.selectedIndex = length - 1;
//         } else {
//           searchInfo.selectedIndex -= 1;
//         }
//       }
//     searchInfo.highlightedNodes[searchInfo.selectedIndex].className = SELECTED_CLASS;
//     searchInfo.highlightedNodes[searchInfo.selectedIndex].style.backgroundColor = selectedColor;
//     parentNode = searchInfo.highlightedNodes[searchInfo.selectedIndex].parentNode;
//     if (parentNode.nodeType === 1) {
//       parentNode.focus();
//     } else if (parentNode.parentNode.nodeType == 1) {
//       parentNode.parentNode.focus();
//     }
//     returnSearchInfo('selectNode');
//     scrollToElement(searchInfo.highlightedNodes[searchInfo.selectedIndex]);
//   }
// }
// /* Forward cycle through regex matched elements */
// function selectNextNode(highlightedColor, selectedColor) {
//   selectNode(highlightedColor, selectedColor, true);
// }

// /* Backward cycle through regex matched elements */
// function selectPrevNode(highlightedColor, selectedColor) {
//   selectNode(highlightedColor, selectedColor, false);
// }

// /* Validate that a given pattern string is a valid regex */
// function validateRegex(pattern) {
//   try{
//     var regex = new RegExp(pattern);
//     return regex;
//   } catch(e) {
//     return false;
//   }
// }

// /**
//  * MAINNNNNNNNNNNNNNNNNNN
//  */
// /* Find and highlight regex matches in web page from a given regex string or pattern */
// function search(regexString, configurationChanged) {
//   var regex = validateRegex(regexString);
//   if (regex && regexString != '' && (configurationChanged || regexString !== searchInfo.regexString)) { // new valid regex string
//     removeHighlight();
//     chrome.storage.local.get({
//       'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
//       'selectedColor' : DEFAULT_SELECTED_COLOR,
//       'textColor' : DEFAULT_TEXT_COLOR,
//       'maxResults' : DEFAULT_MAX_RESULTS,
//       'caseInsensitive' : DEFAULT_CASE_INSENSITIVE},
//       function(result) {
//         initSearchInfo(regexString);
//         if(result.caseInsensitive){
//           regex = new RegExp(regexString, 'i');
//         }
//         highlight(regex, result.highlightColor, result.selectedColor, result.textColor, result.maxResults);
//         selectFirstNode(result.selectedColor, SELECTED_CLASS)
//         returnSearchInfo('search');
//       }
//     );
//   } else if (regex && regexString != '' && regexString === searchInfo.regexString) { // elements are already highlighted
//     chrome.storage.local.get({
//       'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
//       'selectedColor' : DEFAULT_SELECTED_COLOR},
//       function(result) {
//         selectNextNode(result.highlightColor, result.selectedColor);
//       }
//     );
//   } else { // blank string or invalid regex
//     removeHighlight();
//     initSearchInfo(regexString);
//     returnSearchInfo('search');
//   }
// }
// /*** FUNCTIONS ***/

// ** LISTENERS **
// /* Received search message, find regex matches */
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if ('search' == request.message) {
//     search(request.regexString, request.configurationChanged);
//   }
//   /* Received selectNextNode message, select next regex match */
//   else if ('selectNextNode' == request.message) {
//     chrome.storage.local.get({
//       'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
//       'selectedColor' : DEFAULT_SELECTED_COLOR
//       },
//       function(result) {
//         selectNextNode(result.highlightColor, result.selectedColor);
//       }
//     );
//   }
//   /* Received selectPrevNode message, select previous regex match */
//   else if ('selectPrevNode' == request.message) {
//     chrome.storage.local.get({
//       'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
//       'selectedColor' : DEFAULT_SELECTED_COLOR
//       },
//       function(result) {
//         selectPrevNode(result.highlightColor, result.selectedColor);
//       }
//     );
//   }
//   else if ('copyToClipboard' == request.message) {
//     var clipboardHelper = document.createElement('textarea');
//     try {
//       var text = searchInfo.highlightedNodes.map(function (n) {
//         return n.innerText;
//       }).join('\n');
//       clipboardHelper.appendChild(document.createTextNode(text));
//       document.body.appendChild(clipboardHelper);
//       clipboardHelper.select();
//       document.execCommand('copy');
//     } finally {
//       document.body.removeChild(clipboardHelper);
//     }
//   }
//   /* Received getSearchInfo message, return search information for this tab */
//   else if ('getSearchInfo' == request.message) {
//     sendResponse({message: "I'm alive!"});
//     returnSearchInfo('getSearchInfo');
//   }
// });
// /*** LISTENERS ***/


// /*** INIT ***/
// initSearchInfo();
// /*** INIT ***/