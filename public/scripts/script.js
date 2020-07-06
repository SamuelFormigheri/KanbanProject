var cards = document.querySelectorAll('.card');
const dropzone = document.querySelectorAll('.dropzone');
const plus = document.querySelectorAll('.plus');
const modalAdicionar = document.getElementById('modal');
const modalRemove = document.getElementById('modalRemove');
const closeModal = document.getElementById('closeModal');
const closeModalRemove = document.getElementById('closeModalRemove');
const btnAddConfirm = document.getElementById('btnAddConfirm');
const btnConfirmRemove = document.getElementById('btnConfirmRemove');
//Area onde o card passará em cima, para deletá-lo.
const dragToDeleteCard = document.getElementById('dragToDeleteCard');
var dropzoneToAdd = "";
var titleCardToAdd = "";
var idOfDraggedCard = "";
var cardToRemove = "";

//#region Cards --------------------------------------------------------------------------
cards.forEach(card =>{
    card.addEventListener('dragstart', dragstart);
    //card.addEventListener('drag', drag);
    card.addEventListener('dragend', dragend);
});

function dragstart(){
      dropzone.forEach(dropzone =>{
          dropzone.classList.add('highlight');
      });
      dragToDeleteCard.classList.add('show');
      //this é o card selecionado
      this.classList.add('is-dragging');
}

//function drag(){}

function dragend(){
    dropzone.forEach(dropzone =>{
        dropzone.classList.remove('highlight');
    });
    dragToDeleteCard.classList.remove('show');
     //this é o card selecionado
     this.classList.remove('is-dragging');
     //O card que foi largado é alterado no dragleave e está na variável titleCardToAdd
     idOfDraggedCard = this.getAttribute("data");
     updateTheStatusCard();
}
//#endregion --------------------------------------------------------------------------

//#region Dropzone -----------------------------------------------------------------------

dropzone.forEach(dropzone =>{
    //dropzone.addEventListener('dragenter', dragenter);
    dropzone.addEventListener('dragover', dragover);
    dropzone.addEventListener('dragleave', dragleave);
    //dropzone.addEventListener('drop', drop);
});

// function dragenter(){ }

function dragover(){
    //this é o dropzone que estiver em cima
    this.classList.add('over');

    //pega o card que está sendo arrastado
    const cardBeingDragged = document.querySelector('.is-dragging');
    this.appendChild(cardBeingDragged);
}

function dragleave(){
    //this é o dropzone que estiver em cima
    titleCardToAdd = this.parentElement.children[0];
    this.classList.remove('over');
}

//function drop(){}
//#endregion ---------------------------------------------------------------------------

//#region Plus ---------------------------------------------------------------------------
plus.forEach(plus=>{
    plus.addEventListener('click',addCard);
});

function addCard(){
    //Closest para pegar o elemento pai -> children pega todos os filhos, e nesse caso, de todos, pega apenas o primeiro
    dropzoneToAdd = this.closest('div div').children[1]; 
    //Titulo do card para gravar no banco conforme o titulo
    titleCardToAdd = this.closest('h3'); 
    modalAdicionar.classList.remove('hide');
}
//#endregion --------------------------------------------------------------------------

//#region Trash ---------------------------------------------------------------------------
dragToDeleteCard.addEventListener('dragover', catchInfoOfCardToDelete);
dragToDeleteCard.addEventListener('dragleave', deleteCard);
function catchInfoOfCardToDelete(){
    const cardBeingDragged = document.querySelector('.is-dragging');
    idOfDraggedCard = cardBeingDragged.getAttribute("data");
    cardToRemove = cardBeingDragged;
}
function deleteCard(){
    modalRemove.classList.remove('hide');
}
//#endregion

//#region Database Functions -------------------------------------------------------------

//#region Save Card on Database ----------------------------------------------------------
function saveTheNewCard(status, context){
    if(titleCardToAdd.textContent == "Backlog+")
      var opt = "backlog"
    else if(titleCardToAdd.textContent == "To Do+")
      var opt = "toDo"
    else if(titleCardToAdd.textContent == "In progress+")
      var opt = "inProgress"
    else if(titleCardToAdd.textContent == "Done+")
      var opt = "done"
    
    var data = {opt, status, context};
    const options = {
       method: 'POST',
       headers:{
         'Content-Type':'application/json'
       },
       body: JSON.stringify(data)
    };
     fetch('/add-new-card', options);
 }
//#endregion

//#region Update Card on Database --------------------------------------------------------
function updateTheStatusCard(){
    if(titleCardToAdd.textContent == "Backlog+")
        var opt = "backlog"
    else if(titleCardToAdd.textContent == "To Do+")
        var opt = "toDo"
    else if(titleCardToAdd.textContent == "In progress+")
        var opt = "inProgress"
    else if(titleCardToAdd.textContent == "Done+")
        var opt = "done"

    var data = {opt, idOfDraggedCard};
    const options = {
       method: 'POST',
       headers:{
         'Content-Type':'application/json'
       },
       body: JSON.stringify(data)
    };
    fetch('/update-status-card', options);
}
//#endregion

//#region Remove Card on Database --------------------------------------------------------
function RemoveTheCard(){
    var data = {idOfDraggedCard};
    const options = {
    method: 'POST',
    headers:{
        'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
    };
    fetch('/delete-card', options);
}
//#endregion -----------------------------------------------------------------------------

//#endregion -----------------------------------------------------------------------------

//#region Modal to Add Cards -------------------------------------------------------------

btnAddConfirm.addEventListener('click',createNewCard);
closeModal.addEventListener('click',closeModalAdd);

function closeModalAdd(){
    modalAdicionar.classList.add('hide');
}
function createNewCard(){
    var cardContentText = document.getElementById('cardContentText');
    var statusColor = document.getElementById('statusColor');
    //Cria o Elemento div
    var newCard = document.createElement('div');
    //Adiciona a classe card e o atributo draggable
    newCard.classList.add('card');
    newCard.setAttribute('draggable', true);
    if(cardContentText.value){
        newCard.innerHTML = `<div class="status ${statusColor.value}"></div><div class="content">${cardContentText.value}</div>`;
        dropzoneToAdd.appendChild(newCard);
        atualizaCards();
        //Antes de chamar o close, chama a function para executar a chamada do backend e salvar no banco o card
        saveTheNewCard(statusColor.value, cardContentText.value);
        cardContentText.value = "";
        closeModalAdd();
    }
}
function atualizaCards(){
    //Atualiza a lista de cards
    cards = document.querySelectorAll('.card');
    //Atualiza os eventos relacionados aos cards
    cards.forEach(card =>{
        card.addEventListener('dragstart', dragstart);
        //card.addEventListener('drag', drag);
        card.addEventListener('dragend', dragend);
    });
}
//#endregion ----------------------------------------------------------------------------

//#region Modal to Remove Cards ----------------------------------------------------------
btnConfirmRemove.addEventListener('click',RemoveCard);
closeModalRemove.addEventListener('click',closeModalRem);

function closeModalRem(){
    modalRemove.classList.add('hide');
}
 function RemoveCard(){
     RemoveTheCard();
     cardToRemove.remove();
     atualizaCards();
     closeModalRem();
 }

//#endregion -----------------------------------------------------------------------------