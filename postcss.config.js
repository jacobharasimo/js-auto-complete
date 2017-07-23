import postcss_smart_import from 'postcss-smart-import';
import postcss_cssnext from 'postcss-cssnext';
import postcss_apply from 'postcss-apply';
import postcss_responsive_type from 'postcss-responsive-type';

module.exports = {
  plugins: [
    postcss_smart_import(),
    postcss_cssnext(),
    postcss_apply(),
    postcss_responsive_type()
  ]
};
