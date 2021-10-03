function storeHabit(type, inputID) {
    const habitBody = document.getElementById(inputID).value
    const storedHabits = window.localStorage.getItem(type)
    let habits = JSON.parse(storedHabits)
    if(storedHabits != null){
        habits.push({"body": habitBody})
        let stringHabits = JSON.stringify(habits)
        console.log(stringHabits)
        window.localStorage.setItem(type, stringHabits)
        document.getElementById(inputID).value = ""
    }else{
        window.localStorage.setItem(type, JSON.stringify([{"body": habitBody}]))
        document.getElementById(inputID).value = ""
    }

}

