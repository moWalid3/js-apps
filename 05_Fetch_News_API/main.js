//

fetch(
  "https://newsapi.org/v2/everything?q=tesla&from=2024-05-01&sortBy=publishedAt&apiKey=694237c0c155420aa55ec1f485d0dd30",
)
  .then((response) => response.json())
  .then((data) => data.articles)
  .then((articles) => {
    articles.forEach((article) => {
      if (
        article.author != null &&
        !article.author.includes(".com") &&
        article.title != null &&
        article.urlToImage != null &&
        article.url != null
      ) {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="image">
              <img src="${article.urlToImage}"/>
            </div>
            <div class="info">
              <h2 class="title">${article.title}</h2>
              <div class="more-info">
                <a class="details" href="${article.url}" target="_blank">Details</a>
                <p class="author">${article.author}</p>
              </div>
            </div>
        `;

        document.querySelector(".container").append(card);
      }
    });
  });
