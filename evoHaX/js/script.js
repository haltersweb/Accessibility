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
            weight: 'normal', // heavy, normal
            hair_color: 'gray', // gray, brown, blond, red
            hair_style: 'full', // long, short, full
            skin: 'white', // white, black
            eye_color: 'brown', // blue, brown
            age: 'elderly', // elderly, middle, young
            gender: 'male',
            profession: 'scientist'
        },
        {
            id: 'martin',
            name: 'Steve Martin',
            height: 'medium',
            weight: 'normal',
            hair_color: 'gray',
            hair_style: 'short',
            skin: 'white',
            eye_color: 'blue',
            age: 'elderly',
            gender: 'male',
            profession: 'comedian'
        },
        {
            id: 'sinatra',
            name: 'Frank Sinatra',
            height: 'medium',
            weight: 'normal',
            hair_color: 'brown',
            hair_style: 'short',
            skin: 'white',
            eye_color: 'blue',
            age: 'middle',
            gender: 'male',
            profession: 'singer'
        },
        {
            id: 'elvis',
            name: 'Elvis',
            height: 'tall',
            weight: 'normal',
            hair_color: 'brown',
            hair_style: 'short',
            eye_color: 'blue',
            skin: 'white',
            age: 'middle',
            gender: 'male',
            profession: 'singer'
        },
        {
            id: 'gaga',
            name:'Lady Gaga',
            height: 'short',
            weight: 'normal',
            hair_color: 'blond',
            hair_style: 'long',
            eye_color: 'brown',
            skin: 'white',
            age: 'young',
            gender: 'female',
            profession: 'singer'
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
            age: 'middle',
            gender: 'female',
            profession: 'tv host'
        },
        {
            id: 'freeman',
            name: 'Morgan Freeman',
            height: 'tall',
            weight: 'normal',
            hair_color: 'gray',
            hair_style: 'short',
            eye_color: 'brown',
            skin: 'black',
            age: 'elderly',
            gender: 'male',
            profession: 'actor'
        },
        {
            id: 'diana',
            name: 'Princess Diana',
            height: 'tall',
            weight: 'normal',
            hair_color: 'blond',
            hair_style: 'short',
            eye_color: 'blue',
            skin: 'white',
            age: 'young',
            gender: 'female',
            profession: 'princess'
        },
        {
            id: 'beyonce',
            name: 'Beyonce',
            height: 'tall',
            weight: 'normal',
            hair_color: 'blond',
            hair_style: 'long',
            eye_color: 'brown',
            skin: 'black',
            age: 'young',
            gender: 'female',
            profession: 'singer'
        },
        {
            id: 'mccarthy',
            name: 'Melissa McCarthy',
            height: 'medium',
            weight: 'heavy',
            hair_color: 'brown',
            hair_style: 'long',
            eye_color: 'green',
            skin: 'white',
            age: 'middle',
            gender: 'female',
            profession: 'actor'
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
    function cullTiles(form) {
        var profile = {
                //height: form.height.value,
                weight: form.weight.value,
                hair_color: form.hair_color.value,
                //hair_style: form.hair_style.value,
                age: form.age.value,
                gender: form.gender.value
            },
            attributes = Object.keys(profile);

        people.forEach(function(person) {
            var hideFlag = false,
                tile = document.getElementById(person.id),
                i;
            for (i = 0; i < attributes.length; i += 1) {
                if (profile[attributes[i]] !== person[attributes[i]]) {
                    hideFlag = true;
                    break;
                }
            }
            if (hideFlag) {
                tile.classList.add('is-hidden');
            } else {
                tile.classList.remove('is-hidden');
            }
        });
        document.getElementById('extraInfo').classList.remove('is-hidden');
        document.getElementById('extraInfo').focus();
    }
    function meal(form) {
        var trueText = document.getElementById('challenge_2_true'),
            falseText = document.getElementById('challenge_2_false');
        trueText.classList.add('is-hidden');
        falseText.classList.add('is-hidden');
        if(form.table_napkin.checked &&
            !form.table_spoon.checked &&
            form.table_water.checked &&
            form.table_what.checked &&
            form.table_fork.checked) {
            trueText.classList.remove('is-hidden');
            trueText.focus();
            return;
        }
        falseText.classList.remove('is-hidden');
        falseText.focus();
    }
    createTiles('peopleTiles', people);
    document.getElementById('challenge_3_Submit').addEventListener('click', function () {
        cullTiles(this.parentNode);
    });
    document.getElementById('challenge_2_Submit').addEventListener('click', function () {
        meal(this.parentNode);
    })
}(jQuery, NAME));















