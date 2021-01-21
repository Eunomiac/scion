function trbl (prefix) {
    var rules = []
  
    if (prefix) {
      rules.push(prefix)
      prefix = prefix + '-'
    } else {
      prefix = ''
    }
  
    return rules.concat([
      prefix + 'top',
      prefix + 'right',
      prefix + 'bottom',
      prefix + 'left'
    ])
  }
  
  function minMax (suffix) {
    return [suffix, 'min-' + suffix, 'max-' + suffix]
  }
  
  function border (infix) {
    if (infix) {
      infix = '-' + infix
    } else {
      infix = ''
    }
  
    return [
      'border' + infix,
      'border' + infix + '-width',
      'border' + infix + '-style',
      'border' + infix + '-color',
      'border' + infix + '-radius'
    ]
  }
  
  var cssModules = []
    .concat([
      'composes'
    ])
  
  var reset = ['all']
  
  var positioning = []
    .concat([
      'position',
      'z-index'
    ])
    .concat(trbl())
  
  var displayAndBoxModel = []
    .concat([
      'display',
      'overflow'
    ])
    .concat(minMax('width'))
    .concat(minMax('height'))
    .concat([
      'box-sizing',
      'flex',
      'flex-basis',
      'flex-direction',
      'flex-flow',
      'flex-grow',
      'flex-shrink',
      'flex-wrap',
      'align-content',
      'align-items',
      'align-self',
      'justify-content',
      'order'
    ])
    .concat(trbl('padding'))
    .concat([]
      .concat(border())
      .concat(border('top'))
      .concat(border('right'))
      .concat(border('bottom'))
      .concat(border('left')))
    .concat(trbl('margin'))
  
module.exports = {
    "extends": [
        "stylelint-config-sass-guidelines"        
    ],
    "plugins": [ 
        "stylelint-scss",
        "stylelint-order"
    ],
    "rules": {
        "function-url-quotes": null,
        "indentation": 4,
        "max-nesting-depth": 5,
        "order/order": null,
        "order/properties-alphabetical-order": null,
        "order/properties-order": [
            []
              .concat(cssModules)
              .concat(reset)
              .concat(positioning)
              .concat(displayAndBoxModel),
            { unspecified: 'bottomAlphabetical' }
        ],
        "scss/dollar-variable-pattern": [/.+-.+/, { "ignore": ["local"] }],
        "scss/at-mixin-pattern": /.+-?.+/
        
    }
}