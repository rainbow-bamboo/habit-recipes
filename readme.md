# Habit Recipes
This website uses some of the Atomic Habits techniques such as habit stacking to help you develop healthy habits

## Instructions
1. Add the habits that you want to develop
2. Set the website as your homepage

## Algorithm
It does 3 main things
- Habit stack "When I _"
- Habit stack "At _"
- Highlights a random habit

1. Select type of Habit
2. Enter habit
3. Create appropriate habit object 
4. Update storage with habits
5. View page listing and highlighting saved habits
6. Set as homepage (optional)

## Technical Details
We can use and serialize objects for this. Because we only have a couple different types of habits, intent/stack, we can have two different objects in localstorage. One for each. 
It'll look like
{:intention [Intention Array]}
{:stack [Stack Array]}

And then when we deserialize, the Arrays will return arrays of objects. 
These objects are then rendered as habits.

## Future Work
- Ability to delete stored habits
- Seperate habits into explicit parts
- Add a counter to eacch habit