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
        render()
    }else{
        window.localStorage.setItem(type, JSON.stringify([{"body": habitBody,
                                                            "id": 1,
                                                            "count": 0}]))
        document.getElementById(inputID).value = ""
        render()
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

/*  
This function only returns arrays, it does not do an assignment. 
This way we can limit mutations to the incrementCounter function.
*/
function updatedEditedLog(habit){
    const habitLog = habit.log
    if(habitLog){
        return habitLog.concat(Date())
    }else{
        return [Date()]
    }
}

function incrementCounter(type, habitID) {
    const stored = parseFromLocalstorage(type)
    const editedHabits = stored.map(h => {
        if(h.id == habitID){
            h.count = parseInt(h.count) + 1
            h.lastEdited = Date()
            h.log = updatedEditedLog(h)
        }
        return h
    })
    storeToLocalstorage(type, editedHabits)
    render()
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
        render()
    }
}

function resetHabitCounter(type, habitID) {
    const stored = parseFromLocalstorage(type)
    const editedHabits = stored.map(h => {
        if(h.id == habitID){
            const newVal = prompt("What would you like the counter to be?")
            if(newVal){
                h.count = newVal
            }
        }
        return h
    })
    storeToLocalstorage(type, editedHabits)
    render()
}

function resetHabitCounters(type){
    const stored = parseFromLocalstorage(type)
    const resetedHabits = stored.map(h => {
        h.lastEdited = 0
        h.count = 0
        return h
        })
    storeToLocalstorage(type, resetedHabits)
}

function resetAllHabitCounters(){
    if(window.confirm("Reset all habit counters to 0")){
        resetHabitCounters("intentions")
        resetHabitCounters("stacks")
    }
    render()
}

function deleteHabit(type, habitID) {
    if(window.confirm("Delete habit?")){
        const stored = parseFromLocalstorage(type)
        const editedHabits = stored.filter(function(el){
            return el.id != habitID
        })
        storeToLocalstorage(type, editedHabits)
        render()
    }
}

function changeHabit(event, type, id){
    switch (event.target.value){
        case 'edit habit':
            editHabitBody(type, id)
            event.target.value = ""
            break
        case 'reset counter':
            resetHabitCounter(type, id)
            event.target.value = ""
            break
        case 'delete habit':
            deleteHabit(type, id)
            event.target.value = ""
            break
        default:
            console.log("unknown instruction, " + event.target.value)
    }
}

function renderControls(type, id) {
    const newSelect = document.createElement("select")
    newSelect.name = "controls"
    newSelect.className = "controls"
    newSelect.addEventListener('change', (event) => {
        changeHabit(event, type, id)
    })

    const defaultControl = document.createElement("option")
    const defaultText = document.createTextNode("⚙️")
    defaultControl.appendChild(defaultText)
    defaultControl.value = ""
    newSelect.appendChild(defaultControl)
    
    const editControl = document.createElement("option")
    const editText = document.createTextNode("edit habit")
    editControl.appendChild(editText)
    newSelect.appendChild(editControl)

    const resetCounterControl = document.createElement("option")
    const counterText = document.createTextNode("reset counter")
    resetCounterControl.appendChild(counterText)
    newSelect.appendChild(resetCounterControl)

    const deleteControl = document.createElement("option")
    const deleteText = document.createTextNode("delete habit")
    deleteControl.appendChild(deleteText)
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
        const storedEmoji = parseFromLocalstorage('emoji')
        const habitStarArray = [];

        if (habitsDone > 0){
            for (let index = 0; index < habitsDone; index++) {
                habitStarArray.push(storedEmoji)
            }
        }else{
            habitStarArray.push("‍‍📈")
        }

        const stars = habitStarArray.join("");

        const newSpan = document.createElement("p");
        const chart = document.createTextNode(stars);
        newSpan.appendChild(chart);
        newSpan.id = "star-chart";

        targetElement.replaceWith(newSpan);

    }
}

