document.addEventListener("DOMContentLoaded", (event) => {
    // capture place id
    const params = new URLSearchParams(window.location.search);
    const placeId = params.get("placeId");
    if (placeId === null) { // return to country's index if wrong parameter
        window.location.href = "/cuba";
    }

    // fetch Cuba's data model
    fetch("../model/cuba.json")
        .then(async (response) => {
            if (!response.ok) {
                throw new Error("Can't load data model.");
            }

            return response.json();
        })
        .then((data) => {
            // check if place id exist un data model
            const exist = Object.keys(data).find(k => k === placeId);
            if (exist === undefined) { // return to country's index if doesn't
                window.location.href = "/cuba";
            }

            // access place data object
            const place = data[placeId];

            // iterate place properties
            Object.keys(place).forEach((key) => {
                // fetch elements by class key
                const elements = document.getElementsByClassName(key);

                // iterate and replace inner text
                Array.from(elements).forEach((el) => {
                    el.innerText = place[key];
                });
            });
        })
        .catch((reason) => {
            console.error(reason);
        });
});
