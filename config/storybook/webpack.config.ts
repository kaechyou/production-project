import path from 'path';
import webpack, { RuleSetRule } from 'webpack';
import { BuildPaths } from '../build/types/config';
import { buildCssLoader } from '../build/loaders/buildCssLoader';

export default ({ config }: { config: webpack.Configuration }) => {
  const paths: BuildPaths = {
    build: '',
    html: '',
    entry: '',
    src: path.resolve(__dirname, '..', '..', 'src'),
  };

  config.resolve?.modules?.push(paths.src);
  config.resolve?.extensions?.push('.ts', '.tsx');

  if (config.module) {
    config.module.rules = config.module?.rules?.map(
      (rule: RuleSetRule | '...') => {
        if (
          rule !== '...' &&
          rule.test instanceof RegExp &&
          rule.test.toString().includes('svg')
        ) {
          return { ...rule, exclude: /\.svg$/i };
        }

        return rule;
      },
    );
  }
  config.module?.rules?.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });

  config.module?.rules?.push(buildCssLoader(true));

  return config;
};
