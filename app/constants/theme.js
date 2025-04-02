import { PixelRatio } from 'react-native';

const COLORS = {
    red: 'hsl(2, 57%, 42%)',
    reddark: 'hsl(2, 55%, 40%)',
    reddarker: 'hsl(1, 49%, 38%)',
    black: 'hsl(270, 2%, 26%)'
}
const SIZES = {
    small: PixelRatio.getPixelSizeForLayoutSize(8),
    medium: PixelRatio.getPixelSizeForLayoutSize(16),
    large: PixelRatio.getPixelSizeForLayoutSize(24),
    xlarge: PixelRatio.getPixelSizeForLayoutSize(32),
    xxlarge: PixelRatio.getPixelSizeForLayoutSize(40)
};

const FONT_SIZES = {
    small: PixelRatio.getFontScale() * 12,
    medium: PixelRatio.getFontScale() * 16,
    large: PixelRatio.getFontScale() * 20,
    xlarge: PixelRatio.getFontScale() * 24,
    xxlarge: PixelRatio.getFontScale() * 28
};

const FONT_WEIGHTS = {
    light: '200',
    regular: '400',
    medium: '500',
    bold: '700',
    black: '900'
};

export { COLORS , SIZES, FONT_SIZES, FONT_WEIGHTS };