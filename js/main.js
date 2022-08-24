import difficulties from "../data/difficulties.js";
import ancientsData from "../data/ancients.js";
import {brownCards, blueCards, greenCards} from "../data/mythicCards/index.js"

let checkedAncient = '';
let level_checked = 'easy';
let first_stage = [];
let second_stage = [];
let third_stage = [];
let main_cars = {}

let current_card = document.querySelector('.block__current_card');
let mixed_btn = document.querySelector('.mixed_button');
const cards = document.querySelector('.main_game__container');
mixed_btn.addEventListener('click', mixedCard)
let block_ancients = document.querySelector('.block__ancients');

ancientsData.forEach(item => {
    let item_ancient = document.createElement('img');
    item_ancient.src = item.cardFace;
    item_ancient.classList.add('item__ancient')
    block_ancients.appendChild(item_ancient);

})

current_card.addEventListener('click', showOneCard)


function showLevel() {
    const levels = document.querySelector('.difficulty-container');
    levels.classList.add('active');
}


function getFinalCard(){

    // let first_stage = [];
    // let second_stage = [];
    // let third_stage = [];

    for (let elem in main_cars){
       for (let stage in main_cars[elem]){
           if (stage === "firstStage"){
               for (let i of main_cars[elem][stage]){
                   first_stage.push(i)
               }

           }
           else if (stage === "secondStage"){
               for (let i of main_cars[elem][stage]){
                   second_stage.push(i)
               }

           }
           else if (stage === "thirdStage"){
               for (let i of main_cars[elem][stage]){
                   third_stage.push(i)
               }

           }
       }

    }
}

function incrementCountOfColorByStage(stage, stage_array){
    let rand = stage_array[Math.floor(Math.random() * stage_array.length)];
    stage_array.splice(stage_array.indexOf(rand),1);
    current_card.src = `${rand.cardFace}`;
    let color = (rand.color+"Cards")

    main_cars[color][stage].splice(main_cars[color][stage].indexOf(rand),1)
    showCountOfCardByStage(main_cars)
}


function showOneCard(){

    if (first_stage.length !== 0){
        incrementCountOfColorByStage("firstStage", first_stage);
    }
    else if (second_stage.length !== 0 ){
        incrementCountOfColorByStage("secondStage", second_stage);
    }
    else{
        incrementCountOfColorByStage("thirdStage", third_stage);
    }



}

function getCountCartOfAncient(color) {
    return checkedAncient.firstStage[color] + checkedAncient.secondStage[color] + checkedAncient.thirdStage[color]
}

function getFilteredCardByDifficulty(array, count) {


    if (level_checked === "very_easy") {
        let new_array = array.filter(item => item.difficulty === "easy");
        while (new_array.length < count) {
            new_array.push(array.filter(item => item.difficulty === "normal")[Math.floor(Math.random() * count)]);
        }
        return new_array
    } else if (level_checked === "very_hard") {
        let new_array = array.filter(item => item.difficulty === "hard");
        while (new_array.length < count) {
            new_array.push(array.filter(item => item.difficulty === "normal")[Math.floor(Math.random() * count)]);
        }
        return new_array
    } else if (level_checked === "easy") {
        let new_array = array.filter(item => item.difficulty !== "hard");
        return new_array
    } else if (level_checked === "normal") {
        let new_array = array;
        return new_array
    } else if (level_checked === "hard") {
        let new_array = array.filter(item => item.difficulty !== "easy");
        return new_array
    }
}


function clearCards(){
    first_stage = [];
    second_stage = [];
    third_stage = [];
    current_card.src = './assets/mythicCardBackground.png';
}


function getCardsByColorStage(array, color){

    let new_ar = {}
    new_ar[color] = {
        "firstStage": [],
        "secondStage": [],
        "thirdStage": []
    }
    while (new_ar[color]["firstStage"].length < checkedAncient.firstStage[color]){
        let random = array[Math.floor(Math.random() * array.length)]
        new_ar[color]["firstStage"].push(random)
        array.splice(array.indexOf(random),1)
    }

    while (new_ar[color]["secondStage"].length < checkedAncient.secondStage[color]){
        let random = array[Math.floor(Math.random() * array.length)]
        new_ar[color]["secondStage"].push(random)
        array.splice(array.indexOf(random),1)
    }
    while (new_ar[color]["thirdStage"].length < checkedAncient.thirdStage[color]){
        let random = array[Math.floor(Math.random() * array.length)]
        new_ar[color]["thirdStage"].push(random)
        array.splice(array.indexOf(random),1)
    }
    return new_ar
}

function showMainCards(){
    mixed_btn.classList.remove('active');

    cards.classList.add('active')
}


function mixedCard() {
    showMainCards();
    let countGreen = getCountCartOfAncient("greenCards");
    let countBrown = getCountCartOfAncient("brownCards");
    let countBlue = getCountCartOfAncient("blueCards");


    let filteredBrown = getFilteredCardByDifficulty(brownCards, countBrown);
    let filteredBlue = getFilteredCardByDifficulty(blueCards, countBlue);
    let filteredGreen = getFilteredCardByDifficulty(greenCards, countGreen);
    let brownStages = getCardsByColorStage(filteredBrown, "brownCards");
    let blueStages = getCardsByColorStage(filteredBlue, "blueCards");
    let greenStages = getCardsByColorStage(filteredGreen, "greenCards");

    Object.assign(main_cars, brownStages, blueStages,greenStages);


    showCountOfCardByStage(main_cars);
    getFinalCard()

}


function showCountOfCardByStage(data){

    let green = document.querySelectorAll('.green_cards');
    let blue = document.querySelectorAll('.blue_cards');
    let brown = document.querySelectorAll('.brown_cards');
    green.forEach((item,index)=>{
        green[index].textContent = data["greenCards"][green[index].closest('.column').id].length
    })
    blue.forEach((item,index)=>{
        blue[index].textContent = data["blueCards"][blue[index].closest('.column').id].length
    })
    brown.forEach((item,index)=>{
        brown[index].textContent = data["brownCards"][blue[index].closest('.column').id].length
    })
}

const list_level = document.querySelectorAll('.level_item');
list_level.forEach((item, index) => {
    item.addEventListener('click', () => {
        for (let elem of list_level) {
            elem.classList.remove('active');
        }
        item.classList.add('active');
        level_checked = item.id;
        mixed_btn.classList.add('active');
        cards.classList.remove('active');
        clearCards();
    })
})

let list_ancients = document.querySelectorAll('.item__ancient');

list_ancients.forEach((item, index) => {

    item.addEventListener('click', () => {

        for (let elem of list_ancients) {
            elem.classList.remove('active');
        }
        item.classList.add('active');
        checkedAncient = ancientsData[index];
        showLevel();
        cards.classList.remove('active')
    })
})

