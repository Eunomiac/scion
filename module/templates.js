/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async () => {
    // Define template paths to load
    const templatePaths = [
        // Actor Sheet Partials
        "systems/scion/templates/actor/actor-chargen-step1.hbs",
        "systems/scion/templates/actor/actor-chargen-step2.hbs",
        "systems/scion/templates/actor/actor-chargen-step3.hbs",
        "systems/scion/templates/actor/actor-chargen-step4.hbs",
        "systems/scion/templates/actor/actor-chargen-step5.hbs",
        "systems/scion/templates/actor/actor-chargen-step6.hbs"
    ];

    // Load the template parts
    return loadTemplates(templatePaths);
};
