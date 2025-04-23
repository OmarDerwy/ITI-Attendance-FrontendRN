// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require('nativewind/metro');
// const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
// const config = getDefaultConfig(__dirname)

// module.exports = withNativeWind(config, { 
//     //add stuff here idk
//  });

// to debug a problem with building i will use default below
// const { getDefaultConfig } = require("expo/metro-config");
// module.exports = getDefaultConfig(__dirname);

// add built successfully, will try to remove native wind and include reanimated now

const { getDefaultConfig } = require("expo/metro-config");
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const config = getDefaultConfig(__dirname);

const reanimatedConfig = wrapWithReanimatedMetroConfig(config, {
    // Add any custom configuration options here
    // For example, you can specify the path to your Reanimated Babel plugin
    babelTransformerPath: require.resolve('react-native-reanimated/plugin'),
    });

module.exports = reanimatedConfig;
