const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

function seed() {

  const schnitzel = new Recipe({
    name: 'Tasty Schnitzel',
    description: 'A super-tasty Schnitzel - just awesome!',
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
    ingredients: [
      { name: 'Meat', amount: '1'},
      { name: 'French Fries', amount: '20'},
    ]
  });

  const burger = new Recipe({
    name: 'Big Fat Burger',
    description: 'Just full of fat, what else?',
    imagePath: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
    ingredients: [
      { name: 'Buns', amount: '2'},
      { name: 'Cheese', amount: '2'},
      { name: 'Steak', amount: '1'},
      { name: 'Bacon', amount: '2'}
    ]
  });

  Recipe.count().then((count) => {
    if(count === 0) {
      burger.save();
      schnitzel.save();
    }
  });

}

module.exports = {
  seed
};
