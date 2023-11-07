"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);
//   
  const hostName = story.getHostName();

  //if loggin in: 
  const showStar = Boolean(currentUser);

  //Generate the story markup
  return $(`
      <li id="${story.storyId}">
      <div>
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      ${showStar ? getStarHTML(story, currentUser) : ""}
      
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
        <hr></hr>
      </li>
    `);
}

function getDeleteBtnHTML() {
  return ` 
  <span class="trash-can">
  <i class="fas fa-trash-alt"></i>
  </span>`;
}
//Make star and show favorite/not favorite

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


//Handle favoriting and unfavoriting story
function toggleStoryFavorite(e){
  e.preventDefault();


  const $target = $(e.target);
  const $closestLi = $target.closest('li');
  const storyId = $closestLi.attr('id');
  const story = storyList.stories.find(s => s.storyId === storyId)


  //check for favorite
  if($target.hasClass("fas")){
    currentUser.removeFavorites(story);
    $target.closest("i").toggleClass('fas far');
  } else {
    currentUser.addFavorites(story);
    $target.closest("i").toggleClass("fas far");
  }
}

//star on click run toggle
$storiesList.on('click', ".star", toggleStoryFavorite);

//put favorites list on page

function putFavoritesListOnPage(){
  $favoritedStories.empty();
  if(currentUser !== undefined){
  if (currentUser.favorites.length === 0){
    
    $favoritedStories.append("<h1>No favorites added!</h1>");
  } else {
    for (let story of currentUser.favorites){
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
 } else {
    $favoritedStories.append("<h1>Please log in to save your favorite stories.</h1>");

  } 
  $favoritedStories.show();
}

// handle new story

async function submitNewStory(evt){
  console.debug("submitNewStory");
  evt.preventDefault();

  // grab form info
  const title = $('#create-title').val();
  const url= $('#create-url').val();
  const author = $('#create-author').val();
  const username = currentUser.username;
  const storyData = {title, url, author, username};  

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story)

  //hide form and reset

  $submitForm.trigger("reset");

}

$submitForm.on('submit', submitNewStory);

async function deleteStory(event){
  const $closestLi = $(event.target).closest('li');
  const storyId = $closestLi.attr('id');

  await storyList.removeStory(currentUser, storyId);

  await putMyStoriesOnPage();
}

$ownStories.on('click', '.trash-can', deleteStory)

function putMyStoriesOnPage() {
  $ownStories.empty(); 
  if(currentUser !== undefined){
  if (currentUser.ownStories.length === 0){
    $ownStories.show();
    $ownStories.append("<h1> No user stories added yet! </h1>");
    
  } else {
    for (let story of currentUser.ownStories){
      const $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }} else{
    $ownStories.append("<h1>Please log in to keep track of your stories.</h1>");
  }
  $ownStories.show();
}