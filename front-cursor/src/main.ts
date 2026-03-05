import './style.css'

type Client = {
  name: string
  cpf_cnpj: string
}

type ClientOption = {
  id: number
  name: string
}

type Equip = {
  id: number
  description: string
  serial_num: string
  mac: string
  ip_local: string
  ip_publico: string
  http_port?: number | string
  rtsp_port?: number | string
  login?: string | null
  password?: string | null
  client: Client
}

type ApiResponse =
  | {
      success: true
      count: number
      data: Equip[]
    }
  | {
      success?: false
      message: string
    }

type AppState = {
  equips: Equip[] | null
  loading: boolean
  error: string | null
  clients: ClientOption[] | null
  clientsLoading: boolean
  clientsError: string | null
}

const state: AppState = {
  equips: null,
  loading: false,
  error: null,
  clients: null,
  clientsLoading: false,
  clientsError: null,
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Elemento raiz #app não encontrado')
}

function getApiBaseUrl() {
  return (
    (import.meta as any).env?.VITE_API_URL?.toString().replace(/\/$/, '') ||
    'http://localhost:3000'
  )
}

async function fetchEquipsIfNeeded() {
  if (state.equips !== null || state.loading) return

  state.loading = true
  state.error = null

  try {
    const response = await fetch(`${getApiBaseUrl()}/equips`)

    if (!response.ok) {
      throw new Error(`Erro ao buscar equipamentos (${response.status})`)
    }

    const data = (await response.json()) as ApiResponse

    if ('data' in data && Array.isArray(data.data)) {
      state.equips = data.data
    } else {
      const message =
        'message' in data && data.message
          ? data.message
          : 'Resposta inesperada da API de equipamentos.'
      state.equips = []
      state.error = message
    }
  } catch (error) {
    console.error(error)
    state.equips = []
    state.error =
      'Não foi possível carregar os equipamentos. Verifique se a API está ativa.'
  } finally {
    state.loading = false
  }
}

type ClientsApiResponse =
  | {
      success: true
      count: number
      data: { id: number; name: string }[]
    }
  | {
      success?: false
      message: string
    }

async function fetchClientsIfNeeded() {
  if (state.clients !== null || state.clientsLoading) return

  state.clientsLoading = true
  state.clientsError = null

  try {
    const response = await fetch(`${getApiBaseUrl()}/clients`)

    if (!response.ok) {
      throw new Error(`Erro ao buscar clientes (${response.status})`)
    }

    const data = (await response.json()) as ClientsApiResponse

    if ('data' in data && Array.isArray(data.data)) {
      state.clients = data.data.map((c) => ({
        id: c.id,
        name: c.name,
      }))
    } else {
      const message =
        'message' in data && data.message
          ? data.message
          : 'Resposta inesperada da API de clientes.'
      state.clients = []
      state.clientsError = message
    }
  } catch (error) {
    console.error(error)
    state.clients = []
    state.clientsError =
      'Não foi possível carregar a lista de clientes. Verifique se a API está ativa.'
  } finally {
    state.clientsLoading = false
  }
}

function renderShell() {
  app!.innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-logo">
          <span class="sidebar-logo-mark">AC</span>
        </div>
        <nav class="sidebar-nav" aria-label="Navegação principal">
          <button class="sidebar-item" data-route="dashboard">
            <span class="sidebar-icon" aria-hidden="true">
              <!-- ícone casa -->
              <span class="icon-shape icon-home"></span>
            </span>
            <span class="sidebar-tooltip">Página inicial</span>
          </button>
          <button class="sidebar-item" data-route="equips">
            <span class="sidebar-icon" aria-hidden="true">
              <!-- ícone tabela -->
              <span class="icon-shape icon-table"></span>
            </span>
            <span class="sidebar-tooltip">Equipamentos</span>
          </button>
        </nav>
      </aside>
      <div class="layout-main">
        <header class="page-header">
          <div>
            <h1 class="title">Central de Equipamentos</h1>
            <p class="subtitle">Visão geral dos dispositivos e clientes vinculados</p>
          </div>
        </header>
        <main id="view-container" class="page-main" tabindex="-1"></main>
      </div>
    </div>
  `

  document.querySelectorAll<HTMLButtonElement>('.sidebar-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.dataset.route
      if (!route) return
      window.location.hash = `#/${route}`
    })
  })
}

