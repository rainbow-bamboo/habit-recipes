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
    if(stored){
        return stored
    }else{
        return []
    }
}

function storeToLocalstorage(key,val){
    window.localStorage.setItem(key, JSON.stringify(val))
}

function isEditedToday(lastEdited){
    if(lastEdited){
        const lastEditedDate = new Date(lastEdited)
        const lastEditedYear = lastEditedDate.getFullYear()
        const lastEditedMonth = lastEditedDate.getMonth()
        const lastEditedDay = lastEditedDate.getDate()

        const today = new Date()
        const todaysYear = today.getFullYear()
        const todaysMonth = today.getMonth()
        const todaysDay = today.getDate()

        if((lastEditedDay === todaysDay) &&
            (lastEditedMonth === todaysMonth) &&
            (lastEditedDay === todaysDay) &&
            (lastEditedYear === todaysYear)){
                return true
            }else{
                return false
            }
    }else{
        return false
    }
}

function incrementCounter(type, habitID) {
    const stored = parseFromLocalstorage(type)
    const editedHabits = stored.map(h => {
        if(h.id == habitID){
            h.count = parseInt(h.count) + 1
            h.lastEdited = Date()
        }
        return h
    })
    storeToLocalstorage(type, editedHabits)
    init()
}

function editHabitBody(type, habitID) {
    let newBody = window.prompt("What should the new habit be?")
    if(newBody){
        const stored = parseFromLocalstorage(type)
        const editedHabits = stored.map(h => {
            if(h.id == habitID){
                h.body = newBody
            }
            return h
        })
        storeToLocalstorage(type, editedHabits)
        init()
    }
}

function resetHabitCounter(type, habitID) {
    const stored = parseFromLocalstorage(type)
    const editedHabits = stored.map(h => {
        if(h.id == habitID){
            const newVal = prompt("What would you like the counter to be?")
            h.count = newVal
        }
        return h
    })
    storeToLocalstorage(type, editedHabits)
    init()
}

function deleteHabit(type, habitID) {
    if(window.confirm("Delete habit?")){
        const stored = parseFromLocalstorage(type)
        const editedHabits = stored.filter(function(el){
            return el.id != habitID
        })
        storeToLocalstorage(type, editedHabits)
        init()
    }
}

function renderControls(type, id) {
    const newSelect = document.createElement("details")
    newSelect.name = "controls"
    newSelect.id = "controls"

    const defaultControl = document.createElement("summary")
    const defaultText = document.createTextNode("⚙️")
    defaultControl.appendChild(defaultText)
    defaultControl.value = ""
    newSelect.appendChild(defaultControl)
    
    const editControl = document.createElement("button")
    const editText = document.createTextNode("edit habit")
    editControl.appendChild(editText)
    editControl.onclick = function () {
        editHabitBody(type, id)
        newSelect.value = ""
    }
    newSelect.appendChild(editControl)

    const resetCounterControl = document.createElement("button")
    const counterText = document.createTextNode("edit counter")
    resetCounterControl.appendChild(counterText)
    resetCounterControl.onclick = function () {
        resetHabitCounter(type, id)
        newSelect.value = ""
    }
    newSelect.appendChild(resetCounterControl)

    const deleteControl = document.createElement("button")
    const deleteText = document.createTextNode("delete")
    deleteControl.appendChild(deleteText)
    deleteControl.onclick = function () {
        deleteHabit(type, id)
        newSelect.value = ""
    }
    newSelect.appendChild(deleteControl)

    return newSelect
}

function habitsDoneToday(habits){
    const habitsDoneToday = habits.map(e => isEditedToday(e.lastEdited));
    const countHabitsDoneToday = habitsDoneToday.filter(Boolean).length;
    return countHabitsDoneToday;
}

function percentageDoneToday(habits){
    const numHabits = habits.length;
    const countHabitsDoneToday = habitsDoneToday(habits);
    const percentageDone = Math.round(100 * (countHabitsDoneToday / numHabits));
    return percentageDone;
}

function habitStats(id, habits){
    if(habits){
        const targetElement = document.getElementById(id);
        const habitsDone = habitsDoneToday(habits);

        const habitStarArray = [];
        for (let index = 0; index < habitsDone; index++) {
            habitStarArray.push("⭐")
        }

        const stars = habitStarArray.join("");

        const newSpan = document.createElement("span");
        const chart = document.createTextNode(stars);
        newSpan.appendChild(chart);
        newSpan.id = "star-chart";

        targetElement.replaceWith(newSpan);

    }
}

function habitList(type, habits, id){
    if(habits){
        let targetElement = document.getElementById(id)
        targetElement.innerHTML = ""
        habits.forEach(element => {
            const newLI = document.createElement("li")
            const newHabit = document.createElement("span")
            const newContent = document.createTextNode(element.body)
            const editedToday = isEditedToday(element.lastEdited)
            newHabit.appendChild(newContent)
            newLI.appendChild(newHabit)

            const newCounter = document.createElement("button")
            let countText = element.count.toString()
            if(editedToday){
                newCounter.className = "counter edited-today"
                countText = countText.concat(" ⭐")
            }else{
                newCounter.className = "counter"
            }

            const newCount = document.createTextNode(countText)
            newCounter.appendChild(newCount)
            newCounter.onclick = function (){
                incrementCounter(type, element.id)
            }
            
            const newControls = renderControls(type, element.id)
                        
            const newUIDIV = document.createElement("div")
            newUIDIV.className = "habit-ui"
            newUIDIV.appendChild(newCounter)
            newUIDIV.appendChild(newControls)
            
            newLI.appendChild(newUIDIV)
            targetElement.appendChild(newLI)
        })
    }
}

function init(){
    const storedIntentions = parseFromLocalstorage('intentions')
    const storedStacks = parseFromLocalstorage('stacks')
    habitStats('star-chart' , storedIntentions.concat(storedStacks))
    
    if(storedIntentions.length > 0){
        habitList('intentions', storedIntentions, 'intention-list')
    }
    if(storedStacks.length > 0){
        habitList('stacks', storedStacks, 'stack-list')
    }

}

init()