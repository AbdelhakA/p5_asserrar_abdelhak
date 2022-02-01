(async function () {
    const articles = await getArticles()
  
    for (article of articles) {
        displayArticle(article)
    }

  })()
  
  function getArticles() {   // on récupère le contenur de l'API avec fetch
    return fetch("http://localhost:3000/api/products")

    .then(httpBodyResponse => httpBodyResponse.json()) // envoie en réponse le contenu de l'API

        // .then(function (httpBodyResponse) {
        //     return httpBodyResponse.json()
        // })
        // .then(function (articles) {
        //     return articles
        // })
        // .catch(function (error) {
        //     alert(error)
        // })

        
  }

  
  
  function displayArticle(article) { // Afficher les produits récupérés de l'API avec innerHTML
  
    document.getElementById("items").innerHTML += `
        <a href="./product.html?id=${article._id}">
            <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class ="productName">${article.name}</h3>
                <p class ="productDescription">${article.description}</p>
            </article>
        </a>`
  }


  