function renderDashboardView() {
  const container = document.querySelector<HTMLDivElement>('#view-container')
  if (!container) return

  const equips = state.equips ?? []

  const totalEquips = equips.length

  const clientsCount = new Map<string, number>()
  let withPublicIp = 0
  let withLocalIp = 0

  for (const equip of equips) {
    const clientName = equip.client?.name ?? 'Sem cliente'
    clientsCount.set(clientName, (clientsCount.get(clientName) ?? 0) + 1)

    if (equip.ip_publico) withPublicIp++
    if (equip.ip_local) withLocalIp++
  }

  const topClients = Array.from(clientsCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const maxClientCount = topClients.reduce(
    (max, [, count]) => (count > max ? count : max),
    0,
  )

  container.innerHTML = `
    <section class="card card--dashboard">
      <header class="card-header">
        <div>
          <h2 class="card-title">Visão geral</h2>
          <p class="card-description">
            Indicadores rápidos sobre os equipamentos monitorados.
          </p>
        </div>
      </header>

      <div class="kpi-grid">
        <article class="kpi-card">
          <h3 class="kpi-label">Total de equipamentos</h3>
          <p class="kpi-value">${totalEquips}</p>
          <p class="kpi-helper">
            Quantidade total retornada pela API.
          </p>
        </article>

        <article class="kpi-card">
          <h3 class="kpi-label">Clientes atendidos</h3>
          <p class="kpi-value">${clientsCount.size}</p>
          <p class="kpi-helper">
            Número de clientes com pelo menos um equipamento.
          </p>
        </article>

        <article class="kpi-card">
          <h3 class="kpi-label">IP público x local</h3>
          <div class="kpi-bars">
            <div class="kpi-bar-row">
              <span class="kpi-bar-label">IP público</span>
              <div class="kpi-bar-track">
                <div
                  class="kpi-bar-fill kpi-bar-fill--public"
                  style="width: ${
                    totalEquips > 0 ? (withPublicIp / totalEquips) * 100 : 0
                  }%;"
                ></div>
              </div>
              <span class="kpi-bar-value">${withPublicIp}</span>
            </div>
            <div class="kpi-bar-row">
              <span class="kpi-bar-label">IP local</span>
              <div class="kpi-bar-track">
                <div
                  class="kpi-bar-fill kpi-bar-fill--local"
                  style="width: ${
                    totalEquips > 0 ? (withLocalIp / totalEquips) * 100 : 0
                  }%;"
                ></div>
              </div>
              <span class="kpi-bar-value">${withLocalIp}</span>
            </div>
          </div>
          <p class="kpi-helper">
            Proporção de equipamentos configurados com cada tipo de IP.
          </p>
        </article>
      </div>

      <section class="chart-section">
        <header class="chart-header">
          <div>
            <h3 class="chart-title">Equipamentos por cliente</h3>
            <p class="chart-subtitle">Top clientes com maior número de equipamentos.</p>
          </div>
        </header>
        <div class="chart-body">
          ${
            topClients.length === 0
              ? `<p class="chart-empty">Ainda não há dados suficientes para exibir o gráfico.</p>`
              : `
            <div class="chart-bars">
              ${topClients
                .map(([clientName, count]) => {
                  const height =
                    maxClientCount > 0 ? (count / maxClientCount) * 100 : 0
                  return `
                    <div class="chart-bar-item">
                      <div class="chart-bar" style="height: ${height}%;">
                        <span class="chart-bar-value">${count}</span>
                      </div>
                      <span class="chart-bar-label" title="${clientName}">
                        ${clientName}
                      </span>
                    </div>
                  `
                })
                .join('')}
            </div>
          `
          }
        </div>
      </section>
    </section>
  `
}

function renderEquipsTableView() {
  const container = document.querySelector<HTMLDivElement>('#view-container')
  if (!container) return

  const equips = state.equips ?? []

  container.innerHTML = `
    <section class="card">
      <header class="card-header">
        <div>
          <h2 class="card-title">Equipamentos</h2>
          <p class="card-description">
            Lista dos equipamentos com identificação, rede e cliente associado.
          </p>
        </div>
        <div class="card-header-actions">
          <button type="button" class="button button--primary" id="new-equip-button">
            Novo equipamento
          </button>
          <span class="badge" id="equip-count-badge">0 itens</span>
        </div>
      </header>

      <div id="status" class="status status--loading">
        Carregando equipamentos...
      </div>

      <div class="table-filters">
        <div class="table-filters-grid">
          <div class="form-field form-field--inline">
            <label for="filter-description">Descrição</label>
            <input
              id="filter-description"
              type="text"
              placeholder="Filtrar descrição"
            />
          </div>
          <div class="form-field form-field--inline">
            <label for="filter-serial">Número de série</label>
            <input
              id="filter-serial"
              type="text"
              placeholder="Filtrar número de série"
            />
          </div>
          <div class="form-field form-field--inline">
            <label for="filter-mac">Endereço MAC</label>
            <input
              id="filter-mac"
              type="text"
              placeholder="Filtrar MAC"
            />
          </div>
          <div class="form-field form-field--inline">
            <label for="filter-ip-public">IP público</label>
            <input
              id="filter-ip-public"
              type="text"
              placeholder="Filtrar IP público"
            />
          </div>
          <div class="form-field form-field--inline">
            <label for="filter-ip-local">IP local</label>
            <input
              id="filter-ip-local"
              type="text"
              placeholder="Filtrar IP local"
            />
          </div>
          <div class="form-field form-field--inline">
            <label for="filter-client">Cliente</label>
            <input
              id="filter-client"
              type="text"
              placeholder="Filtrar cliente"
            />
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="table" aria-describedby="table-caption">
          <caption id="table-caption" class="sr-only">
            Tabela de equipamentos com dados de identificação, rede e cliente.
          </caption>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Número de Série</th>
              <th>Endereço MAC</th>
              <th>IP Público</th>
              <th>IP Local</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody id="equip-table-body">
          </tbody>
        </table>
      </div>
    </section>
  `

  const statusEl = document.querySelector<HTMLDivElement>('#status')
  const tbody = document.querySelector<HTMLTableSectionElement>('#equip-table-body')
  const badge = document.querySelector<HTMLSpanElement>('#equip-count-badge')
  const newEquipButton = document.querySelector<HTMLButtonElement>('#new-equip-button')
  const filterDescriptionInput =
    document.querySelector<HTMLInputElement>('#filter-description')
  const filterSerialInput = document.querySelector<HTMLInputElement>('#filter-serial')
  const filterMacInput = document.querySelector<HTMLInputElement>('#filter-mac')
  const filterIpPublicInput =
    document.querySelector<HTMLInputElement>('#filter-ip-public')
  const filterIpLocalInput = document.querySelector<HTMLInputElement>('#filter-ip-local')
  const filterClientInput = document.querySelector<HTMLInputElement>('#filter-client')

  if (
    !statusEl ||
    !tbody ||
    !badge ||
    !newEquipButton
  )
    return

  newEquipButton.addEventListener('click', () => {
    openEquipModal()
  })

  if (state.loading) {
    statusEl.className = 'status status--loading'
    statusEl.textContent = 'Carregando equipamentos...'
    return
  }

  if (state.error) {
    statusEl.className = 'status status--error'
    statusEl.textContent = state.error
    badge.textContent = '—'
    return
  }

  if (equips.length === 0) {
    statusEl.className = 'status status--empty'
    statusEl.textContent = 'Nenhum equipamento cadastrado.'
    badge.textContent = '0 itens'
    return
  }

  const baseEquips = [...equips].sort((a, b) => b.id - a.id)

  const renderFilteredRows = () => {
    const descriptionTerm = (filterDescriptionInput?.value ?? '').trim().toLowerCase()
    const serialTerm = (filterSerialInput?.value ?? '').trim().toLowerCase()
    const macTerm = (filterMacInput?.value ?? '').trim().toLowerCase()
    const ipPublicTerm = (filterIpPublicInput?.value ?? '').trim().toLowerCase()
    const ipLocalTerm = (filterIpLocalInput?.value ?? '').trim().toLowerCase()
    const clientTerm = (filterClientInput?.value ?? '').trim().toLowerCase()

    const hasAnyFilter =
      descriptionTerm ||
      serialTerm ||
      macTerm ||
      ipPublicTerm ||
      ipLocalTerm ||
      clientTerm

    const visibleEquips = hasAnyFilter
      ? baseEquips.filter((equip) => {
          const description = (equip.description ?? '').toLowerCase()
          const serial = (equip.serial_num ?? '').toLowerCase()
          const mac = (equip.mac ?? '').toLowerCase()
          const ipPublic = (equip.ip_publico ?? '').toLowerCase()
          const ipLocal = (equip.ip_local ?? '').toLowerCase()
          const clientName = (equip.client?.name ?? '').toLowerCase()

          if (descriptionTerm && !description.includes(descriptionTerm)) {
            return false
          }
          if (serialTerm && !serial.includes(serialTerm)) {
            return false
          }
          if (macTerm && !mac.includes(macTerm)) {
            return false
          }
          if (ipPublicTerm && !ipPublic.includes(ipPublicTerm)) {
            return false
          }
          if (ipLocalTerm && !ipLocal.includes(ipLocalTerm)) {
            return false
          }
          if (clientTerm && !clientName.includes(clientTerm)) {
            return false
          }

          return true
        })
      : baseEquips

    tbody.innerHTML = ''

    for (const equip of visibleEquips) {
      const tr = document.createElement('tr')

      const clientName = equip.client?.name ?? '-'

      const descriptionText = equip.description ?? '-'
      const detailHref = `#/equip/${equip.id}`

      const publicIp = equip.ip_publico ?? ''
      const localIp = equip.ip_local ?? ''
      const httpPort =
        equip.http_port !== undefined &&
        equip.http_port !== null &&
        String(equip.http_port).trim() !== ''
          ? String(equip.http_port).trim()
          : ''

      const publicDisplay = publicIp
        ? httpPort
          ? `${publicIp}:${httpPort}`
          : publicIp
        : ''

      const localDisplay = localIp
        ? httpPort
          ? `${localIp}:${httpPort}`
          : localIp
        : ''

      const publicIpHref =
        publicDisplay && /^https?:\/\//i.test(publicDisplay)
          ? publicDisplay
          : publicDisplay
          ? `http://${publicDisplay}`
          : ''
      const localIpHref =
        localDisplay && /^https?:\/\//i.test(localDisplay)
          ? localDisplay
          : localDisplay
          ? `http://${localDisplay}`
          : ''

      tr.innerHTML = `
        <td>
          <a href="${detailHref}" class="link-description">
            ${descriptionText}
          </a>
        </td>
        <td>${equip.serial_num ?? '-'}</td>
        <td>${equip.mac ?? '-'}</td>
        <td>
          ${
            publicIpHref
              ? `<a href="${publicIpHref}" target="_blank" rel="noopener noreferrer">${publicDisplay}</a>`
              : '-'
          }
        </td>
        <td>
          ${
            localIpHref
              ? `<a href="${localIpHref}" target="_blank" rel="noopener noreferrer">${localDisplay}</a>`
              : '-'
          }
        </td>
        <td>${clientName}</td>
      `

      tbody.appendChild(tr)
    }

    badge.textContent = `${visibleEquips.length} ${
      visibleEquips.length === 1 ? 'item' : 'itens'
    }`
  }

  renderFilteredRows()

  const filterInputs = [
    filterDescriptionInput,
    filterSerialInput,
    filterMacInput,
    filterIpPublicInput,
    filterIpLocalInput,
    filterClientInput,
  ].filter((input): input is HTMLInputElement => Boolean(input))

  filterInputs.forEach((input) => {
    input.addEventListener('input', () => {
      renderFilteredRows()
    })
  })

  statusEl.className = 'status status--hidden'
  statusEl.textContent = ''
}

function closeEquipModal() {
  const overlay = document.querySelector<HTMLDivElement>('.modal-overlay')
  if (overlay) {
    overlay.remove()
  }
}

function openDeleteConfirmModal(equipId: number) {
  if (document.querySelector('.modal-overlay')) return

  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <header class="modal-header">
        <div>
          <h2 class="modal-title" id="delete-modal-title">Excluir equipamento</h2>
          <p class="modal-subtitle">
            Esta ação não poderá ser desfeita. Confirme para remover o equipamento.
          </p>
        </div>
        <button type="button" class="icon-button" data-delete-cancel aria-label="Fechar confirmação">
          ×
        </button>
      </header>

      <div class="modal-footer">
        <button type="button" class="button button--ghost" data-delete-cancel>
          Cancelar
        </button>
        <button type="button" class="button button--danger" data-delete-confirm>
          Confirmar exclusão
        </button>
      </div>
    </div>
  `

  document.body.appendChild(overlay)

  const cancelButtons = overlay.querySelectorAll<HTMLElement>('[data-delete-cancel]')
  const confirmButton = overlay.querySelector<HTMLButtonElement>('[data-delete-confirm]')

  const close = () => {
    overlay.remove()
  }

  cancelButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      close()
    })
  })

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      close()
    }
  })

  confirmButton?.addEventListener('click', async () => {
    if (!confirmButton) return
    confirmButton.disabled = true
    confirmButton.textContent = 'Excluindo...'

    try {
      const response = await fetch(`${getApiBaseUrl()}/equips/${equipId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        console.error('Falha ao excluir equipamento', await response.text())
        confirmButton.disabled = false
        confirmButton.textContent = 'Confirmar exclusão'
        return
      }

      close()

      state.equips = null
      state.loading = false
      state.error = null
      window.location.hash = '#/equips'
    } catch (error) {
      console.error(error)
      confirmButton.disabled = false
      confirmButton.textContent = 'Confirmar exclusão'
    }
  })
}

