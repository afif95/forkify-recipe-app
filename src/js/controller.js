import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addrecipeView from './views/addrecipeView.js';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

const controlrecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderspinner();

    // update resultsView to mark selected search result
    resultsView.update(model.getsearchresultsbypage());

    // update bookmarksView to mark current/selected result
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadrecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    recipeView.rendererror();
    console.error(err);
  }
};

const controlsearchresults = async function () {
  try {
    resultsView.renderspinner();

    //get search query
    const query = searchView.getquery();
    if (!query) throw new error('');

    //load search results
    await model.loadsearchresults(query);

    //render results
    resultsView.render(model.getsearchresultsbypage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.rendererror();
  }
};

const controlpagination = function (gotopage) {
  //render new results
  // resultsView.render(model.state.search.results);
  resultsView.render(model.getsearchresultsbypage(gotopage));

  //render new pagination buttons
  paginationView.render(model.state.search);
};

const controlservings = function (newServings) {
  //update recipe servings (in state)
  model.updateServings(newServings);

  //update recipeView
  recipeView.update(model.state.recipe);
};

const controladdbookmark = function () {
  //add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //update recipeView
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlbookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controladdrecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addrecipeView.renderspinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addrecipeView.rendermessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(() => {
      addrecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addrecipeView.rendererror(err.message);
  }
}
//subscriber (publisher subscriber pattern)
const init = function () {
  bookmarksView.addHandlerRender(controlbookmarks);
  recipeView.addHandlerRender(controlrecipes);
  recipeView.addHandlerUpdateService(controlservings);
  recipeView.adHandlerAddBookmark(controladdbookmark);
  searchView.addhandlersearch(controlsearchresults);
  paginationView.addhandlerclick(controlpagination);
  addrecipeView._addHandlerUpload(controladdrecipe);
};

init();