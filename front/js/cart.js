(async function () {
    displayCart();
})()

async function displayCart() {

    let taillePanier = localStorage.length
    let afficheTableau = [];
    if (taillePanier != 0) {
        for (var i = 0; i < localStorage.length; i++) { // affiche tout le panier
            let key = localStorage.key(i); // on génère une clé du LS pour i (produit)
            let getProduct = localStorage.getItem(key); // key nous permet de récupérer le produit
            let getproductJson = JSON.parse(getProduct); // conversion du produit au format JS
            let itemLink = "http://localhost:3000/api/products/" + getproductJson.itemId; // crée un lien du produit
            const article = await getArticle(itemLink);
            let finalProduct = { // objet contenant toutes les infos du produit à afficher
                itemId: article._id,
                _imageUrl: article.imageUrl,
                name: article.name,
                _price: parseInt(article.price), // parseInt transforme en entier le prix
                _quantity: parseInt(getproductJson._quantity) // parseInt transforme en entier la quantité
            }

            afficheTableau[i] = finalProduct; // le produit est stocké dans un tableau
            afficherArticle(afficheTableau[i], getproductJson._color, key) //on affiche notre article avec ses détails
            if (i === localStorage.length - 1) { // une fois que tout est affiché, on appelle les fonctions que l'on utilisera
                suppression() //fonction utilisée qd l'utilisateur retire un article du panier
                recalculQuantite() //calcul le nombre total d'articles et le prix total
                changement() //observe si il y'a un changement de quantité et modifie les valeurs en conséquence.
                const btnOrder = document.getElementById('order');
                btnOrder.addEventListener('click', function() {

                    infosContact()
                });
            }
        }
    } else {
        alert("Votre panier est vide.")
        return (0);
    }
}



function getArticle(itemLink) { //fonction qui récupère l'article et qui le renvoie que lorsqu'il a reçu la réponse.
    return fetch(itemLink) // autrement dit on fetch cette adresse ""http://localhost:3000/api/products/" + getproductJson.itemId"
        .then(produitResponse => produitResponse.json()) // on convertit la reponse du fetch en JSON
        .then(function (articles) {
            return articles
        })
        .catch(function (error) {
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

    function actionSuppr() {
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
        let getProduct = localStorage.getItem(key);
        let getproductJson = JSON.parse(getProduct);
        let nombre = parseInt(getproductJson._quantity);
        let itemLink = "http://localhost:3000/api/products/" + getproductJson.itemId;
        const article_ = await getArticle(itemLink);
        quantite += nombre; // ajoute progressivement la quantité correspondante à chaque article
        argent += article_.price * nombre; //ajoute progressivement le prix chaque article MULTIPLIE par sa quantité
    };
    var baliseQuant = document.getElementById('totalQuantity').innerHTML;
    if (baliseQuant != "") {
        document.getElementById('totalQuantity').innerHTML = "";
    }
    var balisePrix = document.getElementById('totalPrice').innerHTML;
    if (balisePrix != "") {
        document.getElementById('totalPrice').innerHTML = "";
    }
    document.getElementById('totalQuantity').innerHTML += ` ${quantite} `;


    document.getElementById('totalPrice').innerHTML += ` ${argent} `;

}

function changement() { // check les changement dans les quantités
    var elements = document.getElementsByClassName('itemQuantity');

    var changes = function () {

        var attribut = this.getAttribute("data-id"); // on récupère le "data-id" pour voire quel article a été modifié.
        var concatene = '_' + attribut; // l'emplacement de stockage du nombre de produit
        var valQuant = document.getElementById(concatene).value;
        let getProduct = localStorage.getItem(attribut);
        let getproductJson = JSON.parse(getProduct);
        getproductJson._quantity = valQuant;
        localStorage.removeItem(attribut); //on supprime notre objet du local storage
        let stringTab = JSON.stringify(getproductJson);
        localStorage.setItem(attribut, stringTab);
        recalculQuantite(); // change la quantité totale et le prix total

    }

    for (var i = 0; i < elements.length; i++) { //pour l'ensembles des éléments du tableau (get element by class renvoie un tableau)
        elements[i].addEventListener('change', changes, false);
    }

}

function infosContact() {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let adresse = document.getElementById('address').value;
    let city = document.getElementById('city').value;
    let email = document.getElementById('email').value;
    let store = localStorage.length
    console.log(store, localStorage)
    if (checkFirstName(firstName) == true && checkLastName(lastName) == true && checkAddress(adresse) == true && checkCity(city) && checkMail(email) == true) {
        finishOrder(firstName, lastName, adresse, city, email); // envoie la requête post

    } else {
        alert("Le panier est vide")
    }

}

function checkLastName(value) {
    var check = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (check.exec(value) == null) {
        alert("Le format du nom est incorrect");
        return false;
    } else {
        return true;
    }
}

function checkFirstName(value) {
    var check = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (check.exec(value) == null) {
        alert("Le format du prénom est incorrect");
        return false;
    } else {
        return true;
    }
}

function checkAddress(value) {
    var check = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (check.exec(value) == null) {
        alert("Le format de l'adresse est incorrect");
        return false;
    } else {
        return true;
    }
}

function checkCity(value) {
    var check = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (check.exec(value) == null) {
        alert("Le format de la ville est incorrect");
        return false;
    } else {
        return true;
    }
}

function checkMail(value) {
    var verif = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/;
    if (verif.exec(value) == null) {
        alert("Le format de l'adresse mail est incorrect");
        return false;
    } else {
        return true;
    }
}


function finishOrder(nom, prenom, adresse, ville, mail) {

    let contact = {
        lastName: nom,
        firstName: prenom,
        address: adresse,
        city: ville,
        email: mail,
    }

    let products = [];
    let i = 0;
    let element;
    let getProduct;
    let getproductJson;
    while (i < localStorage.length) {
        element = localStorage.key(i)
        getProduct = localStorage.getItem(element)
        getproductJson = JSON.parse(getProduct);
        products.push(getproductJson.itemId);
        i++;
    }


    const fullInfos = { // contenir les données dans un objet
        contact,
        products
    }

    postApi(fullInfos);

}

function postApi(fullInfos) {



    fetch(("http://localhost:3000/api/products/order"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(fullInfos)
        })
        .then((response) => response.json())
        .then((order) => {

            console.log(order)


            localStorage.clear();

            window.location = "../html/confirmation.html?orderId=" + order.orderId
        })
        .catch(function (error) {
            alert(error)
        });

}