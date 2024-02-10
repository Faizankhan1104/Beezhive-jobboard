// authService.js
export let isJobSeekerLoggedIn = false;

export function login() {
  // Perform login logic
  isJobSeekerLoggedIn = true;
}

export function logout() {
  // Perform logout logic
  isJobSeekerLoggedIn = false;
}

export function isUserLoggedIn() {
  return isJobSeekerLoggedIn;
}
