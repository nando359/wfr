// videoplay-clean.js
// Reemplazo limpio y legible para todas las funciones del template Play Blogger

// ==============================================
// VARIABLES GLOBALES (coinciden con las del XML)
// ==============================================
var imgr = [
  "http://3.bp.blogspot.com/-zP87C2q9yog/UVopoHY30SI/AAAAAAAAE5k/AIyPvrpGLn8/s1600/picture_not_available.png"
];
var showRandomImg = true;
var aBold = true;
var summaryPost = 150;
var summaryTitle = 15;
var numposts = 12;
var numposts1 = 6;
var numposts2 = 6;
var numposts3 = 6;
var numposts4 = 5;
var numposts6 = 1;
var postnum1 = 3;
var postnum2 = 6;
var postnum3 = 5;
var postnum4 = 5;
var postnum6 = 5;

// ==============================================
// UTILIDADES
// ==============================================
function removeHtmlTag(str, chop) {
  if (typeof str !== 'string') return '';
  var s = str.split("<");
  for (var i = 0; i < s.length; i++) {
    if (s[i].indexOf(">") !== -1) {
      s[i] = s[i].substring(s[i].indexOf(">") + 1, s[i].length);
    }
  }
  s = s.join("");
  return s.substring(0, chop - 1);
}

function truncateTitle(title, maxLen = 41) {
  if (title.length > maxLen) {
    return title.substring(0, maxLen) + "...";
  }
  return title;
}

function extractImageUrl(entry) {
  try {
    // Intenta: miniatura de Blogger (s72-c)
    if (entry.media$thumbnail && entry.media$thumbnail.url) {
      return entry.media$thumbnail.url;
    }

    // Intenta: etiqueta <img> en contenido
    const content = entry.content && entry.content.$t || entry.summary && entry.summary.$t || '';
    const imgMatch = content.match(/<img[^>]+src="([^">]+)/);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }

    // Fallback: proxy de imagen genérica
    const cleanTitle = encodeURIComponent(truncateTitle(entry.title.$t));
    return `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${cleanTitle}&sz=400`;

  } catch (e) {
    // Último fallback
    return imgr[0];
  }
}

// ==============================================
// FUNCIONES DE RENDERIZADO DE POSTS
// ==============================================

// --- Slider Principal (#HTML025) ---
function showrecentposts(json) {
  const posts = json.feed.entry || [];
  let html = '';

  posts.forEach(entry => {
    const title = truncateTitle(entry.title.$t);
    const url = entry.link.find(l => l.rel === 'alternate').href;
    const img = extractImageUrl(entry);
    html += `
      <div class="item">
        <div class="item-image">
          <a href="${url}" style="background:url(${img}) no-repeat center;background-size:cover;">
            <div class="slideroverlay"></div>
          </a>
        </div>
        <div class="item-info">
          <div class="cat-title"><a href="${url}">Category</a></div>
          <div class="item-title"><a href="${url}">${title}</a></div>
        </div>
      </div>`;
  });

  document.querySelector('#HTML025 .widget-content').innerHTML = `<div class="slickslider">${html}</div>`;
  if (typeof jQuery !== 'undefined' && jQuery().slick) {
    jQuery('.slickslider').slick({
      dots: true,
      infinite: true,
      speed: 700,
      autoplay: true
    });
  }
}

// --- BoxSlider (#HTML049) ---
function recentarticles67(json) {
  const posts = json.feed.entry || [];
  let html = '';
  posts.slice(0, numposts2).forEach(entry => {
    const title = truncateTitle(entry.title.$t, 30);
    const url = entry.link.find(l => l.rel === 'alternate').href;
    const img = extractImageUrl(entry);
    html += `
      <div class="yinks_narrow">
        <div class="thumb overlay"><a href="${url}"><img src="${img}" alt="${title}"/></a></div>
        <div class="topmetata">
          <div class="postmeta"><a href="${url}">Category</a></div>
          <div class="postTitle"><a href="${url}">${title}</a></div>
        </div>
      </div>`;
  });
  document.querySelector('#HTML049 .widget-content').innerHTML = `<div class="articles7">${html}</div>`;
  if (typeof jQuery !== 'undefined' && jQuery().slick) {
    jQuery('.articles7').slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      dots: false,
      autoplay: true,
      responsive: [
        { breakpoint: 900, settings: { slidesToShow: 4 } },
        { breakpoint: 600, settings: { slidesToShow: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 1 } }
      ]
    });
  }
}

