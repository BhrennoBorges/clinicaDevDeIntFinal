document.addEventListener('DOMContentLoaded', function() {
    const formFiltros = document.querySelector('.form-filtros');
    const resultadosSection = document.querySelector('.resultados-section');
    const medicoSelecionadoSpan = document.getElementById('medico-selecionado');
    const selectMedico = document.getElementById('medico');
    const calendarioWrapper = document.getElementById('calendario-wrapper');
    const horariosWrapper = document.getElementById('horarios-wrapper');
    const btnConfirmar = document.querySelector('.confirmar-agendamento button');
    
    let horarioSelecionado = null;
    let diaSelecionado = null;

    formFiltros.addEventListener('submit', function(e) {
        e.preventDefault();
        const medicoNome = selectMedico.options[selectMedico.selectedIndex].text;
        
        if (selectMedico.value) {
            medicoSelecionadoSpan.textContent = medicoNome;
            resultadosSection.style.display = 'block';
            gerarCalendario(new Date().getFullYear(), new Date().getMonth());
        } else {
            alert('Por favor, selecione um médico.');
        }
    });

    function gerarCalendario(ano, mes) {
        const hoje = new Date();
        const primeiroDia = new Date(ano, mes, 1);
        const ultimoDia = new Date(ano, mes + 1, 0);
        const diasNoMes = ultimoDia.getDate();
        
        const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        
        let html = `
            <div class="calendario-nav">
                <button id="prev-mes">&lt;</button>
                <span id="mes-ano">${meses[mes]} de ${ano}</span>
                <button id="next-mes">&gt;</button>
            </div>
            <div class="calendario-grid">
                <div class="dia-semana">D</div><div class="dia-semana">S</div><div class="dia-semana">T</div><div class="dia-semana">Q</div><div class="dia-semana">Q</div><div class="dia-semana">S</div><div class="dia-semana">S</div>
        `;

        for (let i = 0; i < primeiroDia.getDay(); i++) {
            html += `<div class="dia-calendario outro-mes"></div>`;
        }

        for (let dia = 1; dia <= diasNoMes; dia++) {
            let classe = 'dia-calendario';
            if (ano === hoje.getFullYear() && mes === hoje.getMonth() && dia < hoje.getDate()) {
                classe += ' outro-mes';
            }
            html += `<div class="${classe}" data-dia="${dia}">${dia}</div>`;
        }
        
        html += `</div>`;
        calendarioWrapper.innerHTML = html;

        document.getElementById('prev-mes').addEventListener('click', () => gerarCalendario(ano, mes - 1));
        document.getElementById('next-mes').addEventListener('click', () => gerarCalendario(ano, mes + 1));
        document.querySelectorAll('.dia-calendario:not(.outro-mes)').forEach(diaEl => {
            diaEl.addEventListener('click', () => selecionarDia(diaEl, ano, mes));
        });
    }

    function selecionarDia(elementoDia, ano, mes) {
        document.querySelectorAll('.dia-calendario.selecionado').forEach(d => d.classList.remove('selecionado'));
        elementoDia.classList.add('selecionado');
        diaSelecionado = new Date(ano, mes, elementoDia.dataset.dia);
        
        gerarHorarios(diaSelecionado);
    }
    
    function gerarHorarios(data) {
        const diaDaSemana = data.toLocaleDateString('pt-BR', { weekday: 'long' });
        horariosWrapper.innerHTML = `<h3>Horários para ${diaDaSemana}, ${data.toLocaleDateString('pt-BR')}</h3>`;
        
        const container = document.createElement('div');
        container.className = 'horarios-disponiveis';

        const horariosExemplo = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
        horariosExemplo.forEach(hora => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = hora;
            
            if (Math.random() > 0.4) {
                timeSlot.classList.add('disponivel');
                timeSlot.addEventListener('click', () => selecionarHorario(timeSlot));
            } else {
                timeSlot.classList.add('ocupado');
            }
            container.appendChild(timeSlot);
        });
        horariosWrapper.appendChild(container);
    }

    function selecionarHorario(elementoHora) {
        document.querySelectorAll('.time-slot.selecionado').forEach(h => h.classList.remove('selecionado'));
        elementoHora.classList.add('selecionado');
        horarioSelecionado = elementoHora.textContent;
        btnConfirmar.disabled = false;
    }

});
