console.log("script.js loaded");

let race_selection, subrace_selection;
let class_selection, subclass_selection;
let background_selection;

// Used to toggle the race dropdowns in the character creation page
function toggleDropdown(id) {
    target = document.getElementById(id);

    if (target.classList.contains("hidden")) {
        target.classList.remove("hidden");

        activeTabs = document.getElementsByClassName("activeTab");
        for (let i = 0; i < activeTabs.length; i++) {
            activeTabs[i].click();
        }
    } else {
        target.classList.add("hidden");
    }
}

function showTab(evt, tabGroup, tabName) {
    let tabcontent = document.getElementsByClassName("tabcontent " + tabGroup);
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    let tablinks = document.getElementsByClassName("tablinks " + tabGroup);
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("activeTab");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("activeTab");
}

function selectRace(race_name, subrace_name) {
    let name = document.getElementById("character_name").value;

    race_selection = race_name;
    subrace_selection = subrace_name;

    document.getElementById("races").classList.add("hidden");
    document.getElementById("classes").classList.remove("hidden");

    document.getElementById("character_name").value = name;
    window.scrollTo(0, 0);
}

function selectClass(class_name, subclass_name) {
    let name = document.getElementById("character_name").value;

    class_selection = class_name;
    subclass_selection = subclass_name;

    document.getElementById("classes").classList.add("hidden");
    document.getElementById("backgrounds").classList.remove("hidden");

    document.getElementById("character_name").value = name;
    window.scrollTo(0, 0);
}

function selectBackground(background_name) {
    let name = document.getElementById("character_name").value;

    background_selection = background_name;

    document.getElementById("backgrounds").classList.add("hidden");

    document.getElementById("character_name").value = name;
    window.scrollTo(0, 0);

    document.getElementById("raceInput").value = race_selection;
    document.getElementById("subraceInput").value = subrace_selection;
    document.getElementById("classInput").value = class_selection;
    document.getElementById("subclassInput").value = subclass_selection;
    document.getElementById("backgroundInput").value = background_selection;

    document.getElementById("confirmations").classList.remove("hidden");
}

function loadTooltip(link) {
    return "Tooltip: " + link;
}

function test() {
    console.log(race_selection + "\n" + subrace_selection);
}