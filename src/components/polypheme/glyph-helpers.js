import Enumerable from 'linq';

export function getGlyph (glyph) {
  const prefixes = [  // according with ColorHelpers.getMarkColor
    'base',
    'primary',
    'secondary',
    'success',
    'pick',
    'drop',
    'task',
  ];
  const i = glyph.indexOf ('-');
  if (i !== -1) {
    const prefix = glyph.substring (i + 1);
    if (Enumerable.from (prefixes).where (x => x === prefix).any ()) {
      return {
        glyph: glyph.substring (0, i),
        color: prefix,
      };
    }
  }
  return {
    glyph: glyph,
  };
}
