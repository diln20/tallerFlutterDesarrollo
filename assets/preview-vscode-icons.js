/* Iconos de explorador inspirados en VS Code, sin bibliotecas ni redes externas. */
(function enhanceVSCodeExplorer(){
  'use strict';

  const art = {
    folder:
      '<path fill="#E4A63F" d="M2.5 5.4a2 2 0 0 1 2-2h5l2.2 2.4h7.8a2 2 0 0 1 2 2v10.6a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z"/>' +
      '<path fill="#FFD477" d="M2.5 9h19v9.3a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z"/>',
    folderOpen:
      '<path fill="#DEA544" d="M2.5 5a2 2 0 0 1 2-2h5l2.3 2.5h7.7a2 2 0 0 1 2 2v9.5H2.5Z"/>' +
      '<path fill="#FFD577" d="M4.2 9h17.3c.9 0 1.3.7 1 1.5l-2.7 8.2a2 2 0 0 1-1.9 1.3H3.5a2 2 0 0 1-1.9-2.7l2.1-7.2A1.4 1.4 0 0 1 4.2 9Z"/>',
    dart:
      '<path fill="#00B9B2" d="M5.1 3.2 14.2 2l7.4 7.4v9.2l-4.5 3.3-9.6-.7-5.3-5.3L2.3 7Z"/>' +
      '<path fill="#0175C2" d="M5.1 3.2 2.3 7 7.5 16l9.6 5.9 4.5-3.3L13.5 9Z"/>' +
      '<path fill="#48D1E0" d="m5.1 3.2 8.4 5.8 8.1.4L14.2 2Z"/>' +
      '<path fill="#2A98D3" d="M7.5 16h14.1v2.6l-4.5 3.3Z"/>',
    yaml:
      '<path fill="#9572E9" d="M5 2.5h9.7L20.5 8v12.2A1.8 1.8 0 0 1 18.7 22H5A1.8 1.8 0 0 1 3.2 20.2V4.3A1.8 1.8 0 0 1 5 2.5Z"/>' +
      '<path fill="#D6C6FF" d="M14.5 2.5V8h6Z"/>' +
      '<path d="m7 11 3.2 3.4L13.4 11M10.2 14.4v4.1" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    android:
      '<path fill="#9EDB4B" d="M6 8a6 6 0 0 1 12 0Z"/>' +
      '<rect x="5" y="8" width="14" height="11" rx="2.1" fill="#8DCE39"/>' +
      '<path d="M7 4.1 5.4 2M17 4.1 18.6 2" stroke="#8DCE39" stroke-width="1.5" stroke-linecap="round"/>' +
      '<circle cx="9.2" cy="6.3" r=".9" fill="#173420"/><circle cx="14.8" cy="6.3" r=".9" fill="#173420"/>' +
      '<path d="M8 19v2M16 19v2M3 10v7M21 10v7" stroke="#8DCE39" stroke-width="2" stroke-linecap="round"/>',
    ios:
      '<rect x="6.4" y="1.5" width="11.2" height="21" rx="2.7" fill="#B8CDE0"/>' +
      '<rect x="7.9" y="4.3" width="8.2" height="14.3" rx="1" fill="#386D96"/>' +
      '<path d="M10 2.9h4" stroke="#344C68" stroke-width="1.1" stroke-linecap="round"/>' +
      '<circle cx="12" cy="20.5" r=".9" fill="#44637E"/>',
    web:
      '<circle cx="12" cy="12" r="9" fill="#128EC8"/>' +
      '<path d="M3 12h18M12 3c-5 5.2-5 12.8 0 18M12 3c5 5.2 5 12.8 0 18M5 7.7h14M5 16.3h14" fill="none" stroke="#D5F8FF" stroke-width="1.25" stroke-linecap="round"/>',
    windows:
      '<path fill="#14A9EE" d="m2.2 5.3 9-1.2v7.1h-9Zm10.7-1.4 8.9-1.3v8.6h-8.9ZM2.2 12.8h9v7l-9-1.3Zm10.7 0h8.9v8.6l-8.9-1.3Z"/>',
    linux:
      '<rect x="2" y="4" width="20" height="16" rx="3" fill="#F0BB4C"/>' +
      '<rect x="3.9" y="7" width="16.2" height="11.2" rx="1.2" fill="#2D3546"/>' +
      '<path d="m6.5 10 3.1 2.7-3.1 2.7M11.7 15.5h5.6" fill="none" stroke="#D9EAFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    macos:
      '<rect x="2" y="3" width="20" height="14.8" rx="2.4" fill="#8FACC5"/>' +
      '<rect x="3.8" y="4.7" width="16.4" height="11.3" rx="1" fill="#357BAA"/>' +
      '<path d="M12 17.7v2.7M7.6 21h8.8" stroke="#BCCCDD" stroke-width="2" stroke-linecap="round"/>',
    pages:
      '<rect x="3.4" y="2.2" width="17.2" height="19.6" rx="3" fill="#20A8E7"/>' +
      '<rect x="6.4" y="6.4" width="11.2" height="12.5" rx="1.4" fill="#DAF4FF"/>' +
      '<path d="M9 9h6M9 12h6M9 15h4" stroke="#20A8E7" stroke-width="1.4" stroke-linecap="round"/>',
    widgets:
      '<rect x="2.6" y="2.5" width="8.4" height="8.4" rx="2" fill="#B795F8"/>' +
      '<rect x="13" y="2.5" width="8.4" height="8.4" rx="2" fill="#8062E4"/>' +
      '<rect x="2.6" y="12.8" width="8.4" height="8.4" rx="2" fill="#8062E4"/>' +
      '<rect x="13" y="12.8" width="8.4" height="8.4" rx="2" fill="#B795F8"/>',
    models:
      '<path d="m12 2 9 5v10l-9 5-9-5V7Z" fill="#34C6AD"/>' +
      '<path d="m3 7 9 5 9-5M12 12v10" fill="none" stroke="#ECFFFB" stroke-width="1.6" stroke-linejoin="round"/>',
    services:
      '<path fill="#F3A342" d="M9.7 1.7h4.6l.8 2.7 2 1.1 2.6-.9 2.3 4-2 1.9v2.4l2 1.9-2.3 4-2.6-.9-2 1.1-.8 2.7H9.7l-.8-2.7-2-1.1-2.6.9-2.3-4 2-1.9v-2.4l-2-1.9 2.3-4 2.6.9 2-1.1Z"/>' +
      '<circle cx="12" cy="12" r="3.5" fill="#FFF1D5"/>',
    repositories:
      '<ellipse cx="12" cy="5.4" rx="8.7" ry="3.4" fill="#F58EB7"/>' +
      '<path fill="#D64D87" d="M3.3 5.4v12.7c0 1.9 3.9 3.5 8.7 3.5s8.7-1.6 8.7-3.5V5.4c-.3 1.9-4.1 3.3-8.7 3.3S3.6 7.3 3.3 5.4Z"/>' +
      '<path d="M3.3 12c.3 1.9 4.1 3.4 8.7 3.4s8.4-1.5 8.7-3.4" fill="none" stroke="#FFD7E9" stroke-width="1.5"/>',
    bloc:
      '<path d="m6 6 12 5M6.4 7l2 10M10 17.2l7.6-4.8" stroke="#B3A0FF" stroke-width="2.4" fill="none"/>' +
      '<circle cx="6" cy="6" r="4" fill="#8963F4"/><circle cx="18" cy="11" r="4" fill="#7954D8"/>' +
      '<circle cx="10" cy="18" r="4" fill="#AF91FF"/>',
    github:
      '<circle cx="6" cy="5" r="3" fill="#A6A0ED"/><circle cx="18" cy="18" r="3" fill="#A6A0ED"/><circle cx="6" cy="19" r="3" fill="#A6A0ED"/>' +
      '<path d="M6 8v8M9 5h5a4 4 0 0 1 4 4v6" fill="none" stroke="#D4CFFF" stroke-width="2" stroke-linecap="round"/>',
    build:
      '<path d="m12 2 9 5v10l-9 5-9-5V7Z" fill="#EEA953"/>' +
      '<path d="m3 7 9 5 9-5M12 12v10" fill="none" stroke="#FFF1DB" stroke-width="1.7"/>',
    asset:
      '<rect x="2" y="4" width="20" height="16.5" rx="2.2" fill="#DDAA44"/>' +
      '<circle cx="8.2" cy="9.1" r="2" fill="#FFF0BB"/>' +
      '<path d="m4.7 17.8 4.5-5.3 2.7 2.8 3.5-4 4.4 6.5Z" fill="#F9E6A9"/>',
    test:
      '<path d="M9 2h6M10 2v6l-6 10a2.2 2.2 0 0 0 1.9 3.3h12.2A2.2 2.2 0 0 0 20 18L14 8V2" fill="#4CCAB8" stroke="#CAF9F2" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M7 16h10l2 3H5Z" fill="#BAFFF0"/>',
    markdown:
      '<rect x="3" y="2.5" width="18" height="19" rx="2.5" fill="#377BC5"/>' +
      '<path d="M6.5 16V9l3 3 3-3v7m2-4 2.1 3 2.1-3m-2.1 3v-6" fill="none" stroke="#EBF8FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    file:
      '<path d="M5 2.2h9.7L21 8.5v12.3a1.2 1.2 0 0 1-1.2 1.2H5a2 2 0 0 1-2-2V4.2a2 2 0 0 1 2-2Z" fill="#7495B3"/>' +
      '<path d="M14.7 2.2v6.3H21" fill="#C0D8EE"/>' +
      '<path d="M6.8 12h10M6.8 15h8" stroke="#DAEAF8" stroke-width="1.4" stroke-linecap="round"/>'
  };

  function iconFor(name,isFolder,isOpen){
    const label = String(name).replace(/\/$/,'').trim().toLowerCase();
    if (isFolder) {
      const groups = {
        android:'android',ios:'ios',web:'web',windows:'windows',
        linux:'linux',macos:'macos',pages:'pages',widgets:'widgets',
        models:'models',services:'services',repositories:'repositories',
        bloc:'bloc',build:'build',assets:'asset',test:'test',
        '.github':'github','.dart_tool':'services','.idea':'widgets'
      };
      return groups[label] || (isOpen ? 'folderOpen':'folder');
    }
    if (label.endsWith('.dart')) return 'dart';
    if (label.endsWith('.yaml') || label.endsWith('.yml')) return 'yaml';
    if (label.endsWith('.md')) return 'markdown';
    return 'file';
  }

  function iconMarkup(kind){
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">' +
       (art[kind] || art.file) + '</svg>';
  }

  function makeIcon(kind){
    const wrapper = document.createElement('span');
    wrapper.className = 'pv-vscode-glyph pv-vscode-' + kind;
    wrapper.setAttribute('aria-hidden','true');
    wrapper.innerHTML = iconMarkup(kind);
    return wrapper;
  }

  function upgradeTreeRow(node){
    if (node.dataset.pvVscode === '1') return;
    const raw = (node.firstChild && node.firstChild.nodeType === 3 ?
      node.firstChild.nodeValue : node.textContent || '').trim();
    const parsed = /^([▾▸▤◇▣○])\s*(.*)$/.exec(raw);
    if (!parsed) return;
    const marker = parsed[1], fullName = parsed[2];
    const parts = fullName.split(/\s+·\s+/);
    const name = parts[0].trim();
    const detail = parts.slice(1).join(' · ');
    const selectedStatus = node.querySelector('.pv-ide-selected > span, span')?.textContent?.trim() || '';
    const isRoot = node.classList.contains('pv-tree-root');
    const pending = marker === '○' || node.classList.contains('pv-folder-pending');
    const isFolder = isRoot || marker === '▾' || marker === '▸' || marker === '▣' ||
      node.classList.contains('pv-folder-created') || (marker === '○' && name.endsWith('/'));
    const isOpen = marker === '▾' || isRoot;
    const kind = iconFor(name,isFolder,isOpen);

    const arrow = document.createElement('span');
    arrow.className = 'pv-vscode-arrow';
    arrow.setAttribute('aria-hidden','true');
    arrow.textContent = isFolder ? (isOpen ? '⌄' : '›') : '';

    const labelBox = document.createElement('span');
    labelBox.className = 'pv-vscode-label-box';
    const label = document.createElement('span');
    label.className = 'pv-vscode-label';
    label.textContent = name;
    labelBox.appendChild(label);

    const subtext = selectedStatus || detail;
    if (subtext) {
      const hint = document.createElement('span');
      hint.className = 'pv-vscode-subtext';
      hint.textContent = subtext;
      labelBox.appendChild(hint);
    }

    node.replaceChildren(arrow,makeIcon(kind),labelBox);
    node.classList.add('pv-vscode-entry');
    node.classList.toggle('pv-vscode-pending',pending);
    node.dataset.pvVscode = '1';
  }

  function upgradeTab(tab){
    if (tab.dataset.pvVscode === '1') return;
    const original = (tab.textContent||'').trim();
    const match = /^[▤▣◇]\s*(.+)$/.exec(original);
    if (!match) return;
    const name = match[1];
    const icon = makeIcon(iconFor(name,false,false));
    const label = document.createElement('span');
    label.className = 'pv-vscode-tab-name';
    label.textContent = name;
    tab.replaceChildren(icon,label);
    tab.classList.add('pv-vscode-tab');
    tab.dataset.pvVscode = '1';
  }

  function enhance(){
    const nodes = document.querySelectorAll(
      '.pv-shell .pv-tree-root, .pv-shell .pv-tree-item, .pv-shell .pv-editor-tab > span'
    );
    nodes.forEach((node)=>{
      if(node.classList.contains('pv-editor-tab')) return;
      if(node.classList.contains('pv-tree-root') || node.classList.contains('pv-tree-item')) {
        upgradeTreeRow(node);
      }else{
        upgradeTab(node);
      }
    });
    document.querySelectorAll('.pv-shell .pv-ide-welcome-icon').forEach((node)=>{
      if(node.dataset.pvVscode === '1') return;
      node.replaceChildren(makeIcon('folderOpen'));
      node.dataset.pvVscode = '1';
    });
  }

  document.addEventListener('flutterlab:catalog-code',enhance);
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',enhance,{once:true});
  }else{
    enhance();
  }
})();
