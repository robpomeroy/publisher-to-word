export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-html',
  ],
  rules: {
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'interpolate-size',
          'transition-behavior',
          'anchor-name',
          'position-area',
          'position-try-fallbacks',
        ],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['popover-open'],
      },
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['details-content'],
      },
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['container', 'starting-style', 'view-transition'],
      },
    ],
    'value-keyword-case': [
      'lower',
      {
        ignoreProperties: ['font-family', '--font-sans', '--font-mono'],
      },
    ],
    'color-hex-length': 'long',
    'media-feature-range-notation': null,
    'no-descending-specificity': null,
  },
  ignoreFiles: [
    'dist/**',
    '.astro/**',
    'node_modules/**',
  ],
};
