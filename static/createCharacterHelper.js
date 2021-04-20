console.log("script.js loaded");

// When we try to leave the page, popup to confirm to leave before leaving
window.addEventListener("beforeunload", refreshPopup);
function refreshPopup(event) {
    event.returnValue = "Confirm Refresh";
}

let race_selection, subrace_selection;
let class_selection, subclass_selection;
let background_selection;
let stats;

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

// Used to move from Step 3 to Step 4 on the character creation page
function selectBackground(background_name) {
    background_selection = background_name;

    $("#backgrounds").addClass("hidden");
    $("#stats").removeClass("hidden");
    
    window.scrollTo(0, 0);
}

// Used to move from step 4 to the confirmation on the character creation page
function selectStats(type) {
    if (type == "default")
        stats = [ 15, 14, 13, 12, 10, 8 ];

    $("#raceInput").val(race_selection);
    $("#subraceInput").val(subrace_selection);
    if (subrace_selection == undefined || subrace_selection == 'undefined' || subrace_selection == '') {
        $("#subraceInput").css("display", "none");
        $("#subrace_label").css("display", "none");
    }
    $("#classInput").val(class_selection);
    $("#subclassInput").val(subclass_selection);
    $("#backgroundInput").val(background_selection);
    $("#statsInput").val(stats);

    $("#stats").addClass("hidden");
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
    if (validateData("statsInput"))
        errors += "You must select your stats<br>";

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

function rollStats() {
    // Hide the button, show the dice
    $("#rolls_container").removeClass("hidden");
    $("#roll_dice_button").addClass("hidden");

    // Set the animation to run every 10 milliseconds
    id = setInterval(randomizeImage, 10);
    // Stop the animation after 2 seconds
    setTimeout(stopRandomizer, 2000);

    // Rolling Animation
    function randomizeImage() {
        // Get a list of dice images and for each one
        let dice = $(".dice_imgs");
        for (let i = 0; i < dice.length; i++) {
            // Get a random number between 1-6
            let roll = Math.floor(Math.random() * 6) + 1

            // Get hte image link
            let img_link = dice[i].src;
            // Change the image to reflect the roll
            img_link = img_link.substring(0, img_link.length - 5) + roll + ".png";
            // Set the image
            dice[i].src = img_link;
        }
    }

    // After we are done rolling
    function stopRandomizer() {
        // Stop the interval (animation)
        clearInterval(id);

        stats = new Array(6);
        // For each stat (6 times)
        for (let i = 0; i < 6; i++) {
            let total = 0;
            let lowest = 7;
            let lowest_img;

            // For each die to roll (4 of them)
            for (let j = 0; j < 4; j++) {
                // Roll a d6
                let cur_roll = Math.floor(Math.random() * 6) + 1;

                // Get the current image
                let cur_dice = $("#roll_" + i + "_" + j);
                // Get the image path
                let img_link = cur_dice.attr("src");
                // Change the image to reflect the roll
                img_link = img_link.substring(0, img_link.length - 5) + cur_roll + ".png";
                // Set the image
                cur_dice.attr("src", img_link);

                // Add to the total
                total += cur_roll;
                // Update lowest
                if (cur_roll < lowest) {
                    lowest = cur_roll;
                    lowest_img = cur_dice;
                }
            }

            // Subtract the lowest from the total
            total -= lowest;
            $("#roll_" + i + "_total").text("= " + total);
            stats[i] = total;

            // Grey out lowest die
            lowest_img.addClass("disabled");
        }

        // Show the total fields
        $(".roll_total").removeClass("hidden");
        $("#use_rolled_stats_button").removeClass("hidden");
    }
}