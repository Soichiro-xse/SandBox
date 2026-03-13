// ぽこポケ攻略ツールズ - メインアプリケーション
(function() {
  'use strict';

  // ============================
  // タブ切り替え
  // ============================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + tabId).classList.add('active');
    });
  });

  // ============================
  // ローカルストレージ ヘルパー
  // ============================
  function saveData(key, data) {
    localStorage.setItem('pokopoke_' + key, JSON.stringify(data));
  }
  function loadData(key, fallback) {
    try {
      const d = localStorage.getItem('pokopoke_' + key);
      return d ? JSON.parse(d) : fallback;
    } catch { return fallback; }
  }

  // ============================
  // 1. 加工タイマー
  // ============================
  const TIMER_DURATIONS = {
    'ざいもく': 5, 'レンガ': 5, 'かみ': 5, 'てつ': 5,
    'てつののべぼう': 5, 'ガラス': 5, 'コンクリート': 5,
    'ポケメタル': 5, 'デカヌギア': 10, 'えのぐ': 3
  };

  let timers = loadData('timers', []);
  let timerInterval = null;

  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '' });
    }
  }

  function formatCountdown(ms) {
    if (ms <= 0) return '完了!';
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ':' + String(sec).padStart(2, '0');
  }

  function renderTimers() {
    const list = document.getElementById('timerList');
    if (timers.length === 0) {
      list.innerHTML = '<div class="empty-state"><div class="empty-icon">&#x23F1;</div><p>タイマーはまだありません</p></div>';
      return;
    }
    list.innerHTML = timers.map((t, i) => {
      const remaining = t.endTime - Date.now();
      const isExpired = remaining <= 0;
      const endDate = new Date(t.endTime);
      const endStr = endDate.getHours() + ':' + String(endDate.getMinutes()).padStart(2, '0');
      return `
        <div class="timer-card">
          <div class="timer-info">
            <div class="timer-name">${escHtml(t.material)}${t.memo ? ' - ' + escHtml(t.memo) : ''}</div>
            <div class="timer-end">完了予定: ${endStr}</div>
          </div>
          <div class="timer-time ${isExpired ? 'expired' : ''}" data-timer-idx="${i}">
            ${isExpired ? '完了!' : formatCountdown(remaining)}
          </div>
          <button class="btn btn-sm btn-secondary" onclick="removeTimer(${i})">&#x2716;</button>
        </div>
      `;
    }).join('');
  }

  function updateTimers() {
    let anyActive = false;
    timers.forEach((t, i) => {
      const el = document.querySelector(`[data-timer-idx="${i}"]`);
      if (!el) return;
      const remaining = t.endTime - Date.now();
      if (remaining <= 0) {
        if (!t.notified) {
          t.notified = true;
          showNotification('加工完了!', t.material + (t.memo ? ' - ' + t.memo : '') + ' の加工が完了しました!');
          saveData('timers', timers);
        }
        el.textContent = '完了!';
        el.classList.add('expired');
      } else {
        el.textContent = formatCountdown(remaining);
        el.classList.remove('expired');
        anyActive = true;
      }
    });
    if (!anyActive && timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimerLoop() {
    if (timerInterval) return;
    timerInterval = setInterval(updateTimers, 1000);
  }

  document.getElementById('timerStartBtn').addEventListener('click', () => {
    requestNotificationPermission();
    const material = document.getElementById('timerMaterial').value;
    const memo = document.getElementById('timerMemo').value.trim();
    let minutes;
    if (material === 'カスタム') {
      minutes = parseInt(document.getElementById('timerCustomMin').value) || 5;
    } else {
      minutes = TIMER_DURATIONS[material] || 5;
    }
    const timer = {
      material: material === 'カスタム' ? 'カスタム(' + minutes + '分)' : material,
      memo,
      endTime: Date.now() + minutes * 60 * 1000,
      notified: false
    };
    timers.push(timer);
    saveData('timers', timers);
    renderTimers();
    startTimerLoop();
    document.getElementById('timerMemo').value = '';
  });

  window.removeTimer = function(idx) {
    timers.splice(idx, 1);
    saveData('timers', timers);
    renderTimers();
  };

  // 起動時にタイマー復元
  timers = timers.filter(t => t.endTime > Date.now() - 3600000); // 1時間以上前のは除去
  renderTimers();
  if (timers.some(t => t.endTime > Date.now())) startTimerLoop();

  // ============================
  // 2. 素材計算ツール
  // ============================
  const calcSelect = document.getElementById('calcMaterial');
  PROCESSING_CHAINS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    calcSelect.appendChild(opt);
  });

  // 加工チェーン一覧を表示
  function renderChainList() {
    const container = document.getElementById('chainList');
    container.innerHTML = PROCESSING_CHAINS.map(chain => {
      const steps = chain.chain.map(step => `
        <div class="flow-step">
          <div class="flow-node">${escHtml(step.input)}</div>
          <div style="text-align:center">
            <div class="flow-arrow">&#x27A1;</div>
            ${step.skill ? '<div class="flow-skill">' + escHtml(step.skill) + '</div>' : ''}
          </div>
          <div class="flow-node highlight">${escHtml(step.output)}</div>
          <span style="font-size:0.8rem;color:var(--text-muted)">${escHtml(step.ratio)}</span>
        </div>
      `).join('');
      return `
        <div style="margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border)">
          <h3 style="color:var(--accent-light)">${escHtml(chain.name)}</h3>
          ${steps}
          <div class="combo-tips">${escHtml(chain.tips)}</div>
        </div>
      `;
    }).join('');
  }
  renderChainList();

  document.getElementById('calcBtn').addEventListener('click', () => {
    const chainId = calcSelect.value;
    const amount = parseInt(document.getElementById('calcAmount').value) || 1;
    const chain = PROCESSING_CHAINS.find(c => c.id === chainId);
    const resultDiv = document.getElementById('calcResult');
    if (!chain) {
      resultDiv.innerHTML = '<p style="color:var(--accent);margin-top:12px;">素材を選択してください</p>';
      return;
    }
    let html = '<div class="calc-result"><h4>' + escHtml(chain.name) + ' ' + amount + '個に必要なもの</h4>';
    // 逆算ロジック
    let needed = amount;
    const steps = [...chain.chain].reverse();
    const calcLines = [];
    // 最終素材から逆算
    for (const step of steps) {
      // ratio解析
      let inputNeeded = needed;
      if (step.ratio.includes('→')) {
        const match = step.ratio.match(/(\d+)個?→(\d+)個?/);
        if (match) {
          const inCount = parseInt(match[1]);
          const outCount = parseInt(match[2]);
          inputNeeded = Math.ceil(needed / outCount) * inCount;
        }
      }
      calcLines.push({
        label: step.output + '（' + (step.skill || '手動') + '）',
        value: needed + '個',
        time: step.time || '—'
      });
      needed = inputNeeded;
    }
    // 原材料
    const firstStep = chain.chain[0];
    calcLines.push({
      label: '原材料: ' + firstStep.input,
      value: needed + '個必要',
      time: '—'
    });
    calcLines.forEach(line => {
      html += `<div class="calc-line"><span class="label">${escHtml(line.label)}</span><span class="value">${escHtml(line.value)} (${escHtml(line.time)})</span></div>`;
    });
    // 加工回数
    const batchSize = 50;
    const batches = Math.ceil(needed / batchSize);
    const totalTimeMin = chain.chain.reduce((sum, s) => {
      const m = s.time ? parseInt(s.time.replace(/[^0-9]/g, '')) : 5;
      return sum + m;
    }, 0);
    html += `<div style="margin-top:12px;padding-top:8px;border-top:1px solid var(--border)">`;
    html += `<div class="calc-line"><span class="label">加工バッチ数（50個単位）</span><span class="value">${batches}回</span></div>`;
    html += `<div class="calc-line"><span class="label">推定総時間</span><span class="value">約${totalTimeMin * batches}分</span></div>`;
    html += `</div></div>`;
    resultDiv.innerHTML = html;
  });

  // ============================
  // 3. 特技検索
  // ============================
  const skillFilter = document.getElementById('skillFilter');
  Object.keys(SKILLS_DATA).forEach(skill => {
    const opt = document.createElement('option');
    opt.value = skill;
    opt.textContent = skill + '（' + SKILLS_DATA[skill].pokemon.length + '匹）';
    skillFilter.appendChild(opt);
  });

  function renderSkillResults(filter, query) {
    const container = document.getElementById('skillResults');
    let results = [];
    const q = (query || '').toLowerCase();

    Object.entries(SKILLS_DATA).forEach(([skill, data]) => {
      if (filter && skill !== filter) return;
      const matchingPokemon = q
        ? data.pokemon.filter(p => p.toLowerCase().includes(q))
        : data.pokemon;
      const skillMatch = skill.toLowerCase().includes(q);
      if (q && !skillMatch && matchingPokemon.length === 0) return;
      results.push({ skill, data, matchingPokemon: skillMatch ? data.pokemon : matchingPokemon });
    });

    if (results.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>該当なし</p></div>';
      return;
    }

    container.innerHTML = results.map(r => `
      <div style="margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span class="tag tag-skill">${escHtml(r.skill)}</span>
          <span style="color:var(--text-secondary);font-size:0.85rem;">${escHtml(r.data.description)}</span>
        </div>
        <div class="pokemon-list">
          ${r.matchingPokemon.map(p => '<span class="pokemon-chip">' + escHtml(p) + '</span>').join('')}
        </div>
      </div>
    `).join('');
  }

  document.getElementById('skillSearchInput').addEventListener('input', (e) => {
    renderSkillResults(skillFilter.value, e.target.value);
  });
  skillFilter.addEventListener('change', () => {
    renderSkillResults(skillFilter.value, document.getElementById('skillSearchInput').value);
  });
  renderSkillResults('', '');

  // ============================
  // 4. 自動化ライン設計
  // ============================
  function renderAutomation() {
    const container = document.getElementById('automationList');
    container.innerHTML = AUTOMATION_COMBOS.map(combo => `
      <div class="combo-card">
        <h4>${escHtml(combo.name)}</h4>
        <p class="combo-desc">${escHtml(combo.description)}</p>
        <div class="combo-roles">
          ${combo.required.map(r => `
            <div class="combo-role">
              <span class="combo-role-name">${escHtml(r.role)}</span>
              <span>${r.pokemon.map(p => '<span class="pokemon-chip" style="font-size:0.8rem;padding:3px 8px;">' + escHtml(p) + '</span>').join(' ')}</span>
            </div>
          `).join('')}
        </div>
        <div style="font-size:0.85rem;color:var(--info);margin:6px 0;">
          必要設備: <strong>${escHtml(combo.facility)}</strong>
        </div>
        <div class="combo-tips">${escHtml(combo.tips)}</div>
      </div>
    `).join('');
  }
  renderAutomation();

  // ============================
  // 5. おねがいごとチェッカー
  // ============================
  let questProgress = loadData('quests', {});

  function getQuestKey(area, idx) {
    return area + '_' + idx;
  }

  function renderQuests() {
    const container = document.getElementById('questList');
    let totalQuests = 0;
    let completedQuests = 0;

    let html = '';
    Object.entries(QUESTS_DATA).forEach(([area, quests]) => {
      const areaCompleted = quests.filter((_, i) => questProgress[getQuestKey(area, i)]).length;
      totalQuests += quests.length;
      completedQuests += areaCompleted;

      html += `
        <div class="area-section">
          <div class="area-header" onclick="toggleArea(this)">
            <h3>${escHtml(area)} (${areaCompleted}/${quests.length})</h3>
            <span class="area-toggle">&#x25B6;</span>
          </div>
          <div class="area-body" style="display:none;">
            ${quests.map((q, i) => {
              const key = getQuestKey(area, i);
              const done = questProgress[key] || false;
              return `
                <div class="checklist-item ${done ? 'completed' : ''}">
                  <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleQuest('${escAttr(key)}', this.checked)">
                  <div class="checklist-text">
                    <div><strong style="color:var(--accent-light)">${escHtml(q.pokemon)}</strong> - ${escHtml(q.quest)}</div>
                    <div class="checklist-reward">報酬: ${escHtml(q.reward)}</div>
                    ${q.items.length ? '<div style="font-size:0.8rem;color:var(--text-muted)">必要: ' + q.items.map(escHtml).join(', ') + '</div>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });
    container.innerHTML = html;

    // プログレス更新
    const pct = totalQuests > 0 ? Math.round(completedQuests / totalQuests * 100) : 0;
    document.getElementById('questProgressFill').style.width = pct + '%';
    document.getElementById('questProgressText').textContent = completedQuests + ' / ' + totalQuests + ' 完了 (' + pct + '%)';
  }

  window.toggleArea = function(el) {
    const body = el.nextElementSibling;
    const toggle = el.querySelector('.area-toggle');
    if (body.style.display === 'none') {
      body.style.display = 'block';
      toggle.classList.add('open');
    } else {
      body.style.display = 'none';
      toggle.classList.remove('open');
    }
  };

  window.toggleQuest = function(key, checked) {
    questProgress[key] = checked;
    saveData('quests', questProgress);
    renderQuests();
  };

  // メタモンわざテーブル
  function renderMoveTable() {
    const tbody = document.querySelector('#moveTable tbody');
    tbody.innerHTML = METAMON_MOVES.map(m => `
      <tr>
        <td><strong>${escHtml(m.name)}</strong></td>
        <td><span class="pokemon-chip" style="font-size:0.8rem;padding:3px 8px;">${escHtml(m.from)}</span></td>
        <td>${escHtml(m.effect)}</td>
      </tr>
    `).join('');
  }
  renderQuests();
  renderMoveTable();

  // ============================
  // 6. 入団チャレンジ
  // ============================
  let challengeProgress = loadData('challenge', {});

  function renderChallenges() {
    const container = document.getElementById('challengeList');
    const completed = CHALLENGE_DATA.filter((_, i) => challengeProgress['stage_' + i]).length;
    const total = CHALLENGE_DATA.length;
    const pct = Math.round(completed / total * 100);
    document.getElementById('challengeProgressFill').style.width = pct + '%';
    document.getElementById('challengeProgressText').textContent = completed + ' / ' + total + ' 完了 (' + pct + '%)';

    container.innerHTML = CHALLENGE_DATA.map((c, i) => {
      const key = 'stage_' + i;
      const done = challengeProgress[key] || false;
      return `
        <div class="checklist-item ${done ? 'completed' : ''}">
          <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleChallenge('${key}', this.checked)">
          <div class="checklist-text">
            <div><strong style="color:var(--warning)">ステージ${c.stage}</strong> - ${escHtml(c.badge)}</div>
            <div style="font-size:0.85rem;margin-top:4px;">
              納品物: ${c.items.map(item => '<span class="tag tag-skill" style="font-size:0.7rem;">' + escHtml(item) + '</span>').join(' ')}
            </div>
            <div class="combo-tips" style="margin-top:6px;">${escHtml(c.tips)}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  window.toggleChallenge = function(key, checked) {
    challengeProgress[key] = checked;
    saveData('challenge', challengeProgress);
    renderChallenges();
  };
  renderChallenges();

  // ============================
  // 7. 時間操作計算機
  // ============================
  const timeCalcSelect = document.getElementById('timeCalcMaterial');
  PROCESSING_CHAINS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.name;
    timeCalcSelect.appendChild(opt);
  });

  document.getElementById('timeCalcBtn').addEventListener('click', () => {
    const chainId = timeCalcSelect.value;
    const amount = parseInt(document.getElementById('timeCalcAmount').value) || 1;
    const chain = PROCESSING_CHAINS.find(c => c.id === chainId);
    const resultDiv = document.getElementById('timeCalcResult');
    if (!chain) {
      resultDiv.innerHTML = '<p style="color:var(--accent);margin-top:12px;">素材を選択してください</p>';
      return;
    }

    // 1バッチ50個の制限を考慮
    const batchSize = 50;
    const processingTimeMin = chain.chain.reduce((sum, s) => {
      return sum + (s.time ? parseInt(s.time.replace(/[^0-9]/g, '')) : 5);
    }, 0);

    // 最終出力の1バッチあたりの生産量を計算
    let outputPerBatch = batchSize;
    for (const step of chain.chain) {
      if (step.ratio.includes('→')) {
        const match = step.ratio.match(/(\d+)個?→(\d+)個?/);
        if (match) {
          outputPerBatch = Math.floor(outputPerBatch / parseInt(match[1])) * parseInt(match[2]);
        }
      }
    }
    if (outputPerBatch <= 0) outputPerBatch = batchSize;

    const batches = Math.ceil(amount / outputPerBatch);
    const totalMinutes = processingTimeMin * batches;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    // 必要な原材料
    let rawNeeded = amount;
    const reversedChain = [...chain.chain].reverse();
    for (const step of reversedChain) {
      if (step.ratio.includes('→')) {
        const match = step.ratio.match(/(\d+)個?→(\d+)個?/);
        if (match) {
          rawNeeded = Math.ceil(rawNeeded / parseInt(match[2])) * parseInt(match[1]);
        }
      }
    }

    let html = `<div class="calc-result">
      <h4>${escHtml(chain.name)} ${amount}個の生産計画</h4>
      <div class="calc-line"><span class="label">必要な原材料数</span><span class="value">${rawNeeded}個</span></div>
      <div class="calc-line"><span class="label">加工バッチ数</span><span class="value">${batches}回（1回${outputPerBatch}個産出）</span></div>
      <div class="calc-line"><span class="label">1バッチの加工時間</span><span class="value">約${processingTimeMin}分</span></div>
      <div class="calc-line"><span class="label">通常プレイ総時間</span><span class="value">${hours > 0 ? hours + '時間' : ''}${mins}分</span></div>
      <div style="margin-top:12px;padding-top:8px;border-top:1px solid var(--border)">
        <h4 style="color:var(--warning);">時間操作する場合</h4>
        <div class="calc-line"><span class="label">Switch本体で進める時間</span><span class="value">${hours > 0 ? hours + '時間' : ''}${mins}分</span></div>
        <div class="calc-line"><span class="label">操作回数の目安</span><span class="value">${batches}回（バッチごとに時間を進める）</span></div>
        <p style="font-size:0.8rem;color:var(--text-muted);margin-top:8px;">
          ※ 1バッチ加工開始 → 時間を${processingTimeMin}分進める → 回収 → 次のバッチ を繰り返す
        </p>
      </div>
    </div>`;
    resultDiv.innerHTML = html;
  });

  // ============================
  // ユーティリティ
  // ============================
  function escHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  function escAttr(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
  }

})();
