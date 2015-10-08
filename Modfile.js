// Mod.js
// More info at https://github.com/modjs/mod/

module.exports = {
    plugins: {

    },
    tasks: {
        min:{
            src:'./js/*.js',
            dest:'./min/js/'
        },
        // min:{
        //     src:'./css/*.css',
        //     dest:'./min/css/*.css'
        // }
    },
 
};
