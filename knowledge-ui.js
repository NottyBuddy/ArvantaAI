(async function(){
  const targets = {
    scripts: d => ["Final Pre-Sales Call Script","Updated Call Script"].includes(d.title) && !["Pricing rules"].includes(d.section),
    faqs: d => d.title === "FAQ Bank",
    quick: d => ["Lead stages and routing","Retry cadence and unreachable leads","Protected accounts","CRM activity and callback","Directory and serviceability guardrails","Service area matrix"].includes(d.section),
    brand: d => ["Final Brand & Product SOP","IndiFrame Brochure"].includes(d.title),
    team: d => ["Sales team directory","Experience centre and dealer display directory","Service area matrix"].includes(d.section)
  };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function renderStructuredContent(doc, body){
    const lines=String(doc.content||"").split(/\\r?\\n/);
    const makeTable=(headers,rows)=>{
      const table=document.createElement("table");table.className="team-directory-table structured-data-table";
      const thead=document.createElement("thead"),hr=document.createElement("tr");
      headers.forEach(h=>{const th=document.createElement("th");th.textContent=h;hr.append(th)});
      thead.append(hr);table.append(thead);
      const tbody=document.createElement("tbody");
      rows.forEach(row=>{const tr=document.createElement("tr");row.forEach((v,i)=>{const td=document.createElement("td");
        if(v&&typeof v==="object"&&v.href){const link=document.createElement("a");link.href=v.href;link.target="_blank";link.rel="noopener noreferrer";link.textContent=v.label||"View Map";td.append(link)}
        else td.textContent=String(v??"");
        tr.append(td)});tbody.append(tr)});
      table.append(tbody);body.append(table);return table;
    };
    if(doc.section==="Experience centre and dealer display directory"){
      const rows=lines.filter(line=>line.includes(" | ")&&!/^UPDATED|^City & Location/i.test(line)).map(line=>{
        const c=line.split(" | ").map(v=>v.trim());
        if(c.length<4)return null;
        const map=c.find(v=>v.startsWith("Map:"));
        const status=c.find(v=>v.startsWith("Status:"));
        const url=map?map.replace(/^Map:\\s*/,"").trim():"";
        return [c[0],c[1],c[2],{label:"View Map",href:url},status?status.replace(/^Status:\\s*/,""):"Available / listed"];
      }).filter(Boolean);
      makeTable(["City / Location","Showroom / Partner","Full Address","Map","Status"],rows);
      const note=document.createElement("p");note.className="table-note";note.textContent="Jubilee Hills: Coming Soon. Confirm showroom availability before directing a customer.";body.append(note);
      return true;
    }
    if(doc.section==="Service area matrix"){
      const blocks=[
        {name:"Ajay Guthala",base:"Kakinada"},
        {name:"Merugu Rajesh",base:"Vijayawada"},
        {name:"Sandeep Kumar",base:"Hanamkonda"}
      ];
      blocks.forEach((b,index)=>{
        const line=lines.find(x=>x.startsWith(b.name+" — base "));
        if(!line)return;
        const content=line.slice(line.indexOf(":")+1).trim();
        const rows=content.split(";").map(part=>{
          const m=part.trim().match(/^(.+?)\\s+(\\d+(?:–\\d+)?\\s*km)$/i);
          return m?[m[1].trim(),m[2].replace(/\\s+/g,"")]:null;
        }).filter(Boolean);
        const heading=document.createElement("h4");heading.className="coverage-table-heading";heading.textContent=b.name+" — Coverage from "+b.base;
        body.append(heading);
        makeTable(["City / Town / Area","Approx. Distance"],rows);
      });
      const note=document.createElement("p");note.className="table-note";note.textContent="Distances are approximate routing references only, not guaranteed installation boundaries. Confirm exact serviceability with the responsible team.";body.append(note);
      return true;
    }
    body.textContent=doc.content;
    return false;
  }
  function addContent(id, docs){
    const root=document.getElementById(id);
    if(!root)return;
    const old=root.querySelector(".knowledge-content");
    if(old)old.remove();
    const wrap=document.createElement("div");
    wrap.className="knowledge-content";
    if(id==="scripts"){
      const hub=document.createElement("div");
      hub.className="script-hub";
      const intro=document.createElement("div");
      intro.className="script-hub-intro";
      intro.innerHTML="<div><span class='script-hub-kicker'>SCRIPT HUB</span><h2>Scripts</h2><p>Choose the complete call-script library.</p><small>Version: 1.0 · Last Updated: 2026-10-01</small></div><span class='script-approved'>APPROVED</span>";
      const grid=document.createElement("div");
      grid.className="script-hub-grid";
      const cards=[
        {number:"01",title:"Final Scripts",key:"final"},
        {number:"02",title:"Secondary Scripts",key:"secondary"},
        {number:"03",title:"Hindi Roman Script",key:"hindi"},
        {number:"04",title:"Telugu Roman Scripts",key:"telugu"}
      ];
      cards.forEach(card=>{
        const details=document.createElement("details");
        details.className="script-hub-card";
        const summary=document.createElement("summary");
        summary.innerHTML="<span class='script-hub-number'>"+card.number+"</span><span class='script-hub-card-title'>"+esc(card.title)+"</span><span class='script-hub-open'>Open full script →</span>";
        const body=document.createElement("div");
        body.className="script-hub-body";
        const selectedDocs=card.key==="final"
          ?docs.filter(doc=>doc.title==="Final Pre-Sales Call Script")
          :card.key==="secondary"
            ?docs.filter(doc=>doc.title==="Updated Call Script")
            :[];
        if(selectedDocs.length){
          selectedDocs.forEach(doc=>{
            const section=document.createElement("details");
            section.className="script-hub-section";
            const heading=document.createElement("summary");
            heading.textContent=doc.section;
            const content=document.createElement("div");
            content.textContent=doc.content;
            section.append(heading,content);
            body.append(section);
          });
        }else{
          body.textContent="Approved source content for this script has not been added yet. Please provide the complete document to publish it here.";
        }
        details.append(summary,body);
        grid.append(details);
      });
      hub.append(intro,grid);
      wrap.append(hub);
      root.append(wrap);
      const head=root.querySelector(".pagehead p");
      if(head)head.textContent="Choose the complete call-script library.";
      return;
    }
    const search=document.createElement("input");
    search.className="search knowledge-search";
    search.placeholder="Search approved content…";
    search.setAttribute("aria-label","Search approved content");
    const list=document.createElement("div");
    list.className="knowledge-list";
    docs.forEach(doc=>{
      const details=document.createElement("details");
      details.className="knowledge-item";
      const summary=document.createElement("summary");
      summary.innerHTML="<b>"+esc(doc.section)+"</b><small>"+esc(doc.title)+"</small>";
      const body=document.createElement("div");
      body.className="knowledge-body";
      body.textContent=doc.content;
      details.append(summary,body);
      list.append(details);
    });
    const meta=document.createElement("div");
    meta.className="knowledge-meta";
    meta.textContent=docs.length+" approved sections";
    search.addEventListener("input",()=>{
      const q=search.value.toLowerCase().trim();let n=0;
      [...list.children].forEach(item=>{const show=!q||item.textContent.toLowerCase().includes(q);item.hidden=!show;if(show)n++});
      meta.textContent=n+" of "+docs.length+" approved sections";
    });
    wrap.append(search,meta,list);
    root.append(wrap);
    const head=root.querySelector(".pagehead p");
    if(head)head.textContent="Current approved source content. Search within this section to find verified guidance.";
  }
  try{
    const response=await fetch("/api/knowledge",{headers:{"accept":"application/json"}});
    if(!response.ok)throw new Error("Knowledge endpoint unavailable");
    const data=await response.json();
    const docs=Array.isArray(data.docs)?data.docs:[];
    Object.entries(targets).forEach(([id,filter])=>addContent(id,docs.filter(filter)));
    const teamRoot=document.getElementById("team");
    if(teamRoot){
      const list=teamRoot.querySelector(".knowledge-list");
      const directory=docs.find(d=>d.section==="Sales team directory");
      if(list&&directory){
        const details=document.createElement("details");
        details.className="knowledge-item";
        const summary=document.createElement("summary");
        summary.innerHTML="<b>Sales Team Contacts</b><small>Excel Indi Frame Core</small>";
        const box=document.createElement("div");box.className="knowledge-body";
        const table=document.createElement("table");table.className="team-directory-table";
        table.innerHTML="<thead><tr><th>Sales Person</th><th>Type</th><th>City</th><th>Designation</th><th>Mobile</th><th>Manager</th><th>Email</th><th>State</th></tr></thead>";
        const tbody=document.createElement("tbody");
        directory.content.split("\n").filter(line=>line.includes(" | ")).forEach(line=>{
          const cells=line.split(" | ").map(v=>v.trim());
          if(cells.length===8 && /^\d{10}$/.test(cells[4])){
            const tr=document.createElement("tr");
            cells.forEach((v,i)=>{const td=document.createElement("td");td.textContent=v;if(i===4){td.style.whiteSpace="nowrap"}if(i===6){td.textContent=v;td.style.wordBreak="break-word"}tr.append(td)});
            tbody.append(tr);
          }
        });
        table.append(tbody);box.append(table);
        const note=document.createElement("p");note.textContent="Protected account control: verify the Key Account List before initiating an outbound call. Directory assignment does not confirm serviceability.";
        box.append(note);details.append(summary,box);list.prepend(details);
      }
    }
  }catch(error){
    document.querySelectorAll(".knowledge-content").forEach(x=>x.remove());
    ["scripts","faqs","quick","brand","team"].forEach(id=>{
      const p=document.querySelector("#"+id+" .pagehead p");
      if(p)p.textContent="Approved content could not be loaded. Please refresh or contact the administrator.";
    });
  }
})();