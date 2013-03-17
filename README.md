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


[Meteor]: http://meteor.com/
[MongoDB]: http://www.mongodb.org/
[D3]: http://d3js.org/
[Stack]: http://mbostock.github.com/stack/
