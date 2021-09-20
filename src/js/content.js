chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('received', msg)
  let regex;
  let results = [];

  try {
    regex = new RegExp(msg.input);
  } catch(e) {
    console.error(e);
    return false;
  }

  // STEP 1 - highlight all text matching regex pattern
  highlight_remove('mark.highlighted, mark.selected')
  highlight(regex, document.getElementsByTagName('body')[0])

  // STEP 2 - select the first matching result
  // STEP 3 - on `enter` move to next matching result + on `shift+enter` move to prev matching result
  // STEP 4 - on `esc` remove all highlights and close regexbox
  // STEP 5 - on changing of regex value in textbox, re-search and highlight new matching results
})

/**
 * Search and highlight regex pattern within a given `el`
 */
let highlight = (regex, el) => {
  let unexpandable = /(script|style|svg|audio|canvas|figure|video|select|input|textarea)/i;

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
  let is_collapsed = (el) => {
    return (el) && (el.nodeType === 1) && (el.hasChildNodes()) && (!unexpandable.test(el.tagName)) && (is_visible(el))
  }

  let recur = (el) => {
    // if `el` type is a text element
    if(el && el.nodeType === 3) {
      let result_index = el.data.search(regex)       // search within content of the element
      if(result_index >= 0) {
        let matchedText = el.data.match(regex)[0]
        let matchedTextNode = el.splitText(result_index)      // ?? could have been `el`
        matchedTextNode.splitText(matchedText.length)

        let tag = document.createElement('mark')
        tag.className = 'highlighted'
        tag.style.backgroundColor = '#ffff00'
        tag.style.color = '#ff9900'
        tag.appendChild(matchedTextNode.cloneNode(true))    // create a deep copy of the node
        matchedTextNode.parentNode.replaceChild(tag, matchedTextNode)

        // results.push(tag)
        // searchInfo.length += 1
        // debugger;
        return
      }
    } else if(is_collapsed(el)) {
      for(let i = 0; i < el.childNodes.length; ++i) {
        let child = el.childNodes[i]
        i += recur(child)
      }
    }
    return 0
  }

  recur(el)
}

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
  results[index].style.backgroundColor = red
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