const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLBoolean,
} = require("graphql");
const app = express();

const shops = [
  {
    id: "5f4a6682fb5fe8488c9b21ec",
    name: "Pizza Hut",
    photoURL:
      "https://www.freepnglogos.com/uploads/pizza-hut-png-logo/pizza-hut-brands-png-logo-8.png",
    shopType: "Pizzeria",
  },
  {
    id: "5f4c76fc2647731a44c85236",
    name: "Starbucks Coffee",
    photoURL:
      "https://www.freepnglogos.com/uploads/starbucks-logo-png-transparent-0.png",
    shopType: "Café - Cafe, Coffee, Tea, Beverages, Desserts",
  },
  {
    id: "5f4f7a1b396c4a218c2ef396",
    name: "Puma",
    photoURL: "https://www.freepnglogos.com/uploads/puma-logo-png-6.png",
    shopType: "Clothing Brand",
  },
];

const items = [
  {
    id: "5f4d3498c9f3994cfc739b3c",
    availability: true,
    name: "Family Treat Veg Meals",
    photoURL:
      "https://b.zmtcdn.com/data/dish_photos/12b/b1c93182f274ba2ffff2bd4056bac12b.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
    price: 485,
    description: "Med Farmhouse Pizza + Garlic Bread + Pepsi.",
    atShop: "5f4a6682fb5fe8488c9b21ec",
  },
  {
    id: "5f508bb5e6ff2c3104965066",
    availability: true,
    name: "Iced Cold Brew with Ginger Ale",
    photoURL:
      "https://b.zmtcdn.com/data/dish_photos/401/1991082d984f09377048f8da89443401.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
    price: 335,
    description:
      "A delicious double layered cold brew beverage with ginger ale. A pure delight for a warm sunny day.",
    atShop: "5f4c76fc2647731a44c85236",
  },
  {
    id: "5f508c96e6ff2c3104965067",
    availability: true,
    name: "Face Masks",
    photoURL:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_260,h_260/global/054108/05/fnd/IND/fmt/png/PUMA-Adjustable-Face-Mask-Set-of-Two",
    price: 499,
    description: "PUMA Adjustable Face Mask Set of Two",
    atShop: "5f4f7a1b396c4a218c2ef396",
  },
  {
    id: "5f508ccfe6ff2c3104965069",
    availability: true,
    name: "BMW MMS X-Ray",
    photoURL:
      "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_260,h_260/global/306503/01/sv01/fnd/IND/fmt/png/BMW-MMS-X-Ray",
    price: 7999,
    description: "",
    atShop: "5f4f7a1b396c4a218c2ef396",
  },
  {
    id: "5f508b85e6ff2c3104965065",
    availability: true,
    name: "Midnight Mocha Frappuccino",
    photoURL:
      "https://b.zmtcdn.com/data/dish_photos/401/1991082d984f09377048f8da89443401.jpg?fit=around%7C200%3A200&crop=200%3A200%3B%2A%2C%2A",
    price: 375,
    description:
      "Black cocoa with deep, bittersweet notes is blended with ice, java chips and Starbucks coffee. Layered with whipped cream, and finished with a dusting of black cocoa.",
    atShop: "5f4c76fc2647731a44c85236",
  },
];

const ItemType = new GraphQLObjectType({
  name: "Item",
  description: "This represents an item of a shop.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    availability: { type: GraphQLNonNull(GraphQLBoolean) },
    description: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    price: { type: GraphQLNonNull(GraphQLInt) },
    photoURL: { type: GraphQLNonNull(GraphQLString) },
    atShop: { type: GraphQLNonNull(GraphQLString) },
    shop: {
      type: ShopType,
      resolve: (item) => {
        return shops.find((shop) => shop.id === item.atShop);
      },
    },
  }),
});

const ShopType = new GraphQLObjectType({
  name: "Shop",
  description: "This represents a shop of an item.",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLNonNull(GraphQLString) },
    photoURL: { type: GraphQLNonNull(GraphQLString) },
    shopType: { type: GraphQLNonNull(GraphQLString) },
    items: {
      type: new GraphQLList(ItemType),
      resolve: (shop) => {
        return items.filter((item) => item.atShop === shop.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    item: {
      type: ItemType,
      description: "A single item.",
      args: {
        id: { type: GraphQLString },
      },
      resolve: (parent, args) => items.find((item) => item.id === args.id),
    },
    items: {
      type: new GraphQLList(ItemType),
      description: "List of all items.",
      resolve: () => items,
    },
    shop: {
      type: ShopType,
      description: "A single shop",
      args: {
        id: { type: GraphQLString },
      },
      resolve: (parent, args) => shops.find((shop) => shop.id === args.id),
    },
    shops: {
      type: new GraphQLList(ShopType),
      description: "List of all shops",
      resolve: () => shops,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    additem: {
      type: ItemType,
      description: "Add a item",
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        photoURL: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        availability: { type: GraphQLNonNull(GraphQLBoolean) },
        name: { type: GraphQLNonNull(GraphQLString) },
        atShop: { type: GraphQLNonNull(GraphQLString) },
        price: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const item = {
          id: args.id,
          photoURL: args.photoURL,
          description: args.description,
          availability: args.availability,
          name: args.name,
          atShop: args.atShop,
          price: args.price,
        };
        items.push(item);
        return item;
      },
    },
    addshop: {
      type: ShopType,
      description: "Add a shop",
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        photoURL: { type: GraphQLNonNull(GraphQLString) },
        shopType: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const shop = {
          id: args.id,
          name: args.name,
          photoURL: args.photoURL,
          shopType: args.shopType,
        };
        shops.push(shop);
        return shop;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(5000, () => console.log("Server is now Running!"));