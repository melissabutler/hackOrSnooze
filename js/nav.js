"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  $storiesContainer.show();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  hidePageComponents();
  $storiesContainer.hide();
  console.debug("navLoginClick", evt);
  $loginForm.show();
  $signupForm.show();
  $accountForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// when submit clicked, show story form
$navSubmit.on('click', submitClick);

function submitClick(){
  $submitForm.css("display", "block")
}

function navFavoritesClick(){
  hidePageComponents();
  $storiesContainer.show();
  putFavoritesListOnPage();
}

$body.on('click', '#nav-favorites', navFavoritesClick)

function myStoriesClick(){
  hidePageComponents();
  $storiesContainer.show();
  putMyStoriesOnPage();
}

$body.on('click','#nav-my-stories', myStoriesClick)