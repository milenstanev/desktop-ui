const path = require('path');
const dotenv = require('dotenv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

function resolveRemoteUrl(mode) {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
  dotenv.config({ path: path.resolve(__dirname, `.env.${mode}`) });

  const fromEnv =
    process.env.REMOTE_URL?.trim() ||
    process.env.DESKTOP_UI_REMOTE_URL?.trim() ||
    '';

  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  if (mode === 'production') {
    throw new Error(
      'Host production build requires REMOTE_URL (public desktop-ui URL, no trailing slash).\n' +
        'Set in Vercel: Project Settings → Environment Variables → REMOTE_URL=https://your-desktop-ui.vercel.app\n' +
        'Or use: npm run host:deploy:vercel -- --remote-url https://your-desktop-ui.vercel.app'
    );
  }

  return 'http://localhost:3000';
}

function assertPublicRemoteUrl(url, mode) {
  if (mode !== 'production') return;

  if (/localhost|127\.0\.0\.1/.test(url)) {
    throw new Error(
      `Host production build cannot use localhost REMOTE_URL: ${url}\n` +
        'Set REMOTE_URL to your deployed desktop-ui URL (e.g. https://desktop-ui-eight.vercel.app).'
    );
  }

  if (!/^https:\/\//i.test(url)) {
    throw new Error(
      `Host production REMOTE_URL must use https in production: ${url}`
    );
  }
}

module.exports = (_env, argv = {}) => {
  const mode = argv.mode || process.env.NODE_ENV || 'development';
  const REMOTE_URL = resolveRemoteUrl(mode);
  assertPublicRemoteUrl(REMOTE_URL, mode);

  return {
    entry: './src/index.jsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { presets: ['@babel/preset-react'] },
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: 'host',
        remotes: {
          // Runtime URL from window (injected in index.html at build time)
          desktopUI: `promise new Promise((resolve, reject) => {
            const raw = window.__DESKTOP_UI_REMOTE_URL__ || '';
            const url = String(raw).replace(/\\/$/, '');
            if (!url) {
              reject(new Error('Missing window.__DESKTOP_UI_REMOTE_URL__'));
              return;
            }
            const script = document.createElement('script');
            script.src = url + '/remoteEntry.js';
            script.async = true;
            script.onload = () => {
              const container = window.desktopUI;
              if (!container || typeof container.get !== 'function') {
                reject(new Error('desktopUI container not found after loading ' + url + '/remoteEntry.js'));
                return;
              }
              resolve({
                get: (request) => container.get(request),
                init: (arg) => {
                  try {
                    return container.init(arg);
                  } catch (e) {}
                },
              });
            };
            script.onerror = () => reject(new Error('Failed to load remoteEntry.js from ' + url));
            document.head.appendChild(script);
          })`,
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
          'react-dom/client': { singleton: true, requiredVersion: '^18.0.0' },
          'react-redux': { singleton: true, requiredVersion: '^9.0.0' },
          '@reduxjs/toolkit': { singleton: true, requiredVersion: '^2.0.0' },
        },
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        templateParameters: {
          REMOTE_URL,
        },
      }),
    ],
    devServer: {
      port: 3001,
      historyApiFallback: true,
      allowedHosts: 'all',
    },
  };
};
