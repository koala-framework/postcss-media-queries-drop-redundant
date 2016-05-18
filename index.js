var postcss = require('postcss');

module.exports = postcss.plugin('postcss-media-queries-drop-redundant', function (opts) {
    opts = opts || {};

    var mediaRules = [];

    return function (css, result) {

        /* enrich media rules */
        css.walkAtRules(/media/, function (media) {
            mediaRules.push(media);
            if (media.params.indexOf('min-width') !== -1) {
                m = media.params.match(/min-width:\s*([1-9][0-9]*)px/);
                if (m && m[1]) {
                    media.minWidth = parseInt(m[1]);
                }
            }
            if (media.params.indexOf('max-width') !== -1) {
                m = media.params.match(/max-width:\s*([1-9][0-9]*)px/);
                if (m && m[1]) {
                    media.maxWidth = parseInt(m[1]);
                }
            }
        });

        var onlyMinRules = mediaRules.filter(function(rule) {
            return rule.minWidth && !rule.maxWidth;
        });

        var onlyMaxRules = mediaRules.filter(function(rule) {
            return rule.maxWidth && !rule.minWidth;
        });

        onlyMinRules.sort(function(a, b) {
            return a.minWidth - b.minWidth;
        });

        onlyMaxRules.sort(function(a, b) {
            return b.maxWidth - a.maxWidth;
        });

        // Min width
        deleteDuplicates(onlyMinRules);

        // Max width
        deleteDuplicates(onlyMaxRules);

        /**
         * Finds duplicate declaration values in the given media queries
         * @param object values
         */
        function deleteDuplicates(values) {
            for (i = 0; i < values.length; ++i) {
                values[i].walkRules(function (rule1) {
                    rule1.walkDecls(function (decl1) {
                        for (j = i+1; j < values.length; ++j) {
                            values[j].walkRules(function (rule2) {
                                rule2.walkDecls(function (decl2) {
                                    if((decl1.prop == decl2.prop) && (decl1.value == decl2.value) && rule1.selector == rule2.selector) {
                                        decl2.remove(); // delete if the property is already in an other media query with the same selector
                                    }
                                });
                            });
                        }
                    });
                });
            }
            return values;
        }
    };
});