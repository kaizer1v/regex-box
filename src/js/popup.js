let map = []
var input_changed = false       // global modifiable variable

// Keep watching `keydown` event on `inputRegex` input box
onkeydown = (e) => {
  map[e.keyCode] = e.type === 'keydown'

  if(document.getElementById('inputRegex') === document.activeElement) {

    // changed text + pressed enter
    if(!map[16] && map[13]) {
      map[13] = false
      send_message({
        'input': e.target.value,
        'new_search': input_changed,
        'next_prev': true
      })

    // NOT changed text + pressed shift & enter
    } else if(map[16] && map[13]) {
      map[13] = false
      map[16] = false

      send_message({
        'input': e.target.value,
        'new_search': input_changed,
        'next_prev': false
      })
    } else {
      map[13] = false
      map[16] = false
      input_changed = true
    }
  }
}

let send_message = (params) => {
  chrome.tabs.query({ 'active': true, 'currentWindow': true }, (currTab) => {
    // update params object with all current tab info
    params['tab'] = currTab[0]

    // send params to `content.js` & expect a response
    chrome.tabs.sendMessage(currTab[0].id, params, (resp) => {
      // populate number of results on input box
      document.getElementById('numResults').textContent = `${resp['results_index']} of ${resp['results_total']}`
      input_changed = false
    })
  })
}