async function openEquipModal() {
  if (document.querySelector('.modal-overlay')) return

  await fetchClientsIfNeeded()

  const clients = state.clients ?? []

  const clientsOptionsHtml =
    clients.length > 0
      ? clients
          .map(
            (client) =>
              `<option value="${client.id}">${client.name}</option>`,
          )
          .join('')
      : ''

  const overlay = document.createElement('div')
  overlay.className = 'modal-overlay'
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="equip-modal-title">
      <header class="modal-header">
        <div>
          <h2 class="modal-title" id="equip-modal-title">Novo equipamento</h2>
          <p class="modal-subtitle">
            Preencha os dados principais para cadastrar um novo equipamento.
          </p>
        </div>
        <button type="button" class="icon-button" data-modal-close aria-label="Fechar formulário">
          ×
        </button>
      </header>

      <form class="modal-form" id="equip-form">
        <div class="modal-grid">
          <div class="form-field">
            <label for="equip-description">Descrição</label>
            <input id="equip-description" name="description" type="text" required />
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-serial">Número de série</label>
            <input id="equip-serial" name="serial_num" type="text" required />
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-mac">Endereço MAC</label>
            <input id="equip-mac" name="mac" type="text" />
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-client-id">Cliente</label>
            <select id="equip-client-id" name="client_id" required>
              <option value="" disabled selected>Selecione um cliente</option>
              ${clientsOptionsHtml}
            </select>
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-ip-public">IP público</label>
            <input id="equip-ip-public" name="ip_publico" type="text" required />
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-ip-local">IP local</label>
            <input id="equip-ip-local" name="ip_local" type="text" required />
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-http-port">Porta HTTP</label>
            <input id="equip-http-port" name="http_port" type="number" min="1" max="65535" value="80" required />
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-rtsp-port">Porta RTSP</label>
            <input id="equip-rtsp-port" name="rtsp_port" type="number" min="1" max="65535" value="554" required />
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-login">Login</label>
            <input id="equip-login" name="login" type="text" />
            <div class="field-error"></div>
          </div>

          <div class="form-field">
            <label for="equip-password">Senha</label>
            <input id="equip-password" name="password" type="password" />
            <div class="field-error"></div>
          </div>
        </div>

        <p class="form-hint">
          Os campos de rede são utilizados para gerar automaticamente o link de acesso do equipamento.
        </p>

        <div id="equip-form-error" class="form-error" aria-live="polite"></div>

        <footer class="modal-footer">
          <button type="button" class="button button--ghost" data-modal-cancel>
            Cancelar
          </button>
          <button type="submit" class="button button--primary" id="equip-form-submit">
            Salvar equipamento
          </button>
        </footer>
      </form>
    </div>
  `

  document.body.appendChild(overlay)

  const form = overlay.querySelector<HTMLFormElement>('#equip-form')
  const closeButtons = overlay.querySelectorAll<HTMLElement>('[data-modal-close], [data-modal-cancel]')
  const errorBox = overlay.querySelector<HTMLDivElement>('#equip-form-error')
  const submitButton = overlay.querySelector<HTMLButtonElement>('#equip-form-submit')

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      closeEquipModal()
    })
  })

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeEquipModal()
    }
  })

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!form || !submitButton) return

    form.querySelectorAll('.form-field--error').forEach((el) => {
      el.classList.remove('form-field--error')
    })
    form.querySelectorAll<HTMLDivElement>('.field-error').forEach((el) => {
      el.textContent = ''
    })

    const setFieldError = (fieldName: string, message: string) => {
      const input =
        form.elements.namedItem(fieldName) instanceof HTMLInputElement ||
        form.elements.namedItem(fieldName) instanceof HTMLSelectElement
          ? (form.elements.namedItem(fieldName) as HTMLInputElement | HTMLSelectElement)
          : null

      const fieldWrapper = input?.closest('.form-field')
      if (fieldWrapper) {
        fieldWrapper.classList.add('form-field--error')
        const fieldError = fieldWrapper.querySelector<HTMLDivElement>('.field-error')
        if (fieldError) {
          fieldError.textContent = message
        }
      }
    }

    const description = (form.elements.namedItem('description') as HTMLInputElement).value.trim()
    const serial_num = (form.elements.namedItem('serial_num') as HTMLInputElement).value.trim()
    const mac = (form.elements.namedItem('mac') as HTMLInputElement).value.trim()
    const clientIdRaw = (form.elements.namedItem('client_id') as HTMLSelectElement).value.trim()
    const ip_publico = (form.elements.namedItem('ip_publico') as HTMLInputElement).value.trim()
    const ip_local = (form.elements.namedItem('ip_local') as HTMLInputElement).value.trim()
    const httpPortRaw = (form.elements.namedItem('http_port') as HTMLInputElement).value.trim()
    const rtspPortRaw = (form.elements.namedItem('rtsp_port') as HTMLInputElement).value.trim()
    const login = (form.elements.namedItem('login') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value.trim()

    let hasError = false

    if (!description) {
      setFieldError('description', 'Descrição é obrigatória.')
      hasError = true
    }
    if (!serial_num) {
      setFieldError('serial_num', 'Número de série é obrigatório.')
      hasError = true
    }
    if (!clientIdRaw) {
      setFieldError('client_id', 'Selecione um cliente.')
      hasError = true
    }
    if (!ip_publico) {
      setFieldError('ip_publico', 'IP público é obrigatório.')
      hasError = true
    }
    if (!ip_local) {
      setFieldError('ip_local', 'IP local é obrigatório.')
      hasError = true
    }
    if (!httpPortRaw) {
      setFieldError('http_port', 'Porta HTTP é obrigatória.')
      hasError = true
    }

    if (hasError) {
      if (errorBox) {
        errorBox.textContent = 'Corrija os campos destacados antes de salvar.'
      }
      return
    }

    const client_id = Number(clientIdRaw)
    const http_port = Number(httpPortRaw || '80')
    const rtsp_port = Number(rtspPortRaw || '554')

    const payload = {
      description,
      serial_num,
      mac: mac || null,
      ip_local,
      ip_publico,
      http_port,
      rtsp_port,
      login: login || null,
      password: password || null,
      client_id,
    }

    if (errorBox) {
      errorBox.textContent = ''
    }

    submitButton.disabled = true
    submitButton.textContent = 'Salvando...'

    try {
      const response = await fetch(`${getApiBaseUrl()}/equips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        const msg =
          (data && (data.message || data.error)) ||
          'Não foi possível criar o equipamento. Tente novamente.'
        const backendMessage = typeof msg === 'string' ? msg.toLowerCase() : ''

        if (backendMessage.includes('serial number') && backendMessage.includes('already')) {
          setFieldError('serial_num', 'Número de série já existe.')
        } else if (backendMessage.includes('client not found')) {
          setFieldError('client_id', 'O cliente selecionado não foi encontrado.')
        }

        if (errorBox) {
          errorBox.textContent = msg
        }
        return
      }

      closeEquipModal()

      state.equips = null
      state.loading = false
      state.error = null

      await fetchEquipsIfNeeded()
      renderEquipsTableView()
    } catch (error) {
      console.error(error)
      if (errorBox) {
        errorBox.textContent =
          'Ocorreu um erro inesperado ao salvar. Verifique a API e tente novamente.'
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false
        submitButton.textContent = 'Salvar equipamento'
      }
    }
  })
}

