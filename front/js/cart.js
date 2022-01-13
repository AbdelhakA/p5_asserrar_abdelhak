(async function () {
    displayCart();
  })()

 async function displayCart () {

    let taillePanier = localStorage.length
    let afficheTableau = [];
    if(taillePanier != 0) {
        for (var i = 0; i < localStorage.length; i++) { // affiche tout le panier
            let key = localStorage.key(i); // on génère une clé du LS pour i (produit)
            let getOut = localStorage.getItem(key); // key nous permet de récupérer le produit
            let getoutJson = JSON.parse(getOut); // conversion du produit au format JS
            let itemLink = "http://localhost:3000/api/products/" + getoutJson.itemId; // crée un lien du produit
            // console.log(getoutJson.itemId)
            const article = await getArticle(itemLink);
            let finalProduct = {
                itemId: article._id,
                _imageUrl: article.imageUrl,
                name: article.name,
                _price: parseInt(article.price),
                _quantity: parseInt(getoutJson._quantity)
            }
            // console.log(finalProduct)
            let id = article.itemId;
            // console.log(id)
            afficheTableau[i] = finalProduct; // le produit est stocké dans un tableau
            afficherArticle(afficheTableau[i], getoutJson._color, key) //on affiche notre article avec les valeurs nécessaire.
            if (i == localStorage.length - 1) { // une fois que tout est affiché, on appelle les fonctions que l'on utilisera
                suppression() //fonction utilisée qd l'utilisateur retire un article du panier
                recalculQuantite()  //calcul le nombre total d'articles et le prix total
                changement() //observe si il y'a un changement de quantité et modifie les valeurs en conséquence.
                ContactCheck() //fonction qui verifie que avant de faire la commande le formulaire est bien remplis.
        }
    } 
 } 
 else {
     alert("Votre panier est vide.")
     return (0);
 }
}



function getArticle(itemLink) { //fonction qui récupère l'article avec fetch et qui le renvoie que lorsqu'il a reçu la réponse.
    return fetch(itemLink)
    .then(function(httpBodyResponse) {
        // console.log(httpBodyResponse)
        return httpBodyResponse.json()
    })
    .then (function (articles) {
        // console.log(articles)
        return articles
    })
    .catch (function(error) {
        alert(error)
    })
}

function afficherArticle(article, color, id) {
    document.getElementById('cart__items').innerHTML += `
    <article class="cart__item" id=":${id}">
        <div class="cart__item__img">
            <img src="${article._imageUrl}" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
                <h2>${article.name}</h2>
                <h2>${color}</h2>
                <p>${article._price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" data-id="${id}" id="_${id}" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article._quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" id="${id}">Supprimer</p>
                </div>
            </div>
        </div>
    </article> `
}

function suppression() {

    let pieces = document.getElementsByClassName("deleteItem");

    let actionSuppr = function() {
        var attribute = this.getAttribute("id");
        var parentPiece = ":" + attribute;
        var piece = document.getElementById(parentPiece);
        while (piece.firstChild) { // tant qu'il y a des enfants on les supprime
            piece.removeChild(piece.firstChild);
        }
        document.getElementById(parentPiece).remove(); // quand il ne reste plus de pièces enfant on supprime le parent
        localStorage.removeItem(attribute);
        recalculQuantite(); // recalcul de la quantité une fois que le/les élément(s) sont supprimés.
        
    };
    

    for (var i = 0; i < pieces.length; i++) {
        pieces[i].addEventListener('click', actionSuppr, false); // 
    }
}

async function recalculQuantite() {

    var quantite = 0;
    var argent = 0;
    for (var i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let getOut = localStorage.getItem(key); 
            let getoutJson = JSON.parse(getOut);
            let nombre = parseInt(getoutJson._quantity);
            let itemLink = "http://localhost:3000/api/products/" + getoutJson.itemId; 
            const article = await getArticle(itemLink);
            console.log(article)
            quantite += nombre; // ajoute progressivement la quantité correspondante à chaque article
            argent += article.price * nombre; //ajoute progressivement le prix chaque article MULTIPLIE par sa quantité
    };
    var baliseQuant = document.getElementById('totalQuantity').innerHTML;
    if(baliseQuant != "") {
        document.getElementById('totalQuantity').innerHTML = "";
    }
    var balisePrix = document.getElementById('totalPrice').innerHTML;
    if(balisePrix != "") {
        document.getElementById('totalPrice').innerHTML = "";
    }
    document.getElementById('totalQuantity').innerHTML += ` ${quantite} `;
    
    
    document.getElementById('totalPrice').innerHTML += ` ${argent} `;

}

function changement() { // check les changement dans les quantités
    var elements = document.getElementsByClassName('itemQuantity');

    var changes = function() {
        
        var attribut = this.getAttribute("data-id"); // on récupère le "data-id" pour voire quel article a été modifié.
        var concatene = '_' + attribut; // l'emplacement de stockage du nombre de produit
        var valQuant = document.getElementById(concatene).value;
        let getout = localStorage.getItem(attribut);
        let getoutJson = JSON.parse(getout);
        getoutJson._quantity = valQuant; 
        localStorage.removeItem(attribut); //on supprime notre objet du local storage
        let stringTab = JSON.stringify(getoutJson);
        localStorage.setItem(attribut, stringTab);
        recalculQuantite(); // change la quantité totale et le prix total
        
    }
    
    for (var i = 0; i < elements.length; i++) { //pour l'ensembles des éléments du tableau (get element by class renvoie un tableau)
        elements[i].addEventListener('change', changes, false);
    }
    
}

function InfosContact() { //vérification infos contact
    const order = document.getElementById('order');
    order.addEventListener('click', function()  {
        console.log("test")
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const email = document.getElementById('email').value;
        let store = localStorage.length
        if (validationFirstName(firstName) === true && validationLastName(lastName) === true) {
            if (validationAdresse(address) === true && validationCity(city) === true) {
                if (validationMail(email) === true && store != 0) {
                    postReservaiton(firstName, lastName, adresse, city, email); // envoie la requète post
                }
            }
        }
        if (store === 0) {
            alert("Le panier est vide.")
        }
    })





}
