module.exports = function(db) {
  return {
    getLatestOrderId: async function()  {
      const idQuery = `
      SELECT id
      FROM orders
      ORDER BY id DESC
      LIMIT 1;
      `;
      await db.connect();
      const res = await db.query(idQuery);
      return res.rows[0].id;
    },

    postOrders: function() {
      const ordersQueryString = `
      INSERT INTO orders (restaurant_id, user_id)
      VALUES (1, 1);
      `;
      db.query(ordersQueryString)
        .catch(e => console.error(e));
    },

    postOrderItems: async function(orderData) {
      const orderEntries = Object.entries(orderData);
      const orderItemsQueryString = `
      INSERT INTO order_items (menu_item_id, order_id, quantity)
      VALUES ($1, $2, $3);
      `;
      const lastOrder = await this.getLatestOrderId();
      const promises = [];
      for (let i = 0; i < orderEntries.length; i++) {
        const values = [Number(orderEntries[i][0]), lastOrder, Number(orderEntries[i][1])];
        promises.push(db.query(orderItemsQueryString, values));
      }
      Promise.all(promises)
        .then((data) => data)
        .catch(e => console.error(e));
    }
  };
};

