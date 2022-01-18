let params = (new URL(document.location)).searchParams; // adresse URL
let urlId = params.toString();
let newId = id.substring(0, urlId.length - 1);
var balise = document.getElementById('orderId').innerHTML; 
if (balise != "") { //si il y'avais déja un numéro de commande on le supprime
    document.getElementById('orderId').innerHTML = "";
}
document.getElementById("orderId").innerHTML += `
    ${newId}
`
//on viens d'afficher notre nouvelle commande avec son numéro.
urlId = 0; //on modifie les valeurs pour ne rien stocké 
newId = 0; // même chose.