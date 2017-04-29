/**
 * @author Adina Halter
 * Accessible Tab Navigation
 */

/*global
    NAME, jQuery
*/
(function ($, NAME) {
    'use strict';
    var people = [
            {
                id: 'einstein',
                name: 'Einstein',
                height: 'medium', // tall, medium, short, kid
                girth: 'heavy', // heavy, regular, thin
                hair_color: 'gray', // gray, brown, blond, red
                hair_style: 'afro', // long, short, afro
                skin: 'white', // white, black
                eye_color: 'brown',
                age: 'old', // old, middle, young, teen, kid
                gender: 'male',
                job: 'scientist'
            },
            {
                id: 'martin',
                name: 'Steve Martin',
                height: 'medium',
                girth: 'regular',
                hair_color: 'gray',
                hair_style: 'short',
                skin: 'white',
                eye_color: 'blue',
                age: 'old',
                gender: 'male',
                job: 'actor'
            },
            {
                id: 'sinatra',
                name: 'Frank Sinatra',
                height: 'medium',
                girth: 'regular',
                hair_color: 'gray',
                hair_style: 'short',
                skin: 'white',
                eye_color: 'blue',
                age: 'old',
                gender: 'male',
                job: 'singer'
            },
            {
                id: 'elvis',
                name: 'Elvis',
                height: 'tall',
                girth: 'regular',
                hair_color: 'brown',
                hair_style: 'short',
                eye_color: 'blue',
                skin: 'white',
                age: 'young',
                gender: 'male',
                job: 'singer'
            },
            {
                id: 'obama',
                name:'Obama',
                img_url: 'img/obama.jpg',
                height: 'tall',
                girth: 'thin',
                hair_color: 'brown',
                hair_style: 'short',
                eye_color: 'brown',
                skin: 'black',
                age: 'middle',
                gender: 'male',
                job: 'president'
            },
            {
                name: 'Oprah',
                img_url: 'img/oprah.jpg',
                height: 'tall',
                girth: 'heavy',
                hair_color: 'brown',
                hair_style: 'medium',
                eye_color: 'brown',
                skin: 'black',
                age: 'medium',
                gender: 'female',
                job: 'actor'
            },
            {
                name: 'Morgan Freeman',
                img_url: 'img/freeman.jpg',
                height: 'tall',
                girth: 'medium',
                hair_color: 'white',
                hair_style: 'short',
                eye_color: 'brown',
                skin: 'black',
                age: 'old',
                gender: 'male',
                job: 'actor'
            },
            {
                name: 'Princess Diana',
                img_url: 'img/diana.jpg',
                height: 'tall',
                girth: 'thin',
                hair_color: 'blond',
                hair_style: 'short',
                eye_color: 'blue',
                skin: 'white',
                age: 'young',
                gender: 'female',
                job: 'princess'
            },
            {
                name: 'Meryl Streep',
                img_url: 'img/streep.jpg',
                height: 'short',
                girth: 'medium',
                hair_color: 'blond',
                hair_style: 'long',
                eye_color: 'blue',
                skin: 'white',
                age: 'medium',
                gender: 'female',
                job: 'actor'
            },
            {
                name: 'Stevie Wonder',
                img_url: 'img/wonder.jpg',
                height: 'tall',
                girth: 'medium',
                hair_color: 'black',
                hair_style: 'long',
                eye_color: 'brown',
                skin: 'black',
                age: 'medium',
                gender: 'male',
                job: 'singer'
            }
        ],
        objects = [
            'bowl', 'flower', 'pen', 'bottle', 'laptop'
        ],
        words = [
            'plough', 'pen', 'bonus', 'brownies', 'transcend', 'transitioned', 'temperature', 'tend'
        ];
    function createTiles() {
        var $tileGroup = $('#peopleTiles'),
            tileMarkup = '<div class="tile" data-what=""><img src="" alt="" /><figcaption></figcaption></div>';
        //create tile

        //append tile

/*
browsers.forEach(function(browser) {
    var li = document.createElement('li');
    li.textContent = browser;
    fragment.appendChild(li);
});
*/
people.forEach(function(person) {
    var tile = document.createElement('div'),
        img = document.createElement('img'),
        caption = document.createElement('figcaption');
    tile.attribute("id", name)

});

element.appendChild(fragment);
    }
}(jQuery, NAME));















