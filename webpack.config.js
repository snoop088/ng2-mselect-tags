module.exports = () => {
    return {
        entry: {
            main: './src/index.ts'
        },
        output: {
            path: './src/',
            filename: '[name].bundle.js'
        },
        resolve: {
            extensions: ['.js', '.ts', '.html']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loaders: [
                        'ts-loader',
                        'angular2-template-loader'
                    ]
                },
                {
                    test: /\.html$/,
                    loader: 'raw'
                }
            ]
        },
        devtool: 'inline-source-map'
    };
};