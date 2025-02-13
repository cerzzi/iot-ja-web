document.getElementById("btnHello").addEventListener("click", function() {
    alert("Hello");
});
document.getElementById("btnHei").addEventListener("click", function() {
    alert("Hei");
});
document.getElementById("btnLasku").addEventListener("click", function() {
    let x = 10.5
    let y = 10
    
    alert(x+y)
});

document.getElementById("logButton").addEventListener("click", function() {
    let teksti = document.getElementById("tekstialue").value;
    console.log("Syötetty teksti:", teksti);
});

function loggaaTeksti() {
    let teksti = document.getElementById("tekstialue").value;
    console.log("Syötetty teksti:", teksti);
}
document.getElementById("logButton").addEventListener("click", loggaaTeksti);
document.getElementById("tekstialue").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Estetään rivinvaihto tekstialueessa
        loggaaTeksti();
    }
});
//daynappi
document.getElementById("btnCurrentDay").addEventListener("click", function() {
    let day;

    switch (new Date().getDay()) {
        case 0:
            day = "Sunnuntai";
            break;
        case 1:
            day = "Maanantai";
            break;
        case 2:
            day = "Tiistai";
            break;
        case 3:
            day = "Keskiviikko";
            break;
        case 4:
            day = "Torstai";
            break;
        case 5:
            day = "Perjantai";
            break;
        case 6:
            day = "Lauantai";
            break;
    }

    alert("Tänään on " + day);
});
