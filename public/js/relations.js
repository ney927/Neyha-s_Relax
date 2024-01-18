

fetch('/relations')
    .then((data) => {return data.json()})
    .then((json) => {
        console.log(json)
        const relationsDiv = document.getElementById("relations")
        const Student = document.createElement("table")
        Student.innerHTML = "<tr><th>Student<th></tr><tr><th>SID</th><th>Name</th><th>Email</th></tr>"
        for(i in json.Student) {
            Student.innerHTML +=   `<tr><td>${json.Student[i].sid}</td><td>${json.Student[i].name}</td><td>${json.Student[i].email}</td></tr>`
        };
        const Course = document.createElement("table")
        Course.innerHTML = "<tr><th>Course<th></tr><tr><th>CID</th><th>Title</th><th>Hours</th></tr>"
        for(i in json.Course) {
            Course.innerHTML +=   `<tr><td>${json.Course[i].cid}</td><td>${json.Course[i].title}</td><td>${json.Course[i].hours}</td></tr>`
        };
        const Takes = document.createElement("table")
        Takes.innerHTML = "<tr><th>Takes<th></tr><tr><th>SID</th><th>CID</th><th>Mark</th></tr>"
        for(i in json.Takes) {
            Takes.innerHTML +=   `<tr><td>${json.Takes[i].sid}</td><td>${json.Takes[i].cid}</td><td>${json.Takes[i].mark}</td></tr>`
        };

        relationsDiv.appendChild(Student)
        relationsDiv.appendChild(Course)
        relationsDiv.appendChild(Takes)
    })




//TRASHY SHTI AF
const createBttn = document.getElementById("create-relation-bttn")
const mssg = document.getElementById("create-relation-mssg")

createBttn.addEventListener("click", (e) => {
    var rows = document.getElementById("rows").value
    const cols = document.getElementById("cols").value
    const title = document.getElementById("relation-title").value
    if (title == null || rows == null || cols == null || rows < 1 || cols < 1 || title == ""){ //invalid rows/cols input
        mssg.innerHTML = "Error: ensure all fields are filled"
    } else {
        mssg.innerHTML = "good data"
        rows = rows.split(',')
        let rowsData = []
        let rowIndex = 0;
        let colIndex = 1;
        rowsData[rowIndex][colIndex] = rows[0].trim()
        for(let i=1; i<rows.length(); i++){
            rows[i] = rows[i].trim();
            if (rows[i].contains('!')){
                transition = rows[i].split('!')
                rowsData[rowIndex] += transition[0]
                rowIndex++
                colIndex = 0
                rowsData[rowIndex] = transition[1].trim()
            } else {
                if (colIndex >= cols){
                    rowIndex++
                    colIndex = 0
                }
                rowsData[rowIndex][colIndex] += rows[i]
                colIndex++
            }
        }
        fetch("/createRelation", {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({"title":title, "rows":rowsData, "cols":cols})
        })
    }
})