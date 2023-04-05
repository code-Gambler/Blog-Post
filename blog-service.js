const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "dhpzumae",
  "dhpzumae",
  "pZY56snRHiTDkHQavE5kHGzcbIeD--eD",
  {
    host: "isilo.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

var Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});
const { gte } = Sequelize.Op;

Post.belongsTo(Category, { foreignKey: "category" });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(function () {
        resolve();
      })
      .catch(function (error) {
        reject("unable to sync the database");
      });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll({})
      .then(function (Posts) {
        resolve(Posts);
      })
      .catch(function (error) {
        reject("no results returned");
      });
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
      },
    })
      .then(function (Posts) {
        resolve(Posts);
      })
      .catch(function (error) {
        reject("no results returned");
      });
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then(function (categories) {
        resolve(categories);
      })
      .catch(function (error) {
        reject("no results returned");
      });
  });
};

module.exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
    postData.published = Boolean(postData.published);
    for (let i in postData) {
      if (postData[i] == "") {
        postData[i] = null;
      }
    }
    postData.postDate = new Date();
    Post.create(postData)
      .then(resolve())
      .catch(reject("unable to create post"));
  });
};
function formatDate(date) {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
module.exports.getPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        Category: category,
      },
    })
      .then(function (Posts) {
        resolve(Posts);
      })
      .catch(function (error) {
        reject("no results returned");
      });
  });
};
module.exports.getPostsByMinDate = function (minDate) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDate),
        },
      },
    })
      .then(function (Posts) {
        resolve(Posts);
      })
      .catch(function (error) {
        reject("no results returned");
      });
  });
};
module.exports.getPostById = function (id) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        id: id,
      },
    })
      .then(function (Posts) {
        resolve(Posts[0]);
      })
      .catch(function (error) {
        reject("no results returned");
      });
  });
};
module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
        category: category,
      },
    })
      .then(function (Posts) {
        resolve(Posts);
      })
      .catch(function (error) {
        reject("no results returned");
      });
  });
};
module.exports.addCategory = function(category){
  return new Promise((resolve,reject)=>{
      for(let i in category){
          if(category[i] == ""){
              category[i] = null;
          }
      }
      Category.create({
        category: category.category
      })
      .then(function (category){
        resolve(category);
      })
      .catch(function (error) {
        reject("unable to create category");
      });
  });
};

module.exports.deleteCategoryById = function(id){
  return new Promise((resolve,reject)=>{
      Category.destroy({
          where: {
              id: id
          }
      })
      .then(function (){
        resolve();
      })
      .catch(function (error) {
        reject("unable to delete category");
      });
  });
};

module.exports.deletePostById = function(id){
  return new Promise((resolve,reject)=>{
      Post.destroy({
          where: {
              id: id
          }
      })
      .then(function (){
        resolve();
      })
      .catch(function (error) {
        reject("unable to delete post");
      });
  });
};