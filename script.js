document.addEventListener('DOMContentLoaded', () => {
    const activities = [
        {
            id: 'reading',
            title: 'Leitura',
            time: '30 min',
            details: [
                '<strong>10 min:</strong> Leia um artigo curto, post de blog ou notícia em inglês (ex.: BBC Learning English, The Guardian, ou posts no X). Escolha textos no seu nível ou ligeiramente acima.',
                '<strong>10 min:</strong> Anote 5-10 palavras ou expressões novas em um caderno ou app (ex.: Quizlet). Pesquise seus significados e exemplos de uso.',
                '<strong>10 min:</strong> Resuma o texto em 2-3 frases em inglês, focando na ideia principal.'
            ]
        },
        {
            id: 'writing',
            title: 'Escrita',
            time: '30 min',
            details: [
                '<strong>15 min:</strong> Escreva um parágrafo (5-7 frases) sobre um tema simples (ex.: seu dia, uma opinião sobre um filme, ou um post no X). Use pelo menos 3 palavras novas do dia.',
                '<strong>10 min:</strong> Revise seu texto usando ferramentas como Grammarly ou DeepL Write para corrigir gramática e estilo.',
                '<strong>5 min:</strong> Releia e reescreva uma frase que precise de melhoria.'
            ]
        },
        {
            id: 'listening',
            title: 'Escuta',
            time: '30 min',
            details: [
                '<strong>10 min:</strong> Ouça um podcast, vídeo do YouTube ou áudio curto (ex.: TED-Ed, BBC Learning English, ou clipes no X). Escolha algo com legendas, se necessário.',
                '<strong>10 min:</strong> Ouça novamente, anotando 3-5 frases ou expressões-chave. Tente entender o contexto sem traduzir tudo.',
                '<strong>10 min:</strong> Pratique shadowing: repita as frases imitando a pronúncia, entonação e ritmo do falante.'
            ]
        },
        {
            id: 'speaking',
            title: 'Pronúncia',
            time: '30 min',
            details: [
                '<strong>10 min:</strong> Use um app como Elsa Speak ou Speechling para praticar sons específicos (ex.: /θ/ vs. /ð/, ou vogais como /æ/ vs. /e/).',
                '<strong>10 min:</strong> Grave-se lendo as frases anotadas na atividade de escuta. Compare com o áudio original.',
                '<strong>10 min:</strong> Pratique uma conversa curta (ex.: se apresentar ou responder a uma pergunta comum) em voz alta, focando em clareza e entonação.'
            ]
        }
    ];

    const activitiesGrid = document.getElementById('activities-grid');
    activities.forEach(activity => {
        const card = document.createElement('div');
        card.className = 'activity-card';
        card.id = `card-${activity.id}`;
        card.innerHTML = `
            <div class="card-header">
                <h2>${activity.title}</h2>
                <input type="checkbox" id="${activity.id}" class="task-checkbox">
            </div>
            <div class="card-content">
                <p><strong>Tempo:</strong> ${activity.time}</p>
                <ul>
                    ${activity.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            <div class="notes-section">
                <h3>Anotações:</h3>
                <textarea id="note-${activity.id}" placeholder="Digite suas anotações aqui..." readonly></textarea>
                <div class="note-actions">
                    <button class="note-btn edit" id="edit-btn-${activity.id}">Editar</button>
                    <button class="note-btn save" id="save-btn-${activity.id}" style="display:none;">Salvar</button>
                </div>
            </div>
        `;
        activitiesGrid.appendChild(card);
    });

    const themeToggle = document.getElementById('theme-toggle');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.getElementById('progress-text');
    const checkboxes = document.querySelectorAll('.task-checkbox');
    const resetBtn = document.getElementById('reset-btn');

    const updateProgress = () => {
        const completedTasks = document.querySelectorAll('.task-checkbox:checked').length;
        const totalTasks = checkboxes.length;
        const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${Math.round(percentage)}% Concluído`;
    };

    const saveState = () => {
        checkboxes.forEach(checkbox => {
            localStorage.setItem(`check-${checkbox.id}`, checkbox.checked);
        });
    };

    const loadState = () => {
        checkboxes.forEach(checkbox => {
            checkbox.checked = localStorage.getItem(`check-${checkbox.id}`) === 'true';
            const card = document.getElementById(`card-${checkbox.id}`);
            if (checkbox.checked) {
                card.classList.add('completed');
            }
        });

        activities.forEach(activity => {
            const note = localStorage.getItem(`note-${activity.id}`);
            if (note) {
                document.getElementById(`note-${activity.id}`).value = note;
            }
        });

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        updateProgress();
    };

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const card = document.getElementById(`card-${checkbox.id}`);
            card.classList.toggle('completed', checkbox.checked);
            saveState();
            updateProgress();
        });
    });

    activities.forEach(activity => {
        const editBtn = document.getElementById(`edit-btn-${activity.id}`);
        const saveBtn = document.getElementById(`save-btn-${activity.id}`);
        const noteArea = document.getElementById(`note-${activity.id}`);

        editBtn.addEventListener('click', () => {
            noteArea.readOnly = false;
            noteArea.focus();
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
        });

        saveBtn.addEventListener('click', () => {
            noteArea.readOnly = true;
            localStorage.setItem(`note-${activity.id}`, noteArea.value);
            editBtn.style.display = 'inline-block';
            saveBtn.style.display = 'none';
        });
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Você tem certeza que deseja resetar todo o progresso?')) {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
                document.getElementById(`card-${checkbox.id}`).classList.remove('completed');
            });
            activities.forEach(activity => {
                document.getElementById(`note-${activity.id}`).value = '';
                localStorage.removeItem(`note-${activity.id}`);
            });
            saveState();
            updateProgress();
        }
    });

    loadState();
});
