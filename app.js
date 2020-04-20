let hotels = [];
let roomtypes = [];
let cities = [];
const productsEl = document.querySelector("#entries");
const priceSlider = document.querySelector("#price");
const selPrice = document.querySelector("#selected_price");
const hotelLoc = document.querySelector("#hotelLocations");
const hotelStar = document.querySelector("#hotelStars");
const custRating = document.querySelector("#customerRating");
const sortingHotel = document.querySelector("#sorting");

fetch("/data.json")
    .then(function (response) {
        return response.json();
    })
    .then(initApp)
    .catch(function (error) {
        console.log("Error:", error.message);
    });

// All App logic in here:
function initApp(data) {

    hotels = data[1].entries;
    roomtypes = data[0].roomtypes;
    const cityFilter = document.querySelector("#city-form");


    //initialiaze autocomplete elements
    cities = hotels.map(hotel => hotel.city).filter((v, i, a) => a.indexOf(v) === i);
    initializeCities();

    hotels.map(function (hotel) {
        createHotelElement(hotel, productsEl);
    });

    // To update value, use the 'input' event on the slider:
    priceSlider.addEventListener("change", filterByPrice);

    cityFilter.addEventListener('submit', filterByCity);
    hotelLoc.addEventListener('change', filterByCity);
    hotelStar.addEventListener('change', filterByProperty);
    custRating.addEventListener('change', filterByCustRating);
    sortingHotel.addEventListener('change', sortingHotels);
}

function containsObject(text, list) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].name === text) {
            return true;
        }
    }
    return false;
}

function sortingHotels(e){
    const sortHotel= sortingHotel.value;
    function compare(a, b) {
        
        if (containsObject(sortHotel,a.filters)){
            return -1;
        } else{
            return 1;
        }
      }
      
      hotels.sort(compare);
      productsEl.innerHTML = ""; // Empty the container first
      hotels.map(function (hotel) {
          createHotelElement(hotel, productsEl);
      });
};

function filterByCustRating(e) {
    const custRat = custRating.value;
    let filtered = hotels;
    if (custRat.length !== 0) {
        filtered = hotels.filter(function (hotel) {
            return hotel.ratings.no < custRat;
        });
    }
    console.log(filtered);
    productsEl.innerHTML = ""; // Empty the container first
 
    filtered.map(function (hotel) {
        createHotelElement(hotel, productsEl);
    });
};


function filterByProperty(e) {
    const starProp = hotelStar.value;
    let filtered = hotels;
    if (starProp.length !== 0) {
        filtered = hotels.filter(function (hotel) {
            return hotel.rating == starProp;
        });
    }
    console.log(filtered);
    productsEl.innerHTML = ""; // Empty the container first
    
    filtered.map(function (hotel) {
        createHotelElement(hotel, productsEl);
    });
};

function filterByCity(e) {
    e.preventDefault();

    const cityInput = document.querySelector("#cityInput");
    let filtered = hotels;

    if (e.type == 'submit') {
        if (cityInput.value.length !== 0) {
            filtered = hotels.filter(function (hotel) {
                return hotel.city.toLowerCase().indexOf(cityInput.value.toLowerCase()) > -1;
            });
        }
    } else {
        if (hotelLoc.value.length !== 0) {
            filtered = hotels.filter(function (hotel) {
                return hotel.city.toLowerCase() == hotelLoc.value.toLowerCase();
            });
        }
    }


    console.log(filtered);
    productsEl.innerHTML = ""; // Empty the container first

    filtered.map(function (hotel) {
        createHotelElement(hotel, productsEl);
    });

};

function filterByPrice(e) {
    selPrice.innerText = priceSlider.value;
    const filtered = hotels.filter(function (hotel) {
        return hotel.price < priceSlider.value;
    });
    console.log(filtered);
    productsEl.innerHTML = ""; // Empty the container first

    filtered.map(function (hotel) {
        createHotelElement(hotel, productsEl);

    });

}

//Autocomplete function
function initializeCities() {
    const dataList = document.querySelector('#cities');
    cities.map(function (city) {
        const optionElement = document.createElement('option');
        optionElement.value = city;
        dataList.appendChild(optionElement);

    });

    cities.map(function (city) {
        const optionElement = document.createElement('option');
        optionElement.value = city;
        optionElement.text = city;
        hotelLoc.appendChild(optionElement);

    });
};

// Date functions
$(document).ready(function () {

    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy'
    });
});


function createHotelElement(hotel, productsEl) {
    let starObject = "";
    let hotelProp = "";
    for (let i = 1; i < 6; i++) {
        if (hotel.rating >= i) {
            starObject += `<span class="fa fa-star" data-rating="${i}"></span>`
        } else {
            starObject += `<span class="fa fa-star-o" data-rating="${i}"></span>`
        }
    }

    for (let i = 0; i < hotel.filters.length; i++) {
        hotelProp += `<li class="rating-text">${hotel.filters[i].name}</li>`
    }
    productsEl.innerHTML += `
            <div class="card mx-auto" style="max-width: 840px;">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${hotel.thumbnail}" class="card-img"
                            alt="hotel's image">
                    </div>
                  
                    <div class="col-md-5">
                        <div class="card-body">
                            <h5 class="card-title">${hotel.hotelName}
                                <div class="star-rating">
                                  ${starObject}
                                </div>
                            </h5>
                            <p class="card-text">${hotel.city}</p>
                            <p class="rating-text">${hotel.ratings.text} <span class="text-muted">(reviews ${parseInt(hotel.ratings.no * hotel.guestrating * 10)})</span></p>
                            <small class="text-muted">Customer rating: ${hotel.ratings.no}</small>
                            <iframe width="200" height="75" frameborder="0" style="border:0" src="${hotel.mapurl}" allowfullscreen></iframe>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card-body">
                            <p class="card-text">Hotel services:</p>
                            <ul>${hotelProp}</ul>
                            
                        </div>
                    </div>
                </div>
            </div>
                  `;
};
