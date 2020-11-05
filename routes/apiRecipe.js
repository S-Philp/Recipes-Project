const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
const models = require('../models')

router.get('/',async(req,res)=>{
    const resultData = await axios.get('https://api.spoonacular.com/recipes/complexSearch?query=pasta&number=16&apiKey=aeaea5163d2a46529d7c282344fc87d5')
    res.render('apiMenu',{recipes:resultData.data.results})
})

router.post('/recipe-search',async(req,res)=>{
    let recipeSearch = req.body.recipeSearch
    const resultData = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${recipeSearch}&number=16&apiKey=aeaea5163d2a46529d7c282344fc87d5`)
    res.render('apiMenu',{recipes:resultData.data.results})
})

router.get('/:recipeid',async(req,res)=>{
    let recipeId = req.params.recipeid
    const recipeDetail = await axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=aeaea5163d2a46529d7c282344fc87d5&includeNutrition=true`)
    let extendedIngredientsDetail = recipeDetail.data.extendedIngredients
    let ingredients = extendedIngredientsDetail.map((ingredient)=>{
        return ingredient.originalString
    })
    let ingredientsString= ingredients.join(".")
    let ingredientArrayObject= ingredients.map((ingredientDetail)=>{
        return {ingredientDetail}
    })
    console.log(ingredientArrayObject)
    let instruction = recipeDetail.data.instructions.replace(/<ol>|<li>|<\/li>|<\/ol>/g,'')
    const ingredientObject =[{
        title:recipeDetail.data.title,
        image:recipeDetail.data.image,
        cooktime:recipeDetail.data.readyInMinutes,
        course:recipeDetail.data.dishTypes[0],
        ingredient:ingredientsString,
        instruction:instruction
    }]
    res.render('recipeDetail',{recipe:ingredientObject,ingredientDetails:ingredientArrayObject})
})

module.exports = router