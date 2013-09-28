
METEOR! So what is it?

The short answer is:

Meteor does awesome fast.

It's a javascript framework that makes it possibe to build

...real-time reactive web-apps in a day

How can I spout such hyperbole?

I've done it.

I heard about Meteor in Jan, started playing with it, and got so excited that I organised

Meteor London...

Meteor is still pretty new, and there aren't many people I'd believe if they called them self a Meteor expert,

instead of getting guest speakers it's more of a self help group and demo-scene, 

everyone is encouraged to build something and show it off. Usually followed by a beverage.

The first event was in Febuary

Having never organised a meetup before I was terrified.

Terrified that I'd have nothing interesting to talk about

and worse that no one would turn up at all...

I'm pretty sure that's where the idea for my first Meteor app came from...

I wanted a way of watching people converging on the meetup venue. (or not...)

- Slide goto

A live map, basically opt-in browser based tracking... showing you where you and eveyone else is.

It's super simple, just watching the browser geolocation object and plotting it on the map...

Let's try it:

- DEMO goto.meteor.com

So there we all are... 

The fun part is that the pin positions are LIVE, LIVE, LIVE.

In fact Alan & I fired it up on our mobiles as we rode the bus to the venue,
and got ridiculously excited as the map pins followed us down the street.
he's got an iphone and I've got an Android, and predictably his pin was always slightly ahead and slightly more accurate...

- Slide goto details

...And better still, it was built in _1 day_ with no previous Meteor experience.

- Slide "say what?"

"SAY WHAT?" I was pretty please with meyself at this point

People DID turn up and we talked about how to Meteor...

...and then Alan demo'd his app Blackboard...

- Slide blackboard.meteor.com





GOTO
  - Real-timey, opt-in tracking.
  - Demo Goto
    - ? LxJS custom goto?
    - lxjs.meteor.com
    - Show video of a phone attached to a copter

Blackboard
  - The one that everyone remembers
  - The real time shared blackboard
  - We stood in a pub and wathched genuine works of art appear from unseen 
  - ...genuine works of art
  - Demo (swares, genitals, NO!)

Nervous
Had to ship something every month to keep things intersting.

Asciify
  - NSA proof instant messaging.

Foam
  - Communal hot tub photo party / DDoS-ing the DB with Data URIs

 ==== 10 minutes ====

Getting started is simple
- 4 commands
- Node + MongoDB + SockJS + Handlebars all wrapped up in a Meteor command line tool
- create new app scaffolding / run a local server 

Deploy is simple
- You can deploy to Meteors infrastructure for free.
- The rough plan is to make a framework that people want to use, and then they'll build a fancy hosting platform

Authentication is simple
- Meteor command lets you install packages
- Great packages for oauth

The magic is simple
- Meteor api is designed to provide the same api on client and server, (querying the db is the same on both, server is pulling form mongo, client is pulling from local)

Building a Meteor app can feel like just building a client side...
You need to server-side if you need to hide data or implementation details
- Meteor methods (RPC)
- ACL & pub/sub
- It's your responsibility as a developer to issue valid queries.


==== Question ====
- Windows?
- Is it websockets

==================

So, why Meteor

0. Keeps it simple (JS everywhere. Database everywhere, scafolding quick start)
1. Full stack framework (low surface area)
2. Does realtimey reactivity by default (websockets can be fiddly)
3. 

It's not just templating
Its not just CRUD
it's CRUD-plating.



- A Full stack framework
  - It provides client side _and_ server side structure
  - It bundles Node + MongoDB + SockJS + Handlebars, in a package designed to get you up and running, fast.
  
- Database Everywhere & transparent syncing
  - MongoDB & minimongo
  - This is a HUGE win.
  - There other (arguably better ways, *ahem* couch & pouch)
  - Regardless, as a concept, treating the client as a view on the db, letting the user update their local copy and communicating the changes to the server as json encoded data diffs is a neat trick, and mongo is an approachable api.
  
  - with it in place, we get:
  
  - Uniform data access, 
    - the mongo api is now available in the client
    - less things to learn (Vs. REST & XHR from client plus Data access on server)
    - Data over the wire, not html... progressive enhancement is dying. The lowest common denominator always wins. :-(

  - Transparent syncing
    - Reactive views - The DOM automagically updates as the data changes
    - Latency compensation - Your change your local db view, so the change appears instantly in your browser. In the background the change is sent to server, recorded in the db, and pushed out to other connected clients.

- Users!  





How to Meteor

Java Script is fun so Node is Fun

Mongo is the slutty datastore (Couch is all opinionated, Mongo is all like hey, I know you used to MySQL and that's cool)

Handlebars because Handlebars (also Jade)

SockJS absorbing the details of tricking browsers into push



----
SHIP IT! The demented battle cry of the web developer. 

It's worth re-iterating that it works better if you make it mean deliver "something simple that works now" 

Rather than just thow some SHI--T at the users and see what sticks.

The problem is users are demanding, and the twitters and facebooks have raised the bar of expectation. It used to be enough to glue together some html fragments sprinkle in some cats and you were done, but now they want cats pushed to them in real time.

As masters of the "labour saving" device that is the computer, we're are expected to do all the things

You've got some front-end chops, but the server-side has always been (in the words of Douglas Adams) "somebody else's problem".

----



--------------------------------------------
Meteor: The Medium is the Message

- Meteor "is"
"A better way to build web apps"

Meteor is an open-source platform for building top-quality web apps in a fraction of the time, whether you're an expert developer or just getting started.

- Meteor is:
A full stack web framework, providing the scaffolding for both browser side and server side.

- Meteor is
Node + MongoDB + Socket.io + Handlebars

--------------------------------------------
Goals
- What is meteor
Core: https://github.com/meteor/meteor/blob/devel/packages/meteor/package.js
Package.on_use(function (api) {
  api.use('underscore', ['client', 'server']);

  api.export('Meteor');

  api.add_files('client_environment.js', 'client');
  api.add_files('server_environment.js', 'server');
  api.add_files('helpers.js', ['client', 'server']);
  api.add_files('setimmediate.js', ['client', 'server']);
  api.add_files('timers.js', ['client', 'server']);
  api.add_files('errors.js', ['client', 'server']);
  api.add_files('fiber_helpers.js', 'server');
  api.add_files('fiber_stubs_client.js', 'client');
  api.add_files('startup_client.js', ['client']);
  api.add_files('startup_server.js', ['server']);
  api.add_files('debug.js', ['client', 'server']);

  // dynamic variables, bindEnvironment
  // XXX move into a separate package?
  api.add_files('dynamics_browser.js', 'client');
  api.add_files('dynamics_nodejs.js', 'server');

  // note server before common. usually it is the other way around, but
  // in this case server must load first.
  api.add_files('url_server.js', 'server');
  api.add_files('url_common.js', ['client', 'server']);
});


- What is meteor really
- What's it good at
