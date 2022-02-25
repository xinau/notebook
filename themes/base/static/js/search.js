function preventEnter(event) {
  if(event.keyCode == 13){
      try {
          event.preventDefault ? event.preventDefault() : (event.returnValue = false);
      } catch(err) {
          console.log(err.message); 
      }
  }
}

function debounce(func, wait) {
  var timeout;
  
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
  
    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

const index = new FlexSearch.Document({
  tokenize: "forward",
  document: {
    id: 'id',
    index: ['title','tags','content','date'],
    store: ['title','date','permalink']
  }
});

function build() {
  fetch('/search/index.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      data.forEach(function (item) {
        index.add(item);
      });
    });
}

function init() {
  const input = document.querySelector("#search");
  const output = document.querySelector(".listing");
  
  var last = "";
  
  input.addEventListener("keyup", debounce(function() {
    var query = input.value.trim();
    if (query === last || query === "" || !index) {
      return;
    }
  
    last = query;
    output.innerHTML = ""
  
    var results = index.search({
      query: query,
      enrich: true,
    })

    if (results.length > 0) {
      results[0].result.forEach(function(res) {
        var item = document.createElement("tr")
        item.innerHTML = `
        <td><a href="${ res.doc.permalink }">${ res.doc.title }</a></td>
        <td>${ res.doc.date }</td>
        `
        output.appendChild(item)
      })
    }
  }, 100));

  build();
}
  
if (document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
} 
  