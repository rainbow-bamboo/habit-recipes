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

function editHabitBody(type, id) {
    console.log("editing habit body")
}

function resetHabitCounter(type, id) {
    console.log("resetting counter")
}

function deleteHabit(type, id) {
    console.log("deleting habit")
}

function renderControls(type, id) {
    const newSelect = document.createElement("select")
    newSelect.name = "controls"
    newSelect.id = "controls"

    const defaultControl = document.createElement("option")
    const defaultText = document.createTextNode("*")
    defaultControl.appendChild(defaultText)
    defaultControl.value = ""
    newSelect.appendChild(defaultControl)
    
    const editControl = document.createElement("option")
    const editText = document.createTextNode("edit habit")
    editControl.appendChild(editText)
    editControl.onclick = function () {
        editHabitBody(type, id)
        newSelect.value = ""
    }
    newSelect.appendChild(editControl)
    return newSelect
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
            
            const newControls = renderControls(type, id)
            newLI.appendChild(newControls)

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