(async function () {
  let queryString = window.location.search; // permet de recupérer l'id dans l'URL
  let urlParams = new URLSearchParams(queryString); // permet de recupérer l'id dans l'URL
  let id = urlParams.get('id'); // permet de recupérer l'id dans l'URL
  const item = await getItems(id) // fonction qui récup le produit dans l'API


  displayItem(item);


  const colors = item.colors;


  for (color of colors) {
    displayColor(color);
  }


  const addCart = document.getElementById('addToCart'); // const associé au bouton 'Ajouter au panier'
  addCart.addEventListener('click', function () { // fonction qui s'exécute lorsque l'utilisateur clique sur le bouton

    var pickColor = document.getElementById('colors');
    var index = pickColor.selectedIndex; // couleur sélectionnée
    var quantity = document.getElementById('quantity').value;

    if (index != 0 && quantity > 0) { 

      ajoutPanier(index, colors, id, quantity);

    } else {
      
      alert('Veuillez sélectionner au moins un article et une couleur pour commander')

    }
  });
})()



function getItems(productId) {
  return fetch("http://localhost:3000/api/products/" + productId)

    .then(function (httpBodyResponse) {
      return httpBodyResponse.json()
    })
    .then(function (item) {
      return item;
    })
    .catch(function (error) {
      alert(error)
    })
}

function displayItem(item) {
  let productId = item._id;
  let str = window.location.href;
  let url = new URL(str);
  let id = url.searchParams.get("id");


  if (productId === id) {


    document.getElementById("productItem").innerHTML += `
  <article>
  <div class="item__img" >
            <img id="item_pic" src="${item.imageUrl}" alt="">
          </div>
          <div class="item__content">
            <div class="item__content__titlePrice">
              <h1 id="title"><!-- Nom du produit --></h1>
              <p>Prix : <span id="price">${item.price}</span>€</p>
            </div>
            <div class="item__content__description">
              <p class="item__content__description__title">Description :</p>
              <p id="description">${item.description}</p>
            </div>
            <div class="item__content__settings">
              <div class="item__content__settings__color">
                <label for="color-select">Choisir une couleur :</label>
                <select name="color-select" id="colors">
                    <option>choisissez une couleur</option>
                   
                    
                </select>
              </div>
              <div class="item__content__settings__quantity">
                <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
              </div>
              <div class="item__content__addButton">
          <button id="addToCart">Ajouter au panier</button>
      </div>
            </div>
            </article>`

  }

}

function displayColor(color) { // fonction précédemment appelée et qui affiche les couleurs relatives au modèle
  document.getElementById("colors").innerHTML += `
    <option value="${color}">${color}</option>
`
}

/* fonction qui vérifie qu'il n'y a pas d'éléments identiques 
et les rassemble si c'est le cas */

function ajoutPanier(index, colors, id, quantity) {

  var validColor = colors[index - 1] // ne sélectionne qu'une seule couleur parmi le choix
  var tailleProduit = localStorage.length
  var key = id + validColor
  let order = {
    itemId: id,
    _color: validColor,
    _quantity: quantity
  };

  if (tailleProduit === 0) {
    let orderString = JSON.stringify(order);
    localStorage.setItem(key, orderString);

  } else {
    if (localStorage.getItem(key)) {
      let getProduct = localStorage.getItem(key);
      let getproductJson = JSON.parse(getProduct);
      let quantityA = parseInt(order._quantity);
      let quantityB = parseInt(getproductJson._quantity);
      order._quantity = quantityA + quantityB;
      localStorage.removeItem(key);
      let orderString = JSON.stringify(order);
      localStorage.setItem(key, orderString);

    } else {
      let orderString = JSON.stringify(order);
      localStorage.setItem(key, orderString);

    }
  }
}