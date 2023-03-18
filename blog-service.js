const fs = require("fs");

let posts = [];
let categories = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/posts.json", "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        posts = JSON.parse(data);

        fs.readFile("./data/categories.json", "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            categories = JSON.parse(data);
            resolve();
          }
        });
      }
    });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    posts.length > 0 ? resolve(posts) : reject("no results returned");
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    posts.length > 0
      ? resolve(posts.filter((post) => post.published))
      : reject("no results returned");
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    categories.length > 0 ? resolve(categories) : reject("no results returned");
  });
};

module.exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
    postData.id = posts.length + 1;
    postData.published = Boolean(postData.published);
    postData.postDate = formatDate(new Date());
    posts.push(postData);
    try {
      resolve(postData);
    } catch {
      reject("unable to create post");
    }
  });
};
function formatDate(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}
module.exports.getPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    const filterPosts = posts.filter((post) => post.category == category);
    if (filterPosts.length > 0) {
      resolve(filterPosts);
    } else {
      reject("no posts available");
    }
  });
};
module.exports.getPostsByMinDate = function (minDate) {
  return new Promise((resolve, reject) => {
    const filterPosts = posts.filter(
      (post) => new Date(post.postDate) >= new Date(minDate)
    );
    if (filterPosts.length > 0) {
      resolve(filterPosts);
    } else {
      reject("no posts available");
    }
  });
};
module.exports.getPostById = function (id) {
  return new Promise((resolve, reject) => {
    const returnPost = posts.find((post) => post.id == parseInt(id));
    if (returnPost) {
      resolve(returnPost);
    } else {
      reject("no posts available");
    }
  });
};
module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    posts.length > 0
      ? resolve(
          posts.filter(
            (post) => post.published == true && post.category == category
          )
        )
      : reject("no results returned");
  });
};
