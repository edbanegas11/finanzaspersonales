// Estado de la aplicación (Carga datos previos si existen)
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentType = 'income';

// Elementos capturados del DOM
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const form = document.getElementById('form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeButtons = document.querySelectorAll('.type-btn');
const transactionList = document.getElementById('transaction-list');

// Intercambiar tipo de transacción (Ingreso / Gasto)
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.getAttribute('data-type');
  });
});

// Registrar nuevo movimiento
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (description === '' || isNaN(amount) || amount <= 0) return;

  // Creamos el objeto de la transacción
  const transaction = {
    id: Date.now(),
    description,
    // Si es gasto, el valor se almacena como negativo para la matemática directa
    amount: currentType === 'expense' ? -amount : amount,
    type: currentType,
    date: new Date().toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' })
  };

  transactions.push(transaction);
  
  sincronizarApp();
  
  // Limpiar inputs del formulario
  descriptionInput.value = '';
  amountInput.value = '';
});

// Eliminar un registro específico
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  sincronizarApp();
}

// Calcular balances y actualizar interfaz
// Calcular balances y actualizar interfaz en Lempiras
function calcularYRenderizar() {
  transactionList.innerHTML = '';

  let balanceTotal = 0;
  let ingresosTotales = 0;
  let gastosTotales = 0;

  transactions.forEach(t => {
    balanceTotal += t.amount;
    
    if (t.type === 'income') {
      ingresosTotales += t.amount;
    } else {
      gastosTotales += Math.abs(t.amount);
    }

    // Insertar elemento visual en el historial usando 'L'
    const li = document.createElement('li');
    li.className = `transaction-item ${t.type}`;
    li.innerHTML = `
      <div class="item-info">
        <div class="name">${t.description}</div>
        <div class="date">${t.date}</div>
      </div>
      <div class="item-amount ${t.type}">
        ${t.type === 'income' ? '+' : '-'}L ${Math.abs(t.amount).toFixed(2)}
        <button class="btn-delete" onclick="deleteTransaction(${t.id})">&times;</button>
      </div>
    `;
    transactionList.appendChild(li);
  });

  // Mostrar los resultados formateados en Lempiras
  balanceEl.textContent = `${balanceTotal < 0 ? '-' : ''}L ${Math.abs(balanceTotal).toFixed(2)}`;
  
  balanceEl.style.color = balanceTotal < 0 ? 'var(--danger)' : 'var(--text-main)';
  
  totalIncomeEl.textContent = `+L ${ingresosTotales.toFixed(2)}`;
  totalExpensesEl.textContent = `-L ${gastosTotales.toFixed(2)}`;
}

// Guardar en LocalStorage y refrescar pantalla
function sincronizarApp() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  calcularYRenderizar();
}

// Inicialización inicial al cargar el CodePen
calcularYRenderizar();