function habitList(type, habits, id){
    if(habits){
        let targetElement = document.getElementById(id)
        const storedEmoji = parseFromLocalstorage('emoji')
        targetElement.innerHTML = ""
        habits.forEach(habit => {
            const li = document.createElement("li")
            const span = document.createElement("span")
            const textNode = document.createTextNode(habit.body)
            const editedToday = isEditedToday(habit.lastEdited)
            let countText = "0"
            span.appendChild(textNode)
            li.appendChild(span)

            const counterButton = document.createElement("button")
            if(habit.count > 0){
                countText = habit.count.toString()
            }
            let classes = "counter"
            if(editedToday){
                classes = classes.concat(" edited-today")
                countText = countText.concat(" " + storedEmoji)
            }

            if(habit.count >= 19){
                classes = classes.concat(" learned-habit")
            }

            counterButton.className = classes

            const newCount = document.createTextNode(countText)
            counterButton.appendChild(newCount)
            counterButton.onclick = function (){
                incrementCounter(type, habit.id)
            }
            
            const newControls = renderControls(type, habit.id)
                        
            const newUIDIV = document.createElement("div")
            newUIDIV.className = "habit-ui"
            newUIDIV.appendChild(counterButton)
            newUIDIV.appendChild(newControls)
            
            li.appendChild(newUIDIV)
            targetElement.appendChild(li)
        })
    }
}

function removeElement(id){
    const element = document.getElementById(id)
    element.remove()
    return true
}


function showExport(id){
    const storedIntentions = parseFromLocalstorage('intentions')
    const storedStacks = parseFromLocalstorage('stacks')
    const habits = storedIntentions.concat(storedStacks)
    const exportText = document.createTextNode(JSON.stringify(habits))
    const targetElement = document.getElementById(id)
    const exportDiv = document.createElement('div')
    exportDiv.appendChild(exportText)
    targetElement.replaceWith(exportDiv)
}

function setEmoji(){
    const storedEmoji = parseFromLocalstorage('emoji')
    if(storedEmoji.length > 0){
        const emojiButton = document.getElementById('emoji-button')
        emojiButton.innerHTML = storedEmoji
    }else{
        const emojiButton = document.getElementById('emoji-button')
        emojiButton.innerHTML = "⭐"
        storeToLocalstorage("emoji", "⭐")
    }
}

// This is a magic constant, increment it whenever you make a change to the decorations panel and want to show the new badge
const decorationVersion = 1;

function isDecorationVersionOutdated(){
    const currentVersion = parseFromLocalstorage("decorationVersion")
    if(decorationVersion > currentVersion){
        return true
    }else{
        return false
    }
}

function updateDecorationVersion(){
    storeToLocalstorage("decorationVersion", decorationVersion)
    const newBadge = document.getElementById("newDecorationBadge")
    newBadge.style.display = "none"
}

function newDecorationBadge(){
    if(isDecorationVersionOutdated()){
        const newBadge = document.getElementById("newDecorationBadge")
        newBadge.style.display = "inline"
    }else{
        return false
    }
}

document.getElementById("decorationDetails").addEventListener("toggle", updateDecorationVersion)

function setTheme(){
    const storedTheme = parseFromLocalstorage('theme')
    const app = document.getElementById('app')
    if(storedTheme != ""){
        app.className = storedTheme
    }else{
        app.className = "default-theme"
    }
}

function storeTheme(theme){
    storeToLocalstorage("theme", theme)
    render()
}

new EmojiPicker({
    trigger: [
        {
            selector: '#emoji-button',
            insertInto: '#emoji-input' 
        }
    ],
    closeButton: true,
    specialButtons: 'green' // #008000, rgba(0, 128, 0);
});

document.getElementById("heading").addEventListener("click", render)

function render(){
    const storedIntentions = parseFromLocalstorage('intentions')
    const storedStacks = parseFromLocalstorage('stacks')
    setTheme()
    setEmoji()
    newDecorationBadge()
    habitStats('star-chart' , storedIntentions.concat(storedStacks))
    
    if(storedIntentions.length > 0){
        habitList('intentions', storedIntentions, 'intention-list')
    }else{
        removeElement("intention-section")
    }

    if(storedStacks.length > 0){
        habitList('stacks', storedStacks, 'stack-list')
    }else{
        removeElement("stack-section")
    }
}

render()