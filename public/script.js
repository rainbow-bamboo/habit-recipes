function storeHabit(type, inputID) {
    const habitBody = document.getElementById(inputID).value
    const storedHabits = window.localStorage.getItem(type)
    let habits = JSON.parse(storedHabits)
    if(storedHabits != null){
        const newID = maxID(habits) + 1
        habits.push({"body": habitBody,
                     "id": newID,
                     "count": 0})
        let stringHabits = JSON.stringify(habits)
        console.log(stringHabits)
        window.localStorage.setItem(type, stringHabits)
        document.getElementById(inputID).value = ""
        init()
    }else{
        window.localStorage.setItem(type, JSON.stringify([{"body": habitBody,
                                                            "id": 1,
                                                            "count": 0}]))
        document.getElementById(inputID).value = ""
        init()
    }
}

function maxID(habits) {
    const ids = habits.map(x => x.id)
    const maxID = Math.max(...ids) // This is the spread operator. It's somehow apply
    return maxID
}

function parseFromLocalstorage(key){
    const stored = JSON.parse(window.localStorage.getItem(key))
    return stored
}

function incrementCounter(type, habitID) {
    const stored = parseFromLocalstorage(type)
    const editedHabits = stored.map(h => {
        if(h.id == habitID){
            h.count = h.count + 1
        }
        return h
    })
    window.localStorage.setItem(type, JSON.stringify(editedHabits))
    init()
}

function habitsToElements(type, habits, id){
    if(habits){
        let targetElement = document.getElementById(id)
        targetElement.innerHTML = ""
        habits.forEach(element => {
            const newLI = document.createElement("li")
            const newBtn = document.createElement("button")
            const newContent = document.createTextNode(element.body)
            newBtn.appendChild(newContent)
            newLI.appendChild(newBtn)
            newBtn.onclick = function (){
                incrementCounter(type, element.id)
            }

            const newCounter = document.createElement("span")
            const newCount = document.createTextNode(element.count)
            newCounter.appendChild(newCount)
            newLI.appendChild(newCounter)
            targetElement.appendChild(newLI)
        })
    }
}

function init(){
    const storedIntentions = parseFromLocalstorage('intentions')
    const storedStacks = parseFromLocalstorage('stacks')
    habitsToElements('intentions', storedIntentions, 'intention-list')
    habitsToElements('stacks', storedStacks, 'stack-list')
}

init()