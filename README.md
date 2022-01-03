# Zebra Printer App
![Zebra Printer App](/images/frontend_screenshot.png)

## Purpose
The purpose of this web app is to make an easy-to-use interface to print 2x1 inch shelf labels on the [Zebra ZD421](https://www.zebra.com/us/en/support-downloads/printers/desktop/zd421.html).

## Label Template
![Example Label](/images/example_label.png)

Each shelf label contains three parts: The product's UPC, name, and price. The ZPL template used for this particular label can be found in `images/shelf_label_template.prn`.

## Tools/Libraries
- HTML/CSS/Javascript
    - [QuaggaJS](https://serratus.github.io/quaggaJS/examples/)
    - [Bootstrap](https://getbootstrap.com/)
    - [ExpressJS](https://expressjs.com/)

- Python3
    - [requests](https://docs.python-requests.org/en/latest/)
    - [json](https://docs.python.org/3/library/json.html)

## File Layout
- `index.html` 
    - Creates a Boostrap frontend
- `styles.css` 
    - Applies a few basic styles to the HTML
- `script.js` 
    - Handles events made to the frontend, and makes the final POST request to the ExpressJS server
- `server.js` 
    - Creates a HTTP server that sets up a POST and GET route to `/label`.
    - A POST request will add a label to `label_db.json`
    - A GET request will retrieve the contents of `label_db.json` and return them as a JSON object to the client who executed the GET request.
- `label_db.json`
    - Stores the labels to be printed

## Basic usage
1. Client opens up the web app
2. Scans the UPC of the product, and fills in the according information
3. Once the client is done scanning all products, `client.py` is executed to finally print the labels with `python3 client.py`

## Notes
- The ZD421 must be connected to your local network, otherwise, changes must be made to `client.py`
- You will need to fill in the approriate information for your printer in `client.py` (e.g: the variable `host`)
- The frontend can be hosted on `localhost` but also hosted on a hosting site (e.g: Heroku)

## Possible Future Changes
- Creating a GUI for `client.py`.
- Adding a database of previously entered products and suggesting those to the user.

*Project by Harjot Singh*
