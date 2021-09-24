// global map object keep tracks of which keys have been pressed
let keys = []

// global modifiable variable to keep track of whether the user has changed the regex box value
var input_changed = false

// Keep watching `keydown` event on `regex_box` input
onkeydown = (e) => {
  keys[e.keyCode] = e.type === 'keydown'

  if(document.getElementById('regex_box') === document.activeElement) {

    // changed text + pressed enter
    if(!keys[16] && keys[13]) {
      keys[13] = false
      send_message({
        'input': e.target.value,
        'new_search': input_changed,
        'is_next': true
      })

    // NOT changed text + pressed shift & enter
    } else if(keys[16] && keys[13]) {
      keys[13] = false
      keys[16] = false

      send_message({
        'input': e.target.value,
        'new_search': input_changed,
        'is_next': false
      })

    // pressed any key other than shift or enter
    } else {
      keys[13] = false
      keys[16] = false
      input_changed = true
    }
  }
}


/**
 * Sends message to `content.js` with following parameters
 *
 * params <object>            : an object containing the parameters sent as message
 *    {
 *      'input' <str>         : the regular expression from input box
 *      'new_search' <bool>   : true if new input has been provided, false otherwise
 *      'is_next' <bool>    : if true select next matched result, if false select prev matched result
 *      'tab' <obj>           : current chrome tab object
 *    }
 *
 * resp <object>              : is a response object received from `content.js`
 *    {
 *      'index'               : the index of the selected matched result
 *      'total'               : total number of matched results
 *    }
 */
let send_message = (params) => {
  chrome.tabs.query({ 'active': true, 'currentWindow': true }, (currTab) => {
    // update params object with all current tab info
    params['tab'] = currTab[0]

    // send params to `content.js` & expect a response
    chrome.tabs.sendMessage(currTab[0].id, params, (resp) => {
      // populate number of results on input box
      document.getElementById('results').textContent = `${resp['index']} of ${resp['total']}`

      // default input changed flag to false
      input_changed = false
    })
  })
}

/**
 * Generic event handler capturer for buttons
 *
 * params
 *    `e` <event obj> - event object containing details about event
 */
let clickable = (e) => {
  e.preventDefault()
  let fns = {
    'next': sel_next_prev,
    'prev': sel_next_prev,
    'flags': flags,
    'clipboard': clipboard,
    'cheatsheet': cheatsheet
  }
  let fn = (e.target.tagName.toLowerCase() === 'i') ? e.target.parentNode.getAttribute('id') : e.target.getAttribute('id')

  switch(fn) {
    case 'next':
      sel_next_prev(true)
      break
    case 'prev':
      sel_next_prev(false)
      break
    case 'flags':
      flags()
      break
    case 'clipboard':
      clipboard()
      break
    case 'cheatsheet':
      cheatsheet()
      break
  }
}

document.querySelectorAll('a').forEach((a_tag) => {
  a_tag.addEventListener('click', clickable)
})

/**
 * Get input value of regex box text box
 *
 * params
 *    `id` <str> - the ID of the input element
 *
 * returns
 *    `value` <str> - the value of the input element
 */
let get_input = (id='regex_box') => {
  return document.getElementById(id).value
}

let sel_next_prev = (is_next) => {
  send_message({
    'input': get_input(),
    'new_search': input_changed,
    'is_next': is_next
  })
}


let flags = () => {
  // show & hide flag options
  // get selected/updated flags
  // perform search again
  console.log('flags')
}

let clipboard = () => {
  console.log('clipboard')
}

let cheatsheet = () => {
  console.log('cheatsheet')
}