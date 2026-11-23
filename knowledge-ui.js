(async function(){
  const targets = {
    scripts: d => d.title === "Final Pre-Sales Call Script" && !["Pricing rules"].includes(d.section),
    faqs: d => d.title === "FAQ Bank",
    quick: d => ["Lead stages and routing","Retry cadence and unreachable leads","Protected accounts","CRM activity and callback","Directory and serviceability guardrails","Service area matrix"].includes(d.section),
    brand: d => ["Final Brand & Product SOP","IndiFrame Brochure"].includes(d.title),
    team: d => ["Sales team directory","Experience centre and dealer display directory","Service area matrix"].includes(d.section)
  };
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  function addContent(id, docs){
    const root=document.getElementById(id);
    if(!root)return;
    const old=root.querySelector(".knowledge-content");
    if(old)old.remove();
    const wrap=document.createElement("div");
    wrap.className="knowledge-content";
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
        table.innerHTML="<thead><tr><th>Name</th><th>Mobile</th><th>Email</th><th>Designation</th><th>Coverage</th></tr></thead>";
        const tbody=document.createElement("tbody");
        directory.content.replace(/^Excel Team Directory[^.]*\.\s*/,"").split(/(?<=\.)\s+(?=[A-Z\w])/).forEach(line=>{
          const m=line.match(/^(.+?)\s+—\s+(\d{10})\s+—\s+([^\s]+@[^\s]+)\s+—\s+(.+?)\s+—\s+(.+)\.?$/);
          if(m){const tr=document.createElement("tr");[m[1],m[2],m[3],m[4],m[5]].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.append(td)});tbody.append(tr)}
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