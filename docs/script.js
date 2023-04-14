let state = [];
let stateArea =[];

const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");

const notselected = document.querySelector(".notselected");
const notoptionsContainer = document.querySelector(".notoptions-container");
const notoptionsList = document.querySelectorAll(".notoption");


function selectedfunc()
{
  let url = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
  
  showAllMealsArea(url);
  
  optionsContainer.classList.toggle("active");

}

function moreOptfunc()
{
  DisplayDetails();
  
  notoptionsContainer.classList.toggle("notactive");
}

function DisplayDetails()
{
  let html = '';

  let result = document.querySelector('#moreOptfil');
  
  result.style.display = "block";

  html+= `
          <div class="notoption" id="hideDetailsBtn"  onclick="hideDetails()">
              Hide Details
          </div>

          <div class="notoption" id="hideIngredientsBtn" onclick="hideIngredients()">
              Hide Ingredients
          </div>

          <div class="notoption" id="showIngredientsBtn" onclick="showIngredients()">
              Show Ingredients
          </div>

          <div class="notoption" id="hideRecipeBtn" onclick="hideRecipe()">
              Hide Recipe
          </div>

          <div class="notoption" id="showRecipeBtn" onclick="showRecipe()">
              Show Recipe
          </div>`;

  result.innerHTML = html;  
}

function DisplayArea(records)
{
  
  let html = '';
  
  let result = document.querySelector('#fil');

  result.style.display = "block";

  for (let mealRecipe of records) 
  {
    html += `
            <div class="option" onclick="filterByArea('${mealRecipe.strArea}')">
                ${mealRecipe.strArea}
            </div>`;
  }
  if (records == 0)
  {
    details.style.display = "none";
  recipe.style.display = "none";
  ingredients.style.display = "none";
  notselected.style.display ="none";
    
    result.innerHTML = `<h1>There Was Nothing To Match The Filter</h1>`;

    
  }
  else{
    result.innerHTML = html;
  }
}

function Display(records)
{
  let html = '';
  
  let result = document.querySelector('#result');

  result.style.display = "block";

  for (let mealRecipe of records) 
  {
    html += `<tr>
               <td>
                <div class="container">
                 <img src="${mealRecipe.strMealThumb}">
                 <div class="overlay">
                 <button class="Vdetails" onclick="viewDetails('${mealRecipe.idMeal}')">View Details</button>
                </div>
              </td>
            </tr>`;
  }
  if (records == 0)
  {
    details.style.display = "none";
    recipe.style.display = "none";
    ingredients.style.display = "none";
    notselected.style.display ="none";
    
    result.innerHTML = `<h1>There Was Nothing To Match The Filter</h1>`;
  }
  else{
    result.innerHTML = html;
  }
}

async function getData(url) 
{
  let userInp = document.getElementById("userInp").value;
  try
  {
    const response = await fetch(url);
    const data = await response.json();
    return data.meals.slice(0, 150);
  }
  catch (err)
  {
    result.innerHTML = `<h1>${userInp} is not a valid search term</h1>`;
    selected.style.display ="none";
  }
}

async function showAllMeals(url) 
{
  state = await getData(url);
  Display(state);
}

async function showAllMealsArea(url) 
{
  stateArea = await getData(url);
  DisplayArea(stateArea);
}

function filterByArea(location) 
{
  let userInp = document.getElementById("userInp").value;

  selected.innerHTML = location;
  optionsContainer.classList.toggle("active");
  
  let filtered = [];

  for (let rec of state) 
  {
    if (rec.strArea === location) 
    {
      filtered.push(rec);
      
      details.style.display = "none";
      recipe.style.display = "none";
      ingredients.style.display = "none";
      notselected.style.display ="none";
    }
  }
  Display(filtered);
}

function search()
{
  let userInp = document.getElementById("userInp").value;
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  
  mealDetail.style.display ="none";
  result.style.display = "block";
  selected.style.display ="block";
  notselected.style.display ="none";
  closeBtn.style.display ="block";
  
  if (userInp == 0)
  {
    result.innerHTML = `<h2>Please enter an item to search for</h2>`;
    mealDetail.style.display = "none";
    selected.style.display ="none";
    notselected.style.display ="none";
  }
  else
  {
    showAllMeals(url + userInp);
  }
}

function random() 
{
  let url = "https://www.themealdb.com/api/json/v1/1/random.php";
  
  result.style.display = "block";
  mealDetail.style.display ="none";
  selected.style.display ="none";
  notselected.style.display ="none";
  closeBtn.style.display ="block";
  
  showAllMeals(url);
}

function getRecord(mealID)
{
  for(let rec of state)
  {
    if (rec.idMeal === mealID )
    {
      return rec;
    }
  }
}

function viewDetails(mealID)
{
  let record = getRecord(mealID);
  let result = document.querySelector('#mealDetail');

  let count = 1;
  let ingredients = [];

  for (i in record)
  {
    let ingredient = "";
    let measure = "";

    if (i.startsWith("strIngredient") && record[i]) 
    {
      ingredient = record[i];
      measure = record[`strMeasure` + count];
      count = count +1;
      ingredients.push(`${measure} ${ingredient}`);
    }
  }

  console.log(ingredients);

  mealDetail.style.display = "block";
  aside.style.display = "block";
  selected.style.display ="block";
  notselected.style.display ="block";
  
  result.innerHTML = `
      <div class="expanded">
      
        <div id="details">
          <h1>Name: ${record.strMeal}</h1>
          <h3>Region: ${record.strArea}</h3>
        </div>
        
        <div id="ingredients">
          <h1>Ingredients: </h1>
        </div>
      
        <div id="recipe">
          <h1>Recipe: </h1>
          <pre id="instructions">${record.strInstructions}</pre>
        </div>
        
      </div>`;

  let ingredientCon = document.getElementById("ingredients");
  let parent = document.createElement("ul");
  let recipe = document.getElementById("recipe");

  ingredients.forEach((i) => 
  {
    let child = document.createElement("li");
    child.innerText = i;
    parent.appendChild(child);
    ingredientCon.appendChild(parent);
  });
}

function hideDetails()
{
  details.style.display = "none";
  recipe.style.display = "none";
  ingredients.style.display = "none";
  notselected.style.display ="none";
  notselected.innerHTML = `Hide Details`;
  notoptionsContainer.classList.toggle("notactive");
}

function hideAll()
{
  result.style.display ="none";
  mealDetail.style.display ="none";
  notselected.style.display ="none";
  selected.style.display ="none";
  closeBtn.style.display ="none";
}

function hideRecipe()
{
  recipe.style.display = "none";
  notselected.innerHTML = `Hide Recipe`;
  notoptionsContainer.classList.toggle("notactive");
}

function hideIngredients()
{
  ingredients.style.display = "none";
  notselected.innerHTML = `Hide Ingredients`;
  notoptionsContainer.classList.toggle("notactive");
}

function showRecipe()
{
  recipe.style.display = "block";
  notselected.innerHTML = `Show Recipe`;
  notoptionsContainer.classList.toggle("notactive");
}

function showIngredients()
{
  ingredients.style.display = "block";
  notselected.innerHTML = `Show Ingredients`;
  notoptionsContainer.classList.toggle("notactive");
}

function handleKeyPress(e)
{
 var key=e.keyCode || e.which;
  if (key==13)
  {
     search();
  }
}