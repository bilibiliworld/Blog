function whenDOMReady() {
    if (location.pathname == '/photos/') photos('相册'); // 首次进入需要刷新展示的相评分类
  }
  whenDOMReady()
  document.addEventListener("pjax:complete", whenDOMReady)
  
  // 适配pjax
  
  window.onresize = () => {
    if (location.pathname == '/photos/') waterfall('.gallery-photos');
  };
  
  // 自适应
  
  function photos(tag) {
      let apiUrl = `你的memos地址/api/v1/memo?creatorId=用户UID&tag=${tag}`; // 修改Memos API地址以及 UID
    
      fetch(apiUrl).then(res => res.json()).then(data => {
          let html = '',
              imgs = []
          data.forEach(item => {
              let ls = item.content.match(/\!\[.*?\]\(.*?\)/g)
              if (ls) imgs = imgs.concat(ls)
              if (item.resourceList.length) {
                  item.resourceList.forEach(t => {
                      if (t.externalLink) imgs.push(`![](${t.externalLink})`)
                      else imgs.push(`![](${url}/o/r/${t.id}/${t.publicId}/${t.filename})`)
                  })
              }
          })
  
          if (imgs) imgs.forEach(item => {
              let img = item.replace(/!\[.*?\]\((.*?)\)/g, '$1'),
                  time, title, tat = item.replace(/!\[(.*?)\]\(.*?\)/g, '$1')
              if (tat.indexOf(' ') != -1) {
                  time = tat.split(' ')[0]
                  title = tat.split(' ')[1]
              } else title = tat
  
              html += `<div class="gallery-photo"><a href="${img}" data-fancybox="gallery" class="fancybox" data-thumb="${img}"><img class="no-lazyload photo-img" loading='lazy' decoding="async" src="${img}"></a>`
              title ? html += `<span class="photo-title">${title}</span>` : ''
              time ? html += `<span class="photo-time">${time}</span>` : ''
              html += `</div>`
          })
  
          document.querySelector('.gallery-photos.page').innerHTML = html
          imgStatus.watch('.photo-img', () => { waterfall('.gallery-photos') })
          window.Lately && Lately.init({ target: '.photo-time' })
      }).catch()
  
      if (document.querySelector(".icat-status-bar")) {
        var statusBarItemItems = document.querySelectorAll('.status-bar-item');
        let firstElement = statusBarItemItems[1];
        firstElement.classList.add('selected');
      
        Array.from(statusBarItemItems).forEach(function (element) {
          element.onclick = function (event) {
            var selectedElements = document.querySelectorAll('.status-bar-item.selected');
            Array.from(selectedElements).forEach(function (selectedElement) {
              selectedElement.classList.remove('selected');
            });
            element.classList.add('selected');
      
            event.stopPropagation();
            event.preventDefault();
            return false;
          };
        });
      }
  }
  
  // 相册页处理函数
  
  function statusbar() {
      var e;
      var t = document.getElementById("bar-box");
      var o = document.getElementById("status-bar-button");
      var n = t.clientWidth;
      if (t) {
          if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 8) {
              t.scroll({ left: 0, behavior: "smooth" });
          } else {
              t.scrollBy({ left: n, behavior: "smooth" });
          }
          t.addEventListener("scroll", function n() {
              clearTimeout(e);
              e = setTimeout(function () {
                  o.style.transform =
                      t.scrollLeft + t.clientWidth >= t.scrollWidth - 8 ? "rotate(180deg)" : "";
                  t.removeEventListener("scroll", n);
              }, 150);
          });
      }
  };
  // Bar滚动处理
  