function renderEquipDetailView(equipId: number) {
  const container = document.querySelector<HTMLDivElement>('#view-container')
  if (!container) return

  const equips = state.equips ?? []
  const equip = equips.find((e) => e.id === equipId)

  if (!equip) {
    container.innerHTML = `
      <section class="card">
        <header class="card-header">
          <div>
            <button type="button" class="link-back" id="back-to-equips">
              ← Voltar para a lista de equipamentos
            </button>
            <h2 class="card-title">Equipamento não encontrado</h2>
            <p class="card-description">
              Não foi possível localizar o equipamento solicitado.
            </p>
          </div>
        </header>
      </section>
    `

    const backButton = document.querySelector<HTMLButtonElement>('#back-to-equips')
    backButton?.addEventListener('click', () => {
      window.location.hash = '#/equips'
    })
    return
  }

  const clientName = equip.client?.name ?? '—'

  const publicIp = equip.ip_publico ?? ''
  const localIp = equip.ip_local ?? ''
  const httpPort =
    equip.http_port !== undefined &&
    equip.http_port !== null &&
    String(equip.http_port).trim() !== ''
      ? String(equip.http_port).trim()
      : ''
  const rtspPort =
    equip.rtsp_port !== undefined &&
    equip.rtsp_port !== null &&
    String(equip.rtsp_port).trim() !== ''
      ? String(equip.rtsp_port).trim()
      : ''

  const publicDisplay = publicIp || '—'
  const localDisplay = localIp || '—'

  container.innerHTML = `
    <section class="card">
      <header class="card-header">
        <div>
          <button type="button" class="link-back" id="back-to-equips">
            ← Voltar para a lista de equipamentos
          </button>
          <h2 class="card-title">
            <span class="detail-text" id="equip-header-description">
              ${equip.description ?? '—'}
            </span>
            <span class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit-header">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel-header" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm-header" style="display:none">✓</button>
            </span>
          </h2>
        </div>
        <button type="button" class="button button--ghost button--danger" id="delete-equip-button">
          Excluir equipamento
        </button>
      </header>

      <div id="equip-detail-error" class="form-error" aria-live="polite"></div>

      <div class="detail-grid">
        <div class="detail-field" data-field="serial_num">
          <div class="detail-label">Número de série</div>
          <div class="detail-value">
            <span class="detail-text">${equip.serial_num ?? '—'}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>

        <div class="detail-field" data-field="mac">
          <div class="detail-label">Endereço MAC</div>
          <div class="detail-value">
            <span class="detail-text">${equip.mac ?? '—'}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>

        <div class="detail-field" data-field="ip_publico">
          <div class="detail-label">IP público</div>
          <div class="detail-value">
            <span class="detail-text">${publicDisplay}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>

        <div class="detail-field" data-field="ip_local">
          <div class="detail-label">IP local</div>
          <div class="detail-value">
            <span class="detail-text">${localDisplay}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>

        <div class="detail-field" data-field="http_port">
          <div class="detail-label">Porta HTTP</div>
          <div class="detail-value">
            <span class="detail-text">${httpPort || '—'}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>

        <div class="detail-field" data-field="rtsp_port">
          <div class="detail-label">Porta RTSP</div>
          <div class="detail-value">
            <span class="detail-text">${rtspPort || '—'}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>

        <div class="detail-field" data-field="login">
          <div class="detail-label">Login</div>
          <div class="detail-value">
            <span class="detail-text">${equip.login ?? '—'}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>

        <div class="detail-field" data-field="password">
          <div class="detail-label">Senha</div>
          <div class="detail-value">
            <span class="detail-text">${equip.password ?? '—'}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>

        <div class="detail-field" data-field="client_id">
          <div class="detail-label">Cliente</div>
          <div class="detail-value">
            <span class="detail-text">${clientName}</span>
            <div class="detail-actions">
              <button type="button" class="icon-inline-button" data-role="edit">✎</button>
              <button type="button" class="icon-inline-button" data-role="cancel" style="display:none">✕</button>
              <button type="button" class="icon-inline-button" data-role="confirm" style="display:none">✓</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `

  const backButton = document.querySelector<HTMLButtonElement>('#back-to-equips')
  backButton?.addEventListener('click', () => {
    window.location.hash = '#/equips'
  })

  const errorBox = document.querySelector<HTMLDivElement>('#equip-detail-error')

  const deleteButton = document.querySelector<HTMLButtonElement>('#delete-equip-button')
  deleteButton?.addEventListener('click', () => {
    openDeleteConfirmModal(equipId)
  })

  const applyUpdate = async (payload: Record<string, unknown>) => {
    if (errorBox) {
      errorBox.textContent = ''
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/equip/${equipId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        const msg =
          (data && (data.message || data.error)) ||
          'Não foi possível atualizar o equipamento.'
        if (errorBox) {
          errorBox.textContent = msg
        }
        return false
      }

      Object.assign(equip, payload)
      return true
    } catch (error) {
      console.error(error)
      if (errorBox) {
        errorBox.textContent =
          'Ocorreu um erro inesperado ao atualizar. Verifique a API e tente novamente.'
      }
      return false
    }
  }

  const setupInlineTextEdit = (
    fieldKey: keyof Equip | 'ip_publico' | 'ip_local' | 'http_port' | 'rtsp_port',
  ) => {
    const fieldEl = container.querySelector<HTMLDivElement>(`.detail-field[data-field="${fieldKey}"]`)
    if (!fieldEl) return

    const textEl = fieldEl.querySelector<HTMLSpanElement>('.detail-text')
    const editBtn = fieldEl.querySelector<HTMLButtonElement>('[data-role="edit"]')
    const cancelBtn = fieldEl.querySelector<HTMLButtonElement>('[data-role="cancel"]')
    const confirmBtn = fieldEl.querySelector<HTMLButtonElement>('[data-role="confirm"]')

    if (!textEl || !editBtn || !cancelBtn || !confirmBtn) return

    let originalValue = textEl.textContent ?? ''

    let inputEl: HTMLInputElement | null = null

    const enterEditMode = () => {
      if (!inputEl) {
        inputEl = document.createElement('input')
        inputEl.type =
          fieldKey === 'http_port' || fieldKey === 'rtsp_port' ? 'number' : 'text'
        inputEl.className = 'detail-input'
        inputEl.value = originalValue === '—' ? '' : originalValue
        textEl.parentElement?.insertBefore(inputEl, textEl)
      }

      textEl.style.display = 'none'
      inputEl.style.display = ''
      editBtn.style.display = 'none'
      cancelBtn.style.display = ''
      confirmBtn.style.display = ''
      inputEl.focus()
    }

    const exitEditMode = (reset: boolean) => {
      if (reset && inputEl) {
        inputEl.value = originalValue === '—' ? '' : originalValue
      }

      textEl.style.display = ''
      if (inputEl) {
        inputEl.style.display = 'none'
      }
      editBtn.style.display = ''
      cancelBtn.style.display = 'none'
      confirmBtn.style.display = 'none'
    }

    editBtn.addEventListener('click', () => {
      enterEditMode()
    })

    cancelBtn.addEventListener('click', () => {
      exitEditMode(true)
    })

    confirmBtn.addEventListener('click', async () => {
      if (!inputEl) return
      const newValueRaw = inputEl.value.trim()

      if (newValueRaw === (originalValue === '—' ? '' : originalValue)) {
        exitEditMode(false)
        return
      }

      const payload: Record<string, unknown> = {}
      if (fieldKey === 'http_port' || fieldKey === 'rtsp_port') {
        payload[fieldKey] = newValueRaw ? Number(newValueRaw) : null
      } else {
        payload[fieldKey] = newValueRaw || null
      }

      const ok = await applyUpdate(payload)
      if (!ok) return

      originalValue = newValueRaw || '—'
      textEl.textContent = originalValue
      exitEditMode(false)
    })
  }

  setupInlineTextEdit('serial_num')
  setupInlineTextEdit('mac')
  setupInlineTextEdit('ip_publico')
  setupInlineTextEdit('ip_local')
  setupInlineTextEdit('http_port')
  setupInlineTextEdit('rtsp_port')

  const setupClientEdit = () => {
    const fieldEl = container.querySelector<HTMLDivElement>('.detail-field[data-field="client_id"]')
    if (!fieldEl) return

    const textEl = fieldEl.querySelector<HTMLSpanElement>('.detail-text')
    const editBtn = fieldEl.querySelector<HTMLButtonElement>('[data-role="edit"]')
    const cancelBtn = fieldEl.querySelector<HTMLButtonElement>('[data-role="cancel"]')
    const confirmBtn = fieldEl.querySelector<HTMLButtonElement>('[data-role="confirm"]')

    if (!textEl || !editBtn || !cancelBtn || !confirmBtn) return

    const clients = state.clients ?? []

    let originalClientName = textEl.textContent ?? ''
    let selectEl: HTMLSelectElement | null = null

    const enterEditMode = () => {
      if (!selectEl) {
        selectEl = document.createElement('select')
        selectEl.className = 'detail-select'

        const placeholder = document.createElement('option')
        placeholder.value = ''
        placeholder.disabled = true
        placeholder.textContent = 'Selecione um cliente'
        selectEl.appendChild(placeholder)

        for (const client of clients) {
          const opt = document.createElement('option')
          opt.value = String(client.id)
          opt.textContent = client.name
          if (client.name === originalClientName) {
            opt.selected = true
            selectEl.value = String(client.id)
          }
          selectEl.appendChild(opt)
        }

        textEl.parentElement?.insertBefore(selectEl, textEl)
      }

      textEl.style.display = 'none'
      selectEl.style.display = ''
      editBtn.style.display = 'none'
      cancelBtn.style.display = ''
      confirmBtn.style.display = ''
      selectEl.focus()
    }

    const exitEditMode = (reset: boolean) => {
      if (reset && selectEl) {
        const clients = state.clients ?? []
        const matching = clients.find((c) => c.name === originalClientName)
        selectEl.value = matching ? String(matching.id) : ''
      }

      textEl.style.display = ''
      if (selectEl) {
        selectEl.style.display = 'none'
      }
      editBtn.style.display = ''
      cancelBtn.style.display = 'none'
      confirmBtn.style.display = 'none'
    }

    editBtn.addEventListener('click', () => {
      enterEditMode()
    })

    cancelBtn.addEventListener('click', () => {
      exitEditMode(true)
    })

    confirmBtn.addEventListener('click', async () => {
      if (!selectEl) return
      const selectedId = selectEl.value
      if (!selectedId) {
        if (errorBox) {
          errorBox.textContent = 'Selecione um cliente para continuar.'
        }
        return
      }

      const client = (state.clients ?? []).find((c) => String(c.id) === selectedId)
      const newName = client?.name ?? ''

      if (!newName || newName === originalClientName) {
        exitEditMode(false)
        return
      }

      const payload: Record<string, unknown> = {
        client_id: Number(selectedId),
      }

      const ok = await applyUpdate(payload)
      if (!ok) return

      originalClientName = newName
      textEl.textContent = newName

      if (equip.client) {
        equip.client.name = newName
      }

      exitEditMode(false)
    })
  }

  setupClientEdit()

  const setupHeaderDescriptionEdit = () => {
    const textEl =
      container.querySelector<HTMLSpanElement>('#equip-header-description')
    const editBtn = container.querySelector<HTMLButtonElement>('[data-role="edit-header"]')
    const cancelBtn =
      container.querySelector<HTMLButtonElement>('[data-role="cancel-header"]')
    const confirmBtn =
      container.querySelector<HTMLButtonElement>('[data-role="confirm-header"]')

    if (!textEl || !editBtn || !cancelBtn || !confirmBtn) return

    let originalValue = textEl.textContent?.trim() || ''
    let inputEl: HTMLInputElement | null = null

    const enterEditMode = () => {
      if (!inputEl) {
        inputEl = document.createElement('input')
        inputEl.type = 'text'
        inputEl.className = 'detail-input'
        inputEl.value = originalValue || ''
        textEl.parentElement?.insertBefore(inputEl, textEl)
      }

      textEl.style.display = 'none'
      inputEl.style.display = ''
      editBtn.style.display = 'none'
      cancelBtn.style.display = ''
      confirmBtn.style.display = ''
      inputEl.focus()
    }

    const exitEditMode = (reset: boolean) => {
      if (reset && inputEl) {
        inputEl.value = originalValue
      }

      textEl.style.display = ''
      if (inputEl) {
        inputEl.style.display = 'none'
      }
      editBtn.style.display = ''
      cancelBtn.style.display = 'none'
      confirmBtn.style.display = 'none'
    }

    editBtn.addEventListener('click', () => {
      enterEditMode()
    })

    cancelBtn.addEventListener('click', () => {
      exitEditMode(true)
    })

    confirmBtn.addEventListener('click', async () => {
      if (!inputEl) return
      const newValueRaw = inputEl.value.trim()

      if (newValueRaw === originalValue) {
        exitEditMode(false)
        return
      }

      const payload: Record<string, unknown> = {
        description: newValueRaw || null,
      }

      const ok = await applyUpdate(payload)
      if (!ok) return

      originalValue = newValueRaw
      textEl.textContent = originalValue || '—'
      equip.description = originalValue
      exitEditMode(false)
    })
  }

  setupHeaderDescriptionEdit()
}

