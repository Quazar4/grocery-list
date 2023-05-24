const { Pool } = require('pg');
const prompt = require('prompt');

const pool = new Pool({
  user: 'name',
  host: 'localhost',
  database: 'db_name',
  password: 'random_password',
  port: 5432
});

async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

async function createGroceryItem(name, quantity) {
  const text = 'INSERT INTO grocery_items(name, quantity) VALUES($1, $2) RETURNING *';
  const values = [name, quantity];

  try {
    await query(text, values);
    console.log('Grocery item created successfully!');
  } catch (err) {
    console.error('Error creating grocery item:', err);
  }
}

async function getGroceryItems() {
  const text = 'SELECT * FROM grocery_items';

  try {
    const items = await query(text);
    return items;
  } catch (err) {
    console.error('Error retrieving grocery items:', err);
    return [];
  }
}

function displayGroceryItems() {
  const groceryList = document.getElementById('grocery-list');
  groceryList.innerHTML = '';

  getGroceryItems()
    .then(items => {
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.quantity}`;
        groceryList.appendChild(li);
      });
    });
}

document.getElementById('grocery-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const nameInput = document.getElementById('name-input');
  const quantityInput = document.getElementById('quantity-input');

  const name = nameInput.value;
  const quantity = quantityInput.value;

  createGroceryItem(name, quantity)
    .then(() => {
      nameInput.value = '';
      quantityInput.value = '';
      displayGroceryItems();
    });
});

displayGroceryItems();
