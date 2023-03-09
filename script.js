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
    document.getElementById("test").addEventListener("click", function () {
        console.log(maxedState, oldHeight, oldWidth, oldLeft, oldTop, ieBtnsEventListened, maxi, ieWindows, i, e);
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
            for (let i = 0; i < taskbarWindows.length; i++) {
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
        oldLeft[ieWindow] = e.offsetLeft;
        oldTop[ieWindow] = e.offsetTop;
        e.classList.add("minimise");
        e.addEventListener("animationend", function () {
            if (e.classList.contains("minimise")) {
                e.style.display = "none";
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
            //Adds event listener to window buttons - Added if statement so doesn't double add
            if (!ieBtnsEventListened[i]) {
                ieBtnsEventListened[i] = true;
                //Adds taskbar div
                const newTaskbar = document.createElement("div");
                const newTaskBtn = document.createElement("button");
                newTaskbar.classList.add("taskbar-window", "col", "ps-0", "pe-1");
                newTaskbar.setAttribute("window", i);
                newTaskBtn.classList.add("taskbar-btn", "ps-1", "pt-0", "fw-bolder", "lh-sm", "text-start");
                newTaskBtn.innerHTML = "<img src='images/logo.png' alt='' class='footer-logo me-1 pb-1'> eRevive"
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
    document.getElementById("time").innerHTML = currentTime;
}
window.setInterval(function () {
    time()
}, 1000)