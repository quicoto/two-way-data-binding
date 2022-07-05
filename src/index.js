export default function (scope) {
  const $element = document.querySelector(`[mam-bind="firstName"]`);

  $element.textContent = scope.firstName;
}