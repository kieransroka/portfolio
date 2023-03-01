// For Window Buttons
let maxedState = [];
let oldHeight = [];
let oldWidth = [];
let oldLeft = [];
let oldTop = [];
let ieBtnsEventListened = [];
let maxiBtn = [];

//Maximise ie window function
function maxiButton(i, e, maxi, ieWindows) {
    maxedState[i] = false;
    oldHeight[i] = e.offsetHeight;
    oldWidth[i] = e.offsetWidth;
    oldLeft[i] = e.offsetLeft;
    oldTop[i] = e.offsetTop;
    document.getElementsByClassName("maxi-btn")[i].addEventListener("click", function () {
        let ieWindow = e.getAttribute("window");
        if (!maxedState[ieWindow]) {
            oldHeight[ieWindow] = e.offsetHeight;
            oldWidth[ieWindow] = e.offsetWidth;
            oldLeft[ieWindow] = e.offsetLeft;
            oldTop[ieWindow] = e.offsetTop;
            e.style.width = "100%";
            e.style.height = window.innerHeight - 40 + "px";
            e.style.top = (e.offsetHeight * 0.5) + "px";
            e.style.left = (e.offsetWidth * 0.5) + "px"
            maxi[ieWindow].style.backgroundImage = "url(images/unmax.png)"
        } else if (maxedState[ieWindow]) {
            e.style.width = oldWidth[ieWindow] + "px";
            e.style.height = oldHeight[ieWindow] + "px";
            e.style.left = oldLeft[ieWindow] + "px";
            e.style.top = oldTop[ieWindow] + "px";
            maxi[ieWindow].style.backgroundImage = "url(images/max.png)"
        }
        maxedState[ieWindow] = !maxedState[ieWindow];
    })
    document.getElementById("test").addEventListener("click", function () {
        console.log(maxedState, oldHeight, oldWidth, oldLeft, oldTop, ieBtnsEventListened, maxi, ieWindows, i, e);
    })

}

//Close ie window function
function closeButton(i, e, maxi) {
    document.getElementsByClassName("close-btn")[i].addEventListener("click", function () {
        e.parentElement.remove();
        let ieWindow = e.getAttribute("window");
        maxedState.splice(ieWindow, 1);
        ieBtnsEventListened.splice(ieWindow, 1);
        maxi.splice(ieWindow, 1);
        oldHeight.splice(ieWindow, 1);
        oldWidth.splice(ieWindow, 1);
        oldLeft.splice(ieWindow, 1);
        oldTop.splice(ieWindow, 1);
        let ieWindows = document.getElementsByClassName("ie-box");
        for (let i = 0; i < ieWindows.length; i++) {
            let e = ieWindows[i];
            e.setAttribute("window", i);
        }
    })
}

//iFrame refresh
function refreshButton(i, e) {
    document.getElementsByClassName("refresh-btn")[i].addEventListener("click", function () {
        let ieWindow = e.getAttribute("window");
        document.getElementsByClassName('ie-iframe')[ieWindow].src = document.getElementsByClassName('ie-iframe')[ieWindow].src;
    })
}

//iFrame back 
function backButton(i, e) {
    let ieWindow = e.getAttribute("window");
    //Gets iframe
    let frame = document.getElementsByClassName('ie-iframe')[ieWindow]
    //Event listener for button
    document.getElementsByClassName("back-btn")[i].addEventListener("click", function () {
        frame.contentWindow.postMessage(locationReq, "*");
    })
    //To be passed to iframe
    let locationReq = 'locationRequest';
    //Function to prevent going back on first page
    function ieBack(data) {
        let frameLocation = data.data;
        console.log(frameLocation);
        if (frameLocation !== 'https://reduviid-expiration.000webhostapp.com/index.php') {
            let historyReq = "windowHistory"
            frame.contentWindow.postMessage(historyReq, "*");
        }
    }
    //Event listener for communication from iframe
    window.addEventListener('message', ieBack, false);
}

//iFrame forward
function fwdButton(i, e) {
    let ieWindow = e.getAttribute("window");
    //Gets iframe
    let frame = document.getElementsByClassName('ie-iframe')[ieWindow]
    //Event listener for button
    document.getElementsByClassName("forward-btn")[i].addEventListener("click", function () {
        frame.contentWindow.postMessage(locationReq, "*");
    })
    //To be passed to iframe
    let locationReq = 'locationRequest';
    //Function to prevent going back on first page
    function ieBack(data) {
        let frameLocation = data.data;
        console.log(frameLocation);
        if (frameLocation !== 'https://reduviid-expiration.000webhostapp.com/index.php') {
            let historyReq = "windowHistory"
            frame.contentWindow.postMessage(historyReq, "*");
        }
    }
    //Event listener for communication from iframe
    window.addEventListener('message', ieBack, false);
}

//Ie-box window create
document.getElementById("button").addEventListener("click", function () {
    // For making new div
    const newDiv = document.createElement("div");
    //gets window info from html
    async function openExplorer() {
        //gets info from html file
        const resp = await fetch("ie-box.html");
        const html = await resp.text();
        // Creates new div in main
        document.getElementsByTagName("main")[0].appendChild(newDiv);
        //Fills div with info from html file
        newDiv.innerHTML = html;
        let header = newDiv.querySelector(".ie-box-header");
        // Drag IE Windows
        dragElement(newDiv.firstChild);

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
            if (header) {
                // if present, the header is where you move the DIV from:
                header.onmousedown = dragMouseDown;
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

                elementOutside(newDiv.firstChild);
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
            elementOutside(newDiv.firstChild);
        });
        resizeObserver.observe(newDiv.firstChild);
    }
    //Runs when windows are added
    function windowAdd() {
        //Gets all windows
        let ieWindows = document.getElementsByClassName("ie-box");
        //Loops through windows
        for (let i = 0; i < ieWindows.length; i++) {
            let e = ieWindows[i];
            e.setAttribute("window", i);
            //Brings clicked window to front
            e.addEventListener("click", function () {
                for (let i = 0; i < ieWindows.length; i++) {
                    let e = ieWindows[i];
                    if (e.style.zIndex) {
                        e.style.zIndex = 3;
                    }
                }
                e.style.zIndex = 4;
            })
            //Adds event listener to window buttons - Added if statement so doesn't double add
            if (!ieBtnsEventListened[i]) {
                ieBtnsEventListened[i] = true;
                //For maximise
                maxiBtn[i] = document.getElementsByClassName("maxi-btn")[i];
                maxiButton(i, e, maxiBtn, ieWindows);
                //For closing
                closeButton(i, e, maxiBtn);
                //For Refresh
                refreshButton(i, e);
                //For back
                backButton(i, e)
            }
        }
    }
    openExplorer();
    const ieWindowObserver = new MutationObserver(function (mutationRecords) {
        let isNew = false;
        for (let i = 0; i < mutationRecords.length; i++) {
            let mutation = mutationRecords[i];
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                isNew = true;
                break
            }
        }
        if (isNew) {
            windowAdd();
        }
    });
    ieWindowObserver.observe(document.getElementsByTagName("main")[0], { childList: true });
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