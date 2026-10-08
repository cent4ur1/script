"use strict";var Rt=Object.create;var U=Object.defineProperty;var Lt=Object.getOwnPropertyDescriptor;var St=Object.getOwnPropertyNames;var $t=Object.getPrototypeOf,xt=Object.prototype.hasOwnProperty;var Ut=(t,e)=>{for(var o in e)U(t,o,{get:e[o],enumerable:!0})},K=(t,e,o,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of St(e))!xt.call(t,a)&&a!==o&&U(t,a,{get:()=>e[a],enumerable:!(i=Lt(e,a))||i.enumerable});return t};var T=(t,e,o)=>(o=t!=null?Rt($t(t)):{},K(e||!t||!t.__esModule?U(o,"default",{value:t,enumerable:!0}):o,t)),Ot=t=>K(U({},"__esModule",{value:!0}),t);var Bt={};Ut(Bt,{default:()=>wt});module.exports=Ot(Bt);var k=require("@raycast/api"),et=require("@raycast/utils"),O=T(require("react"));var _=require("@linear/sdk"),X=require("@raycast/api"),Y=require("@raycast/utils"),S=null;async function bt(t,e,o,i,a){let s=JSON.stringify({query:o,variables:i}),n=new Headers(e.headers);new Headers(a).forEach((d,D)=>n.set(D,d)),n.set("Content-Type","application/json");let c=await fetch(t,{...e,method:"POST",headers:Object.fromEntries(n.entries()),body:s}),m=c.headers.get("Content-Type")?.startsWith("application/json")?await c.json():await c.text();if(typeof m!="string"&&c.ok&&!m.errors&&m.data)return{...m,headers:c.headers,status:c.status};throw new Error(typeof m=="string"?m:m.errors?.[0]?.message??`GraphQL Error (${c.status})`)}var N=Y.OAuthService.linear({scope:"read write",onAuthorize({token:t}){S=new _.LinearClient({accessToken:t,headers:{"public-file-urls-expire-in":"60","linear-raycast-extension-name":X.environment.extensionName}});let e=S.client;e.rawRequest=((o,i,a)=>bt(e.url,e.options,o,i,a))}});function y(){if(!S)throw new Error("No linear client initialized");return{linearClient:S,graphQLClient:S.client}}var Z=require("@raycast/api"),$=!1;async function tt(){$=!!(await(0,Z.getApplications)()).find(o=>o.bundleId==="com.linear")}var v=require("react/jsx-runtime");function qt({children:t}){return(0,O.useEffect)(()=>{tt()},[]),t}var Q=class extends O.default.Component{constructor(e){super(e),this.state={error:null}}static getDerivedStateFromError(e){return{error:e}}render(){let{error:e}=this.state;if(!e)return this.props.children;if(!(e.message.includes("invalid_grant")||e.message.includes("Error while fetching tokens")||e.message.includes("Could not initialize OAuth")))throw e;return(0,v.jsx)(k.Detail,{markdown:`# Sign In Failed

Failed to authenticate with Linear:
\`\`\`
${e.message}
\`\`\`

This can happen when the network is unreliable or the authorization code has expired. Please try signing in again.`,actions:(0,v.jsx)(k.ActionPanel,{children:(0,v.jsx)(k.Action,{title:"Sign in Again",onAction:async()=>{await N.client.removeTokens(),this.setState({error:null})}})})})}},Et=(0,et.withAccessToken)(N)(qt);function M({children:t}){return(0,v.jsx)(Q,{children:(0,v.jsx)(Et,{children:t})})}var g=require("@raycast/api"),x=require("react");var ot=T(require("fs")),it=require("@raycast/api"),nt=T(require("node-emoji"));function A({icon:t,color:e,fallbackIcon:o}){if(!t)return o;if(/:(.*):/.test(t))return nt.get(t)??o;let a=`${it.environment.assetsPath}/linear-icons/${t.toLowerCase()}.svg`;return ot.default.existsSync(a)?{source:a,...e?{tintColor:{light:e,dark:e,adjustContrast:!0}}:{}}:o}function C(t){return A({icon:t.icon??void 0,color:t.color??void 0,fallbackIcon:{source:{light:"light/initiative.svg",dark:"dark/initiative.svg"}}})}function w(t){return t?A({icon:t.icon??void 0,color:t.color??void 0,fallbackIcon:{source:{light:"light/project.svg",dark:"dark/project.svg"}}}):{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}var F=require("@raycast/utils");var Tt=`
  id
  url
  icon
  color
  createdAt
  sortOrder
  title
  updatedAt
  project {
    id
    name
    icon
    color
  }
  initiative {
    id
    name
    color
    icon
  }
  creator {
    displayName
    avatarUrl
    email
  }
`;async function rt(t){let{graphQLClient:e}=y(),{data:o}=await e.rawRequest(`
      query($documentId: ID!) {
        documents(filter: { id: { eq: $documentId } }) {
          nodes {
            content
            ${Tt}
          }
        }
      }
    `,{documentId:t});return o?.documents.nodes?.[0]}var at=require("lodash");var Nt=`
  id
  url
  icon
  color
  createdAt
  sortOrder
  title
  updatedAt
  project {
    id
    name
    icon
    color
  }
  initiative {
    id
    name
    color
    icon
  }
  creator {
    displayName
    avatarUrl
    email
  }
`;async function st(t="",e={projectId:""}){let{graphQLClient:o}=y(),i="projectId"in e&&e.projectId.length>0,a="initiativeId"in e&&e.initiativeId.length>0,s=`nodes { ${Nt} } pageInfo { hasNextPage }`,n=i?`
      query($query: String!, $projectId: ID!) {
        documents(orderBy: updatedAt, filter: { and: [
          { title: { containsIgnoreCase: $query } },
          { project: { id: { eq: $projectId } } }
        ] }) { ${s} } }
    `:a?`
      query($query: String!, $initiativeId: ID!) {
        documents(orderBy: updatedAt, filter: { and: [
          { title: { containsIgnoreCase: $query } },
          { initiative: { id: { eq: $initiativeId } } }
        ] }) { ${s} } }
    `:`
      query($query: String!) { documents(orderBy: updatedAt, filter: { title: { containsIgnoreCase: $query } }) { ${s} } }
    `,c=i||a?{query:t.trim(),...e}:{query:t.trim()},{data:m}=await o.rawRequest(n,c),d=(0,at.sortBy)(m?.documents.nodes??[],j=>j.sortOrder??1/0),D=!!m?.documents.pageInfo.hasNextPage;return{docs:d,hasMoreDocs:D}}function ct(t="",e={projectId:""}){let{data:o,error:i,isLoading:a,mutate:s}=(0,F.useCachedPromise)(st,[t,e],{failureToastOptions:{title:"Failed to load documents"},keepPreviousData:!0});return{docs:o?.docs,docsError:i,isLoadingDocs:!o&&!i||a,supportsDocTypeahead:t.trim().length>0||o?.hasMoreDocs,mutateDocs:s}}function ut(t){let{data:e,error:o,isLoading:i,mutate:a}=(0,F.useCachedPromise)(rt,[t],{failureToastOptions:{title:"Failed to load document content"}});return{doc:e,docError:o,isLoadingDoc:!e&&!o||i,mutateDoc:a}}var mt=require("@raycast/utils");var lt=require("lodash");var Qt=`
  id
  name
  color
  icon
  description
  sortOrder
  projects {
    nodes {
      id
    }
  }
`;async function dt(){let{graphQLClient:t}=y(),{data:e}=await t.rawRequest(`
      query {
        initiatives(orderBy: updatedAt) {
          nodes {
            ${Qt}
          }
        }
      }
    `);return(0,lt.sortBy)(e?.initiatives.nodes??[],o=>o.sortOrder??1/0)}function pt(){let{data:t,error:e,isLoading:o,mutate:i}=(0,mt.useCachedPromise)(dt,[],{failureToastOptions:{title:"Failed to load initiatives"},keepPreviousData:!0});return{initiatives:t,initiativesError:e,isLoadingInitiatives:!t&&!e||o,mutateInitiatives:i}}var ft=require("@raycast/utils");var Mt=`
  id
  name
  description
  icon
  color
  progress
  url
  status {
    id
    name
    type
    color
  }
  lead {
    id
    displayName
    avatarUrl
    email
  }
  startDate
  targetDate
  members {
    nodes {
      id
    }
  }
  teams {
    nodes {
      key
      id
    }
  }
`;async function gt({teamId:t,searchText:e="",after:o=null,first:i=null}){let{graphQLClient:a}=y(),s=`
    projects(first: $first, after: $after, filter: { name: { containsIgnoreCase: $searchText } }) {
      nodes {
        ${Mt}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `;if(!t){let{data:m}=await a.rawRequest(`
        query($first: Int, $after: String, $searchText: String) {
          ${s}
        }
      `,{first:i,after:o,searchText:e}),d=m?.projects;return{data:d?.nodes??[],hasMore:!!d?.pageInfo.hasNextPage,cursor:d?.pageInfo.endCursor||null}}let{data:n}=await a.rawRequest(`
      query($teamId: String!, $first: Int, $after: String, $searchText: String) {
        team(id: $teamId) {
          ${s}
        }
      }
    `,{teamId:t,first:i,after:o,searchText:e}),c=n?.team?.projects;return{data:c?.nodes??[],hasMore:!!c?.pageInfo.hasNextPage,cursor:c?.pageInfo.endCursor||null}}function G(t,e){let{data:o,error:i,isLoading:a,mutate:s,pagination:n}=(0,ft.useCachedPromise)((c,m)=>d=>gt({teamId:c,searchText:m,after:d.cursor,first:e?.pageSize}),[t,e?.searchText],{execute:e?.execute!==!1,keepPreviousData:!0});return{projects:o,isLoadingProjects:!o&&!i||a,projectsError:i,mutateProjects:s,pagination:n}}var h=require("@raycast/api"),kt=require("date-fns");var b=require("@raycast/api");function ht(t){return A({icon:t.icon??void 0,color:t.color??void 0,fallbackIcon:{source:b.Icon.Document,tintColor:t.color??b.Color.PrimaryText}})}var q=require("@raycast/api"),yt=require("@raycast/utils");function It(t){return t?{source:t.avatarUrl?encodeURI(t.avatarUrl):(0,yt.getAvatarIcon)(t.displayName.toUpperCase()),mask:q.Image.Mask.Circle}:q.Icon.Person}var r=require("@raycast/api");async function Dt(t){let{graphQLClient:e}=y(),{data:o}=await e.rawRequest(`
      mutation {
        documentDelete(id: "${t}") {
          success
        }
      }
    `);return{success:o?.documentDelete.success}}async function Pt(t,e){let{graphQLClient:o}=y(),i=`projectId: ${e.projectId?`"${e.projectId}"`:null}`;i+=`, initiativeId: ${e.initiativeId?`"${e.initiativeId}"`:null}`;let{data:a}=await o.rawRequest(`
      mutation {
        documentUpdate(id: "${t}", input: {${i}}) {
          success
        }
      }
    `);return{success:a?.documentUpdate.success}}function B(t){return t instanceof Error?t.message:String(t)}var W=require("@raycast/api");var V=require("react/jsx-runtime");function z({title:t,url:e,...o}){return $?(0,V.jsx)(W.Action.Open,{title:`${t||"Open"} in Linear`,icon:"linear-app-icon.png",target:e,application:"Linear",...o}):(0,V.jsx)(W.Action.OpenInBrowser,{url:e,title:`${t||"Open"} in Browser`})}var l=require("react/jsx-runtime");function Ft({doc:t,mutateDocs:e,projects:o,initiatives:i,mutateDoc:a}){let s=async n=>{let c="project"in n,m=`to ${c?`Project: ${n.project.name}`:`Initiative: ${n.initiative.name}`}`,d=await(0,r.showToast)(r.Toast.Style.Animated,"Moving document",m),D=c?{projectId:n.project.id}:{initiativeId:n.initiative.id},j=e(Pt(t.id,D),{optimisticUpdate:f=>{if(!f)return;let u=c?{project:{...n.project},initiative:void 0}:{initiative:{...n.initiative},project:void 0};return{...f,docs:f.docs?.map(p=>p.id!==t.id?p:{...p,...u,updatedAt:new Date})}}});(a?a(j,{optimisticUpdate:f=>{if(!f)return;let u=c?{project:{...n.project},initiative:void 0}:{initiative:{...n.initiative},project:void 0};return{...f,...u,updatedAt:new Date}}}):j).then(({success:f})=>{f&&(d.style=r.Toast.Style.Success,d.title="Moved document")}).catch(f=>{d.style=r.Toast.Style.Failure,d.title="Failed to move document",d.message=B(f),d.primaryAction={title:"Retry",onAction:()=>s(n),shortcut:r.Keyboard.Shortcut.Common.Refresh}})};return((o??[]).length>0||(i??[]).length>0)&&(0,l.jsxs)(r.ActionPanel.Submenu,{title:"Move Document",icon:r.Icon.Move,shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}},filtering:{keepSectionOrder:!0},children:[(i??[]).length>0&&(0,l.jsx)(r.ActionPanel.Section,{title:"Initiatives",children:i?.filter(n=>n.id!==t.initiative?.id).map(n=>(0,l.jsx)(r.Action,{title:n.name,icon:C(n),onAction:()=>s({initiative:n})},n.id))}),(o??[]).length>0&&(0,l.jsx)(r.ActionPanel.Section,{title:"Projects",children:o?.filter(n=>n.id!==t.project?.id).map(n=>(0,l.jsx)(r.Action,{title:n.name,icon:w(n),onAction:()=>s({project:n})},n.id))})]})}function Gt({doc:t,mutateDocs:e,deleteUnsupported:o}){if(o)return(0,l.jsx)(l.Fragment,{});let i=()=>(0,r.confirmAlert)({title:"Delete Document",message:`Are you sure you want to delete '${t.title}'?`,icon:{source:r.Icon.DeleteDocument,tintColor:r.Color.Red},primaryAction:{title:"Delete",style:r.Alert.ActionStyle.Destructive,onAction:a}}),a=async()=>{let s=await(0,r.showToast)(r.Toast.Style.Animated,"Deleting document",t.title);e(Dt(t.id),{optimisticUpdate:n=>{if(n)return{...n,docs:n.docs?.filter(c=>c.id!==t.id)}}}).then(({success:n})=>{n&&(s.style=r.Toast.Style.Success,s.title="Document deleted")}).catch(n=>{s.style=r.Toast.Style.Failure,s.title="Failed to delete document",s.message=B(n),s.primaryAction={title:"Retry",onAction:a,shortcut:r.Keyboard.Shortcut.Common.Refresh}})};return(0,l.jsx)(r.Action,{title:"Delete Document",icon:{source:r.Icon.DeleteDocument,tintColor:r.Color.Red},onAction:i,style:r.Action.Style.Destructive,shortcut:r.Keyboard.Shortcut.Common.Remove})}function E({doc:t,...e}){return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(z,{title:"Open Document",url:t.url}),(0,l.jsxs)(r.ActionPanel.Section,{children:[(0,l.jsx)(Ft,{doc:t,...e}),(0,l.jsx)(Gt,{doc:t,...e})]}),(0,l.jsxs)(r.ActionPanel.Section,{children:[(0,l.jsx)(r.Action.CreateQuicklink,{icon:r.Icon.RaycastLogoPos,title:"Create Quicklink",shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}},quicklink:{link:t.url,name:t.title,application:$?"Linear":void 0}}),(0,l.jsx)(r.Action.CopyToClipboard,{icon:r.Icon.Link,content:t.url,title:"Copy Link",shortcut:r.Keyboard.Shortcut.Common.CopyPath}),(0,l.jsx)(r.Action.CopyToClipboard,{icon:r.Icon.Clipboard,content:t.title,title:"Copy Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]})]})}var L=require("@raycast/api"),jt=require("node-emoji");var R=require("react/jsx-runtime");function vt({doc:t,...e}){let{doc:o,isLoadingDoc:i,mutateDoc:a}=ut(t.id),s="";return o?.content&&(s=`# ${o.title}

${(0,jt.emojify)(o.content)}`),(0,R.jsx)(L.Detail,{markdown:s,isLoading:i,navigationTitle:t.title,actions:(0,R.jsxs)(L.ActionPanel,{children:[(0,R.jsx)(L.Action.CopyToClipboard,{title:"Copy Markdown",content:s}),o&&(0,R.jsx)(E,{doc:o,mutateDoc:a,...e,deleteUnsupported:!0})]})})}var P=require("react/jsx-runtime");function At({doc:t,...e}){let o=[t.project?.name??"",t.initiative?.name??"",t.title,t.creator.displayName],i=t.updatedAt?new Date(t.updatedAt):new Date(t.createdAt);return(0,P.jsx)(h.List.Item,{title:t.title,keywords:o,icon:ht(t),accessories:[...t.project?[{tag:{value:t.project.name,color:t.project.color?{light:t.project.color,dark:t.project.color,adjustContrast:!0}:h.Color.SecondaryText},icon:w(t.project)}]:[],...t.initiative?[{tag:{value:t.initiative.name,color:t.initiative.color?{light:t.initiative.color,dark:t.initiative.color,adjustContrast:!0}:h.Color.SecondaryText},icon:C(t.initiative)}]:[],{date:i,icon:h.Icon.Clock,tooltip:`Updated: ${(0,kt.format)(i,"MM/dd/yyyy")}`},{icon:It(t.creator),tooltip:`Creator: ${t.creator.displayName} (${t.creator.email})`}],actions:(0,P.jsxs)(h.ActionPanel,{children:[(0,P.jsx)(h.Action.Push,{title:"Show Content",target:(0,P.jsx)(vt,{doc:t,...e}),icon:h.Icon.Eye}),(0,P.jsx)(E,{doc:t,...e})]})},t.id)}var I=require("react/jsx-runtime");function Ct({project:t}){let[e,o]=(0,x.useState)(""),[i,a]=(0,x.useState)({projectId:""}),{projects:s,isLoadingProjects:n}=G(),{initiatives:c,isLoadingInitiatives:m}=pt(),{docs:d,isLoadingDocs:D,supportsDocTypeahead:j,mutateDocs:J}=ct(e,i),f=(0,x.useMemo)(()=>{if(!d)return[];let u=d??[];if("initiativeId"in i&&i.initiativeId.length>0&&(c??[]).length>0)return u.filter(p=>p.initiative&&p.initiative.id===i.initiativeId);if((s??[]).length>0){if(t)return u.filter(p=>p.project&&p.project.id===t.id);if("projectId"in i&&i.projectId.length>0)return u.filter(p=>p.project&&p.project.id===i.projectId)}return u},[t,i,d,s,c]);return(0,I.jsxs)(g.List,{isLoading:n||D||m,navigationTitle:t?`${t.name} Documents`:void 0,...!t&&((s??[]).length>0||(c??[]).length>0)?{searchBarAccessory:(0,I.jsxs)(g.List.Dropdown,{tooltip:"Change Entity",onChange:u=>{let p=u.startsWith("initiative:")?{initiativeId:u.replace("initiative:","")}:{projectId:u.replace("project:","")};a(p)},storeValue:!0,children:[(0,I.jsx)(g.List.Dropdown.Item,{value:"",title:"All Documents"}),(c??[]).length>0&&(0,I.jsx)(g.List.Dropdown.Section,{title:"Initiatives",children:c?.map(u=>(0,I.jsx)(g.List.Dropdown.Item,{value:`initiative:${u.id}`,title:u.name,icon:C(u),keywords:[u.name,u.description??""]},u.id))}),(s??[]).length>0&&(0,I.jsx)(g.List.Dropdown.Section,{title:"Projects",children:s?.map(u=>(0,I.jsx)(g.List.Dropdown.Item,{value:`project:${u.id}`,title:u.name,icon:w(u),keywords:[u.name,u.description]},u.id))})]})}:{},...j?{onSearchTextChange:o,searchBarPlaceholder:"Search by document title",throttle:!0}:{searchBarPlaceholder:"Filter by title, creator, project or initiative name"},children:[f.map(u=>(0,I.jsx)(At,{doc:u,mutateDocs:J,projects:s,initiatives:c},u.id)),(0,I.jsx)(g.List.EmptyView,{title:"No documents found",icon:{source:g.Icon.DeleteDocument,tintColor:g.Color.Orange}})]})}var H=require("react/jsx-runtime");function wt(){return(0,H.jsx)(M,{children:(0,H.jsx)(Ct,{})})}
