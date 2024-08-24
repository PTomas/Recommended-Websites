var userId;
var savedUser = localStorage.getItem("user");

window.onload = function(event){
  if(!savedUser){
    const authButton = document.querySelector(".oauth");

    document.querySelector('.oauth').addEventListener('click', function() {
      console.log("works")
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
        let userId;
        let init = {
          method: 'GET',
          async: true,
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          'contentType': 'json'
        };
        fetch(
          'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
          init)
            .then((response) => response.json())
            .then(function(data) {
              console.log(data.id)
              userId = data.id
              if(userId){
                location.reload
              }
              localStorage.setItem("user", userId);
              savedUser = localStorage.getItem("user")
            })
      });
      sendMessage();
      getWebsites();
    });
    
  
  }else{
    savedUser = localStorage.getItem("user")
    sendMessage();
    getWebsites();
  }
}
    
function sendMessage(){
  chrome.runtime.sendMessage({message: savedUser}, function (response, sender, sendResponse) {
      console.log(response)
  })
}

var search = document.querySelector(".search");
search.addEventListener("mouseover", () => {
    let id = null;
    let pos = 0;
    // search.style.width = 150 + "px"; 
    let getStyle = window.getComputedStyle(search);
    clearInterval(id);
    id = setInterval(frame, getStyle.width);
    function frame() {
        if ( pos == 150) {
            clearInterval(id);
        } else {
            pos = pos + 15; 
            search.style.width = pos + "px"; 
        }
      }
})
search.addEventListener("mouseout", () => {
    if(search.value){
      search.style.width = 150 + "px"; 
    }else{
      search.style.width = 20 + "px"; 

    }

})

const authButton = document.querySelector('.auth-container');
const pullToRefresh = document.querySelector('.pull-to-refresh');
const refresh = document.querySelector('.refresh');
function onDrag({movementX, movementY}){
      let getStyle = window.getComputedStyle(refresh);
      let leftValue = parseInt(getStyle.left);
      let topValue = parseInt(getStyle.top);

      refresh.style.left = `${leftValue + movementX}px`;
      refresh.style.top = `${topValue + movementY}px`;
  }

  function dragEnd({movementX, movementY}){
      let getStyle = window.getComputedStyle(refresh);
      let leftValue = parseInt(getStyle.left);
      let topValue = parseInt(getStyle.top);

      refresh.style.left = `${leftValue + movementX}px`;
      refresh.style.top = `${topValue + movementY}px`;
  }

  
  pullToRefresh.addEventListener('dragstart', () => {
    pullToRefresh.style.cursor = 'all-scroll';
    pullToRefresh.addEventListener('mousemove', onDrag);
  })
  pullToRefresh.addEventListener('dragend', () => {
    pullToRefresh.style.cursor = 'all-scroll';
    pullToRefresh.addEventListener('mousemove', dragEnd);
  })
  
  
var recommended = document.querySelector(".recommendBtn")
var past = document.querySelector(".historyBtn")


recommended.addEventListener("click", function() {
  recommended.style.display = "none";
  past.style.display = "block"
  getWebsites()
})

var content = document.querySelector(".modal-content");

past.addEventListener("click", function getHistory() {
  past.style.display = "none";
  recommended.style.display = "block"
  var colors = ["#33b249", "#5dbea3", "#ED0800", "#80669d", "#4681f4", "#ffbd03", "#dd7973"]
  let url = `http://localhost:3000/array/:${savedUser}`;
  let history = [];
  fetch(url)
      .then(res => {
          return res.json();
      })
      .then(res => {
          history = res.past.split(",")
          header = `<h3 class="title"> History </h3> `;
          
          while (content.firstChild) {
            content.removeChild(content.lastChild);
          }
          var title = document.createElement("div");
          content.appendChild(title)
          title.insertAdjacentHTML('afterbegin',header);
          // Add a header based on post type
          markup = ``;
          // Iterate through our posts array and chain
          // the markup based on our HTML structure
          for (let i = 0; i < history.length; i++) {
            var len = Math.floor((Math.random() * colors.length));
            var height = 80;
              if(i % 2.5 == 0){
                height = 160;
              }
              console.log(history[i])

              markup += `
                  <div class="card" style="height:${height}px; background-color:${colors[len]};">
                      <div class="card-body" >
                          <a class="post" href="${history[i]}" style="color:white; font-family: 'Work Sans', sans-serif;" target="_blank">${history[i]}</a>
                      </div>
                  </div>
              `;
          }
            
          var cardCont = document.createElement("div");
          cardCont.classList.add("card-container")
          content.appendChild(cardCont);
          var cards = document.createElement("div");
          cards.classList.add("cards")
          cardCont.appendChild(cards);
          cards.insertAdjacentHTML('beforeend',markup);
      }) .catch((error) => {
              markup = `<h3 class="title">404 Not Found.😞</h3>`
              while (content.firstChild) {
                content.removeChild(content.lastChild);
              }
            content.insertAdjacentHTML('beforeend',markup);
          });
})

