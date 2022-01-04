
(async function () {
  displayCart();
//   console.log(displayCart)
})()

async function displayCart () {
var taille = localStorage.length
let displayTab = [];
if(taille != 0) {
    for (var i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        // console.log(key)
        let wayOut = localStorage.getItem(key);
        // console.log(wayOut)
        let wayoutJson = JSON.parse(wayOut);
        // console.log(wayoutJson)
        let itemLink = "http://localhost:3000/api/products/" + wayoutJson.itemId;
        // console.log(itemLink)
        let id_produit = wayoutJson.itemId;
        // console.log(id_produit)
        let couleur = wayoutJson._color;
        // console.log(couleur)
        
        
        
        const item = await getProducts(itemLink);
        // console.log(item)
        let product = {
            id: item._id,
            imageUrl: item.imageUrl,
              name: item.name,
              price: parseInt(item.price),
            //   quantité: parseInt(wayoutJson._quantity),
            
        }
        // console.log(product)
        console.log('-------------------------')
        let nom = item.name;
        console.log(nom)
        let prix = item.price;
        console.log(prix)
        let id = item._id;
        console.log(id)
        let image = item.imageUrl;
        console.log(image)
        let desc = item.description;
        console.log(desc)
        let alterText = item.altTxt;
        console.log(alterText)
        let quantite = parseInt(wayoutJson._quantity);
        console.log(quantite)
        
         
         
        // displayTab[i] = product;
        // displayProduct(displayTab[i], wayoutJson._color, key)
        // if(i == localStorage.length - 1) {
        //     erase()
        //     quantityPrice()
        //     change()
        //     contactCheck()
        // }
    }
}

else {
    // alert("Le panier est vide." )
    return (0);
}
}


function getProducts(itemLink) { //fonction qui récupère l'article avec fetch et qui le renvoie que lorsqu'il a reçu la réponse.
return fetch(itemLink)
    .then(function (httpBodyResponse) {
        // console.log(httpBodyResponse.json)
        return httpBodyResponse.json()
        
    })
    .then(function (items) {
        // console.log(items)
        return items
    })
    .catch(function (error) {
        alert(error)
    })     
}


function displayProduct(item, color, id) {

  document.getElementById('cart__items').innerHTML += 
  `<article class="cart__item" data-id="${id}">
  <div class="cart__item__img">
    <img src="${item.imageUrl}" alt="Photographie d'un canapé">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__titlePrice">
      <h2>${item.name}</h2>
      <h2>${color}</h2>
      <p>${item.price}</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=>
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem" id="${id}">Supprimer</p>
      </div>
    </div>
  </div>
</article>`
}

function erase() {
  var elements = document.getElementsByClassName("deleteItem");

  var maFonction = function() {
      var attribute = this.getAttribute("id");
      var parentElement = ":" + attribute
      var element = document.getElementById(parentElement);
      while (element.firstChild) {
          element.removeChild(element.firstChild);
      }
      document.getElementById(parentElement).remove();
      localStorage.removeItem(attribute);
      quantityPrice();
  };

  for (var i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', maFonction, false); 
  }
}

async function quantityPrice() {
  var quantity = 0
  var money = 0
  for (var i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let wayOut = localStorage.getItem(key);
      let wayoutJson = JSON.parse(wayOut);
      let quantityNb = parseInt(wayoutJson.quantité);
      let itemLink = "http://localhost:3000/api/products/" + wayoutJson._id;
      const item = await getProducts(itemLink);
      console.log(item)
      quantity += quantityNb;
      money += item.price * quantityNb;
  }
  var total = document.getElementById('totalQuantity').innerHTML;
  if (total !="") {
    document.getElementById('totalQuantity').innerHTML = "";
  }
  var total2 = document.getElementById('totalQuantity').innerHTML;
  if (total2 !="") {
    document.getElementById('totalQuantity').innerHTML = "";
  }

  document.getElementById("totalQuantity").innerHTML += `
  ${quantity}
  `
  document.getElementById("totalPrice").innerHTML += `
  ${money}
  `
}

