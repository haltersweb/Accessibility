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
            id: 'oprah',
            name: 'Oprah',
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
            id: 'freeman',
            name: 'Morgan Freeman',
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
            id: 'diana',
            name: 'Princess Diana',
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
            id: 'streep',
            name: 'Meryl Streep',
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
            id: 'wonder',
            name: 'Stevie Wonder',
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
    ]/*,
        objects = [
            'bowl', 'flower', 'pen', 'bottle', 'laptop'
        ],
        words = [
            'plough', 'pen', 'bonus', 'brownies', 'transcend', 'transitioned', 'temperature', 'tend'
        ]*/;
    function createTiles() {
        var tiles = document.getElementById('peopleTiles'),
            fragment = document.createDocumentFragment();
        people.forEach(function(person) {
            var tile = document.createElement('div'),
                figure = document.createElement('figure'),
                img = document.createElement('img'),
                caption = document.createElement('figcaption');
            tile.setAttribute('id', person.id);
            img.setAttribute('src', 'img/' + person.id + '.jpg');
            img.setAttribute('alt', 'picture of ' + person.name);
            caption.textContent = person.name;
            figure.appendChild(img);
            figure.appendChild(caption);
            tile.appendChild(figure);
            fragment.appendChild(tile);
        });
        tiles.appendChild(fragment);
    }
    createTiles();
}(jQuery, NAME));















