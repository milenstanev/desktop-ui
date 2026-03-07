/* eslint-disable testing-library/prefer-screen-queries -- screen import fails in Vercel build (RTL v16) */
import { render } from '@testing-library/react';
import App from './app/App';
import { APP_TEST } from './shared/constants';

test('renders desktop UI header and add window buttons', () => {
  const { getByRole } = render(<App />);

  expect(
    getByRole('heading', { name: APP_TEST.HEADING_TITLE })
  ).toBeInTheDocument();
  expect(
    getByRole('button', { name: APP_TEST.BUTTON_ADD_SIMPLE_EXAMPLE })
  ).toBeInTheDocument();
  expect(
    getByRole('button', { name: APP_TEST.BUTTON_ADD_COUNTER })
  ).toBeInTheDocument();
  expect(
    getByRole('button', { name: APP_TEST.BUTTON_ADD_FORM_EDITOR })
  ).toBeInTheDocument();
});
