# Monitor.js

Monitor basic server information via a web service written on Node.js

## Dependencies

The only dependencies for monitor.js are Node.js and express. To install express, simply use npm:

    npm install express

Note: monitor.js only works on *nix

## Running

To run monitor.js, clone the github repository and run it with node:

    git clone git://github.com/tiemonster/monitor.js.git
    cd monitor.js
    node monitor.js

## Information that monitor.js provides

Monitor.js provdes a quick and dirty estimate of the load on your server:

* Uptime
* Load averages
* CPU usage
* Memory usage

## Disclaimer

I am not a Linux server administrator, nor do I have any idea what I'm doing. I just needed a way to get an estimate of load on my servers via a web service. If I did something wrong, please fork, fix, and request a pull. Patches are more than welcome!

## Released under the MIT License

Copyright (c) 2011 Mark S. Cahill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.