document.addEventListener('DOMContentLoaded', () => {
    
    // --- File Drag & Drop Logic ---
    function setupDragAndDrop(zoneId, inputId, labelId) {
        const zone = document.getElementById(zoneId);
        const input = document.getElementById(inputId);
        const label = document.getElementById(labelId);

        // Click to open file dialog
        zone.addEventListener('click', () => input.click());

        // Drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            zone.addEventListener(eventName, () => zone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            zone.addEventListener(eventName, () => zone.classList.remove('dragover'), false);
        });

        // Drop event
        zone.addEventListener('drop', (e) => {
            let dt = e.dataTransfer;
            let files = dt.files;
            input.files = files; // Assign files to input
            updateLabel(files);
        });

        // Change event (when selected via dialog)
        input.addEventListener('change', function() {
            updateLabel(this.files);
        });

        function updateLabel(files) {
            if (files.length === 0) return;
            if (files.length === 1) {
                label.textContent = files[0].name;
            } else {
                label.textContent = `${files.length} files selected`;
            }
        }
    }

    setupDragAndDrop('excelDropZone', 'excelFile', 'excelFileName');
    setupDragAndDrop('attachmentDropZone', 'attachmentFiles', 'attachmentFileNames');


    // --- Form Submission Logic ---
    const form = document.getElementById('emailForm');
    const sendBtn = document.getElementById('sendBtn');
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    const spinner = document.getElementById('spinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if Excel is provided
        const excelFile = document.getElementById('excelFile').files[0];
        if (!excelFile) {
            showStatus('Please select an Excel file containing the recipient list.', 'error');
            return;
        }

        // Prepare FormData
        const formData = new FormData(form);
        
        // UI Loading State
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        showStatus('Uploading files and dispatching emails...', 'info', true);

        try {
            // Note: Update URL if hosted elsewhere
            const response = await fetch('/api/send-emails', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showStatus(result.message, 'success');
                // Optional: show errors in console if some emails failed
                if (result.errors) {
                    console.warn("Some emails failed:", result.errors);
                    showStatus(result.message + ' (Check console for failures)', 'info');
                }
            } else {
                showStatus(result.message || 'An error occurred during sending.', 'error');
            }

        } catch (error) {
            console.error('Error:', error);
            showStatus('Network error or server is unreachable. Is the server running?', 'error');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Emails';
        }
    });

    function showStatus(text, type, showSpinner = false) {
        statusMessage.className = `status-message ${type}`;
        statusText.textContent = text;
        if (showSpinner) {
            spinner.classList.remove('hidden');
        } else {
            spinner.classList.add('hidden');
        }
    }
});