// --- Post Areas Genéricas ---
function createPostAreaHtml(entries, maxResults) {
  let html = '';
  entries.slice(0, maxResults).forEach(entry => {
    const title = truncateTitle(entry.title.$t, 45);
    const url = entry.link.find(l => l.rel === 'alternate').href;
    const img = extractImageUrl(entry);
    html += `
      <div class="yinks_wide left">
        <div class="thumb overlay"><a href="${url}"><img src="${img}" alt="${title}"/></a></div>
        <div class="topmetata">
          <div class="postmeta"><a href="${url}">Category</a></div>
          <h3 class="postTitle"><a href="${url}">${title}</a></h3>
        </div>
      </div>`;
  });
  return `<div class="postarea">${html}</div>`;
}

function postarea1(json) { document.querySelector('#HTML3 .widget-content').innerHTML = createPostAreaHtml(json.feed.entry, postnum1); }
function postarea2(json) { document.querySelector('#HTML4 .widget-content').innerHTML = createPostAreaHtml(json.feed.entry, postnum2); }
function postarea3(json) { document.querySelector('#HTML5 .widget-content').innerHTML = createPostAreaHtml(json.feed.entry, postnum3); }
function postarea4(json) { document.querySelector('#HTML6 .widget-content').innerHTML = createPostAreaHtml(json.feed.entry, postnum4); }
function postarea6(json) { document.querySelector('#HTML8 .widget-content').innerHTML = createPostAreaHtml(json.feed.entry, postnum6); }

// ==============================================
// POSTS RELACIONADOS
// ==============================================
var relatedTitles = [];
var relatedUrls = [];
var thumburl = [];
var relatedTitlesNum = 0;

function related_results_labels_thumbs(json) {
  const posts = json.feed.entry || [];
  for (let i = 0; i < posts.length; i++) {
    const entry = posts[i];
    const title = truncateTitle(entry.title.$t);
    const url = entry.link.find(l => l.rel === 'alternate').href;
    const img = extractImageUrl(entry);

    relatedTitles[relatedTitlesNum] = title;
    relatedUrls[relatedTitlesNum] = url;
    thumburl[relatedTitlesNum] = img;
    relatedTitlesNum++;
  }
}

function removeRelatedDuplicates_thumbs() {
  const seen = {};
  const uniqueTitles = [];
  const uniqueUrls = [];
  const uniqueThumbs = [];

  for (let i = 0; i < relatedUrls.length; i++) {
    if (!seen[relatedUrls[i]]) {
      seen[relatedUrls[i]] = true;
      uniqueTitles.push(relatedTitles[i]);
      uniqueUrls.push(relatedUrls[i]);
      uniqueThumbs.push(thumburl[i]);
    }
  }

  relatedTitles = uniqueTitles;
  relatedUrls = uniqueUrls;
  thumburl = uniqueThumbs;
}

function printRelatedLabels_thumbs() {
  const container = document.getElementById('related-posts');
  if (!container || relatedUrls.length === 0) return;

  // Seleccionar 3 posts aleatorios únicos
  const shuffled = [];
  const used = {};
  const maxResults = Math.min(3, relatedUrls.length);

  for (let i = 0; i < maxResults; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * relatedUrls.length);
    } while (used[idx]);
    used[idx] = true;
    shuffled.push({ title: relatedTitles[idx], url: relatedUrls[idx], img: thumburl[idx] });
  }

  let html = '';
  shuffled.forEach(item => {
    html += `
      <a class="related-wrap" href="${item.url}" title="${item.title}">
        <img class="lazy" src="${item.img}" alt="${item.title}"/>
        <div>${item.title}</div>
      </a>`;
  });

  container.innerHTML += html;
}
