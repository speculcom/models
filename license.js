(function () {
  const grid = document.getElementById('license-grid');
  if (!grid) return;
  const search = document.getElementById('lic-search');
  const usage = document.getElementById('lic-usage');
  const type = document.getElementById('lic-type');
  const strict = document.getElementById('lic-strict');
  const count = document.getElementById('lic-count');
  const cards = Array.from(grid.querySelectorAll('.license-card'));
  const total = cards.length;

  function apply() {
    const q = (search.value || '').trim().toLowerCase();
    const u = usage.value;
    const t = type.value;
    const onlyYes = strict.checked;
    let shown = 0;
    cards.forEach((card) => {
      const commercial = card.dataset.commercial;
      const attribution = card.dataset.attribution;
      let ok = true;
      if (q && !card.dataset.text.includes(q)) ok = false;
      if (t !== 'all' && card.dataset.type !== t) ok = false;
      if (onlyYes && commercial !== 'yes') ok = false;
      if (u === 'internal' && commercial === 'no') ok = false;
      if (u === 'client' && commercial !== 'yes') ok = false;
      if (u === 'redistribute' && !(commercial === 'yes' && attribution === 'yes')) ok = false;
      if (u === 'saas' && commercial !== 'yes') ok = false;
      card.hidden = !ok;
      if (ok) shown++;
    });
    const usageNote = {
      any: '未知的许可保留在结果里并标“需确认”，不替你删掉。',
      internal: '内部使用仍要看数据留存与训练条款；商用允许不等于可以上传客户数据。',
      client: '交付客户要再看再分发、责任限制与输出归属；这里只按“明确允许商用”初筛。',
      redistribute: '再分发要求商用允许 + 署名；AGPL 还要承担开源义务，不能只看“可商用”。',
      saas: 'SaaS 对外服务还要看 MAU 门槛、备案、内容标识与安全评估；许可允许不等于境内合规。'
    }[u] || '';
    count.textContent = '显示 ' + shown + ' / ' + total + ' 条。' + usageNote;
  }

  [search, usage, type, strict].forEach((el) => el.addEventListener('input', apply));
  [usage, type, strict].forEach((el) => el.addEventListener('change', apply));
  apply();
})();
