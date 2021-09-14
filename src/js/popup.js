
/*** CONSTANTS ***/
let DEFAULT_INSTANT_RESULTS = true;
let ERROR_COLOR = '#F8D7DA';
let WHITE_COLOR = '#ffffff';
let ERROR_TEXT = "Content script was not loaded on this url or please wait for the page to load.";
let HISTORY_IS_EMPTY_TEXT = "Search history is empty.";
let CLEAR_ALL_HISTORY_TEXT = "Clear History";
let DEFAULT_CASE_INSENSITIVE = false;
let MAX_HISTORY_LENGTH = 30;
/*** CONSTANTS ***/

/*** VARIABLES ***/
let sentInput = false;          // ???
// let processingKey = false;      // ???
let searchHistory = null;
let maxHistoryLength = MAX_HISTORY_LENGTH;
/*** VARIABLES ***/

/**ELEMENTS**/
let txt_regex = document.getElementById('inputRegex');
let num_results = document.getElementById('numResults');
let btn_next = document.getElementById('next');
let btn_prev = document.getElementById('prev');
let btn_flag = document.getElementById('insensitive');


/**
 * Initialisation - run when the extension is opened
 */
/* Received returnSearchInfo message, populate popup UI */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.message == 'returnSearchInfo') {
    // processingKey = false;

    // update the results `0 of 0` text
    if(request.numResults > 0) {
      num_results.textContent = String(request.currentSelection+1) + ' of ' + String(request.numResults);
    } else {
      num_results.textContent = String(request.currentSelection) + ' of ' + String(request.numResults);
    }


    if(!sentInput) {
      txt_regex.value = request.regexString;
    }
    if(request.numResults > 0 && request.cause == 'selectNode') {
      addToHistory(request.regexString);
    }
    if(request.regexString !== txt_regex.value) {
      search();
    }
  }
});

/**
 * Input box keydown event listener
 */
txt_regex.addEventListener('keydown', (e) => {
  if(e.code == 'Enter' && e.code != 'Shift') {                // ENTER
    next_prev(true)
  } else if (e.code == 'Shift' && (e.code == 'Enter')) {      // SHIFT + ENTER
    next_prev(false)
  // } else if () {                                           // ESC key
    // TODO: remove highlights from page + close box
  } else {
    search()                                                  // any char other than SHIFT or ENTER
  }
}, true)


/**
 * Sets regbex text box's state (error or normal) based on validity
 */
let set_status_regbox = (valid) => {
  txt_regex.style.backgroundColor = (!valid) ? ERROR_COLOR : WHITE_COLOR
  return
}

/**
 * Fire the query to search pattern on browser page
 */
let search = (changed=undefined) => {
  console.log('yo o yo');
  // search query corrent + incorrect ones
  chrome.tabs.query({ 'active': true, 'currentWindow': true }, (tabs) => {
    if(typeof tabs[0].id != 'undefined') {
      chrome.tabs.sendMessage(tabs[0].id, {
        'message': 'search',
        'regexString': txt_regex.value,
        'configurationChanged': changed,
        'getNext': true
      });
      sentInput = true
    }
    // chrome.storage.local.set({lastSearch: txt_regex.value});
  });

  set_status_regbox(is_valid_regex(txt_regex.value))   // set text box state (error or normal)
}

/*** FUNCTIONS ***/
/* Validate that a given pattern string is a valid regex */
let is_valid_regex = (pattern) => {
  try {
    new RegExp(pattern)
    return true
  } catch(e) {
    console.error(e)
    return false
  }
}

/**
 * Select next or previous based on `true` or `false`
 */
let next_prev = (next=true) => {
  let msg = (next) ? 'selectNextNode' : 'selectPrevNode'
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  }, (tabs) => {
    if(typeof tabs[0].id != 'undefined') {
      chrome.tabs.sendMessage(tabs[0].id, {
        'message': msg
      })
    }
  })
  return true
}


let createHistoryLineElement = (text) => {
  var deleteEntrySpan = document.createElement('span');
  deleteEntrySpan.className = 'historyDeleteEntry fas fa-times'
  deleteEntrySpan.addEventListener('click', () => {
    for(let i = searchHistory.length - 1; i >= 0; i--) {
      if(searchHistory[i] == text) {
        searchHistory.splice(i, 1);
      }
    }
    chrome.storage.local.set({searchHistory: searchHistory});
    updateHistoryDiv();
  });
  var linkSpan = document.createElement('span');
  linkSpan.className = 'historyLink'
  linkSpan.textContent = text;
  linkSpan.addEventListener('click', () => {
    if (txt_regex.value !== text) {
      txt_regex.value = text;
      search();
      txt_regex.focus();
    }
  });
  var lineDiv = document.createElement('li');
  lineDiv.appendChild(deleteEntrySpan);
  lineDiv.appendChild(linkSpan);
  return lineDiv;
}

