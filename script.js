const IMDB_ICON_URL = 'https://ia.media-imdb.com/images/M/MV5BMTczNjM0NDY0Ml5BMl5BcG5nXkFtZTgwMTk1MzQ2OTE@._V1_.png';
const ROTTEN_TOMATOES_ICON_URL = 'https://www.clipartmax.com/png/full/206-2067887_rotten-tomatoes-logo-rotten-tomatoes-logo-png.png';
const METACRITIC_ICON_URL = 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Metacritic_M.png';
const VALID_KEYS = ['Plot', 'Actors', 'Awards', 'Runtime', 'Director', 'Genre', 'Released', 'Rated', 'Language'];
const APIKEY = '14aa26ee';

function searchOMDBAPI() {
    event.preventDefault();
    let searchWord = document.getElementById('search').value;
    document.getElementById('search').value = '';
    document.getElementById('searchDiv').innerHTML = '';

    if (searchWord != '') {
        let URI = `http://www.omdbapi.com/?apikey=${APIKEY}&type=movie&s=${searchWord}`;
        fetch(URI)
            .then(response => {
                response.json().then(data => {
                    console.log(data);
                    if (data.Response === 'True') {
                        showSearchResults(data.Search);
                    }
                });
            })
            .catch(error => console.error(error));
    }
}

function getIMDBIDResults(imdbID) {
    let URI = `http://www.omdbapi.com/?apikey=${APIKEY}&type=movie&i=${imdbID}`;
    fetch(URI)
        .then(response => {
            response.json().then(data => {
                console.log(data);
                let resultsDIV = document.getElementById('results');
                resultsDIV.prepend(generateCardBasedOnData(data));
            });
        })
        .catch(error => console.error(error));
}

function showSearchResults(search) {
    let searchContainer = document.getElementById('searchDiv');
    search.forEach(item => {
        let searchDIV = document.createElement('DIV');
        searchDIV.className = 'singleMatch';

        let posterContainer = document.createElement('DIV');

        let selectButton = document.createElement('BUTTON');
        selectButton.innerHTML = 'SELECT';
        selectButton.setAttribute('id', item.imdbID);
        selectButton.onclick = (event) => {
            getIMDBIDResults(event.target.id);
        };
        searchDIV.appendChild(selectButton);

        let img = document.createElement('IMG');
        img.setAttribute('src', item.Poster);
        img.style.height = '250px';
        img.style.width = '175px';
        posterContainer.appendChild(img);

        let title = document.createElement('h3');
        title.innerHTML = `${item.Title} (${item.Year})`;
        posterContainer.appendChild(title);

        searchDIV.appendChild(posterContainer);

        searchContainer.appendChild(searchDIV);
    });


}

function generateCardBasedOnData(data) {
    let card = document.createElement('DIV');
    card.className = 'card';

    let header = document.createElement('DIV');
    header.className = 'cardHeader';

    let title = document.createElement('h2');
    title.innerHTML = `${data.Title} (${data.Year})`;
    header.appendChild(title);

    let closeButton = document.createElement('BUTTON');
    closeButton.innerHTML = 'X';
    closeButton.className = 'closeButton';
    closeButton.onclick = () => {
        card.remove();
    };
    header.appendChild(closeButton);

    card.appendChild(header);

    let body = document.createElement('DIV');
    body.className = 'cardBody';

    let infoDIV = document.createElement('DIV');
    infoDIV.className = 'info';

    let keys = Object.keys(data);
    keys.sort();
    keys.forEach(key => {
        if (VALID_KEYS.includes(key) && data[key] != 'N/A') {
            infoDIV.appendChild(generateLabelAndValue(key, data[key]));
        }
    });

    body.appendChild(infoDIV);

    let posterDIV = document.createElement('DIV');
    posterDIV.className = 'poster';
    if (data.Poster != 'N/A' && data.Poster != undefined) {
        let img = document.createElement('img');
        img.setAttribute('src', data.Poster);
        posterDIV.appendChild(img);
    }
    posterDIV.appendChild(generateRaitings(data.Ratings));
    body.appendChild(posterDIV);

    card.appendChild(body);
    return card;
}

function generateRaitings(ratings) {
    let ratingContainer = document.createElement('DIV');
    ratingContainer.className = 'ratingContainer';

    //
    ratings.forEach(rating => {
        let container = document.createElement('DIV');
        let img = document.createElement('IMG');
        if (rating.Source === 'Internet Movie Database') {
            img.setAttribute('src', IMDB_ICON_URL);
        } else if (rating.Source === 'Rotten Tomatoes') {
            img.setAttribute('src', ROTTEN_TOMATOES_ICON_URL);
        } else if (rating.Source === 'Metacritic') {
            img.setAttribute('src', METACRITIC_ICON_URL);
        } else {
            img.setAttribute('src', '');
        }
        img.style.height = '35px';
        container.appendChild(img);

        let value = document.createElement('P');
        value.innerHTML = rating.Value;
        container.appendChild(value);

        ratingContainer.appendChild(container);
    });

    return ratingContainer;
}

function generateLabelAndValue(label, value) {
    let element = document.createElement('DIV');
    element.className = 'labelContainer';

    let labelElement = document.createElement('LABEL');
    labelElement.innerHTML = label;
    element.appendChild(labelElement);

    let valueElement = document.createElement('P');
    valueElement.innerHTML = value;
    element.appendChild(valueElement);

    return element;
}
