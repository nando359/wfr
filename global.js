// ==================================================
// Play Cine - global.js
// ==================================================

// Configuración global
var getPlayerOptions = {
  playerContainer: "#videox_player",
  playerRatio: "16:9",
  playerMobile: "600",
  playerDesktop: "70%",
  playerResponsive: false
};
var playerLogo = "https://1.bp.blogspot.com/-Ab27xrNIzKs/XtvMgqLijtI/AAAAAAAAB3o/XHNK2b9vhAwFGnGh3iG4fd4opF6G62xEwCK4BGAsYHg/s300/video_logo.jpg";
var noThumbnail = "https://1.bp.blogspot.com/-UNkQcay9emQ/XtvMWLhM0_I/AAAAAAAAB3c/YmQDmJWwjOQfgfsyi7LRDoiMwpC_VK7PgCK4BGAsYHg/s680/nth.png";
var postPerPage = 12;
var commentsSystem = "blogger";
var disqusShortname = "templatestopbest";

// Corrección crítica: acceso seguro a media$thumbnail
function _0x51dex12(_0x51dex3, _0x51dex6) {
  var _0x51dexb = _0x51dex3[_0x51dex6]['title']['$t'],
      _0x51dex4 = _0x51dex3[_0x51dex6]['content']['$t'],
      _0x51dexa = jQuery('.post-content').html(_0x51dex4);

  var mediaUrl = noThumbnail;
  if (_0x51dex3[_0x51dex6].hasOwnProperty('media$thumbnail')) {
    mediaUrl = _0x51dex3[_0x51dex6].media$thumbnail.url
      .replace('/s72-c/', '/s680/')
      .replace('/w72-h72-n/', '/w680-h383-n/');
  }

  return '<li class="item-' + _0x51dexb + '"><div class="post-content"><a class="post-image-link" href="' + 
         _0x51dex3[_0x51dex6]['link'][4]['href'] + '"><img class="post-thumb" alt="' + 
         _0x51dexb + '" src="' + mediaUrl + '"/></a><div class="post-info"><h2 class="post-title">' + 
         '<a href="' + _0x51dex3[_0x51dex6]['link'][4]['href'] + '">' + _0x51dexb + '</a></h2></div></div></li>';
}

// Funciones de inicialización
jQuery(document).ready(function($) {
  // Menú móvil
  $('.mobile-menu-toggle').click(function() {
    $('body').toggleClass('nav-active');
  });

  // Sticky sidebar
  if ($('#sidebar-wrapper').length) {
    $('#sidebar-wrapper').theiaStickySidebar({
      additionalMarginTop: 20,
      additionalMarginBottom: 20
    });
  }

  // Back to top
  var backTop = $('.back-top');
  $(window).scroll(function() {
    $(this).scrollTop() >= 100 ? backTop.fadeIn(250) : backTop.fadeOut(250);
  });
  backTop.click(function() {
    $('html, body').animate({ scrollTop: 0 }, 500);
    return false;
  });

  // Paginación e inicialización AJAX para hot/featured/related
  function initAjaxSection(selector, label, maxItems, containerClass) {
    var $section = $(selector);
    if (!$section.length) return;

    var labelValue = $section.find('.related-tag').data('label') || 'random';
    var url = labelValue === 'random'
      ? '/feeds/posts/default?alt=json-in-script&max-results=' + maxItems
      : '/feeds/posts/default/-/' + encodeURIComponent(labelValue) + '?alt=json-in-script&max-results=' + maxItems;

    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'jsonp',
      beforeSend: function() {
        if (containerClass === 'hot-posts') {
          $section.find('.widget-content').html('<div class="hot-loader"></div>');
        }
      },
      success: function(data) {
        if (!data.feed.entry) {
          $section.find('.widget-content').html('<ul class="no-posts"><b>Error:</b> No Posts Found <i class="far fa-frown"></i></ul>');
          return;
        }

        var html = '<ul class="' + containerClass + '">';
        for (var i = 0; i < Math.min(data.feed.entry.length, maxItems); i++) {
          var itemClass = containerClass === 'hot-posts' ? 'hot-item' :
                          containerClass === 'featured-posts' ? 'feat-item' :
                          containerClass === 'related-posts' ? 'related-item' : 'item';
          var innerClass = itemClass + '-inner';
          html += '<li class="' + itemClass + ' item-' + i + '"><div class="' + innerClass + '">';
          html += '<a class="post-image-link" href="' + data.feed.entry[i].link[4].href + '">';
          html += '<img class="post-thumb" alt="' + data.feed.entry[i].title.$t + '" src="';

          if (data.feed.entry[i].media$thumbnail) {
            html += data.feed.entry[i].media$thumbnail.url.replace('/s72-c/', '/s680/');
          } else {
            html += noThumbnail;
          }
          html += '"/></a><div class="post-info"><h2 class="post-title"><a href="' + data.feed.entry[i].link[4].href + '">' + 
                  data.feed.entry[i].title.$t + '</a></h2></div></div></li>';
        }
        html += '</ul>';
        $section.find('.widget-content').html(html);
      }
    });
  }

  // Inicializar secciones
  if ($('.show-hot').length) initAjaxSection('#hot-section', 'hot', 6, 'hot-posts');
  if ($('.show-featured').length) initAjaxSection('#feat-section', 'featured', 4, 'featured-posts');
  if ($('#related-wrap').length) initAjaxSection('#related-wrap', 'related', 4, 'related-posts');

  // Comentarios y sistema de comentarios
  if ($('.blog-post-comments').length) {
    var system = commentsSystem;
    if (system === 'disqus') {
      var disqus_shortname = disqusShortname;
      var disqus_url = window.location.href;
      (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
      })();
    } else if (system === 'facebook') {
      $('.blog-post-comments').html('<div class="fb-comments" data-width="100%" data-href="' + window.location.href + '" data-order-by="time" data-num-posts="5"></div>');
      if (typeof FB !== 'undefined') FB.XFBML.parse();
    }
  }

  // Compartir
  $('.share-links .window-upex').click(function(e) {
    e.preventDefault();
    var url = $(this).data('url'),
        width = $(this).data('width') || 550,
        height = $(this).data('height') || 400;
    window.open(url, 'Share', 'width=' + width + ',height=' + height + ',scrollbars=yes,resizable=yes');
  });

  $('.show-hid a').click(function(e) {
    e.preventDefault();
    $(this).closest('.share-links').toggleClass('show-hidden');
  });
});
