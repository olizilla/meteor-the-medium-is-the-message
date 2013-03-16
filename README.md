Meteor: The Medium Is The Message
=================================

A talk about Meteor & Mongo, written as a Meteor app to show off it's finer points.

So, what should we pack for this trip?

- Meteor
- D3, If you're gonna be reactive you may as well bring a visualisation tool up to the job.
- Stack.js, _the_ slides tool by _the_ d3 wizard.
- As much caffine and up tempo music as fits in the head.

Bootstrapping the things
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

Yep, Meteor does the project init boilerplate stamping for you.

Yep, Meteor has a package manager for streamlining common integration boilerplate.

__So what have we got?__

It doesn't look like much at the moment but we now have a working Meteor app 
serving up some reudimentary html and d3.js, ready for us to start hacking. 
It's in dev mode so if we talk a look at the source we can see there is a pile 
of js getting automagically loaded. This is the source of the magic and we are 
not ready to look upon it yet so let's moving along.


Building a talk
---------------

So the prefabricated project has put our css, js and html resources in the root 
of the project. That's ok for showing that it works but the theory is any files 
and folders in the root will get run on both client and server. What a racy idea.

Still we're professionals, so it feel semantically incorrect to have front end
resources mixed up with server side ones, so we'll apply our OCD wand and move
them into a `client` directory. 

**Magic Alert**: the folders: 'client', 'server', 'test' & 'public' are special.

Fortunately they do what they say on the tin. 
- `client` is for your front-end code. Some magic occurs. JS & CSS elements are added to the html head element for you. In production you get minification, concatenation and cache friendly resource versioning too.
- `server` is for JS files that are only to be executed on the server. Secrets and other mysteries can go here.
- `public` is for static resources that you want served up on a stable url with no magic.
- `test` files are only executed when running `meteor test`.

JS files placed anywhere else are available on both client and server. This is useful for defining common collections and models.


