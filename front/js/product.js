console.log("yo");

(async function () {
    const items = await getItems()
    
    for (item of items) {
       displayItem(item);
       
    }
   const colors = item.colors;
   
    
   for (color of colors) {
    displayColor(color);
   }

   //test test

   const addCart = document.getElementById('addToCart');
    addCart.addEventListener('click', function(item) { //Cette fonction ce déclenche quand l'utilisateur clique sur ajouter au panier
        var selectElem = document.getElementById('colors');
        var index = selectElem.selectedIndex;
    let str = window.location.href;
    let url = new URL(str); 
    let id  = url.searchParams.get("id");
        
        var quantity = document.getElementById('quantity').value;

        if(index != 0 && quantity > 0) { //on vérifie que la couleur a été choisie et que la quantitée n'est pas à 0
            console.log('top')
            addPanier(index, colors, id, quantity);
            // verifOrdre();
        }
        else {
            console.log('nop')
            alert('il faut choisir une couleur et avoir au moins un article pour commander !')
            return (1);
        }
    });
  })()

  
  
  function getItems() {
    return fetch("http://localhost:3000/api/products")
        .then(function (httpBodyResponse) {
            return httpBodyResponse.json()
        })
        .then(function (items) {
            return items;
        })
        .catch(function (error) {
            alert(error)
        })
  }
  
  function displayItem(item) { 
    let productId = item._id; 
    let str = window.location.href;
    let url = new URL(str); 
    let id  = url.searchParams.get("id"); 
    
    
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

function displayColor(color) {  
  document.getElementById("colors").innerHTML += `
      <option value="${color}">${color}</option>
  `
}

function addPanier(index, colors, id, quantity) {  // C'est une fonction qui vérifie qu'il n'existe pas déja dans notre
  var colorValide = colors[index - 1]
  console.log(id)            // storage un élément avec le même id et la même couleur. Si oui il
  var size = localStorage.length                 // rassemble les deux élément en un élément en additionnant les quantités.
  var key = id + colorValide
  let commande = {
      itemId: id,
      _color: colorValide,
      _quantity: quantity
  };
  console.log(commande)
  
  if (size === 0) {
      let tableauString = JSON.stringify(commande);
      localStorage.setItem(key, tableauString);
      console.log(localStorage);
  }
  else {
      if (localStorage.getItem(key)) {
          let sortir = localStorage.getItem(key);
          let sortirJson = JSON.parse(sortir);
          let quantity1 = parseInt(commande._quantity);
          let quantity2 = parseInt(sortirJson._quantity);
          commande._quantity = quantity1 + quantity2;
          localStorage.removeItem(key);
          let tableauString = JSON.stringify(commande);
          localStorage.setItem(key, tableauString);
          console.log(localStorage);
      }
      else {
          let tableauString = JSON.stringify(commande);
          localStorage.setItem(key, tableauString);
          console.log(localStorage);
      }
  }
}

