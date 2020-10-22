// Setting up project requirements
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true});

const day = date.getDate();

// Creating the todolistDB schema
const itemsSchema = new mongoose.Schema ({
  name: {
    type: String,
    required: true
  }
});

// Creating items collection in DB using itemsSchema
const Item = mongoose.model('item', itemsSchema)

// Creating the default items present in the DB
const item1 = new Item ({
  name: 'Buy milk'
}); 

const item2 = new Item ({
  name: 'Link app with DB'
}); 

const item3 = new Item ({
  name: 'Deploy todo app'
}); 

const defaultItems = [item1, item2, item3];

// Creating schema for specific list created when using custom route
const listSchema = {
  name: String,
  items: [itemsSchema]
};
// Creating lists collection using the listSchema created above 
const List = mongoose.model('List', listSchema);

// Handling of get request on the '/' route.
app.get('/', (req, res) => {
  // getting the date from the date.js module

  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        } else {
          console.log('defaultItems successfully saved items to DB.');
        }
      });
      res.redirect('/');
    } else {
    /*rendering the list.ejs file using the variables from app.js as variables to be used in the html code of the ejs file.*/
    res.render('list', { listTitle: day, newListItems: foundItems });
    };
  });
});
// Handling of the POST reqs from the list.ejs code.
app.post('/', (req, res) => {
  /* Using a if/else statement to be able to send what has been POSTed to the item variable in the right array. Once pushed in the right array, a redirect to the appropriate route is made which in turn triggers the relevant GET request on it. */
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === day) {
    item.save();
  res.redirect('/');
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName)
    });
  }
});

// Delete route handling the removal of list items. Supporting specific lists
app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === day){
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (!err) {
        console.log('Removal successful!');
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
      if (!err) {
        console.log('Removal successful!');
        res.redirect('/' + listName);
      }
    });
  }
});

// Handling of the GET req on custom route (i.e.: /Work, /School, ...).
app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, (err, foundList) => {
    if (!err){
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect('/' + customListName);
      } else {
      res.render('list', { listTitle: foundList.name, newListItems: foundList.items});
      }
    };
  });
});

app.listen(3000, () => console.log('Server started on port 3000.'));
