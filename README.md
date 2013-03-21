Meteor: The Medium Is The Message
=================================

A talk about [Meteor][], [MongoDB][] & [D3][], as a Meteor app. 

So, what should we pack for this trip?

- [Meteor][], "A better way to build apps."
- [D3][], If you're gonna be reactive you may as well bring a visualisation tool up to the job.
- [Stack][], HTML slides by _the_ D3 wizard.
- As much caffine and up tempo music as fits in the head.

Bootstrap all the things
------------------------

Install meteor, create an app and add the d3 package. Let's GO!

```shell

	curl https://install.meteor.com | /bin/sh

	meteor create the-medium-is-the-message

	cd the-medium-is-the-message

	meteor list

	meteor add d3

	meteor

	open http://localhost:3000

```

__Whoa whut?__

Yep, Meteor has a hipster curl install. The script is out there for you to read if it makes you nervous.

Yep, Meteor does the project init boilerplate for you.

Yep, Meteor has a package manager, making it easy to drop in common dependencies (d3, jquery) and whole features (user accounts, oauth).

__So what have we got?__

It doesn't look like much at the moment but we now have a working Meteor app 
serving up some reudimentary html and d3.js, ready for us to start hacking. 
It's in dev mode so viewing source we see a pile of js getting loaded that we
had little to do with. This is the source of the magic and we are not ready to 
look upon it yet so let's moving along.

Make the bed
------------

The prefabricated project has put our css, js and html resources in the root of 
the project. That's ok for showing that it works but the theory is any files and 
folders in the root will get run on both client and server. Pretty racy.

As professional pedents, it feels semantically improper (read: dirty) to have 
front end resources mixing with server-side ones, so we move them into a 
`client` directory.

Adding in the code for [Stack][]

```shell
.
├── README.md
└── client
    ├── lib
    │   ├── stack.v0.css
    │   └── stack.v0.js
    ├── the-medium-is-the-message.css
    ├── the-medium-is-the-message.html
    └── the-medium-is-the-message.js

```

**Magic Alert**: the folders: `client`, `server`, `public` & `test` are special. 
Fortunately they do what they say on the tin. 

- `client` is for your front-end code. Some magic occurs. JS & CSS elements are added to the html head element for you. In production you get minification, concatenation and cache friendly resource versioning too.
- `server` is for JS files that are only to be executed on the server. Secrets and other mysteries can go here.
- `public` is for resources that you want served up on a stable url with no magic. (favicon, images etc.)
- `test` files are only executed when running `meteor test`.

I was compelled to put the stack code into a `lib` dir as I didn't write it, and
like a victorian child, I'd rather not look at it too much. As a bonus, Meteor's 
load order takes this kind of thing into account:

> Files in subdirectories are loaded before files in parent directories, so that files in the deepest subdirectory are loaded first

Load Order & You
----------------

I had to make some minor edits to Stack to get it to play nicely... As per page 1 of the docs:

> It is best to write your application in such a way that it is insensitive to the order in which files are loaded, for example by using Meteor.startup
http://docs.meteor.com/#structuringyourapp

We're in framework land now; to benefit from the magic we have to play by the rules. 

To get it working I had to:

- Convert it from a self executing function `var stack = (function(){...})();` to a simple function that we can call from `Meteor.startup`
- Move the background image out to the `public` folder
- Update the css file to use an absolute path to the background image

In return, my files are minified, versioned and cached so it's a fair trade.


Getting up
----------

```meteor deploy goto --password```

Get's your app live on [goto.meteor.com]. The `--password` will prompt you to 
choose a password so that only you can then redeploy to that domain. 
Lo-fi, but it works, and they've got [grander plans afoot](http://meteor.com/blog/2012/07/25/meteors-new-112-million-development-budget.

Get a dump of the mongo db from your live app via meteor-dump: https://gist.github.com/olizilla/5209369

Where the magic lives
---------------------

Mongo & minimongo. Making mongo available on the client and transparently syncing it with the server.
From this one trick you get:

- Uniform data access code. Both client & server uses the same api, so less to learn.
- Data over the wire. Keep your app repsonsive by pushing data diffs instead of waiting for page reloads.

And like levelling up in Civilisation, once you have those technologies you get:

- Reactive views. Your UI updates in front of your eyes as new data is received.
- Latency compensation. Each user changes his local database; they see instant updates. Mongo syncs and patches the changes in the background.

Sure, there are some other nice things like:

- JS ALL THE THINGS. 1 language for both client and server, keeps things simple, but credit there goes to NodeJS
- Hot code deploy. Actually totally awesome, but more for the novelty of seein your app update without having to hit refresh.
- Free hosting. A neat trick. Like node's killer feature, package management done right, simple hosting might just be Meteor's.

But... it's the transparent and unified data magic that means you can crank out compelling apps in hours rather than days.

Contention Bones
----------------

- "Can I use it in production yet?". Yes. No. How about you build your app, test it, and decide for yourself. It will take you a day, so don't go complaining about time investment.
- "Will it scale". To paraphrase [Cory Doctorow], you have more to fear from obscurity than from collapsing at scale. Write your killer feature, go live, prove it's a good idea, then load test it. Maybe it survives, maybe you have to contirbute some patches back to the community.
- "Fibers! I use Node, I love callbacks". Yep, this is just plain old contentious. Basically Nodes answer for staying scalable is by encouraging the use of callbacks for all the things. Meteor uses Fibers, which is a node module that undoes that teaching, and flips node over to use V8's coroutine/thread support. Front end developers are used to using callbacks, server side dev's from other languages are used to having threads and code that looks synchronous. It's a dull debate. I suggest you avoid it. Try both, see which one you like. Meteor uses Fibers.


[goto.meteor.com]: http://goto.meteor.com
[Meteor]: http://meteor.com/
[MongoDB]: http://www.mongodb.org/
[D3]: http://d3js.org/
[Stack]: http://mbostock.github.com/stack/
[NodeJS]: http://meteor.com/

