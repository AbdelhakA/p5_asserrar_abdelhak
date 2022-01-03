(async function () {
    const articles = await getArticles()
  
    for (article of articles) {
        displayArticle(article)
    }

  })()

  // Récupère l'API
  
  function getArticles() {
    return fetch("http://localhost:3000/api/products")
        .then(function (httpBodyResponse) {
            return httpBodyResponse.json()
        })
        .then(function (articles) {
            return articles
        })
        .catch(function (error) {
            alert(error)
        })
  }

  // Afficher ce que j'ai recup
  
  function displayArticle(article) {
  
    document.getElementById("items").innerHTML += `
        <a href="./product.html?id=${article._id}">
            <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class ="productName">${article.name}</h3>
                <p class ="productDescription">${article.description}</p>
            </article>
        </a>`
  }


  