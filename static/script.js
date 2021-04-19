console.log("script.js loaded");

function stat_change(stat_name) {
    // Get new stat value
    let stat_val = $("#" + stat_name + "_score").val();
    // Calculate modifier value
    let stat_mod = Math.floor((stat_val - 10) / 2);
    // Set the modifier value
    $("#" + stat_name + "_modifier").html(((stat_mod >= 0) ? "+" : "") + stat_mod);
}

function skill_change(skill_name) {
    adjustSkillModifier(skill_name);

    // Get the number of skills available 
    let skills_title = $("#skills-title").html();
    let num_skills = skills_title.substring(skills_title.length - 2, skills_title.length - 1);
    
    // Get a list of available skill choices
    let skills = $(".skill");
    let num_picked = 0;
    for (let i = 0; i < skills.length; i++) {
        if (skills[i].checked) {
            num_picked++;
        }
    }

    // If we currently have picked more than allowed
    if (num_picked > num_skills) {
        // Uncheck the lowest skills
        num_picked = 0;
        for (let i = 0; i < skills.length; i++) {
            if (skills[i].checked && ++num_picked > num_skills) {
                skills[i].checked = false;
                adjustSkillModifier(skills[i].name);
            }
        }
        alert("You have reached the max number of skills!");
    }
}

function adjustSkillModifier(skill_name) {
    // Get the proficiency bonus from the text
    let prof_bonus = $("#proficiency_bonus_holder").text();
    prof_bonus = parseInt(prof_bonus.substr(prof_bonus.indexOf(":") + 3));

    // Get the skill and skill bonus elements of the skill that was just changed
    let targetSkill = $("#" + skill_name);
    let targetSkillBonus = $("#" + skill_name + "_bonus");

    // Pull the current modifier from the bonus element
    let newModifier = parseInt(targetSkillBonus.text());

    // If we just checked the skill, then add the bonus, otherwise, subtract the bonus
    if (targetSkill.is(":checked")) {
        newModifier += prof_bonus;
    } else {
        newModifier -= prof_bonus;
    }

    // Reset the bonus
    targetSkillBonus.text(((newModifier >= 0) ? "+" : "") + newModifier);
}