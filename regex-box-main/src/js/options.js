/*** CONSTANTS ***/
const DEFAULT_MAX_RESULTS = 500;
const DEFAULT_HIGHLIGHT_COLOR = '#ffff00';
const DEFAULT_SELECTED_COLOR = '#ff9900';
const DEFAULT_TEXT_COLOR = '#000000';
const DEFAULT_MAX_HISTORY_LENGTH = 30;
const WHITE_COLOR = '#ffffff';
const ERROR_COLOR = '#ff8989';
const GOOD_COLOR = '#89ff89';
let DEFAULT_INSTANT_RESULTS = true;
/*** CONSTANTS ***/

/*** FUNCTIONS ***/
/* Mark status text */
function markStatus(text, time){
  let time = typeof time !== 'undefined' ? time : 1250;
  let status = document.getElementById('status');
  status.textContent = text;
  setTimeout(function() {
    status.textContent = '';
  }, time); 
}

/* Validate input for max results */
function validateMaxResults() {
  let inputVal = document.getElementById('maxResults').value;
  if (inputVal.match(/^\d+$/) && Number.isInteger(parseInt(inputVal))) {
    let num = parseInt(inputVal);
    if (num < Number.MAX_SAFE_INTEGER) {
      if (document.getElementById('maxResults') === document.activeElement) {
        document.getElementById('maxResults').style.backgroundColor = GOOD_COLOR;
        setTimeout(function() {
          document.getElementById('maxResults').style.backgroundColor = WHITE_COLOR;
        }, 1250);
      }
      return parseInt(inputVal);
    } else {
      markStatus(inputVal + " is too large.", 2000);
      document.getElementById('maxResults').style.backgroundColor = ERROR_COLOR;
    }
  } else {
    markStatus("'" + inputVal + "' is not an integer. Please try another value.", 2000);
    document.getElementById('maxResults').style.backgroundColor = ERROR_COLOR;
  }
  return false;
}

/* Save options to storage */
function saveOptions() {
  let maxResults = validateMaxResults();
  if (maxResults) {
    let options = {
      'highlightColor' : document.getElementById('highlightColor').value,
      'selectedColor' : document.getElementById('selectedColor').value,
      'textColor' : document.getElementById('textColor').value,
      'maxResults' : maxResults,
      'instantResults' :  document.getElementById('instantResults').checked,
      'maxHistoryLength' : document.getElementById('maxHistoryLength').value
    }
    
    chrome.storage.local.set(options, function() {
      markStatus('New settings saved');
    });
  }
}

/* Load options from storage */
function loadOptions() {
  chrome.storage.local.get({
    'highlightColor' : DEFAULT_HIGHLIGHT_COLOR,
    'selectedColor' : DEFAULT_SELECTED_COLOR,
    'textColor' : DEFAULT_TEXT_COLOR,
    'maxResults' : DEFAULT_MAX_RESULTS,
    'instantResults' : DEFAULT_INSTANT_RESULTS,
    'maxHistoryLength' : DEFAULT_MAX_HISTORY_LENGTH }, 
    function(result) {
      document.getElementById('highlightColor').value = result.highlightColor;
      document.getElementById('exampleHighlighted').style.backgroundColor = result.highlightColor;
      document.getElementById('selectedColor').value = result.selectedColor;
      document.getElementById('exampleSelected').style.backgroundColor = result.selectedColor;
      document.getElementById('textColor').value = result.textColor;
      document.getElementById('exampleHighlighted').style.color = result.textColor;
      document.getElementById('exampleSelected').style.color = result.textColor;
      document.getElementById('maxResults').value = result.maxResults;
      document.getElementById('instantResults').checked = result.instantResults;
      document.getElementById('maxHistoryLength').value = result.maxHistoryLength;
    }
  );
}

/* Restore default configuration */
function restoreDefaults() {
  chrome.storage.local.clear(function() {
    markStatus('Defaults restored');
  });
  loadOptions();
}
/*** FUNCTIONS ***/

/*** LISTENERS ***/
document.addEventListener('DOMContentLoaded', function() {
  loadOptions();

  document.getElementById('highlightColor').addEventListener('change', function() {
    document.getElementById('exampleHighlighted').style.backgroundColor = document.getElementById('highlightColor').value;
    saveOptions();
  });
  
  document.getElementById('selectedColor').addEventListener('change', function() {
    document.getElementById('exampleSelected').style.backgroundColor = document.getElementById('selectedColor').value;
    saveOptions();
  });
  
  document.getElementById('textColor').addEventListener('change', function() {
    document.getElementById('exampleHighlighted').style.color = document.getElementById('textColor').value;
    document.getElementById('exampleSelected').style.color = document.getElementById('textColor').value;
    saveOptions();
  });
  
  document.getElementById('maxResults').addEventListener('change', function() {
    saveOptions();
  });

  document.getElementById('instantResults').addEventListener('change', function() {
    saveOptions();
  });

  document.getElementById('maxHistoryLength').addEventListener('change', function() {
    saveOptions();
  });
  
  document.getElementById('buttonSave').addEventListener('click', function() {
    saveOptions();
  });
  
  document.getElementById('buttonReset').addEventListener('click', function() {
    restoreDefaults();
  });
});
/*** LISTENERS ***/
