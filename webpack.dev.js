const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "development", // Mode pengembangan
  devtool: "eval-source-map", // Source map untuk debugging
  module: {
    rules: [
      {
        test: /\.css$/, // Rule untuk file CSS
        use: [
          "style-loader", // Memuat CSS ke dalam DOM
          {
            loader: "css-loader", // Memproses CSS
            options: {
              sourceMap: true, // Aktifkan source map
            },
          },
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"), // Folder yang akan dilayani
    },
    port: 9000, // Port development server
    hot: true, // Hot Module Replacement
    compress: true, // Kompresi gzip
    historyApiFallback: true, // Fallback untuk Single Page Applications
    client: {
      overlay: {
        errors: true, // Tampilkan overlay untuk error
        warnings: true, // Tampilkan overlay untuk warning
        runtimeErrors: true, // Tampilkan runtime errors
      },
      logging: "error", // Hanya tampilkan log error
      progress: true, // Tampilkan progress kompilasi
    },
    // Bagian proxy dihapus sesuai permintaan
  },
});
