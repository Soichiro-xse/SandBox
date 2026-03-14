// ぽこポケ攻略ツールズ - メインアプリケーション
(function() {
  'use strict';

  // ============================
  // ポケモン名 → 図鑑番号 対応表
  // ============================
  const POKEMON_IDS = {
    'フシギダネ':1,'フシギソウ':2,'フシギバナ':3,'ヒトカゲ':4,'リザード':5,'リザードン':6,
    'ゼニガメ':7,'カメール':8,'カメックス':9,'キャタピー':10,'トランセル':11,'バタフリー':12,
    'ビードル':13,'コクーン':14,'スピアー':15,'ポッポ':16,'ピジョン':17,'ピジョット':18,
    'コラッタ':19,'ラッタ':20,'オニスズメ':21,'オニドリル':22,'アーボ':23,'アーボック':24,
    'ピカチュウ':25,'ライチュウ':26,'サンド':27,'サンドパン':28,'ニドラン♀':29,'ニドリーナ':30,
    'ニドクイン':31,'ニドラン♂':32,'ニドリーノ':33,'ニドキング':34,'ピッピ':35,'ピクシー':36,
    'ロコン':37,'キュウコン':38,'プリン':39,'プクリン':40,'ズバット':41,'ゴルバット':42,
    'ナゾノクサ':43,'クサイハナ':44,'ラフレシア':45,'パラス':46,'パラセクト':47,
    'コンパン':48,'モルフォン':49,'ディグダ':50,'ダグトリオ':51,'ニャース':52,'ペルシアン':53,
    'コダック':54,'ゴルダック':55,'マンキー':56,'オコリザル':57,'ガーディ':58,'ウインディ':59,
    'ニョロモ':60,'ニョロゾ':61,'ニョロボン':62,'ワンリキー':66,'ゴーリキー':67,'カイリキー':68,
    'マダツボミ':69,'ウツドン':70,'ウツボット':71,'メノクラゲ':72,'ドククラゲ':73,
    'イシツブテ':74,'ゴローン':75,'ゴローニャ':76,'ポニータ':77,'ギャロップ':78,
    'ヤドン':79,'ヤドラン':80,'コイル':81,'レアコイル':82,'カモネギ':83,
    'ドードー':84,'ドードリオ':85,'パウワウ':86,'ジュゴン':87,'ベトベター':88,'ベトベトン':89,
    'シェルダー':90,'パルシェン':91,'ゴース':92,'ゴースト':93,'ゲンガー':94,
    'イワーク':95,'スリープ':96,'スリーパー':97,'クラブ':98,'キングラー':99,
    'ビリリダマ':100,'マルマイン':101,'タマタマ':102,'ナッシー':103,
    'カラカラ':104,'ガラガラ':105,'サワムラー':106,'エビワラー':107,'ベロリンガ':108,
    'ドガース':109,'マタドガス':110,'サイホーン':111,'サイドン':112,
    'ラッキー':113,'タウロス':128,'マグマラシ':155,
    'ケーシィ':63,'ユンゲラー':64,'フーディン':65,
    'ストライク':123,'ルージュラ':124,'エレブー':125,'ブーバー':126,'カイロス':127,
    'カイリュー':149,'ミニリュウ':147,'ハクリュー':148,
    'ミュウツー':150,'ミュウ':151,
    'チコリータ':152,'ベイリーフ':153,'メガニウム':154,'ヒノアラシ':155,'マグマラシ':156,'バクフーン':157,
    'ワニノコ':158,'アリゲイツ':159,'オーダイル':160,
    'ホーホー':163,'ヨルノズク':164,'レディバ':165,'レディアン':166,
    'イトマル':167,'アリアドス':168,'クロバット':169,
    'チョンチー':170,'ランターン':171,'ピチュー':172,'ピィ':173,'ププリン':174,'トゲピー':175,
    'トゲチック':176,'ネイティ':177,'ネイティオ':178,'メリープ':179,'モコモ':180,'デンリュウ':181,
    'マリル':183,'マリルリ':184,'ウソッキー':185,'ニョロトノ':186,
    'エーフィ':196,'ブラッキー':197,
    'キリンリキ':203,'ノコッチ':206,
    'マグニチュード':207,'ヘラクロス':214,'ニューラ':215,'ヨーギラス':246,'サナギラス':247,'バンギラス':248,
    'マグカルゴ':219,'ウリムー':220,'イノムー':221,'ブーピッグ':221,
    'サニーゴ':222,'テッポウオ':223,'オクタン':224,
    'ハサミボー':214,'クヌギダマ':213,'フォレトス':205,
    'ドーブル':235,
    'ルンパッパ':272,'ハスブレロ':271,'ハスボー':270,
    'タネボー':273,'コノハナ':274,'ダーテング':275,
    'ポチエナ':261,'グラエナ':262,'ジグザグマ':263,'マッスグマ':264,
    'アチャモ':255,'ワカシャモ':256,'バシャーモ':257,
    'ミズゴロウ':258,'ヌマクロー':259,'ラグラージ':260,
    'キモリ':252,'ジュプトル':253,'ジュカイン':254,
    'ラルトス':280,'キルリア':281,'サーナイト':282,'エルレイド':475,
    'ナックラー':328,'ビブラーバ':329,'フライゴン':330,
    'サボネア':331,'ノクタス':332,'チルット':333,'チルタリス':334,
    'コータス':324,'バネブー':293,'ドゴーム':294,'バクオング':295,
    'マクノシタ':296,'ハリテヤマ':297,'ルリリ':298,
    'ミズゴロウ':258,
    'ヨマワル':353,'サマヨール':354,'ジュペッタ':354,
    'キバニア':318,'サメハダー':319,
    'ヌメラ':704,'ヌメイル':705,'ヌメルゴン':706,
    'ミツハニー':415,'ビークイン':416,'ハチィーモ':416,
    'ゴンベ':446,'リオル':447,'ルカリオ':448,
    'イーブイ':133,'シャワーズ':134,'サンダース':135,'ブースター':136,
    'エーフィ':196,'ブラッキー':197,'リーフィア':470,'グレイシア':471,'ニンフィア':700,
    'ペラップ':441,
    'キャモメ':278,'ペリッパー':279,
    'ラプラス':131,
    'ゾロア':570,'ゾロアーク':571,
    'チラーミィ':572,'チラチーノ':573,
    'モグリュー':529,'ドリュウズ':530,
    'ドッコラー':532,'ドテッコツ':533,'ローブシン':534,
    'ポッチャマ':393,'ポッタイシ':394,'エンペルト':395,
    'ナエトル':387,'ハヤシガメ':388,'ドダイトス':389,
    'ヒコザル':390,'モウカザル':391,'ゴウカザル':392,
    'キバゴ':610,'オノンド':611,'オノノクス':612,
    'ハッサム':212,
    'ウッウ':845,
    'ヒバニー':813,'ラビフット':814,'エースバーン':815,
    'タンドン':840,'トロッゴン':841,'セキタンザン':842,
    'ホシガリス':819,'ヨクバリス':820,
    'パピモッチ':761,'アマカジ':761,
    'ドラメシヤ':885,'ドロンチ':886,'ドラパルト':887,
    'ニャオハ':906,'ニャローテ':907,'マスカーニャ':908,
    'パモ':921,'パモット':922,'パーモット':923,
    'カイデン':923,
    'ガチゴラス':697,'チゴラス':696,
    'ライコウ':243,'エンテイ':244,'スイクン':245,
    'ボルケニオン':721,
    'ヤブクロン':568,'ダストダス':569,
    'メタング':375,'メタグロス':376,'ベルダム':374,
    'ツタージャ':495,'ジャノビー':496,'ジャローダ':497,
    'メラルバ':636,'ウルガモス':637,
    'ヒトモシ':607,'ランプラー':608,'シャンデラ':609,
    'トリデプス':598,'ナットレイ':597,
    'フクスロー':629,
    'ゲッコウガ':658,'ケロマツ':656,'ゲコガシラ':657,
    'ハリマロン':650,'ハリボーグ':651,'ブリガロン':652,
    'フォッコ':653,'テールナー':654,'マフォクシー':655,
    'ウインク':658,
    'ヤンチャム':674,'ゴロンダ':675,
    'カルボウ':851,
    'アゴジムシ':632,'ハハコモリ':591,
    'バリヤード':122,
    'カヌチャン':948,'テツノカイナ':992,
    'キラーメ':950,'グレンアルマ':952,
  };

  // ポケモン名からスプライトURL取得
  function getSpriteUrl(name) {
    const id = POKEMON_IDS[name];
    if (!id) return null;
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + id + '.png';
  }

  // ============================
  // スプライトスクロールバナー
  // ============================
  (function initSpriteBanner() {
    const banner = document.getElementById('spriteBanner');
    if (!banner) return;
    // ゲームに登場するポケモンからピックアップ
    const featured = [
      25,4,7,1,133,123,127,214,184,658,447,131,149,175,571,
      255,393,495,813,921,607,636,532,529,179,415,278,83,54,79
    ];
    // 2周分で無限スクロール
    const all = [...featured, ...featured];
    banner.innerHTML = all.map(id =>
      `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" alt="" loading="lazy">`
    ).join('');
  })();

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
      <div class="skill-card">
        <h4>
          <span class="tag tag-skill">${escHtml(r.skill)}</span>
          <span style="font-size:0.82rem;font-weight:400;color:var(--text-sub);">${escHtml(r.data.description)}</span>
        </h4>
        <div class="pokemon-list">
          ${r.matchingPokemon.map(p => {
            const url = getSpriteUrl(p);
            const img = url ? `<img src="${url}" alt="" loading="lazy">` : '';
            return `<span class="pokemon-chip">${img}${escHtml(p)}</span>`;
          }).join('')}
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
              <span>${r.pokemon.map(p => {
                const url = getSpriteUrl(p);
                const img = url ? `<img src="${url}" alt="" loading="lazy" style="width:24px;height:24px;image-rendering:pixelated;">` : '';
                return `<span class="pokemon-chip" style="font-size:0.8rem;padding:3px 8px 3px 4px;">${img}${escHtml(p)}</span>`;
              }).join(' ')}</span>
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

  // ============================
  // 8. せいそくち図鑑
  // ============================
  const AREA_COLORS = {
    "パサパサこうやの街":   { bg: "#FFF3E0", border: "#FF9800", text: "#E65100", icon: "🏜️" },
    "ゴツゴツやまの街":     { bg: "#F3E5F5", border: "#9C27B0", text: "#6A1B9A", icon: "⛰️" },
    "ドンヨリうみべの街":   { bg: "#E3F2FD", border: "#2196F3", text: "#0D47A1", icon: "🌊" },
    "キラキラうきしまの街": { bg: "#F9FBE7", border: "#CDDC39", text: "#827717", icon: "✨" },
    "まっさらな街":         { bg: "#FCE4EC", border: "#E91E63", text: "#880E4F", icon: "🏠" },
  };
  const METHOD_COLORS = {
    "ストーリー":   { bg: "#E8EAF6", color: "#3F51B5", icon: "📖" },
    "おねがいごと": { bg: "#FFF8E1", color: "#F57F17", icon: "⭐" },
    "フィールド":   { bg: "#E8F5E9", color: "#2E7D32", icon: "🚶" },
    "夜のみ":       { bg: "#212121", color: "#90CAF9", icon: "🌙" },
    "レア/特別":    { bg: "#FCE4EC", color: "#C62828", icon: "👑" },
  };
  const RARITY_COLOR = { "★":"#AAB","★★":"#4CAF50","★★★":"#FF9800","★★★★":"#E91E63" };

  let habitatArea   = '';
  let habitatMethod = '';
  let habitatQuery  = '';

  function renderHabitats() {
    const grid  = document.getElementById('habitatGrid');
    const count = document.getElementById('habitatCount');
    const q = habitatQuery.toLowerCase();

    const results = HABITATS_DATA.filter(p => {
      if (habitatArea   && !p.areas.includes(habitatArea))   return false;
      if (habitatMethod && p.method !== habitatMethod)        return false;
      if (q             && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });

    count.textContent = results.length + '匹表示中（全' + HABITATS_DATA.length + '匹）';

    if (results.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-icon">🔍</div><p>見つかりませんでした</p></div>';
      return;
    }

    grid.innerHTML = results.map(p => {
      const spriteUrl = getSpriteUrl(p.name);
      const spriteHtml = spriteUrl
        ? `<img src="${spriteUrl}" alt="${escHtml(p.name)}" loading="lazy" class="hab-sprite">`
        : `<div class="hab-sprite-placeholder">?</div>`;

      const methodStyle = METHOD_COLORS[p.method] || { bg:'#eee', color:'#333', icon:'•' };
      const rarityColor = RARITY_COLOR[p.rarity] || '#aab';

      const areaBadges = p.areas.map(a => {
        const ac = AREA_COLORS[a] || { bg:'#eee', border:'#aaa', text:'#333', icon:'📍' };
        return `<span class="hab-area-badge" style="background:${ac.bg};border-color:${ac.border};color:${ac.text};">${ac.icon} ${a.replace('の街','')}</span>`;
      }).join('');

      const itemsHtml = p.items.length
        ? `<div class="hab-items">🎁 ${p.items.map(i => `<span class="hab-item">${escHtml(i)}</span>`).join('')}</div>`
        : '';

      return `
        <div class="hab-card" data-method="${escAttr(p.method)}">
          <div class="hab-sprite-wrap">${spriteHtml}</div>
          <div class="hab-info">
            <div class="hab-name">${escHtml(p.name)}
              <span class="hab-rarity" style="color:${rarityColor};">${p.rarity}</span>
            </div>
            <div class="hab-method-badge" style="background:${methodStyle.bg};color:${methodStyle.color};">
              ${methodStyle.icon} ${escHtml(p.method)}
            </div>
            <div class="hab-areas">${areaBadges}</div>
            <div class="hab-detail">${escHtml(p.detail)}</div>
            ${itemsHtml}
          </div>
        </div>`;
    }).join('');
  }

  // エリアフィルター
  document.getElementById('habitatAreaTabs').addEventListener('click', e => {
    const btn = e.target.closest('.hab-area-btn');
    if (!btn) return;
    document.querySelectorAll('.hab-area-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    habitatArea = btn.dataset.area;
    renderHabitats();
  });

  // 出会い方フィルター
  document.getElementById('habitatMethodTabs').addEventListener('click', e => {
    const btn = e.target.closest('.hab-method-btn');
    if (!btn) return;
    document.querySelectorAll('.hab-method-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    habitatMethod = btn.dataset.method;
    renderHabitats();
  });

  // 検索
  document.getElementById('habitatSearchInput').addEventListener('input', e => {
    habitatQuery = e.target.value;
    renderHabitats();
  });

  renderHabitats();

  // ============================
  // 9. ポケモン認識
  // ============================

  // --- シルエットクイズ ---
  (function initSilhouetteQuiz() {
    // スプライトが存在するポケモンのみ対象
    const allPokemon = Object.keys(POKEMON_IDS).filter(name => getSpriteUrl(name));
    let currentPokemon = null;
    let revealed = false;

    function getPokemonSkills(name) {
      return Object.entries(SKILLS_DATA)
        .filter(([, data]) => data.pokemon.includes(name))
        .map(([skill]) => skill);
    }

    function skillBadges(skills) {
      if (!skills.length) return '<span style="color:var(--text-muted)">特技なし</span>';
      return skills.map(s => `<span class="tag tag-skill">${escHtml(s)}</span>`).join(' ');
    }

    function pickRandom() {
      return allPokemon[Math.floor(Math.random() * allPokemon.length)];
    }

    function startQuiz() {
      currentPokemon = pickRandom();
      revealed = false;
      const img = document.getElementById('quizSprite');
      img.src = getSpriteUrl(currentPokemon);
      img.style.filter = 'brightness(0)';
      document.getElementById('quizInput').value = '';
      document.getElementById('quizResult').innerHTML = '';
      document.getElementById('quizRevealBtn').textContent = '答えを見る';
    }

    function showAnswer(correct, guessed) {
      revealed = true;
      document.getElementById('quizSprite').style.filter = '';
      document.getElementById('quizRevealBtn').textContent = '次のポケモン →';
      const skills = getPokemonSkills(currentPokemon);
      let cls, msg;
      if (guessed === undefined) {
        cls = 'reveal'; msg = `&#x1F4A1; 答え: <strong>${escHtml(currentPokemon)}</strong>`;
      } else if (correct) {
        cls = 'correct'; msg = `&#x2713; 正解！ <strong>${escHtml(currentPokemon)}</strong>`;
      } else {
        cls = 'wrong'; msg = `&#x2717; 不正解。正解は <strong>${escHtml(currentPokemon)}</strong>`;
      }
      document.getElementById('quizResult').innerHTML =
        `<div class="quiz-result ${cls}">${msg}<br>特技: ${skillBadges(skills)}</div>`;
    }

    document.getElementById('quizCheckBtn').addEventListener('click', () => {
      if (revealed || !currentPokemon) return;
      const answer = document.getElementById('quizInput').value.trim();
      showAnswer(answer === currentPokemon, answer);
    });

    document.getElementById('quizRevealBtn').addEventListener('click', () => {
      if (!revealed) showAnswer();
      else startQuiz();
    });

    document.getElementById('quizNextBtn').addEventListener('click', startQuiz);

    document.getElementById('quizInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('quizCheckBtn').click();
    });

    startQuiz();
  })();

  // --- 画像から判定 ---
  (function initImageRecognizer() {
    // 色相 → 関連スキル マッピング
    const COLOR_CATEGORIES = [
      { label: '🔥 ほのお系', skills: ['もやす'], hueMin: [0, 330], hueMax: [30, 360] },
      { label: '⚡ でんき系', skills: ['はつでん'], hueMin: [30], hueMax: [70] },
      { label: '🌿 くさ系',   skills: ['さいばい', 'ちらかす'], hueMin: [70], hueMax: [170] },
      { label: '💧 みず系',   skills: ['うるおす'], hueMin: [170], hueMax: [260] },
      { label: '🌸 その他',   skills: ['さがしもの', 'テレポート', 'しわける', 'もりあげる'], hueMin: [260], hueMax: [330] },
    ];

    function rgbToHue(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max === min) return -1;
      const d = max - min;
      const s = max === 0 ? 0 : d / max;
      if (s < 0.25) return -1; // グレー系は除外
      let h;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
        case g: h = ((b - r) / d + 2) * 60; break;
        default: h = ((r - g) / d + 4) * 60;
      }
      return h;
    }

    function getDominantHue(data) {
      const buckets = new Array(36).fill(0);
      let total = 0;
      for (let i = 0; i < data.length; i += 16) {
        const hue = rgbToHue(data[i], data[i + 1], data[i + 2]);
        if (hue < 0) continue;
        buckets[Math.floor(hue / 10)]++;
        total++;
      }
      if (!total) return -1;
      return buckets.indexOf(Math.max(...buckets)) * 10 + 5;
    }

    function getCategoryForHue(hue) {
      if (hue < 0) return null;
      for (const cat of COLOR_CATEGORIES) {
        for (let i = 0; i < cat.hueMin.length; i++) {
          if (hue >= cat.hueMin[i] && hue <= cat.hueMax[i]) return cat;
        }
      }
      return COLOR_CATEGORIES[COLOR_CATEGORIES.length - 1];
    }

    function renderRecognizeResult(cat) {
      const el = document.getElementById('recognizeResult');
      if (!cat) {
        el.innerHTML = '<div class="empty-state"><div class="empty-icon">&#x1F504;</div><p>色情報を取得できませんでした。<br>カラーの画像をお試しください。</p></div>';
        return;
      }
      const matchedPokemon = new Set();
      cat.skills.forEach(skill => {
        if (SKILLS_DATA[skill]) SKILLS_DATA[skill].pokemon.forEach(p => matchedPokemon.add(p));
      });
      const chips = [...matchedPokemon].map(name => {
        const url = getSpriteUrl(name);
        const img = url ? `<img src="${url}" alt="" loading="lazy">` : '';
        return `<span class="pokemon-chip">${img}${escHtml(name)}</span>`;
      }).join('');
      el.innerHTML = `
        <div class="skill-card">
          <h4>
            <span style="font-size:1rem;">${escHtml(cat.label)}</span>
            <span style="font-size:0.82rem;font-weight:400;color:var(--text-sub);">
              関連スキル: ${cat.skills.map(s => `<span class="tag tag-skill">${escHtml(s)}</span>`).join(' ')}
            </span>
          </h4>
          <div class="pokemon-list">${chips}</div>
        </div>`;
    }

    function analyzeImage(file) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const cvs = document.createElement('canvas');
          cvs.width = Math.min(img.width, 200);
          cvs.height = Math.min(img.height, 200);
          const ctx = cvs.getContext('2d');
          ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
          const { data } = ctx.getImageData(0, 0, cvs.width, cvs.height);
          const hue = getDominantHue(data);
          document.getElementById('recognizePreview').innerHTML =
            `<img src="${escAttr(e.target.result)}" alt="アップロード画像">`;
          renderRecognizeResult(getCategoryForHue(hue));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    const dropArea = document.getElementById('recognizeDropArea');
    const fileInput = document.getElementById('recognizeFileInput');

    dropArea.addEventListener('click', () => fileInput.click());
    dropArea.addEventListener('dragover', e => { e.preventDefault(); dropArea.classList.add('drag-over'); });
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
    dropArea.addEventListener('drop', e => {
      e.preventDefault();
      dropArea.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) analyzeImage(file);
    });
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) analyzeImage(fileInput.files[0]);
    });
  })();

})();
