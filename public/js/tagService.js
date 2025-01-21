class TagService {
    static async addTag(noteId, tagName) {
        return await ApiService.fetchWithAuth(`/notes/${noteId}/tags`, {
            method: 'POST',
            body: JSON.stringify({ tag: tagName })
        });
    }

    static async removeTag(noteId, tagName) {
        return await ApiService.fetchWithAuth(`/notes/${noteId}/tags/${encodeURIComponent(tagName)}`, {
            method: 'DELETE'
        });
    }

    static createTagElement(tagName, noteId, isEditable = true) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = tagName;
        
        if (isEditable) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'tag-remove';
            removeBtn.innerHTML = '&times;';
            removeBtn.onclick = async (e) => {
                e.stopPropagation();
                try {
                    await this.removeTag(noteId, tagName);
                    tag.remove();
                    NotificationService.success('Tag supprimé');
                } catch (error) {
                    NotificationService.error('Erreur lors de la suppression du tag');
                }
            };
            tag.appendChild(removeBtn);
        }
        
        return tag;
    }
} 