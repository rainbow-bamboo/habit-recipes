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
5. View page listing
6. Keep a counter per habit
7. Set as homepage (optional)

## Technical Details
We can use and serialize objects for this. Because we only have a couple different types of habits, intent/stack, we can have two different objects in localstorage. One for each. 
It'll look like
{:intention [Intention Array]}
{:stack [Stack Array]}

And then when we deserialize, the Arrays will return arrays of objects. 
These objects are then rendered as habits.

Because reading and writing to localstorage is fast, we're using it as our global state. Functions that need to edit stored habits 
1. Read habits from localstorage
2. Edit the resulting array
3. Store to localstorage
4. Call init which will read from localstorage again and rerender

Our rendering function, `habitsToElements` makes me appreaciate JSX. We have to do a `document.createElement -> element.appendChild` pattern, but at least it's vanilla js.


## Future Work
- Seperate habits into explicit parts