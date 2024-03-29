import document from './document';

function render(html, attributeBind) {
  const container = document.createElement(`div`);
  container.innerHTML = html;
  const bindName = (testId, attribute) => container.querySelector(`[${attribute || attributeBind}="${testId}"]`);
  const bindNames = (testId, attribute) => container.querySelectorAll(`[${attribute || attributeBind}="${testId}"]`);
  // asFragment has been stolen from react-testing-library
  const asFragment = () => document.createRange().createContextualFragment(container.innerHTML);

  // Some tests need to look up global ids with document.getElementById()
  // so we need to be inside an actual document.
  document.body.innerHTML = ``;
  document.body.appendChild(container);

  return {
    container, bindName, bindNames, asFragment
  };
}

export { render };
