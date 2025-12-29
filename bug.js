
    // Keep students in an array of objects: { id, name, grade }
    let students = [];

    // Simple DOM helpers
    let form = document.getElementById('studentForm');
    let nameInput = document.getElementById('nameInput');
    let gradeInput = document.getElementById('gradeInput');
    let studentTable = document.getElementById('studentTable');
    let averageGrade = document.getElementById('averageGrade');
    let errorMsg = document.getElementById('errorMsg');
    // Load saved students when the page opens
    function loadStudents() {
    let saved = localStorage.getItem('students');
      if (saved) {
        try {
          let parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            students = parsed.map(function(s) {
              return {
                id: s.id || Date.now() + Math.floor(Math.random() * 1000),
                name: String(s.name || ''),
                grade: Number(s.grade || 0)
              };
            });
          }
        } catch (e) {
          // if parse fails, start with empty list
          students = [];
        }
      }
    }

    // Save students to localStorage
    function saveStudents() {
      localStorage.setItem('students', JSON.stringify(students));
    }

    // Calculate average grade (returns a number)
    function calculateAverage() {
      if (students.length === 0) return 0;
      let sum = 0;
      for (let i = 0; i < students.length; i++) {
        sum += Number(students[i].grade) || 0;
      }
      return sum / students.length;
    }

    // Render the table and the average
    function renderStudents() {
      // Clear table body
      studentTable.innerHTML = '';

      let avg = calculateAverage();

      // Create rows from students
      for (let i = 0; i < students.length; i++) {
        let s = students[i];
        let tr = document.createElement('tr');

        // Add highlight class if below average
        if (students.length > 0 && s.grade < avg) {
          tr.classList.add('below');
        }

        let tdName = document.createElement('td');
        tdName.textContent = s.name;
        tr.appendChild(tdName);

        let tdGrade = document.createElement('td');
        tdGrade.textContent = s.grade;
        tr.appendChild(tdGrade);

        let tdDelete = document.createElement('td');
        let btn = document.createElement('button');
        btn.textContent = 'Delete';
        btn.className = 'delete-btn';
        // store id on button so we know which student to remove
        btn.dataset.id = s.id;
        // attach click handler to delete this student
        btn.addEventListener('click', function (e) {
          var id = Number(e.target.dataset.id);
          deleteStudent(id);
        });
        tdDelete.appendChild(btn);
        tr.appendChild(tdDelete);

        studentTable.appendChild(tr);
      }

      // Show average with two decimal places
      averageGrade.textContent = avg.toFixed(2);

      // Persist changes
      saveStudents();
    }

    // Add a new student after validating input
    function addStudent(name, grade) {
      // simple validation
      if (!name || name.trim() === '') {
        errorMsg.textContent = 'Enter a name.';
        return;
      }
      if (grade === '' || isNaN(grade) || grade < 0 || grade > 100) {
        errorMsg.textContent = 'Enter a grade between 0 and 100.';
        return;
      }

      errorMsg.textContent = '';

      let student = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: name.trim(),
        grade: Number(grade)
      };

      students.push(student);
      renderStudents();

      // Clear inputs
      nameInput.value = '';
      gradeInput.value = '';
      nameInput.focus();
    }

    // delete a student by id
    function deleteStudent(id) {
      students = students.filter(function (s) { return s.id !== id; });
      renderStudents();
    }

    // Wire the form submit event
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // don't reload the page
      addStudent(nameInput.value, gradeInput.value);
    });

    // Initialize
    loadStudents();
    renderStudents();
