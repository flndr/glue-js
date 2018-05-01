const path         = require( "path" );
const Webpack      = require( 'webpack' );
const DefinePlugin = Webpack.DefinePlugin;

const NPM_RUN_BUILD  = 'build';
const NPM_RUN_DEV    = 'dev';
const NPM_RUN_SCRIPT = process.env.npm_lifecycle_event || NPM_RUN_DEV;

const IS_DEV = NPM_RUN_SCRIPT === NPM_RUN_BUILD ? false : true;

const config = {

    mode : IS_DEV ? 'development' : 'production',

    devtool : IS_DEV ? 'eval-source-map' : 'source-map',

    entry : {
        index : "./src/index.ts"
    },

    output : {
        path          : path.join( __dirname, "dist" ),
        filename      : "[name].js",
        chunkFilename : "[name].chunk.js",
        libraryTarget : 'umd'
    },

    resolve : {
        extensions : [ ".js", ".ts" ]
    },

    module : {
        rules : [
            {
                test    : /\.ts$/,
                include : __dirname,
                loader  : [
                    'babel-loader',
                    'ts-loader'
                ]
            }
        ]
    },

    plugins : [
        new DefinePlugin(
            {
                __DEV__ : JSON.stringify( IS_DEV )
            }
        )
    ]

};

module.exports = config;