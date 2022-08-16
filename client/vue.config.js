module.exports = {
  lintOnSave: process.env.NODE_ENV === 'production' ? false : 'default',
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
};