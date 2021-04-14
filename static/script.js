console.log("script.js loaded");

// Used to toggle the race dropdowns in the character creation page
function toggleDropdown(id) {
    target = document.getElementById(id);

    if (target.classList.contains("hidden"))
        target.classList.remove("hidden");
    else
        target.classList.add("hidden");
}

function selectRace(race_id, subrace_name) {
    let name = document.getElementById("character_name").value;

    let result = "New character created:" +
        "\n\tName: " + name + 
        "\n\tRace ID: " + race_id + 
        "\n\tSubrace: " + subrace_name;
    console.log(result);

    document.getElementById("races").classList.add("hidden");
    document.getElementById("content-wrap").innerHTML += "<p>" + result + "</p>";
    document.getElementById("character_name").value = name;
}