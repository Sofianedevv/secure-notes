class SearchService {
    static async searchNotes(query) {
        const searchResults = document.getElementById('searchResults');
        const notes = document.querySelectorAll('.note-card');
        
        if (!query) {
            notes.forEach(note => note.style.display = 'block');
            return;
        }

        notes.forEach(note => {
            const title = note.querySelector('h3').textContent.toLowerCase();
            const content = note.querySelector('p').textContent.toLowerCase();
            const searchTerm = query.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        });
    }
} 