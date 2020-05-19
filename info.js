let modal = document.getElementById("infoModal");
let info = document.getElementById("info");
let close = document.getElementsByClassName("close")[0];

info.onclick = function(){
    modal.style.display = "block";
};

close.onclick = function(){
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};