// Drag IE Windows
dragElement(document.getElementById("ie-box"));


//Checks if ie-box goes outside view
function elementOutside(elmnt) {
    if (elmnt.getBoundingClientRect().top <= 0) {
        elmnt.style.top = (elmnt.offsetHeight * 0.5) + "px";
    }

    if (elmnt.getBoundingClientRect().left <= 0) {
        elmnt.style.left = (elmnt.offsetWidth * 0.5) + "px";
    }

    if (elmnt.getBoundingClientRect().right >= window.innerWidth) {
        elmnt.style.left = window.innerWidth - (elmnt.offsetWidth * 0.5) + "px";
    }

    if (elmnt.getBoundingClientRect().bottom >= window.innerHeight) {
        elmnt.style.top = window.innerHeight - (elmnt.offsetHeight * 0.5) + "px";
    }
}

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elementOutside(document.getElementById("ie-box"));
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const resizeObserver = new ResizeObserver(entires => {
    elementOutside(document.getElementById("ie-box"));
});
resizeObserver.observe(document.getElementById("ie-box"));

//Maximise Button
let maxedState;
let oldHeight;
let oldWidth;
let oldLeft;
let oldTop;
document.getElementById("maxi-btn").addEventListener("click", function () {
    let ieBox = document.getElementById("ie-box");
    let maxiBtn = document.getElementById("maxi-btn");
    if (!maxedState) {
        oldHeight = ieBox.offsetHeight;
        oldWidth = ieBox.offsetWidth;
        oldLeft = ieBox.offsetLeft;
        console.log();
        oldTop = ieBox.offsetTop;
        console.log();
        ieBox.style.width = "100%";
        ieBox.style.height = window.innerHeight - 40 + "px";
        ieBox.style.top = (ieBox.offsetHeight * 0.5) + "px";
        ieBox.style.left = (ieBox.offsetWidth * 0.5) + "px"
        maxiBtn.style.backgroundImage = "url(images/unmax.png)"
    } else {
        ieBox.style.width = oldWidth + "px";
        ieBox.style.height = oldHeight + "px";
        ieBox.style.left = oldLeft + "px";
        ieBox.style.top = oldTop + "px";
        maxiBtn.style.backgroundImage = "url(images/max.png)"
    }
    maxedState = !maxedState;
})

// iFrame refresh
document.getElementById("refresh-btn").addEventListener("click", function () {
    document.getElementById('ie-iframe').src = document.getElementById('ie-iframe').src;
})



//Function for BSOD
function shutDown() {
    let audio = new Audio('audio/bsod.mp3');
    audio.play();
    document.getElementById("overlay").style.backgroundImage = "url(images/bsod.png)";
    document.getElementById("overlay").style.backgroundColor = "#1903A6";
    document.getElementById("overlay").style.opacity = "100%";
    document.getElementById("overlay").style.backgroundRepeat = "no-repeat";
    document.getElementById("overlay").style.backgroundSize = "contain";
    document.getElementById("overlay").style.backgroundPosition = "center center";
    document.getElementById("overlay").style.height = "101vh";
    document.getElementById("myFooter").style.display = "none";
    document.getElementById("ie-col").style.zIndex = "0";
}
//Event listener for press of shutdown button, causes BSOD
document.getElementById("shutDown").addEventListener("click", function () {
    shutDown();
})

//Function to undo BSOD
function unBSOD() {
    document.getElementById("overlay").style.backgroundImage = "none";
    document.getElementById("overlay").style.backgroundColor = "#FF6AD5";
    document.getElementById("overlay").style.opacity = "40%";
    document.getElementById("overlay").style.height = "96vh";
    document.getElementById("myFooter").style.display = "block";
    document.getElementById("ie-col").style.zIndex = "2";
}
//Event listner for button press while BSOD
document.getElementById("overlay").addEventListener("click", function () {
    unBSOD();
})
//Spinner for both buttons on search page
if (window.location.pathname == "/php/KS_website/index.html") {
    document.getElementById("submit").addEventListener("click", function () {
        document.getElementById("spinner").style.display = "inline-block";
    })
    document.getElementById("viewAll").addEventListener("click", function () {
        document.getElementById("spinner").style.display = "inline-block";
    })
}

//Function that gets the local time of machine and displays in bottom right
function time() {
    let currentTime = new Date().toLocaleTimeString('en-GB', {
        hour: "numeric",
        minute: "numeric"
    });
    document.getElementById("time").innerHTML = "<img src='images/volume.png' id='volume' class='pb-1'>" + currentTime;
}
window.setInterval(function () {
    time()
}, 1000)