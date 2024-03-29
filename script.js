// For Window Buttons
let maxedState = [];
let oldHeight = [];
let oldWidth = [];
let oldLeft = [];
let oldTop = [];
let ieBtnsEventListened = [];
let maxiBtn = [];

function indexSort(e, ieWindows) {
    for (let i = 0; i < ieWindows.length; i++) {
        let e = ieWindows[i];
        e.classList.remove("front");
        e.classList.add("back");
    }
    e.classList.remove("back");
    e.classList.add("front");
}

//Focus function
function giveFocus(i, e, ieWindows,) {
    let ieWindow = e.getAttribute("window");
    //Brings clicked window to front
    e.addEventListener("click", function () {
        indexSort(e, ieWindows)
        selectTask(i)
    })
    //Gets iframe
    let frame = document.getElementsByClassName('ie-iframe')[ieWindow];
    let windowFocus = "windowFocus";
    //Listens for iframe loading to trigger postmessage
    frame.addEventListener("load", function () {
        frame.contentWindow.postMessage(windowFocus, "*");
    })
    //Add event listener for message from iframe
    window.addEventListener('message', iframeFront, false);
    //function run after message recieved
    function iframeFront(data) {
        //Checks message has come from correct window and correct function
        if (frame.contentWindow === data.source && data.data === "windowFocus") {
            indexSort(e, ieWindows);
            selectTask(i)
        }
    }
}

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
            e.style.height = window.innerHeight - 37 + "px";
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
}

//Close ie window function
function closeButton(i, e, maxi) {
    document.getElementsByClassName("close-btn")[i].addEventListener("click", function () {
        let ieWindows = document.getElementsByClassName("ie-box");
        let ieWindow = e.getAttribute("window");
        let taskbarWindows = document.getElementsByClassName("taskbar-window");
        let taskbarWindow = document.getElementsByClassName("taskbar-window")[ieWindow];

        taskbarWindow.style.visibility = "hidden";
        taskbarWindow.classList.add("removing");

        e.parentElement.remove();
        for (let i = 0; i < ieWindows.length; i++) {
            let e = ieWindows[i];
            e.setAttribute("window", i);
        }

        if (taskbarWindows.length > 1) {
            let taskbarMove = document.getElementsByClassName("taskbar-window");
            for (let i = ieWindow; i < taskbarWindows.length; i++) {
                taskbarMove[i].classList.add("moving");
            }
            taskbarMove[taskbarWindows.length - 1].addEventListener("animationend", function removingTask() {
                taskbarWindow.remove();
                for (let i = 0; i < taskbarWindows.length; i++) {
                    let orderTaskbar = document.getElementsByClassName("taskbar-window")[i];
                    orderTaskbar.setAttribute("window", i)
                    taskbarMove[i].classList.remove("moving");
                }
                selectTask();
            })
        } else {
            taskbarWindow.remove();
            selectTask();
        }
        maxedState.splice(ieWindow, 1);
        ieBtnsEventListened.splice(ieWindow, 1);
        maxi.splice(ieWindow, 1);
        oldHeight.splice(ieWindow, 1);
        oldWidth.splice(ieWindow, 1);
        oldLeft.splice(ieWindow, 1);
        oldTop.splice(ieWindow, 1);
    })
}

