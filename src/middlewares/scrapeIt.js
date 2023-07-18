"use strict"

const scrapeIt = require("../lib")

// Promise interface
function scrapeWebsite() {
  return scrapeIt("https://ionicabizau.net", {
    title: ".header h1",
    desc: ".header h2",
    avatar: {
      selector: ".header img",
      attr: "src",
    },
  }).then(({ data, status }) => {
    console.log(`Status Code: ${status}`);
    console.log(data);
  });
}

// Async-Await
async function scrapeAsync() {
  const { data } = await scrapeIt("https://ionicabizau.net", {
    // Fetch the articles
    articles: {
      listItem: ".article",
      data: {
        // Get the article date and convert it into a Date object
        createdAt: {
          selector: ".date",
          convert: x => new Date(x),
        },
        // Get the title
        title: "a.article-title",
        // Nested list
        tags: {
          listItem: ".tags > span",
        },
        // Get the content
        content: {
          selector: ".article-content",
          how: "html",
        },
        // Get attribute value of root listItem by omitting the selector
        classes: {
          attr: "class",
        },
      },
    },
    // Fetch the blog pages
    pages: {
      listItem: "li.page",
      name: "pages",
      data: {
        title: "a",
        url: {
          selector: "a",
          attr: "href",
        },
      },
    },
    // Fetch some other data from the page
    title: ".header h1",
    desc: ".header h2",
    avatar: {
      selector: ".header img",
      attr: "src",
    },
  });
  console.log(data);
}

module.exports = {
  scrapeIt,
  scrapeWebsite,
  scrapeAsync,
};