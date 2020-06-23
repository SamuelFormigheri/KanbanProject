var cards = document.querySelectorAll('.card');
const dropzone = document.querySelectorAll('.dropzone');
const plus = document.querySelectorAll('.plus');
const modalAdicionar = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const btnAddConfirm = document.getElementById('btnAddConfirm');
var dropzoneToAdd = "";

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
      //this é o card selecionado
      this.classList.add('is-dragging');
}

//function drag(){}

function dragend(){
    dropzone.forEach(dropzone =>{
        dropzone.classList.remove('highlight');
    });
     //this é o card selecionado
     this.classList.remove('is-dragging');
}
//#endregion --------------------------------------------------------------------------

//#region Dropzone --------------------------------------------------------------------

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
    this.classList.remove('over');
}

//function drop(){}
//#endregion ---------------------------------------------------------------------------

//#region Plus ------------------------------------------------------------------------

plus.forEach(plus=>{
    plus.addEventListener('click',addCard);
});

function addCard(){
    //Closest para pegar o elemento pai -> children pega todos os filhos, e nesse caso, de todos, pega apenas o primeiro
    dropzoneToAdd = this.closest('div div').children[1]; 
    modalAdicionar.classList.remove('hide');
}

//#endregion --------------------------------------------------------------------------

//#region Modal to Add Cards ----------------------------------------------------------

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