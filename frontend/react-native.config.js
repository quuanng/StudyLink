/** @type import("@react-native-community/cli-types").Config */
module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: false, // Automatically installs CocoaPods
    },
  },
  assets: ['./node_modules/react-native-vector-icons/Fonts'], // Add this line
}
