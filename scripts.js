// Load keen-tracking.js
!function(name,path,ctx){
  var latest,prev=name!=='Keen'&&window.Keen?window.Keen:false;ctx[name]=ctx[name]||{ready:function(fn){var h=document.getElementsByTagName('head')[0],s=document.createElement('script'),w=window,loaded;s.onload=s.onerror=s.onreadystatechange=function(){if((s.readyState&&!(/^c|loade/.test(s.readyState)))||loaded){return}s.onload=s.onreadystatechange=null;loaded=1;latest=w.Keen;if(prev){w.Keen=prev}else{try{delete w.Keen}catch(e){w.Keen=void 0}}ctx[name]=latest;ctx[name].ready(fn)};s.async=1;s.src=path;h.parentNode.insertBefore(s,h)}}
}('KeenTracker','https://d26b395fwzu5fz.cloudfront.net/keen-tracking-0.0.1.js',this);

Keen.ready(function(){
  KeenTracker.ready(init);
});

// Executes when the library is loaded and ready
function init(){
  // Use this for recording events
    var tracker = new KeenTracker({
      projectId: '55ba42cb2fd4b13708f6a943',
      writeKey: '6b47a4c6d13ad605dcb816bbb9a254b499c80e1c33693af7d0cbc605849d861f48ba6c67c9875e4a087edc2854ae11d9fa9d08a631a6534b044a6de9362f04788a878a2b7f541eebd8ad7438fe5c42bcc27421e2a3208690a56e91c523234375950f8e7fd76e6281861354bf9c7ecb67'
    });

    var uniqueId; // = KeenTracker.helpers.getUniqueId();
    var userId;

    var sessionCookie = window.sessionCookie = KeenTracker.utils.cookie('track-session');
    if ('string' !== typeof sessionCookie.get('guest_id')) {
        sessionCookie.set('guest_id', KeenTracker.helpers.getUniqueId());
    }

    var sessionTimer = KeenTracker.utils.timer();
    sessionTimer.start();

    // THE BIG DATA MODEL!
    tracker.extendEvents(function(){
        return {
            page: {
                title: document.title,
                url: document.location.href
                // info: {} (add-on)
            },
            referrer: {
                url: document.referrer
                // info: {} (add-on)
            },
            tech: {
                browser: KeenTracker.helpers.getBrowserProfile(),
                // info: {} (add-on)
                ip: '${keen.ip}',
                ua: '${keen.user_agent}'
            },
            time: KeenTracker.helpers.getDatetimeIndex(),
            visitor: {
                id: sessionCookie.get('user_id'),
                time_on_page: sessionTimer.value()
            },
            // geo: {} (add-on)
            keen: {
                timestamp: new Date().toISOString(),
                addons: [
                    {
                        name: 'keen:ip_to_geo',
                        input: {
                            ip: 'tech.ip'
                        },
                        output: 'geo'
                    },
                    {
                        name: 'keen:ua_parser',
                        input: {
                            ua_string: 'tech.ua'
                        },
                        output: 'tech.info'
                    },
                    {
                        name: 'keen:url_parser',
                        input: {
                            url: 'page.url'
                        },
                        output: 'page.info'
                    },
                    {
                        name: 'keen:referrer_parser',
                        input: {
                            page_url: 'page.url',
                            referrer_url: 'referrer.url'
                        },
                        output: 'referrer.info'
                    }
                ]
            }
        };
    });

    document.getElementById("form").onsubmit = function(event){
        event.preventDefault();

        var formName = document.getElementById('name').value;
        var formCompany = document.getElementById('company').value;
        var formAnswer = document.getElementById('question').value;

        if( formName == "" )
        {
           alert( "Please provide your name!" );
           return false;
        }

        if( formCompany == "" )
        {
           alert( "Please provide your company!" );
           return false;
        }

        var submit = {
        name: formName,
        company: formCompany,
        answer: formAnswer,
        submit: true
        };

        // 500ms to record an event
        tracker.recordEvent('submit', submit, function(err, res){
          if (err) {
              console.log(err);
          }
          else {
              console.log("high-five");
          }
        });
        $('h1#title').hide();
        $('form').hide();
        $('#logo').hide();
        $('h1#thanks').show();
        $('a#big-logo img').show();

    }

    tracker.recordEvent('pageview');

    // Track errors and messages in the dev console
    Keen.debug = true;
    KeenTracker.debug = true;

    // Observe what's happening in each method
    tracker.on('recordEvent', Keen.log);
    tracker.on('recordEvents', Keen.log);
    tracker.on('deferEvent', Keen.log);
    tracker.on('deferEvents', Keen.log);
    tracker.on('recordDeferredEvents', Keen.log);
    tracker.on('extendEvent', Keen.log);
    tracker.on('extendEvents', Keen.log);
}