async function renderCurrentRoute() {
  const hash = window.location.hash || '#/dashboard'
  const route = hash.replace(/^#\//, '') || 'dashboard'

  await Promise.all([fetchEquipsIfNeeded(), fetchClientsIfNeeded()])

  const [baseRoute, param] = route.split('/')

  if (baseRoute === 'equips') {
    renderEquipsTableView()
  } else if (baseRoute === 'equip' && param) {
    const equipId = Number(param)
    if (!Number.isNaN(equipId)) {
      renderEquipDetailView(equipId)
    } else {
      renderDashboardView()
    }
  } else {
    renderDashboardView()
  }

  const activeRouteForSidebar =
    baseRoute === 'equip' ? 'equips' : baseRoute || 'dashboard'

  const titleEl = document.querySelector<HTMLHeadingElement>('.title')
  const subtitleEl = document.querySelector<HTMLParagraphElement>('.subtitle')

  if (baseRoute === 'equip') {
    if (titleEl) titleEl.textContent = ''
    if (subtitleEl) subtitleEl.textContent = ''
  } else {
    if (titleEl) titleEl.textContent = 'Central de Equipamentos'
    if (subtitleEl)
      subtitleEl.textContent = 'Visão geral dos dispositivos e clientes vinculados'
  }

  document
    .querySelectorAll<HTMLButtonElement>('.sidebar-item')
    .forEach((btn) => {
      const isActive = btn.dataset.route === activeRouteForSidebar
      btn.classList.toggle('sidebar-item--active', isActive)
    })
}

function initRouter() {
  window.addEventListener('hashchange', () => {
    renderCurrentRoute()
  })
}

renderShell()
initRouter()
renderCurrentRoute()
