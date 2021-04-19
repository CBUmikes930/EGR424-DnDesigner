console.log("script.js loaded");

// When we try to leave the page, popup to confirm to leave before leaving
window.addEventListener("beforeunload", refreshPopup);
function refreshPopup(event) {
    event.returnValue = "Confirm Refresh";
}

let race_selection, subrace_selection;
let class_selection, subclass_selection;
let background_selection;

// Used to toggle the dropdown headers in the character creation page
function toggleDropdown(id) {
    let target = $("#" + id);

    if (target.hasClass("hidden")) {
        target.removeClass("hidden");

        let activeTabs = $(".activeTab");
        for (let i = 0; i < activeTabs.length; i++) {
            activeTabs[i].click();
        }
    } else {
        target.addClass("hidden");
    }
}

// Used to tab between sub-classes and subraces on the character creation page
function showTab(evt, tabGroup, tabName) {
    // Hide all tabs
    $(".tabcontent." + tabGroup).css("display", "none");
    // Unselect current tab
    $(".tablinks." + tabGroup).removeClass("activeTab");

    // Show the current selection
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("activeTab");
}

// Used to move from Step 1 to Step 2 on the character creation page
function selectRace(race_name, subrace_name) {
    race_selection = race_name;
    subrace_selection = subrace_name;

    $("#races").addClass("hidden");
    $("#classes").removeClass("hidden");

    window.scrollTo(0,0);
}

// Used to move from Step 2 to Step 3 on the character creation page
function selectClass(class_name, subclass_name) {
    class_selection = class_name;
    subclass_selection = subclass_name;

    $("#classes").addClass("hidden");
    $("#backgrounds").removeClass("hidden");

    window.scrollTo(0, 0);
}

// Used to move from Step 3 to confirmation on the character creation page
function selectBackground(background_name) {
    background_selection = background_name;

    $("#raceInput").val(race_selection);
    $("#subraceInput").val(subrace_selection);
    if (subrace_selection == undefined || subrace_selection == 'undefined' || subrace_selection == '')
        $("#subraceInput").css("display", "none");
    $("#classInput").val(class_selection);
    $("#subclassInput").val(subclass_selection);
    $("#backgroundInput").val(background_selection);

    $("#backgrounds").addClass("hidden");
    $("#confirmations").removeClass("hidden");
    
    window.scrollTo(0, 0);
}

// Check data and either submit or show errors
function submitForm() {
    let errors = "";
    if (validateData("character_name"))
        errors += "Invalid Character Name<br>";
    if (validateData("raceInput"))
        errors += "You must select a race<br>";
    if (validateData("classInput"))
        errors += "You must select a class<br>";
    if (validateData("subclassInput"))
        errors += "You must select a subclass<br>";
    if (validateData("backgroundInput"))
        errors += "You must select a background<br>";

    if (errors == "") {
        // Remove the refresh popup so we don't have to confirm
        window.removeEventListener("beforeunload", refreshPopup);
        // Submit the form (as a post request)
        $("#create_character_form").submit();
    } else {
        $("#form-errors").html(errors);
    }
}

// Helper method that returns true if a value stored at element with the given id is blank or undefined
function validateData(id) {
    let value = $("#" + id).val();
    return (value == undefined || value == 'undefined' || value == '')
}