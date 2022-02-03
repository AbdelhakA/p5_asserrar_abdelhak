let url = new URL(window.location);
console.log(url)
document.getElementById("orderId").innerHTML = url.searchParams.get("orderId"); // affiche l'orderId via innerHTML 
console.log(document.getElementById("orderId").innerHTML = url.searchParams.get("orderId")) 