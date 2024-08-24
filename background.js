var user;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(request.message)
  user = request.message
  fetch('http://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({ID: request.message})
  }).then(res => {
    return res.json();
  }).then(res => {
    senderResponse(res);
  })
})


chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
      var tab = tabs[0];
      var url = tab.url;
      if(url.includes("https://www.google.com") || url.includes("chrome://")){
        googleSearch(url);
        console.log(url);
      }else{
        if(user){
          browsing(url);
          console.log(url);
        }
      }
  });
})

function googleSearch(url) {
  var cleaned= url.replace(/[^a-zA-Z0-9 ]/g, " ");
  
}

async function browsing(url) {
  const browsingSite = [];
  const browsingUrls = [];
  var modified = url.split("/");
  modified = modified.slice(0,3);
  modified = modified.join("/")
  var specific = url.split("/");
  var i = specific.length
  specific = specific.slice(i-1, i)
  fetch(`http://localhost:3000/searches/:${user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ID: user, site: modified, query: specific[0]})
    })
    console.log(`posted: ${modified}`)
    console.log(user)
}
  

