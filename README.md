# Via offline pages
Via is a small web browser for Android, this is a tool that helps browse your list of offline saved pages.

By running the script it generates an html file that indexes all the offline pages, opening this html file in Via allows you to easily open the saved pages.

## Why
- Now that it is a web page you can use the search functionality and lookup pages easily.
- Newest Via update is broken and doesn't show the list of offline pages at all so I had to resort to make some tool in the meantime.
- Additional lookup paths can easily be added so you can have pages in other locations. (e.g move your pages to external sdcard)

I have nearly 3,000 pages saved so being able to search is really useful. Previously I would resort to running `grep` on Termux to find a given page and url encode it and enter it in the address bar. Then Via changed the offline pages location so now half of my pages are at `/sdcard/Download` and half in `/sdcard/Android/data/mark.via.gp/files/offline`, this script easily combines them and makes searching a breeze.

## Usage
Usage is mainly intended from Termux.

```sh
# Make sure you install nodejs and git
$ pkg install nodejs git
# Clone the script
$ git clone https://github.com/ravener/via-offline-pages
$ cd via-offline-pages
# Run the script
$ node index.js
```
It defaults to write the given html to `/sdcard/via.html` you can pass an argument to specify an output file.

Now open Via browser and type `file:///sdcard/via.html` and there you go, browse your offline pages in a nice and clean way.

Keep in mind you have to run the script everytime you save new pages and vice versa to keep the list updated.

The purpose is very minimal right now and may look pointless to many but in the feature maybe we can add more information and make it a great offline page index.

Just something I decided to open source for no reason.

## TODO
- Show date in the list.
- Other sorting options, e.g sort by largest file size.

## License
[MIT License](LICENSE)
