// Setting up project requirements
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Creating arrays used by the app for the '/' and '/work' routes
let items = [];
let workItems = [];

// Handling of get request on the '/' route.
app.get('/', (req, res) => {
  // getting the date from the date.js module
  let day = date.getDate();
  /*rendering the list.ejs file using the variables from app.js as variables to be used in the html code of the ejs file.*/
  res.render('list', { listTitle: day, newListItems: items });
});

// Handling of the POST reqs from the list.ejs code.
app.post('/', (req, res) => {
  /* Using a if/else statement to be able to send what has been POSTed to the item variable in the right array. Once pushed in the right array, a redirect to the appropriate route is made which in turn triggers the relevant GET request on it. */
  let item = req.body.newItem;
  if (req.body.list === 'Work List') {
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

// Handling of the GET req on '/work' route.
app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', newListItems: workItems });
});

app.listen(3000, () => console.log('Server started on port 3000.'));
