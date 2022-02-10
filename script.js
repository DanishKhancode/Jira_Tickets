let addbtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalcont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareacont = document.querySelector(".textarea-cont");
let allPriorityColors = document.querySelectorAll(".proirity-color"); 
let toolBoxColor = document.querySelectorAll(".color");
let colors = [ "lightpink", "lightblue", "lightgreen", "black" ];
let moralPriorityColor = colors[colors.length - 1];
let addFlag = false;
let removeFlag = false;
let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let ticketsArr = [];
if (localStorage.getItem("jira_tickets")) {
    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketObj) => {
        createticket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}
for (let i = 0; i < toolBoxColor.length; i++){
    toolBoxColor[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColor[i].classList[0];
        let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })
        //remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++){
            allTicketsCont[i].remove();
        }
       //display new filterd ticket
        filteredTickets.forEach((ticketObj, idx) => {
            createticket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
    toolBoxColor[i].addEventListener("dblclick", (e) => {
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++){
            allTicketsCont[i].remove();
        }
        ticketsArr.forEach((ticketObj, idx) => {
            createticket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
}
//listener for modal priority coloring
  allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        moralPriorityColor = colorElem.classList[0];
    })
})
addbtn.addEventListener("click", (e) => {
    addFlag = !addFlag;
    if (addFlag) {
        modalcont.style.display = "flex";
    } else {
        modalcont.style.display = "none";
    }
    removeBtn.addEventListener("click", (e) => {
        removeFlag = !removeFlag;
    })
})
modalcont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createticket(moralPriorityColor, textareacont.value);
        addFlag = false;
        setModalToDefault();
    }
})
function createticket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id"> #${ticketID}</div>
    <div class="task-area"> ${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fas fa-lock"></i>
</div>
    `;
    mainCont.appendChild(ticketCont);
    if (!ticketID) {
        ticketsArr.push({ ticketColor, ticketTask, ticketID: id });
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    }
    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}
function handleRemoval(ticket, id) {
    ticket.addEventListener("click", (e) => {
        if (!removeFlag) return;
        let idx = getTicketIdx(id);
        ticketsArr.splice(idx, 1);
        let strTicketArr = JSON.stringify(ticketsArr);
        localStorage.setItem("jira_tickets", strTicketArr);
        ticket.remove();
    })
}
function handleLock(ticket, id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerHTML;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
    })
}
function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        console.log(currentTicketColor, currentTicketColorIdx);
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        ticketsArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
    })
}
function getTicketIdx(id) {
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}
function setModalToDefault() {
    modalcont.style.display = "none";
    textareacont.value = "";
    moralPriorityColor = colors[colors.length - 1];
    allPriorityColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length - 1].classList.add("border");
}