function change() { // fonction qui regarde si il y'a un changement dans les quantités
var elements = document.getElementsByClassName("itemQuantity");

var myFunction = function() {
    var attribute = this.getAttribute("data-id"); //on récupère le data-id pour voire quel article a été modifié.
    var concat = '_' + attribute; // l'endroit ou est stocké la valeur du nombre de produit.
    var valQuantity = document.getElementById(concat).value;
    console.log(valQuantity)
    let wayOut = localStorage.getItem(attribute);
    let wayoutJson = JSON.parse(wayOut);
    wayoutJson._quantity = valQuantity; //on modifie la valeur dans notre objet java.
    console.log(wayoutJson)
    localStorage.removeItem(attribute); //on suprime notre objet dans le local storage
    let tableauString = JSON.stringify(wayoutJson);
    localStorage.setItem(attribute, tableauString); // on stoque de nouveau notre objet en lui attribuant la clé de l'objet précedement supprimer.
    console.log(localStorage)
    quantityPrice(); //on change la quantité total des articles et le prix total.
};

for (var i = 0; i < elements.length; i++) { //pour l'ensembles des éléments du tableau (get element by class renvoie un tableau)
    elements[i].addEventListener('change', myFunction, false);
}
}

function contactCheck() { //vérifie si le formulaire est bien remplie avant de faire la requète POST vers l'api
const order = document.getElementById('order');
order.addEventListener('click', function()  {
    console.log("test")
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const adresse = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const email = document.getElementById('email').value;
    let store = localStorage.length
    if (validationFirstName(firstName) === true && validationLastName(lastName) === true) {
        if (validationAdresse(adresse) === true && validationCity(city) === true) {
            if (validationMail(email) === true && store != 0) {
                postReservaiton(firstName, lastName, adresse, city, email); // envoie la requète post
            }
        }
    }
    if (store === 0) {
        alert("Panier vide. Ajoutez des articles!")
    }
});
}

function validationMail(value) { //vérifie à l'aide de regex que l'adresse mail est composé d'une première partie avec des lettres, des nombres, et quelques signes spéciaux.
                            // suivie du signe @ puis de nouveau cette sélection suivie d'un . enfin il ne peux y'avoir que deux caractères en lettres après le .
var verif = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/ ;
if (verif.exec(value) == null) {
    alert("Votre email est incorrecte");
    return false;
}
else {
    return true;
}	
}

function validationFirstName(value) {
var verif = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u ; //autorise cette liste de caractère.
if (verif.exec(value) == null) {
    alert("Votre First Name est incorrecte");
    return false;
}
else {
    return true;
}
}

function validationLastName(value) {
var verif = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u ;
if (verif.exec(value) == null) {
    alert("Votre Last Name est incorrecte");
    return false;
}
else {
    return true;
}
}

function validationCity(value) {
var verif = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u ;
if (verif.exec(value) == null) {
    alert("Votre City est incorrecte");
    return false;
}
else {
    return true;
}
}

function validationAdresse(value) {
var verif = /^[a-zA-Z0-9ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s,.'-]{3,}$/ ; //même chose mais au mois 3 caractère.
if (verif.exec(value) == null) {
    alert("Votre Adresse est incorrecte");
    return false;
}
else {
    return true;
}
}

async function postReservaiton(first, last, adresse, ville, mail) { // crée le tableau de donnée de contatc
let contact = {
    firstName: first,
    lastName: last,
    address: adresse,
    city: ville,
    email: mail
}
let products = [];
var i = 0;
let key;
let wayOut;
let wayoutJson;
while (i < localStorage.length) { //on remplis le tableau avec nos valeurs final.
    key = localStorage.key(i);
    wayOut = localStorage.getItem(key);
    wayoutJson = JSON.parse(wayOut);
    products[i] = wayoutJson._id;
    i++;
}
const aEnvoyer = { //on envoie cet objet et ce tableau à l'api
    contact,
    products
}
envoiePost(aEnvoyer);

}


async function envoiePost(post) {
await axios.post("http://localhost:3000/api/products/order", JSON.stringify(post), {headers: {'Content-Type': 'application/json'}}) // on utilise axios pour faire un post vers l'api on privilégie cette méthode qui est plus facile.
    .then(function(res){
        const resultat = res
        const redirection = "./confirmation.html?" + resultat.data.orderId
        localStorage.clear() //on efface nos valeurs la commande est effectué
        window.location.href = redirection ; //on redirige l'utilisateur vers la page de confirmation.
    })
    .catch(function(err){
        console.log(err)
    })
}