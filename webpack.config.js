const path = require("path");
const os = require("os");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: "./src/legacy/Legacy.ts", // 入口ts文件，名字可以任取，但是一定要注意 路径设置是否正确 
    output: { filename: "./Kila.js" }, // 自动会产生dist目录，因此可以去掉dist/目录 
    mode: 'development', //设置为开发模式 
    devtool: "source-map", // 如果要调试TypeScript源码，需要设置成这样 
    resolve: {
        extensions: [".ts", ".js"] // 添加ts和js作为可解析的扩展 
    },
    plugins: [
        new UglifyJsPlugin()
    ], // 在此可以添加各种插件 
    module: {
        rules: [
            {
                test: /\.ts$/, // 正则表达式，如果是.ts结尾的文件 
                use: ["ts-loader"] // 则使用ts-loader来加载TypeScript源码并自动进行转译 
            }, {
                test: /\.(glsl|frag|vert)$/,
                exclude: /node_modules/,
                loader: 'glslify-import-loader'
            }, {
                test: /\.(glsl|frag|vert)$/,
                exclude: /node_modules/,
                loader: 'raw-loader'
            }, {
                test: /\.(glsl|frag|vert)$/,
                exclude: /node_modules/,
                loader: 'glslify-loader'
            }
        ]
    },
    // devServer参数详细说明，请参考https://webpack.js.org/configuration/ dev-server/网页相关内容 
    devServer: { // 就是配置我们npm install webpack-dev- server –save-dev安装的那个服务器 
        contentBase: path.join(__dirname, "./"), // 设置url的根目录，如果不设置，则默认指向 项目根目录(和设置./效果一样) 
        compress: true, //如果为 true ，开启虚拟服务器时为你的代码 进行压缩。起到加快开发流程和优化的作用 
        host: 'localhost', // 设置主机名，默认为”localhost” 
        port: 3000, // 设置端口号,默认端口号为8080
        historyApiFallback: true, //让所有404错误的页面定位到index.html 
        open: true //启动服务器时，自动打开浏览器，默认为false 
    }
};