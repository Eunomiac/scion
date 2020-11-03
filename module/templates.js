/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async () => {
    // Define template paths to load
    const templatePaths = [
        // Actor Sheet Partials
        "systems/scion/templates/actor/actor-chargen.html"
    ];

    // Load the template parts
    return loadTemplates(templatePaths);
};