//Minimise function
function minimise(i, e) {
    document.getElementsByClassName("mini-btn")[i].addEventListener("click", function () {
        let ieWindow = e.getAttribute("window");
        let taskbarBtn = document.getElementsByClassName("taskbar-btn")[ieWindow];
        oldLeft[ieWindow] = e.offsetLeft;
        oldTop[ieWindow] = e.offsetTop;
        e.classList.add("minimise");
        e.addEventListener("animationend", function () {
            if (e.classList.contains("minimise")) {
                e.style.display = "none";
                taskbarBtn.classList.remove("task-selected");
            }
        })
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
    //To be passed to iframe
    let locationReq = 'locationRequest';
    //Event listener for button
    document.getElementsByClassName("back-btn")[i].addEventListener("click", function () {
        frame.contentWindow.postMessage(locationReq, "*");
    })
    //Function to prevent going back on first page
    function ieBack(data) {
        if (data.data !== "windowFocus") {
            let frameLocation = data.data;
            if (frameLocation !== 'https://reduviid-expiration.000webhostapp.com/index.php') {
                let historyReq = "windowHistory"
                frame.contentWindow.postMessage(historyReq, "*");
            }
        }
    }
    //Event listener for communication from iframe
    window.addEventListener('message', ieBack, false);
}

//iFrame forward
function fwdButton(i, e) {
    let ieWindow = e.getAttribute("window");
    //Gets iframe
    let frame = document.getElementsByClassName('ie-iframe')[ieWindow];
    let forward = "windowFwd";
    //Event listener for button
    document.getElementsByClassName("forward-btn")[i].addEventListener("click", function () {
        frame.contentWindow.postMessage(forward, "*");
    })
}

function selectTask(i) {
    let taskbarBtns = document.getElementsByClassName("taskbar-btn");
    let e = taskbarBtns[i];
    let ieWindows = document.getElementsByClassName("ie-box");
    function indent() {
        for (let i = 0; i < taskbarBtns.length; i++) {
            let e = taskbarBtns[i];
            if (e.classList.contains("task-selected")) {
                e.classList.remove("task-selected");
            }
        }
        if (ieWindows.length === 0) {
            return;
        } else if (ieWindows.length < 2) {
            taskbarBtns[0].classList.add("task-selected");
        } else if (e === undefined) {
            e = taskbarBtns[taskbarBtns.length - 1];
            e.classList.add("task-selected");
        } else {
            e.classList.add("task-selected");
        }
    }
    indent();
    if (e !== undefined) {
        e.addEventListener("click", function () {
            indent();
            let taskWindow = e.parentElement.getAttribute("window");
            let ieWindow = ieWindows[taskWindow];
            indexSort(ieWindow, ieWindows);
            if (ieWindow.classList.contains("minimise")) {
                ieWindow.classList.remove("minimise");
                ieWindow.style.display = "block";
                ieWindow.style.left = oldLeft[taskWindow] + "px";
                ieWindow.style.top = oldTop[taskWindow] + "px";
                ieWindow.classList.add("reopen");
                ieWindow.addEventListener("animationend", function () {
                    ieWindow.classList.remove("reopen");
                })
            }
        })
    }


}


//Ie-box window create
let launchBtns = document.getElementsByClassName("ie-launch");
for (let i = 0; i < launchBtns.length; i++) {
    let launchBtn = launchBtns[i];
    launchBtn.addEventListener("click", function () {
        let ieWindows = document.getElementsByClassName("ie-box");
        if (ieWindows.length >= 5) {
            let audio = new Audio('audio/bsod.mp3');
            audio.play();
            const newWarning = document.createElement("div");
            const warningUnderlay = document.createElement("div");
            newWarning.classList.add("warning", "text-center", "pb-3");
            newWarning.innerHTML =

                "<div class='ie-box-header row align-items-center ms-0 me-0 mb-3 text-nowrap'>" +
                "<div class='col col-sm-8 d-flex align-items-center ps-1'>" +
                "<img src='images/logopagebw.png' alt='' class='address-logo me-1'>" +
                "<p class='mb-0'> Macrohard Interweb Adventurer</p>" +
                "</div> <div class='col col-sm-4 pe-1 d-flex justify-content-end'>" +
                "<button class='close-btn warning-x'></button>" +
                "</div>" +
                "</div>" +
                "<p class='ps-2 pe-2'><img src='images/warning.png' alt='' class='ms-1 me-3'>You have exceeded the window limit. Please close a window before continuing.</p>" +
                "<button class='start lh-sm warning-close btn-outline'>OK</button>";
            warningUnderlay.innerHTML = "<div id='warning-underlay'></div>";
            document.getElementsByTagName("main")[0].appendChild(newWarning);
            document.getElementsByTagName("main")[0].appendChild(warningUnderlay);
            document.getElementsByClassName("warning-close")[0].addEventListener("click", function () {
                newWarning.remove();
                warningUnderlay.remove();
            })
            document.getElementsByClassName("warning-x")[0].addEventListener("click", function () {
                newWarning.remove();
                warningUnderlay.remove();
            })
        } else {
            // For making new div
            const newDiv = document.createElement("div");
            const frameSrc = launchBtn.getAttribute("data-address");

            //gets window info from html
            async function openExplorer() {
                //gets info from html file
                const resp = await fetch("ie-box.html");
                const windowHTML = await resp.text();
                // Creates new div in main
                document.getElementsByTagName("main")[0].appendChild(newDiv);
                //Fills div with info from html file
                newDiv.innerHTML = windowHTML;
                newDiv.getElementsByClassName("ie-iframe")[0].setAttribute("src", frameSrc)
                let header = newDiv.querySelector(".ie-box-header");
                //Address URL
                const addressBar = newDiv.getElementsByClassName("address-url")[0];
                addressBar.innerHTML = frameSrc;
                const goBtn = newDiv.getElementsByClassName("go-btn")[0];
                goBtn.href = frameSrc;
                goBtn.firstElementChild.addEventListener("mouseover", function () {
                    goBtn.firstElementChild.classList.remove("btn-flash");
                })
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
                    //Adds event listener to window buttons - Added if statement so doesn't double add
                    if (!ieBtnsEventListened[i]) {
                        ieBtnsEventListened[i] = true;
                        //Adds taskbar div
                        const newTaskbar = document.createElement("div");
                        const newTaskBtn = document.createElement("button");
                        newTaskbar.classList.add("taskbar-window", "col", "ps-0", "pe-1");
                        newTaskbar.setAttribute("window", i);
                        newTaskBtn.classList.add("taskbar-btn", "ps-1", "pt-0", "fw-bolder", "lh-sm", "text-start", "text-truncate");
                        newTaskBtn.innerHTML = "<img src='images/logo.png' alt='' class='footer-logo me-1 pb-1'>Interweb Adventurer";
                        document.getElementById("footer-windows").appendChild(newTaskbar);
                        newTaskbar.appendChild(newTaskBtn);

                        //To give focus when clicked
                        giveFocus(i, e, ieWindows);
                        //For maximise
                        maxiBtn[i] = document.getElementsByClassName("maxi-btn")[i];
                        maxiButton(i, e, maxiBtn, ieWindows);
                        //For closing
                        closeButton(i, e, maxiBtn);
                        //For Minimise
                        minimise(i, e);
                        //For Refresh
                        refreshButton(i, e);
                        //For back
                        backButton(i, e);
                        //For forward
                        fwdButton(i, e);
                        //For taskbar select
                        selectTask(i);
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
        }
    })
}
//For dropup animation
let dropup = document.getElementById("dropup");
let dropupMenu = document.getElementById("dropdown-menu");
dropup.addEventListener("hidden.bs.dropdown", event => {
    document.getElementById("dropdown-menu").classList.add("start-closing");
    dropupMenu.addEventListener("animationend", function () {
        document.getElementById("dropdown-menu").classList.remove("start-closing");
    })
})
//Function for BSOD
function shutDown() {
    let audio = new Audio('audio/bsod.mp3');
    let overlay = document.getElementById("overlay");
    audio.play();
    document.getElementById("footer").style.display = "none";
    overlay.classList.add("bsod");
}
//Event listener for press of shutdown button, causes BSOD
document.getElementById("shutdown").addEventListener("click", function () {
    shutDown();
})

//Function to undo BSOD
function unBSOD() {
    let overlay = document.getElementById("overlay");
    overlay.classList.remove("bsod");
    document.getElementById("footer").style.display = "block";
}
//Event listner for button press while BSOD
document.getElementById("overlay").addEventListener("click", function () {
    unBSOD();
})

let startBtn = document.getElementById("start");
startBtn.addEventListener("mouseenter", function () {
    startBtn.classList.remove("btn-flash");
})

//Function that gets the local time of machine and displays in bottom right
function time() {
    let currentTime = new Date().toLocaleTimeString('en-GB', {
        hour: "numeric",
        minute: "numeric"
    });
    document.getElementById("time").innerHTML = currentTime;
}
window.setInterval(function () {
    time()
}, 1000)