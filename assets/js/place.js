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

            // change page title
            document.title = place.placeName + " " + document.title;

            // iterate place properties
            Object.keys(place).forEach((key) => {
                // fetch elements by class key
                const elements = document.getElementsByClassName(key);

                // iterate and replace inner text
                Array.from(elements).forEach((el) => {
                    el.innerText = place[key];
                });
            });

            // media rows
            const videoRow = document.getElementById("placeVideos");
            const photoRow = document.getElementById("placePhotos");

            // iterate videos
            Object.values(place["placeVideos"]).forEach((ytId) => {
                // create html elements
                const col = document.createElement("div");
                col.classList.add("col-12", "col-md-4");
                videoRow.appendChild(col);

                const ratio = document.createElement("div");
                ratio.classList.add("ratio", "ratio-16x9");
                col.appendChild(ratio);

                const embed = document.createElement("iframe");
                embed.setAttribute("src", "https://www.youtube.com/embed/" + ytId);
                embed.setAttribute("frameborder", 0);
                embed.setAttribute("title", "YouTube Video Player");
                embed.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
                embed.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
                embed.setAttribute("allowfullscreen", "");
                ratio.appendChild(embed);
            });

            // iterate photos
            Object.values(place["placePhotos"]).forEach((url) => {
                const col = document.createElement("div");
                col.classList.add("col-12", "col-md-4");
                photoRow.appendChild(col);

                const img = document.createElement("img");
                img.classList.add("img-fluid", "img-thumbnail");
                img.setAttribute("src", url);
                img.setAttribute("alt", "A picture of " + place["placeName"]);
                col.appendChild(img);
            });

            // related places
            Object.values(place["related"]).forEach((id) => {
                // fetch ul
                const ul = document.getElementById("placeRelated");

                // create element
                const li = document.createElement("li");
                li.classList.add("me-3");

                // create link
                const url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?placeId=" + id;
                const a = document.createElement("a");
                a.setAttribute("href", url);
                a.innerText = data[id]["placeName"];

                // append
                li.appendChild(a);
                ul.appendChild(li);
            });
        })
        .catch((reason) => {
            console.error(reason);
        });
});
