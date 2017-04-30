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
            weight: 'heavy', // heavy, regular, thin
            hair_color: 'gray', // gray, brown, blond, red
            hair_style: 'full', // long, short, full
            skin: 'white', // white, black
            eye_color: 'brown', // blue, brown
            age: 'old', // old, middle, young
            gender: 'male',
            profession: 'scientist'
        },
        {
            id: 'martin',
            name: 'Steve Martin',
            height: 'medium',
            weight: 'regular',
            hair_color: 'gray',
            hair_style: 'short',
            skin: 'white',
            eye_color: 'blue',
            age: 'old',
            gender: 'male',
            profession: 'comedian'
        },
        {
            id: 'sinatra',
            name: 'Frank Sinatra',
            height: 'medium',
            weight: 'regular',
            hair_color: 'gray',
            hair_style: 'short',
            skin: 'white',
            eye_color: 'blue',
            age: 'old',
            gender: 'male',
            profession: 'singer'
        },
        {
            id: 'elvis',
            name: 'Elvis',
            height: 'tall',
            weight: 'regular',
            hair_color: 'brown',
            hair_style: 'short',
            eye_color: 'blue',
            skin: 'white',
            age: 'young',
            gender: 'male',
            profession: 'singer'
        },
        {
            id: 'obama',
            name:'Obama',
            height: 'tall',
            weight: 'thin',
            hair_color: 'brown',
            hair_style: 'short',
            eye_color: 'brown',
            skin: 'black',
            age: 'middle',
            gender: 'male',
            profession: 'president'
        },
        {
            id: 'oprah',
            name: 'Oprah',
            height: 'tall',
            weight: 'heavy',
            hair_color: 'brown',
            hair_style: 'full',
            eye_color: 'brown',
            skin: 'black',
            age: 'medium',
            gender: 'female',
            profession: 'tv host'
        },
        {
            id: 'freeman',
            name: 'Morgan Freeman',
            height: 'tall',
            weight: 'medium',
            hair_color: 'white',
            hair_style: 'short',
            eye_color: 'brown',
            skin: 'black',
            age: 'old',
            gender: 'male',
            profession: 'actor'
        },
        {
            id: 'diana',
            name: 'Princess Diana',
            height: 'tall',
            weight: 'thin',
            hair_color: 'blond',
            hair_style: 'short',
            eye_color: 'blue',
            skin: 'white',
            age: 'young',
            gender: 'female',
            profession: 'princess'
        },
        {
            id: 'streep',
            name: 'Meryl Streep',
            height: 'short',
            weight: 'medium',
            hair_color: 'blond',
            hair_style: 'long',
            eye_color: 'blue',
            skin: 'white',
            age: 'medium',
            gender: 'female',
            profession: 'actor'
        },
        {
            id: 'wonder',
            name: 'Stevie Wonder',
            height: 'tall',
            weight: 'medium',
            hair_color: 'black',
            hair_style: 'long',
            eye_color: 'brown',
            skin: 'black',
            age: 'medium',
            gender: 'male',
            profession: 'singer'
        }
    ]/*,
        objects = [
            'bowl', 'flower', 'pen', 'bottle', 'laptop'
        ],
        words = [
            'plough', 'pen', 'bonus', 'brownies', 'transcend', 'transitioned', 'temperature', 'tend'
        ]*/;
    function createTiles(tilesId, group) {
        var tiles = document.getElementById(tilesId),
            fragment = document.createDocumentFragment();
        group.forEach(function(entity) {
            var tile = document.createElement('div'),
                figure = document.createElement('figure'),
                img = document.createElement('img'),
                caption = document.createElement('figcaption');
            tile.id = entity.id;
            tile.className = 'tile';
            img.src = 'img/' + entity.id + '.jpg';
            img.alt = 'picture of ' + entity.name;
            caption.textContent = entity.name;
            figure.appendChild(img);
            figure.appendChild(caption);
            tile.appendChild(figure);
            fragment.appendChild(tile);
        });
        tiles.appendChild(fragment);
    }
    createTiles('peopleTiles', people);
}(jQuery, NAME));















