let gl;   // declare a global variable `gl`

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  let regex,
      fn_map = {
        'search': fn_search,
        'clipboard': fn_clipboard
      }

  try {
    regex = new RegExp(req.input)
  } catch(e) {
    console.error(e)
    return false
  }

  // append `regex obj` as parameter to appropriate function
  req['params']['regex'] = regex

  // call appropriate function based on mapping & interaction
  let to_return = fn_map[req['fn']](req['params'] ? req['params'] : {})

  // send appropriate response based on called function
  sendResponse(to_return)
})


let fn_search = (params) => {
  if(params['new_search']) {
    // remove old highlights & highlight new matches again
    highlight_remove('mark.highlighted, mark.selected')
    gl = highlight(params['regex'], document.getElementsByTagName('body')[0])
  } else {
    // select next or previous matched item, based on `is_next` flag
    gl['index'] = (params['is_next']) ? el_select(gl['index'] += 1, gl['arr']) : el_select(gl['index'] -= 1, gl['arr'])
  }

  return {
    'arr': gl,
    'index': gl['index'],
    'total': gl['total']
  }
}


let fn_clipboard = () => {
  console.log('copy to clipboard');
}


/**
 * Search and highlight regex pattern within a given `el`
 *
 * Params
 *    `regex`: a regex object
 *    `el`   : the element within which the regex search needs to be conducted
 *
 * Returns
 *    `total`: total number of matched results
 *    `index`: current highlighted result out of total
 *    `arr`:   an array of all matched elements
 */
let highlight = (regex, el) => {
  let total = 0,
      arr = [],
      omit = /(html|title|iframe|meta|link|script|style|svg|audio|canvas|figure|video|select|input|textarea)/i
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

        arr.push(mark)
        total += 1
        return 1
      }
    } else if(is_hidden(el)) {
      for(let i = 0; i < el.childNodes.length; ++i) {
        i += recur(el.childNodes[i])
      }
    }
    return 0
  }
  recur(el)

  return {
    'total': total,
    'arr': arr,
    'index': 1
  }
}


/**
 * Clear all highlighting from page for a given query selector
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
let el_select = (index, highlighted_els) => {
  // unselect all highlighted elements
  highlighted_els.forEach((el) => {
    el.style.backgroundColor = 'red'
    el.classList.remove('selected')
  })

  // if index is out of bounds, then cycle back
  if(index < 0) {
    index = highlighted_els.length
  }
  if(index > highlighted_els.length - 1) {
    index = 0
  }

  // only change the background of the selected node
  highlighted_els[index].style.backgroundColor = 'green'
  highlighted_els[index].classList.add('selected')

  el_scroll_to(highlighted_els[index])
  return index
}


/**
 * Scroll to `el`'s position on page
 */
let el_scroll_to = (el) => {
  el.scrollIntoView({
    behaviour: 'auto',
    block: 'center',
    inline: 'center'
  })
}


