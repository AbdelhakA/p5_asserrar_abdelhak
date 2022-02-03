let url = new URL(window.location); // renvoie l'adresse de la page confirmation
document.getElementById("orderId").innerHTML = url.searchParams.get("orderId"); // affiche l'orderId via innerHTML 