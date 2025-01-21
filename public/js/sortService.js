class SortService {
    static sortNotes(criteria) {
        const notesList = document.querySelector('.notes-list');
        const notes = Array.from(notesList.querySelectorAll('.note-card'));

        notes.sort((a, b) => {
            switch(criteria) {
                case 'date':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                case 'title':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                default:
                    return 0;
            }
        });

        notes.forEach(note => notesList.appendChild(note));
    }
} 