# retina.js

### JavaScript and LESS helpers for rendering high-resolution image variants

retina.js makes it easy to serve high-resolution images to devices with retina displays

## How it works

When your users load a page, retina.js checks each image on the page to see if there is a high-resolution version of that image on your server. If a high-resolution variant exists, the script will swap in that image in-place.

The script assumes you use Apple's prescribed high-resolution modifier (@2x) to denote high-resolution image variants on your server.

For example, if you have an image on your page that looks like this:

    <img src="/images/my_image.png" />

The script will check your server to see if an alternative image exists at this path:

    "/images/my_image@2x.png"

##How to use

###JavaScript

The JavaScript helper script automatically replaces images on your page with high-resolution variants (if they exist). To use it, download the script and include it at the bottom of your page.

1. Place the retina.js file on your server
2. Include the script on your page (put it at the bottom of your template, before your closing \</body> tag)

    <script type="text/javascript" src="/scripts/retina.js"></script>

###LESS

The LESS CSS mixin is a helper for applying high-resolution background images in your stylesheet. You provide it with an image path and the dimensions of the original-resolution image. The mixin creates a media query spefically for Retina displays, changes the background image for the selector elements to use the high-resolution (@2x) variant and applies a background-size of the original image in order to maintain proper dimensions. To use it, download the mixin, import or include it in your LESS stylesheet, and apply it to elements of your choice.

*Syntax:*

    .at2x(@path, [optional] @width: auto, [optional] @height: auto);

*Steps:*

1. Add the .at2x() mixin from retina.less to your LESS stylesheet (or reference it in an @import statement)
2. In your stylesheet, call the .at2x() mixin anywhere instead of using background-image

This:

    .logo {
      .at2x('/images/my_image.png', 200px, 100px);
    }

Will compile to:

    .logo {
      background-image: url('/images/my_image.png');
    }

    @media all and (-webkit-min-device-pixel-ratio: 1.5) {
      .logo {
        background-image: url('/images/my_image@2x.png');
        background-size: 200px 100px;
      }
    }

#Building & Testing retina.js

##How to build

We use [Coyote](http://imulus.github.com/coyote/) to stitch everything together. Install Coyote by running `gem install coyote`.

    $ rake build

This will compile the CoffeeScript and put the new build in `build/retina.js`

During development, you can use:

    $ rake watch

to keep an eye on the source files and automatically compile them to `test/functional/public`. Handy for testing in the browser.

##How to test

We use [mocha](http://visionmedia.github.com/mocha/) for unit testing with [should](https://github.com/visionmedia/should.js) assertions. Install mocha and should by running `npm install -g mocha should`.

To run the test suite:

    $ mocha

We also have a [Sinatra](http://sinatrarb.com) app for testing in the browser locally. This is handy for testing on your retina devices.

To start the server, run:

    $ cd test/functional && ruby app.rb

Then navigate your browser to [http://localhost:4567](http://localhost:4567)


#License

(MIT License)

Copyright (C) 2012 [Imulus](http://imulus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