let updateHistoryDiv = () => {
  let historyDiv = document.getElementById('history');
  if(historyDiv) {
    historyDiv.innerHTML = '';

    // default history is empty message
    let span = document.createElement('span');
    span.className = 'historyIsEmptyMessage';
    span.textContent = HISTORY_IS_EMPTY_TEXT;
    historyDiv.appendChild(span);

    if(searchHistory.length != 0) {
      historyDiv.innerHTML = '';
      for(let i = searchHistory.length - 1; i >= 0; i--) {
        historyDiv.appendChild(createHistoryLineElement(searchHistory[i]));
      }

      // create `Clear History` button
      let clearButton = document.createElement('a');
      clearButton.href = '#';
      clearButton.type = 'button';
      clearButton.textContent = CLEAR_ALL_HISTORY_TEXT;
      clearButton.className = 'clearHistoryButton';
      clearButton.addEventListener('click', clearSearchHistory);
      historyDiv.appendChild(clearButton);
    }
  }
}

/**
 * adds search items to local storage list (after user presses enter)
 */
let addToHistory = (regex) => {
  if(regex && searchHistory !== null) {
    if(searchHistory.length == 0 || searchHistory[searchHistory.length - 1] != regex) {
      searchHistory.push(regex);
    }
    for(let i = searchHistory.length - 2; i >= 0; i--) {
      if(searchHistory[i] == regex) {
        searchHistory.splice(i, 1);
      }
    }
    if(searchHistory.length > maxHistoryLength) {
      searchHistory.splice(0, searchHistory.length - maxHistoryLength);
    }
    chrome.storage.local.set({searchHistory: searchHistory});
    updateHistoryDiv();
  }
}

/**
 * removes list of history items
 */
let clearSearchHistory = () => {
  searchHistory = [];
  chrome.storage.local.set({searchHistory: searchHistory});
  updateHistoryDiv();
}


/*** LISTENERS ***/
btn_next.addEventListener('click', (e) => {
  next_prev(true)
})

btn_prev.addEventListener('click', (e) => {
  next_prev(false)
})

document.getElementById('clear').addEventListener('click', (e) => {
  txt_regex.value = ''
  txt_regex.focus()
  search()
});

document.getElementById('show-history').addEventListener('click', (e) => {
  let makeVisible = document.getElementById('history').style.display == 'none';
  document.getElementById('history').style.display = makeVisible ? 'block' : 'none';
  document.getElementById('show-history').className = (makeVisible) ? 'selected' : '';
});

btn_flag.addEventListener('click', (e) => {
  let is_on = (e.target.dataset.on === 'true') ? true : false
  e.target.setAttribute('data-on', !is_on)
  e.target.className = (is_on) ? 'selected' : ''
  chrome.storage.local.set({ caseInsensitive: is_on })
  search(true)
})

document.getElementById('copy-to-clipboard').addEventListener('click', (e) => {
  chrome.tabs.query({ 'active': true, 'currentWindow': true }, (tabs) => {
    if(typeof tabs[0].id != 'undefined') {
      chrome.tabs.sendMessage(tabs[0].id, {
        'message': 'copyToClipboard'
      })
    }
  })
})

/*** LISTENERS ***/

/*** INIT ***/
/* Retrieve from storage whether we should use instant results or not */
chrome.storage.local.get({
  'instantResults' : DEFAULT_INSTANT_RESULTS,
  'maxHistoryLength' : MAX_HISTORY_LENGTH,
  'searchHistory' : null
  // 'isSearchHistoryVisible' : false
}, (result) => {
  let elem = (result.instantResults) ? 'input' : 'change'
  txt_regex.addEventListener(elem, (e) => {
    search()
  })

  if(result.maxHistoryLength) {
    maxHistoryLength = result.maxHistoryLength;
  }
  if(result.searchHistory) {
    searchHistory = result.searchHistory.slice(0);
  } else {
    searchHistory = [];
  }
  document.getElementById('history').style.display = result.isSearchHistoryVisible ? 'block' : 'none';
  document.getElementById('show-history').className = (result.isSearchHistoryVisible) ? 'selected' : '';
  updateHistoryDiv();
});

/* Get search info if there is any */
chrome.tabs.query({
  'active': true,
  'currentWindow': true
}, (tabs) => {
  if(typeof tabs[0].id == 'undefined') {
    chrome.tabs.sendMessage(tabs[0].id, {
      'message' : 'getSearchInfo'
    }, (resp) => {
      if(!resp) {
        document.getElementById('error').textContent = ERROR_TEXT
      }
    });
  }
});

/* Focus on input form */
txt_regex.focus()
txt_regex.select()
// window.setTimeout(() => { txt_regex.select() }, 0)
// Thanks to http://stackoverflow.com/questions/480735#comment40578284_14573552

var makeVisible = document.getElementById('history').style.display == 'none'
document.getElementById('history').style.display = makeVisible ? 'block' : 'none'
document.getElementById('show-history').className = (makeVisible) ? 'selected' : ''
chrome.storage.local.set({ isSearchHistoryVisible: makeVisible })