function getWebsites() {
  let url = `http://localhost:3000/array/:${savedUser}`;
  var colors = ["#33b249", "#5dbea3", "#ED0800", "#80669d", "#4681f4", "#ffbd03", "#dd7973"]
  
  let programming = [];
  let shopping = [];
  let social = [];
  let entertain = [];
  let news = [];
  let resultsArr = [];
  let contentType = [];
  
  let n = 1;
  var height = 80;
  fetch(url)
      .then(res => {
          return res.json();
      })
      .then(res => {
        programming = res.programming.split(",")
        shopping = res.shopping.split(",")
        social = res.social.split(",")
        entertain = res.entertain.split(",")
        news = res.news.split(",")

        resultsArr.push(programming);
        resultsArr.push(shopping)
        resultsArr.push(social)
        resultsArr.push(entertain)
        resultsArr.push(news)

        suggested = res.suggested.split(",")
        contentType = res.types.split(",");
          
          header = `<h3 class="title"> Recommended Websites </h3> `;

          for (let i = 0; i < contentType.length; i++) {
            console.log(contentType[i])
            var len = (Math.floor((Math.random() * colors.length)));

            header += `
            <button class="contentBtn" style="background-color:${colors[len]};" >${contentType[i]}</button>
            `;
          }
          while (content.firstChild) {
            content.removeChild(content.lastChild);
          }
          var type = document.createElement("div");
          type.classList.add("content")
          content.appendChild(type)
          type.insertAdjacentHTML('afterbegin',header);
          // Add a header based on post type
          markup = `<h3> Recommended Websites </h3>`;
          // Iterate through our posts array and chain
          // the markup based on our HTML structure
          for (let i = 0; i < resultsArr.length; i++) {
            for(let x = 0; x < resultsArr[i].length; x++){

            }
              var dist = Math.floor((Math.random() * colors.length));
              console.log(suggested[i])
              var height = 90;
              if(i % 2.5 == 0){
                height = 180;
              }
              markup += `
                  <div class="card" style="height:${height}px; background-color:${colors[dist]};">
                      <div class="card-body">
                          <a class="post" href="${suggested[i]}" style="color:white; font-family: 'Work Sans', sans-serif;" target="_blank">${suggested[i]}</a>
                      </div>
                  </div>
              `;
          }

        var cardCont = document.createElement("div");
        cardCont.classList.add("card-container")
        content.appendChild(cardCont);
        var cards = document.createElement("div");
        cards.classList.add("cards")
        cardCont.appendChild(cards);
        cards.insertAdjacentHTML('beforeend',markup);
      }) .catch((error) => {
            markup = `<h3 class="title">404 Not Found.😞</h3>`
            while (content.firstChild) {
              content.removeChild(content.lastChild);
            }
            content.insertAdjacentHTML('beforeend',markup);
          });
}

var searchBtn = document.querySelector(".srchBtn");

searchBtn.addEventListener("click", function() {
  var colors = ["#33b249", "#5dbea3", "#ED0800", "#80669d", "#4681f4", "#ffbd03", "#dd7973"];
  let term = search.value;
  let url = `http://localhost:3000/array/:${userId}`;
  let history = [];
  fetch(url)
      .then(res => {
          return res.json();
      })
      .then(res => {
          history = res.past.split(",")
          const matches = history.filter(s => s.includes(term));
          markup = `<h3> Recommended Websites </h3>`;   
          for (let i = 0; i < matches.length; i++) {
            var dist = Math.floor((Math.random() * colors.length));
            var height = 80;
            if(i % 2.5 == 0){
              height = 160;
            }
            
            markup += `
                <div class="card" style="height:${height}px; background-color:${colors[dist]};">
                    <div class="card-body">
                        <a class="post" href="${matches[i]}" style="color:white; font-family: 'Work Sans', sans-serif;" target="_blank">${matches[i]}</a>
                    </div>
                </div>
            `;
          }
          while (content.firstChild) {
            content.removeChild(content.lastChild);
          }
          var cardCont = document.createElement("div");
          cardCont.classList.add("card-container")
          content.appendChild(cardCont);
          var cards = document.createElement("div");
          cards.classList.add("cards")
          cardCont.appendChild(cards);
          cards.insertAdjacentHTML('beforeend',markup);
        
        })
  

})