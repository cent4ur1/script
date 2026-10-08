"use strict";var ji=Object.create;var bt=Object.defineProperty;var Ui=Object.getOwnPropertyDescriptor;var Fi=Object.getOwnPropertyNames;var Ei=Object.getPrototypeOf,Ni=Object.prototype.hasOwnProperty;var Oi=(e,t)=>{for(var s in t)bt(e,s,{get:t[s],enumerable:!0})},Is=(e,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Fi(t))!Ni.call(e,i)&&i!==s&&bt(e,i,{get:()=>t[i],enumerable:!(r=Ui(t,i))||r.enumerable});return e};var ct=(e,t,s)=>(s=e!=null?ji(Ei(e)):{},Is(t||!e||!e.__esModule?bt(s,"default",{value:e,enumerable:!0}):s,e)),Vi=e=>Is(bt({},"__esModule",{value:!0}),e);var Pr={};Oi(Pr,{default:()=>vi});module.exports=Vi(Pr);var K=require("@raycast/api"),xi=require("react");var Ps=require("@raycast/api");var ys=require("@linear/sdk"),hs=require("@raycast/api"),ks=require("@raycast/utils"),dt=null;async function qi(e,t,s,r,i){let c=JSON.stringify({query:s,variables:r}),a=new Headers(t.headers);new Headers(i).forEach((d,u)=>a.set(u,d)),a.set("Content-Type","application/json");let n=await fetch(e,{...t,method:"POST",headers:Object.fromEntries(a.entries()),body:c}),o=n.headers.get("Content-Type")?.startsWith("application/json")?await n.json():await n.text();if(typeof o!="string"&&n.ok&&!o.errors&&o.data)return{...o,headers:n.headers,status:n.status};throw new Error(typeof o=="string"?o:o.errors?.[0]?.message??`GraphQL Error (${n.status})`)}var Wt=ks.OAuthService.linear({scope:"read write",onAuthorize({token:e}){dt=new ys.LinearClient({accessToken:e,headers:{"public-file-urls-expire-in":"60","linear-raycast-extension-name":hs.environment.extensionName}});let t=dt.client;t.rawRequest=((s,r,i)=>qi(t.url,t.options,s,r,i))}});function k(){if(!dt)throw new Error("No linear client initialized");return{linearClient:dt,graphQLClient:dt.client}}async function St(e,t,s,r,i){let c=r,a=!0,n,o=0;for(;a&&o<i;){let d=await e(n);c=s(c,d),a=t(d)?.hasNextPage,n=t(d)?.endCursor,o++}return c}var Wi=50,Qi=50,Qt=(0,Ps.getPreferenceValues)();function Bi(){let e=Qt.limit?+Qt.limit:Qi,t=Math.min(Wi,e),s=Math.floor(e/t);return{pageSize:t,pageLimit:s}}function ut({inFilterBlock:e,addComma:t,inParentheses:s}={inFilterBlock:!1,inParentheses:!1,addComma:!0}){return Qt.shouldHideRedundantIssues?[...s?["("]:[],...t?[", "]:[],...e?[]:["filter: { "],"completedAt: { null: true }, canceledAt: { null: true }",...e?[]:[" }"],...s?[")"]:[]].join(""):""}var ke=`
  id
  identifier
  title
  branchName
  priority
  priorityLabel
  estimate
  dueDate
  updatedAt
  url
  number
  labels {
    nodes {
      id
      name
      color
    }
  }
  state {
    id
    type
    name
    color
  }
  assignee {
    id
    displayName
    email
    avatarUrl
  }
  team {
    id
    issueEstimationType
    issueEstimationAllowZero
    issueEstimationExtended
    activeCycle {
      id
    }
  }
  cycle {
    id
    number
    startsAt
    endsAt
    completedAt
  }
  parent {
    id
    title
    number
    state {
      type
      color
    }
  }
  project {
    id
    name
    icon
    color
  }
  projectMilestone {
    id
    name
  }
`;async function Xe(){let{graphQLClient:e}=k(),{data:t}=await e.rawRequest(`
      query {
        issues(orderBy: createdAt${ut()}) {
          nodes {
            ${ke}
          }
        }
      }
    `);return t?.issues.nodes}async function zi(){let{graphQLClient:e}=k(),{data:t}=await e.rawRequest(`
      query {
        viewer {
          assignedIssues(orderBy: updatedAt${ut()}) {
            nodes {
              ${ke}
            }
          }
        }
      }
    `);return t?.viewer.assignedIssues.nodes}async function Gi(){let{graphQLClient:e}=k(),{data:t}=await e.rawRequest(`
      query {
        viewer {
          createdIssues(orderBy: updatedAt${ut()}) {
            nodes {
              ${ke}
            }
          }
        }
      }
    `);return t?.viewer.createdIssues.nodes}async function _i(){let{graphQLClient:e}=k(),{pageSize:t,pageLimit:s}=Bi();return St(async r=>e.rawRequest(`
          query($cursor: String) {
            issues(first: ${t}, after: $cursor, orderBy: updatedAt, filter: { subscribers: { some: { isMe: { eq: true } } }${ut({inFilterBlock:!0,addComma:!0})} }) {
              nodes {
                ${ke}
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,{cursor:r}),r=>r.data?.issues.pageInfo,(r,i)=>r.concat(i.data?.issues.nodes||[]),[],s)}function bs(e){switch(e){case"assigned":return zi();case"created":return Gi();case"subscribed":return _i()}}async function Ss(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          children${ut({inParentheses:!0})} {
            nodes {
              ${ke}
              sortOrder
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue.children.nodes}async function Cs(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          identifier
          title
          branchName
          description
          team {
            name
          }
          labels {
            nodes {
              name
            }
          }
          project {
            name
            description
          }
          parent {
            id
            identifier
            title
            description
          }
          children {
            nodes {
              id
              identifier
              title
              description
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue}async function ws(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          comments {
            nodes {
              id
              body
              createdAt
              url
              user {
                id
                displayName
                email
                avatarUrl
              }
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue.comments.nodes}async function As(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          ${ke}
          attachments {
            nodes {
              id
              title
              subtitle
              source
              url
              updatedAt
            }
          }
          description
          relations {
            nodes {
              id
              type
              relatedIssue {
                id
                identifier
                title
                state {
                  color
                  type
                }
              }
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue}var l=require("@raycast/api"),Ze=require("@raycast/utils"),$e=require("react");var Ls=require("fs/promises"),Bt=ct(require("path"));var Zi="application/octet-stream",Hi={".apng":"image/apng",".avif":"image/avif",".bmp":"image/bmp",".csv":"text/csv",".doc":"application/msword",".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",".gif":"image/gif",".gz":"application/gzip",".heic":"image/heic",".heif":"image/heif",".ico":"image/x-icon",".jpeg":"image/jpeg",".jpg":"image/jpeg",".json":"application/json",".md":"text/markdown",".mov":"video/quicktime",".mp3":"audio/mpeg",".mp4":"video/mp4",".pdf":"application/pdf",".png":"image/png",".ppt":"application/vnd.ms-powerpoint",".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",".svg":"image/svg+xml",".tar":"application/x-tar",".tif":"image/tiff",".tiff":"image/tiff",".txt":"text/plain",".webm":"video/webm",".webp":"image/webp",".xls":"application/vnd.ms-excel",".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",".zip":"application/zip"};function Ki(e){return Hi[Bt.default.extname(e).toLowerCase()]??Zi}async function Xi(e){let{graphQLClient:t}=k(),s=await(0,Ls.readFile)(e),r=Ki(e),i=Bt.default.basename(e),{data:c}=await t.rawRequest(`
      mutation FileUpload($size: Int!, $contentType: String!, $filename: String!) {
        fileUpload(size: $size, contentType: $contentType, filename: $filename) {
          success
          uploadFile {
            headers {
              key
              value
            }
            uploadUrl
            assetUrl
          }
        }
      }
    `,{size:s.byteLength,contentType:r,filename:i}),a=c?.fileUpload.uploadFile;if(!c?.fileUpload.success||!a)throw new Error(`Failed to request an upload URL for "${i}"`);let n=new Headers({"Content-Type":r,"Cache-Control":"public, max-age=31536000"});a.headers.forEach(({key:d,value:u})=>n.set(d,u));let o=await fetch(a.uploadUrl,{method:"PUT",headers:n,body:s});if(!o.ok)throw new Error(`Failed to upload "${i}": ${o.status} ${o.statusText}`);return{assetUrl:a.assetUrl,contentType:r,name:i}}async function Ct(e){let{linearClient:t}=k(),s=await Xi(e.url),r=await t.createAttachment({issueId:e.issueId,title:s.name,url:s.assetUrl});return{success:r.success,id:r.attachmentId}}async function wt(e){let{linearClient:t}=k(),s=await t.attachmentLinkURL(e.issueId,e.url);return{success:s.success,id:s.attachmentId}}async function Ts(e){let{graphQLClient:t}=k(),s=e.title.replace(/"/g,"\\$&"),r=e.description?.replace(/\n/g,"\\n")?.replace(/"/g,"\\$&"),i=`teamId: "${e.teamId}", title: "${s}", description: "${r}", priority: ${e.priority}`;e.stateId&&(i+=`, stateId: "${e.stateId}"`),e.estimate&&(i+=`, estimate: ${e.estimate}`),e.assigneeId&&(i+=`, assigneeId: "${e.assigneeId}"`),e.labelIds&&e.labelIds.length>0&&(i+=`, labelIds: [${e.labelIds.map(a=>`"${a}"`).join(",")}]`),e.dueDate&&(i+=`, dueDate: "${e.dueDate.toISOString()}"`),e.cycleId&&(i+=`, cycleId: "${e.cycleId}"`),e.projectId&&(i+=`, projectId: "${e.projectId}"`),e.projectId&&e.projectMilestoneId&&(i+=`, projectMilestoneId: "${e.projectMilestoneId}"`),e.parentId&&(i+=`, parentId: "${e.parentId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${i}}) {
          success
          issue {
            ${ke}
          }
        }
      }
    `);return{success:c?.issueCreate.success,issue:c?.issueCreate.issue}}async function $s(e){let{graphQLClient:t}=k(),s=e.title.replace(/"/g,"\\$&"),r=e.description?.replace(/\n/g,"\\n").replace(/"/g,"\\$&"),i=`teamId: "${e.teamId}", title: "${s}", description: "${r}", parentId: "${e.parentId}"`;e.stateId&&(i+=`, stateId: "${e.stateId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${i}}) {
          success
        }
      }
    `);return{success:c?.issueCreate.success}}var le=require("date-fns"),Ji=10080*60*1e3;function je(e){let t=Date.now(),s=Date.now()+Ji,r=new Date(e.startsAt),i=new Date(e.endsAt),c=!e.completedAt&&(0,le.isBefore)(r,t)&&(0,le.isAfter)(i,t),a=!e.completedAt&&(0,le.isBefore)(r,s)&&(0,le.isAfter)(i,s),n=c?{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}:{light:"light/cycle.svg",dark:"dark/cycle.svg"},o=`Cycle ${e.number} (${(0,le.format)(r,"dd MMM")} - ${(0,le.format)(i,"dd MMM")})`,d=c?`Active ${o}`:o;return{...e,isActive:c,isNext:a,icon:n,title:d}}function Pe(e){return e.filter(t=>(0,le.isAfter)(new Date(t.endsAt),Date.now())).map(je)}function q(e){return e instanceof Error?e.message:String(e)}var Ds={exponential:[0,1,2,4,8,16,32,64],fibonacci:[0,1,2,3,5,8,13,21],linear:[0,1,2,3,4,5,6,7],tShirt:[0,1,2,3,5,8,13,21]},Rs={0:"\u2013",1:"XS",2:"S",3:"M",5:"L",8:"XL",13:"XXL",21:"XXXL"};function At({estimate:e,issueEstimationType:t}){if(!e)return"Not estimated";if(t==="tShirt"){let s=Rs[e];return s||String(e)}return String(e)}function Je({issueEstimationType:e,issueEstimationAllowZero:t,issueEstimationExtended:s}){if(e==="notUsed")return null;let r=t?0:1,i=s?Ds[e].length:6,c=Ds[e].slice(r,i);return e==="tShirt"?c.map(a=>({estimate:a,label:Rs[a]})):c.map(a=>({estimate:a,label:a!==1?`${a} points`:`${a} point`}))}function zt(e={}){return{title:"",description:"",stateId:"",priority:"",assigneeId:"",labelIds:[],estimate:"",dueDate:null,cycleId:"",projectId:"",milestoneId:"",...e}}function Yi(e){if(typeof e=="string")try{let t=JSON.parse(e);return typeof t=="object"&&t!==null?t:{}}catch{return{}}return typeof e=="object"&&e!==null?e:{}}function be(e){return typeof e=="string"?e:void 0}function xs(e){return typeof e=="number"?String(e):be(e)}function vs(e){if(!Array.isArray(e))return;let t=e.filter(s=>typeof s=="string");return t.length>0?t:void 0}function er(e){if(typeof e!="string")return;let t=new Date(e);return Number.isNaN(t.getTime())?void 0:t}function Ms(e,t={}){let s=Yi(e.templateData),r=zt(t),i=vs(s.labelIds)??vs(s.labels);return{title:be(s.title)??r.title,description:be(s.description)??r.description,stateId:be(s.stateId)??be(s.statusId)??r.stateId,priority:xs(s.priority)??r.priority,assigneeId:be(s.assigneeId)??r.assigneeId,labelIds:i??r.labelIds,estimate:xs(s.estimate)??r.estimate,dueDate:s.dueDate!==void 0?er(s.dueDate)??null:r.dueDate,cycleId:be(s.cycleId)??r.cycleId,projectId:be(s.projectId)??r.projectId,milestoneId:r.milestoneId}}function Lt(e){let t=e.split(`
`),s=/https?:\/\/\S+/,r=t.map(i=>i.trim()).filter(i=>s.test(i));return Array.from(new Set(r))}var Gt=require("@raycast/api");function Se(e){return e?{source:"linear-icons/milestone.svg",tintColor:Gt.Color.PrimaryText}:{source:"linear-icons/no-milestone.svg",tintColor:Gt.Color.SecondaryText}}var ce={0:{light:"light/priority-no-priority.svg",dark:"dark/priority-no-priority.svg"},1:{light:"light/priority-urgent.svg",dark:"dark/priority-urgent.svg"},2:{light:"light/priority-high.svg",dark:"dark/priority-high.svg"},3:{light:"light/priority-medium.svg",dark:"dark/priority-medium.svg"},4:{light:"light/priority-low.svg",dark:"dark/priority-low.svg"}};var js=ct(require("fs")),Us=require("@raycast/api"),Fs=ct(require("node-emoji"));function Tt({icon:e,color:t,fallbackIcon:s}){if(!e)return s;if(/:(.*):/.test(e))return Fs.get(e)??s;let i=`${Us.environment.assetsPath}/linear-icons/${e.toLowerCase()}.svg`;return js.default.existsSync(i)?{source:i,...t?{tintColor:{light:t,dark:t,adjustContrast:!0}}:{}}:s}function de(e){return e?Tt({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:{light:"light/project.svg",dark:"dark/project.svg"}}}):{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}var Es=require("lodash");var tr={triage:{light:"light/triage.svg",dark:"dark/triage.svg"},backlog:{light:"light/backlog.svg",dark:"dark/backlog.svg"},unstarted:{light:"light/unstarted.svg",dark:"dark/unstarted.svg"},started:{light:"light/started.svg",dark:"dark/started.svg"},completed:{light:"light/completed.svg",dark:"dark/completed.svg"},canceled:{light:"light/canceled.svg",dark:"dark/canceled.svg"}};function G(e){return{source:tr[e.type],tintColor:{light:e.color,dark:e.color,adjustContrast:!0}}}function Ce(e,t=["triage","backlog","unstarted","started","completed","canceled"]){if(e.length===0)return[];let s=(0,Es.groupBy)(e,r=>r.type);return t.filter(r=>!!s[r]).map(r=>s[r]).flat()}var Ns=require("@raycast/api");function $t(e,t){let s=t?.logoUrl?encodeURI(t.logoUrl):Ns.Icon.TwoPeople;return Tt({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:s})}var Dt=require("@raycast/api"),Os=require("@raycast/utils");function H(e){return e?{source:e.avatarUrl?encodeURI(e.avatarUrl):(0,Os.getAvatarIcon)(e.displayName.toUpperCase()),mask:Dt.Image.Mask.Circle}:Dt.Icon.Person}var Vs=require("@raycast/utils");function Ue(e,t){let{linearClient:s}=k(),{data:r,error:i,isLoading:c}=(0,Vs.useCachedPromise)(async a=>(await s.cycles({filter:{team:{id:{eq:a}}}})).nodes.sort((o,d)=>o.number-d.number),[e],{execute:t?.execute!==!1&&!!e});return{cycles:r,cyclesError:i,isLoadingCycles:!r&&!i||c}}var Qs=require("@raycast/utils");var qs=`
  id
  name
  description
  icon
  color
  sortOrder
  type
  archivedAt
  templateData
  team {
    id
  }
`;function sr(e,t){let s=e.type.toLowerCase()==="issue",r=!e.team||e.team.id===t;return s&&!e.archivedAt&&r}function ir(e,t){return(e.sortOrder??0)-(t.sortOrder??0)||e.name.localeCompare(t.name)}async function Ws(e){if(!e)return[];let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query IssueTemplates($teamId: String!, $first: Int) {
        organization {
          templates(first: $first) {
            nodes {
              ${qs}
            }
          }
        }
        team(id: $teamId) {
          templates(first: $first) {
            nodes {
              ${qs}
            }
          }
        }
      }
    `,{teamId:e,first:100});return[...s?.organization?.templates?.nodes??[],...s?.team?.templates?.nodes??[]].filter((i,c,a)=>a.findIndex(n=>n.id===i.id)===c).filter(i=>sr(i,e)).sort(ir)}function _t(e,t){let{data:s,error:r,isLoading:i}=(0,Qs.useCachedPromise)(Ws,[e],{execute:t?.execute!==!1&&!!e});return{issueTemplates:s,issueTemplatesError:r,isLoadingIssueTemplates:!s&&!r||i}}var Bs=require("@raycast/utils");function ee(e,t=[],s){let{data:r,error:i,isLoading:c,mutate:a}=(0,Bs.useCachedPromise)(e,t,s);return{issues:r,issuesError:i,isLoadingIssues:c,mutateList:a}}var _s=require("@raycast/utils");var zs=require("@raycast/api");var rr=100,or=100,nr=(0,zs.getPreferenceValues)();function ar(){let e=Number(nr.labelsLimit),t=Number.isFinite(e)&&e>0?e:or,s=Math.floor(Math.min(rr,t)),r=Math.ceil(t/s);return{pageSize:s,pageLimit:r}}async function Gs(e){if(!e)return[];let{pageSize:t,pageLimit:s}=ar(),{graphQLClient:r}=k();return St(async i=>r.rawRequest(`
          query($teamId: String!, $cursor: String) {
            team(id: $teamId) {
              labels(first: ${t}, after: $cursor) {
                nodes {
                  id
                  name
                  color
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        `,{teamId:e,cursor:i}),i=>i.data?.team?.labels?.pageInfo,(i,c)=>i.concat(c.data?.team?.labels?.nodes??[]),[],s)}function Fe(e,t){let{data:s,error:r,isLoading:i}=(0,_s.useCachedPromise)(Gs,[e],{execute:t?.execute!==!1&&!!e});return{labels:s,labelsError:r,isLoadingLabels:!s&&!r||i}}var Hs=require("@raycast/utils");var lr=`
  id
  name
  targetDate
  project {
      id
  }
  sortOrder
  updatedAt
`;async function Zs(e){let{graphQLClient:t}=k();if(e){let{data:s}=await t.rawRequest(`
        query($projectId: String!) {
          project(id: $projectId) {
            projectMilestones {
              nodes {
                ${lr}
              }
            }
          }
        }
      `,{projectId:e});return s?.project.projectMilestones.nodes}return null}function Ee(e,t){let{data:s,error:r,isLoading:i,mutate:c}=(0,Hs.useCachedPromise)(Zs,[e],{execute:t?.execute!==!1});return{milestones:s,isLoadingMilestones:!s&&!r||i,milestonesError:r,mutateMilestones:c}}var Xs=require("@raycast/utils");var cr=`
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
`;async function Ks({teamId:e,searchText:t="",after:s=null,first:r=null}){let{graphQLClient:i}=k(),c=`
    projects(first: $first, after: $after, filter: { name: { containsIgnoreCase: $searchText } }) {
      nodes {
        ${cr}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `;if(!e){let{data:o}=await i.rawRequest(`
        query($first: Int, $after: String, $searchText: String) {
          ${c}
        }
      `,{first:r,after:s,searchText:t}),d=o?.projects;return{data:d?.nodes??[],hasMore:!!d?.pageInfo.hasNextPage,cursor:d?.pageInfo.endCursor||null}}let{data:a}=await i.rawRequest(`
      query($teamId: String!, $first: Int, $after: String, $searchText: String) {
        team(id: $teamId) {
          ${c}
        }
      }
    `,{teamId:e,first:r,after:s,searchText:t}),n=a?.team?.projects;return{data:n?.nodes??[],hasMore:!!n?.pageInfo.hasNextPage,cursor:n?.pageInfo.endCursor||null}}function Ne(e,t){let{data:s,error:r,isLoading:i,mutate:c,pagination:a}=(0,Xs.useCachedPromise)((n,o)=>d=>Ks({teamId:n,searchText:o,after:d.cursor,first:t?.pageSize}),[e,t?.searchText],{execute:t?.execute!==!1,keepPreviousData:!0});return{projects:s,isLoadingProjects:!s&&!r||i,projectsError:r,mutateProjects:c,pagination:a}}var Js=require("@raycast/utils");function pe(e,t){let{linearClient:s}=k(),{data:r,error:i,isLoading:c}=(0,Js.useCachedPromise)(async a=>(await s.workflowStates({filter:{team:{id:{eq:a}}}})).nodes.sort((o,d)=>o.position-d.position),[e],{initialData:[],execute:t?.execute!==!1});return{states:r,isLoadingStates:c,statesError:i}}var ti=require("@raycast/utils");var Ys=require("lodash");async function ei(e=""){let{graphQLClient:t,linearClient:s}=k(),r=await s.viewer,{data:i}=await t.rawRequest(`
      query($userId: String!, $query: String!) {
        organization {
          logoUrl
        }
        teams(filter: {name: {containsIgnoreCase: $query}}) {
          nodes {
            id
            name
            icon
            color
            key
            membership(userId: $userId) {
              sortOrder
            }
            issueEstimationType
            issueEstimationAllowZero
            issueEstimationExtended
            activeCycle {
              id
              number
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,{userId:r.id,query:e}),c=(0,Ys.sortBy)(i?.teams.nodes??[],o=>o.membership?.sortOrder??1/0),a=i?.organization,n=!!i?.teams.pageInfo.hasNextPage;return{teams:c,organization:a,hasMoreTeams:n}}function mt(e=""){let{data:t,error:s,isLoading:r}=(0,ti.useCachedPromise)(ei,[e]);return{teams:t?.teams,org:t?.organization,teamsError:s,isLoadingTeams:!t&&!s||r,supportsTeamTypeahead:e.trim().length>0||t?.hasMoreTeams}}var si=require("@raycast/utils");function Oe(e=""){let{linearClient:t}=k(),{data:s,error:r,isLoading:i}=(0,si.useCachedPromise)(async c=>{let a=await t.users(c.trim().length>0?{filter:{name:{containsIgnoreCase:c}}}:void 0);return{users:a?.nodes??[],hasMoreUsers:!!a?.pageInfo?.hasNextPage}},[e],{initialData:[]});return{users:s?.users,supportsUserTypeahead:e.trim().length>0||s?.hasMoreUsers,usersError:r,isLoadingUsers:!s&&!r||i}}var j=require("@raycast/api"),$i=require("date-fns");var Ye=require("@raycast/api"),Rt=require("date-fns");function xt(e){let t=(0,Rt.differenceInDays)(e,(0,Rt.startOfToday)()),s=Ye.Color.PrimaryText;return t<=7&&(s=Ye.Color.Orange),t<=0&&(s=Ye.Color.Red),{source:Ye.Icon.Calendar,tintColor:s}}var ii=require("@raycast/utils");function Ve(e){let t=e.id,{data:s,error:r,isLoading:i,mutate:c}=(0,ii.useCachedPromise)(As,[t],{initialData:{...e,description:""}});return{issue:s,issueError:r,isLoadingIssue:i,mutateDetail:c}}var g=require("@raycast/api"),ds=require("date-fns"),Ti=require("react");var C=require("@raycast/api"),ri=require("@raycast/utils"),oi=require("nanoid"),qe=require("react");var te=require("react/jsx-runtime");function Zt({issue:e}){let{pop:t}=(0,C.useNavigation)(),{states:s}=pe(e.team.id),r=(0,qe.useMemo)(()=>s.filter(A=>A.type==="unstarted")[0],[s]),{issue:i,isLoadingIssue:c}=Ve(e),{data:a,isLoading:n,revalidate:o}=(0,ri.useAI)(`Act as a product manager for Linear issues. Break down a Linear issue into a list of sub-issues. 
    
Follow these instructions:
- The sub-issues should be actionable.
- Every sub-issue should have a title and description
- Don't repeat the issue title in the description.
- Create as many sub-issues as it makes sense. Don't create too many or too few.

Use this JSON format:
[
  {
    "title": "<title of sub-issue>",
    "description": "<description of sub-issue>"
  },
  ...
]

${i.description?`To give you more context and help in creating sub-issues, here's the Linear issue description:
"""
${i.description}
"""
`:""}

Break down the Linear issue with this title: "${i.title}"`,{execute:!!i&&!c,creativity:.5}),[d,u]=(0,qe.useState)(!1),[b,w]=(0,qe.useState)([]);(0,qe.useEffect)(()=>{if(!(!a||n)){try{let $=/\[[\s\S]*?\]/,A=a.match($);if(A&&A[0]){let J=JSON.parse(A[0]);w(J.map(U=>({...U,id:(0,oi.nanoid)(),selected:!0})))}}catch($){(0,C.showToast)({style:C.Toast.Style.Failure,title:"Failed to parse AI results",message:q($),primaryAction:{title:"Retry",onAction:o},secondaryAction:{title:"Copy AI Result",onAction:()=>C.Clipboard.copy(a)}})}u(!0)}},[a,n]);async function T(){try{await(0,C.showToast)({style:C.Toast.Style.Animated,title:"Creating sub-issues"});let $=b.filter(A=>A.selected);await Promise.all($.map(A=>$s({teamId:i.team.id,title:A.title,description:A.description,parentId:i.id,stateId:r?.id}))),await(0,C.showToast)({style:C.Toast.Style.Success,title:"Created sub-issues"}),t()}catch($){(0,C.showToast)({style:C.Toast.Style.Failure,title:"Failed to create Sub-Issues",message:q($)})}}return(0,te.jsxs)(C.List,{isLoading:n||!d,children:[b?.map($=>(0,te.jsx)(C.List.Item,{icon:$.selected?{source:C.Icon.CheckCircle,tintColor:C.Color.Green}:C.Icon.Circle,title:$.title,subtitle:$.description,actions:(0,te.jsxs)(C.ActionPanel,{children:[(0,te.jsx)(C.Action,{title:$.selected?"Unselect Sub-Issue":"Select Sub-Issue",icon:$.selected?C.Icon.Circle:{source:C.Icon.CheckCircle,tintColor:C.Color.Green},onAction:()=>w(b.map(A=>A.id===$.id?{...A,selected:!A.selected}:A))}),(0,te.jsx)(C.Action,{title:"Create Sub-Issues",icon:C.Icon.Plus,onAction:()=>T()}),(0,te.jsx)(C.Action,{title:"Generate New Sub-Issues",icon:C.Icon.ArrowClockwise,onAction:o})]})},$.title)),(0,te.jsx)(C.List.EmptyView,{title:"No sub-issues were generated. Try again.",actions:(0,te.jsx)(C.ActionPanel,{children:(0,te.jsx)(C.Action,{title:"Retry",icon:C.Icon.ArrowClockwise,onAction:o})})})]})}var y=require("@raycast/api"),We=require("@raycast/utils"),pt=require("react");async function ni(e,t){let{graphQLClient:s}=k(),r=[];if(t.teamId&&r.push(`teamId: "${t.teamId}"`),t.title&&r.push(`title: "${t.title.replace(/"/g,"\\$&")}"`),t.description&&r.push(`description: "${t.description.replace(/\n/g,"\\n").replace(/"/g,"\\$&")}"`),t.stateId&&r.push(`stateId: "${t.stateId}"`),typeof t.priority<"u"&&r.push(`priority: ${t.priority}`),typeof t.assigneeId<"u"&&r.push(`assigneeId: ${t.assigneeId?`"${t.assigneeId}"`:null}`),t.labelIds&&r.push(`labelIds: [${t.labelIds.map(c=>`"${c}"`).join(",")}]`),typeof t.estimate<"u"&&r.push(`estimate: ${t.estimate}`),typeof t.dueDate<"u"){let c=t.dueDate?t.dueDate instanceof Date?t.dueDate.toISOString():t.dueDate:null;r.push(`dueDate: ${c?`"${c}"`:null}`)}typeof t.cycleId<"u"&&r.push(`cycleId: ${t.cycleId?`"${t.cycleId}"`:null}`),typeof t.projectId<"u"&&r.push(`projectId: ${t.projectId?`"${t.projectId}"`:null}`),typeof t.projectMilestoneId<"u"&&r.push(`projectMilestoneId: ${t.projectMilestoneId?`"${t.projectMilestoneId}"`:null}`),typeof t.parentId<"u"&&r.push(`parentId: ${t.parentId?`"${t.parentId}"`:null}`);let{data:i}=await s.rawRequest(`
      mutation {
        issueUpdate(id: "${e}", input: {${r.join(", ")}}) {
          success
        }
      }
    `);return{success:i?.issueUpdate.success}}var S=require("react/jsx-runtime");function Ht(e){let{pop:t}=(0,y.useNavigation)(),{issue:s,isLoadingIssue:r,mutateDetail:i}=Ve(e.issue),[c,a]=(0,pt.useState)(""),{teams:n,org:o,supportsTeamTypeahead:d,isLoadingTeams:u}=mt(c),b=n&&n.length>1,[w,T]=(0,pt.useState)(""),{users:$,supportsUserTypeahead:A,isLoadingUsers:J}=Oe(w),{handleSubmit:U,itemProps:D,values:v,setValue:W}=(0,We.useForm)({async onSubmit(p){let Z=await(0,y.showToast)({style:y.Toast.Style.Animated,title:"Editing issue"});try{let me={teamId:p.teamId||e.issue.team.id,title:p.title,description:p.description,stateId:p.stateId,labelIds:p.labelIds,dueDate:p.dueDate,...B&&p.estimate?{estimate:parseInt(p.estimate)}:{},...p.assigneeId?{assigneeId:p.assigneeId}:{},...p.cycleId?{cycleId:p.cycleId}:{},...p.projectId?{projectId:p.projectId}:{},...p.milestoneId?{projectMilestoneId:p.milestoneId}:{},...p.parentId?{parentId:p.parentId}:{},priority:parseInt(p.priority)},{success:lt}=await ni(s.id,me);lt&&(Z.style=y.Toast.Style.Success,Z.title=`Edited Issue \u2022 ${s.identifier}`,t(),i(),e.mutateList&&e.mutateList(),e.mutateSubIssues&&e.mutateSubIssues())}catch(me){Z.style=y.Toast.Style.Failure,Z.title="Failed to edit issue",Z.message=q(me)}},validation:{teamId:b?We.FormValidation.Required:void 0,title:We.FormValidation.Required,stateId:We.FormValidation.Required,priority:We.FormValidation.Required},initialValues:{teamId:e.issue.team.id,title:e.issue.title,description:s.description??void 0,priority:String(e.issue.priority),stateId:e.issue.state.id,estimate:e.issue.estimate?String(e.issue.estimate):void 0,assigneeId:e.issue.assignee?.id,labelIds:e.issue.labels.nodes.map(p=>p.id),dueDate:s.dueDate?new Date(s.dueDate):null,cycleId:e.issue.cycle?.id,projectId:e.issue.project?.id,milestoneId:e.issue.projectMilestone?.id,parentId:e.issue.parent?.id}});(0,pt.useEffect)(()=>{W("description",s.description||""),W("dueDate",s.dueDate?new Date(s.dueDate):null)},[s]);let ue=!!v.teamId&&v.teamId.trim().length>0,{states:De}=pe(v.teamId,{execute:ue}),{labels:_}=Fe(v.teamId,{execute:ue}),{cycles:ae}=Ue(v.teamId,{execute:ue}),{issues:ye}=ee(Xe,[],{execute:ue}),{projects:I}=Ne(v.teamId,{execute:ue}),{milestones:L}=Ee(v.projectId,{execute:!!v.projectId}),R=n?.find(p=>p.id===v.teamId),B=R?Je({issueEstimationType:R.issueEstimationType,issueEstimationAllowZero:R.issueEstimationAllowZero,issueEstimationExtended:R.issueEstimationExtended}):null,Re=Ce(De||[]),xe=De&&De.length>0,He=e.priorities&&e.priorities.length>0,Y=_&&_.length>0,E=ae&&ae.length>0,N=I&&I.length>0,Nt=L&&L.length>0,Pt=ye&&ye.length>0;return(0,S.jsxs)(y.Form,{actions:(0,S.jsx)(y.ActionPanel,{children:(0,S.jsx)(y.Action.SubmitForm,{onSubmit:U,title:"Edit Issue"})}),isLoading:u||r||J,children:[(d||b)&&(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(y.Form.Dropdown,{title:"Team",...D.teamId,...d&&{onSearchTextChange:a,isLoading:u,throttle:!0},children:n?.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:$t(p,o)},p.id))}),(0,S.jsx)(y.Form.Separator,{})]}),(0,S.jsx)(y.Form.TextField,{title:"Title",placeholder:"Issue title",autoFocus:!0,...D.title}),(0,S.jsx)(y.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",...D.description}),(0,S.jsx)(y.Form.Dropdown,{title:"Status",...D.stateId,children:xe?Re.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:G(p)},p.id)):null}),(0,S.jsx)(y.Form.Dropdown,{title:"Priority",...D.priority,children:He?e.priorities?.map(({priority:p,label:Z})=>(0,S.jsx)(y.Form.Dropdown.Item,{title:Z,value:String(p),icon:{source:ce[p]}},p)):null}),(0,S.jsxs)(y.Form.Dropdown,{title:"Assignee",...D.assigneeId,...A&&{onSearchTextChange:T,isLoading:J,throttle:!0},children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:y.Icon.Person}),$?.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:H(p)},p.id))]}),(0,S.jsx)(y.Form.TagPicker,{title:"Labels",...D.labelIds,placeholder:"Add label",children:Y?_.map(({id:p,name:Z,color:me})=>(0,S.jsx)(y.Form.TagPicker.Item,{title:Z,value:p,icon:{source:y.Icon.Dot,tintColor:me}},p)):null}),B?(0,S.jsxs)(y.Form.Dropdown,{title:"Estimate",...D.estimate,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),B.map(({estimate:p,label:Z})=>(0,S.jsx)(y.Form.Dropdown.Item,{title:Z,value:String(p),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},p))]}):null,(0,S.jsx)(y.Form.DatePicker,{title:"Due Date",type:y.Form.DatePicker.Type.Date,...D.dueDate}),E||N||Pt?(0,S.jsx)(y.Form.Separator,{}):null,E?(0,S.jsxs)(y.Form.Dropdown,{title:"Cycle",...D.cycleId,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),Pe(ae).map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:p.title,value:p.id,icon:{source:p.icon}},p.id))]}):null,N?(0,S.jsxs)(y.Form.Dropdown,{title:"Project",...D.projectId,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),I.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:`${p.name} (${p.status.name})`,value:p.id,icon:de(p)},p.id))]}):null,Nt?(0,S.jsxs)(y.Form.Dropdown,{title:"Milestone",storeValue:!0,...D.milestoneId,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),L.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:`${p.name}  (${p.targetDate||"No Target Date"})`,value:p.id,icon:Se(p)},p.id))]}):null,Pt?(0,S.jsxs)(y.Form.Dropdown,{title:"Parent",...D.parentId,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),ye.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:`${p.identifier} - ${p.title}`,value:p.id,icon:G(p.state)},p.id))]}):null]})}var se=require("@raycast/api"),li=require("date-fns");var O=require("@raycast/api"),ai=require("@raycast/utils");var we=require("react/jsx-runtime");function vt({issue:{id:e,title:t,identifier:s}}){let{pop:r}=(0,O.useNavigation)(),{reset:i,itemProps:c,handleSubmit:a}=(0,ai.useForm)({onSubmit:async n=>{let o=await(0,O.showToast)({style:O.Toast.Style.Animated,title:"Attaching links"}),d=Lt(n.links);if(d.length===0&&n.attachments.length===0){o.style=O.Toast.Style.Failure,o.title="No links or attachments provided";return}if(d.length>0){let u=d.length===1?"link":"links";try{await Promise.all(d.map(b=>wt({issueId:e,url:b}))),o.style=O.Toast.Style.Success,o.title=`Successfully attached ${u}`}catch(b){o.style=O.Toast.Style.Failure,o.title=`Failed attaching ${u}`,o.message=q(b)}}if(n.attachments.length>0){let u=n.attachments.length===1?"attachment":"attachments";try{o.style=O.Toast.Style.Animated,o.title=`Uploading ${u}\u2026`,await Promise.all(n.attachments.map(b=>Ct({issueId:e,url:b}))),o.style=O.Toast.Style.Success,o.title=`Successfully uploaded ${u}`}catch(b){o.style=O.Toast.Style.Failure,o.title=`Failed uploading ${u}`,o.message=q(b)}}i({attachments:[],links:""}),r()},initialValues:{links:""}});return(0,we.jsxs)(O.Form,{actions:(0,we.jsx)(O.ActionPanel,{children:(0,we.jsx)(O.Action.SubmitForm,{onSubmit:a,icon:O.Icon.NewDocument,title:"Attach"})}),navigationTitle:"Add Attachments and Links",children:[(0,we.jsx)(O.Form.Description,{title:"Issue",text:`[${s}] ${t}`}),(0,we.jsx)(O.Form.FilePicker,{title:"Attachment",...c.attachments}),(0,we.jsx)(O.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...c.links})]})}var Ae=require("react/jsx-runtime");function Kt({attachments:e,issue:t}){return(0,Ae.jsx)(se.List,{navigationTitle:`Links for ${t.identifier}`,children:e.map(s=>{let r=new Date(s.updatedAt);return(0,Ae.jsx)(se.List.Item,{icon:s.source?.imageUrl??se.Icon.Link,title:s.title,subtitle:s.subtitle,accessories:[{date:r,tooltip:`Updated: ${(0,li.format)(r,"EEEE d MMMM yyyy 'at' HH:mm")}`}],actions:(0,Ae.jsxs)(se.ActionPanel,{children:[(0,Ae.jsx)(se.Action.OpenInBrowser,{url:s.url}),(0,Ae.jsx)(se.Action.Push,{title:"Add Attachments and Links",icon:se.Icon.NewDocument,target:(0,Ae.jsx)(vt,{issue:t})})]})},s.id)})})}var Q=require("@raycast/api"),ci=require("react");var gt=require("react/jsx-runtime");function Qe({comment:e,issue:t,mutateComments:s}){let{linearClient:r}=k(),{pop:i}=(0,Q.useNavigation)(),[c,a]=(0,ci.useState)(e?e.body:"");async function n(){await(0,Q.showToast)({style:Q.Toast.Style.Animated,title:`${e?"Updating":"Adding"} comment`});try{e?await r.updateComment(e.id,{body:c}):await r.createComment({body:c,issueId:t.id}),await(0,Q.showToast)({style:Q.Toast.Style.Success,title:`${e?"Updated":"Added"} comment`}),i(),s&&s()}catch(o){(0,Q.showToast)({style:Q.Toast.Style.Failure,title:`Failed to ${e?"update":"add"} comment`,message:q(o)})}}return(0,gt.jsx)(Q.Form,{actions:(0,gt.jsx)(Q.ActionPanel,{children:(0,gt.jsx)(Q.Action.SubmitForm,{title:e?"Edit Comment":"Add Comment",onSubmit:n,icon:e?Q.Icon.Pencil:Q.Icon.Plus})}),children:(0,gt.jsx)(Q.Form.TextArea,{id:"comment",title:"Comment",placeholder:"Leave a comment",value:c,onChange:a})})}var h=require("@raycast/api"),gi=require("date-fns"),fi=ct(require("remove-markdown"));var di=require("@raycast/utils");function Xt(e){let{data:t,error:s,isLoading:r,mutate:i}=(0,di.useCachedPromise)(ws,[e]);return{comments:t,commentsError:s,isLoadingComments:r,mutateComments:i}}var ui=require("@raycast/utils");function Be(){let{linearClient:e}=k(),{data:t,error:s,isLoading:r}=(0,ui.useCachedPromise)(()=>e.viewer);return{me:t,meError:s,isLoadingMe:!t&&!s||r}}var Yt=require("@raycast/api");var mi=require("@raycast/api"),Jt=!1;async function pi(){Jt=!!(await(0,mi.getApplications)()).find(s=>s.bundleId==="com.linear")}var es=require("react/jsx-runtime");function ft({title:e,url:t,...s}){return Jt?(0,es.jsx)(Yt.Action.Open,{title:`${e||"Open"} in Linear`,icon:"linear-app-icon.png",target:t,application:"Linear",...s}):(0,es.jsx)(Yt.Action.OpenInBrowser,{url:t,title:`${e||"Open"} in Browser`})}var V=require("react/jsx-runtime");function ts({issue:e}){let{linearClient:t}=k(),{me:s,isLoadingMe:r}=Be(),{comments:i,isLoadingComments:c,mutateComments:a}=Xt(e.id);async function n(o){if(await(0,h.confirmAlert)({title:"Delete Comment",message:"Are you sure you want to delete this comment?",icon:{source:h.Icon.Trash,tintColor:h.Color.Red}}))try{await(0,h.showToast)({style:h.Toast.Style.Animated,title:"Deleting comment"}),await a(t.deleteComment(o),{optimisticUpdate(d){return d&&d?.filter(u=>u.id!==o)}}),await(0,h.showToast)({style:h.Toast.Style.Success,title:"Deleted comment"})}catch(d){(0,h.showToast)({style:h.Toast.Style.Failure,title:"Failed to delete comment",message:q(d)})}}return(0,V.jsxs)(h.List,{isLoading:c||r,navigationTitle:`${e.identifier} \u2022 Comments`,searchBarPlaceholder:"Filter by user or comment content",isShowingDetail:!0,children:[(0,V.jsx)(h.List.EmptyView,{title:"No comments",description:"This issue doesn't have any comments.",actions:(0,V.jsx)(h.ActionPanel,{children:(0,V.jsx)(h.Action.Push,{title:"Add Comment",icon:h.Icon.Plus,target:(0,V.jsx)(Qe,{issue:e,mutateComments:a})})})}),i?.map(o=>{let d=new Date(o.createdAt);return(0,V.jsx)(h.List.Item,{title:o.user.displayName,subtitle:o.body,icon:H(o.user),keywords:(0,fi.default)(o.body).replace(/\n/g," ").split(" "),accessories:[{date:d,tooltip:`Created: ${(0,gi.format)(d,"EEEE d MMMM yyyy 'at' HH:mm")}`}],detail:(0,V.jsx)(h.List.Item.Detail,{markdown:o.body}),actions:(0,V.jsxs)(h.ActionPanel,{children:[(0,V.jsx)(ft,{title:"Open Comment",url:o.url}),s?.id===o.user.id?(0,V.jsxs)(h.ActionPanel.Section,{children:[(0,V.jsx)(h.Action.Push,{title:"Edit Comment",icon:h.Icon.Pencil,shortcut:h.Keyboard.Shortcut.Common.Edit,target:(0,V.jsx)(Qe,{issue:e,comment:o,mutateComments:a})}),(0,V.jsx)(h.Action,{title:"Delete Comment",icon:h.Icon.Trash,style:h.Action.Style.Destructive,shortcut:h.Keyboard.Shortcut.Common.Remove,onAction:()=>n(o.id)})]}):null,(0,V.jsx)(h.ActionPanel.Section,{children:(0,V.jsx)(h.Action.Push,{title:"Add Comment",icon:h.Icon.Plus,shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},target:(0,V.jsx)(Qe,{issue:e,mutateComments:a})})}),(0,V.jsxs)(h.ActionPanel.Section,{children:[(0,V.jsx)(h.Action.CopyToClipboard,{icon:h.Icon.Clipboard,content:o.url,title:"Copy Comment URL",shortcut:h.Keyboard.Shortcut.Common.CopyPath}),(0,V.jsx)(h.Action.CopyToClipboard,{icon:h.Icon.Clipboard,content:o.body,title:"Copy Comment",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]}),(0,V.jsx)(h.ActionPanel.Section,{children:(0,V.jsx)(h.Action,{title:"Refresh",icon:h.Icon.ArrowClockwise,shortcut:h.Keyboard.Shortcut.Common.Refresh,onAction:a})})]})},o.id)})]})}var Ge=require("@raycast/api");var Ii=require("@raycast/utils");function It(){let{linearClient:e}=k(),{data:t,error:s,isLoading:r}=(0,Ii.useCachedPromise)(()=>e.issuePriorityValues,[],{initialData:[]});return{priorities:t,prioritiesError:s,isLoadingPriorities:!t&&!s||r}}var ge=require("@raycast/api"),Mt=require("date-fns");var ze=require("react/jsx-runtime");function yt({issue:e,mutateList:t,mutateSubIssues:s,priorities:r,me:i}){let c=[e.identifier,e.state.name,e.priorityLabel];e.assignee&&c.push(e.assignee.email,e.assignee.displayName);let a=new Date(e.updatedAt),n=e.dueDate?new Date(e.dueDate):null,o=e.estimate?{icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},text:At({estimate:e.estimate,issueEstimationType:e.team.issueEstimationType})}:null,d=e.cycle?je(e.cycle):null,u=e.project||null,b=e.labels.nodes.length>0,w=[{date:a,tooltip:`Updated: ${(0,Mt.format)(a,"EEEE d MMMM yyyy 'at' HH:mm")}`},{icon:n?xt(n):void 0,text:n?(0,Mt.format)(n,"MMM dd"):void 0,tooltip:n?`Due date: ${(0,Mt.format)(n,"MM/dd/yyyy")}`:void 0},{icon:b?ge.Icon.Tag:void 0,text:b?String(e.labels.nodes.length):void 0,tooltip:b?e.labels.nodes.map(T=>T.name).join(", "):void 0},{icon:u?de(u):void 0,tooltip:`Project: ${u?u.name:void 0}`},{icon:d?{source:d.icon}:void 0,text:d?String(d.number):void 0,tooltip:d?`Cycle: ${d.title}`:void 0},{icon:o?o.icon:void 0,text:o?o.text:void 0},{icon:G(e.state),tooltip:`Status: ${e.state.name}`},{icon:H(e.assignee),tooltip:e.assignee?`Assignee: ${e.assignee?.displayName} (${e.assignee?.email})`:"Unassigned"}];return(0,ze.jsx)(ge.List.Item,{title:e.title,icon:{value:{source:ce[e.priority]},tooltip:`Priority: ${e.priorityLabel}`},subtitle:e.identifier,keywords:c,accessories:w,actions:(0,ze.jsxs)(ge.ActionPanel,{title:e.identifier,children:[(0,ze.jsx)(ge.Action.Push,{title:"Show Details",icon:ge.Icon.Sidebar,target:(0,ze.jsx)(ht,{issue:e,mutateList:t,priorities:r,me:i})}),(0,ze.jsx)(et,{issue:e,mutateList:t,mutateSubIssues:s,priorities:r,me:i})]})},e.id)}var Le=require("react/jsx-runtime");function ss({issue:e,mutateList:t}){let{issues:s,isLoadingIssues:r,mutateList:i}=ee(d=>Ss(d),[e.id]),{priorities:c,isLoadingPriorities:a}=It(),{me:n,isLoadingMe:o}=Be();return(0,Le.jsxs)(Ge.List,{isLoading:r||o||a||o,navigationTitle:`${e.identifier} \u2022 Sub-issues`,children:[(0,Le.jsx)(Ge.List.EmptyView,{title:"No issues",description:"This issue doesn't have any sub-issues.",actions:(0,Le.jsx)(Ge.ActionPanel,{children:(0,Le.jsx)(Ge.Action.Push,{title:"Create Sub-Issue",target:(0,Le.jsx)(kt,{priorities:c,me:n,parentId:e.id,projectId:e.project?.id,cycleId:e.cycle?.id,teamId:e.team.id})})})}),s?.map(d=>(0,Le.jsx)(yt,{issue:d,mutateList:t,mutateSubIssues:i,priorities:c,me:n},d.id))]})}var M=require("@raycast/api");function hi(e){let t=[`Work on Linear issue ${e.identifier}:`,""],s=ur(e.branchName);if(s&&t.push(`Suggested branch name: ${s}`,""),t.push(`<issue identifier="${jt(e.identifier)}">`),t.push(`<title>${e.title}</title>`),t.push(...ki(e.description)),e.team?.name&&t.push(`<team name="${jt(e.team.name)}"/>`),e.labels?.nodes?.forEach(i=>{t.push(`<label>${i.name}</label>`)}),e.project?.name){let i=jt(e.project.name);t.push(e.project.description?`<project name="${i}">${e.project.description}</project>`:`<project name="${i}"/>`)}e.parent&&t.push(...yi("parent-issue",e.parent));let r=e.children?.nodes??[];return r.length>0&&(t.push("<sub-issues>"),r.forEach(i=>t.push(...yi("sub-issue",i))),t.push("</sub-issues>")),t.push("</issue>"),t.join(`
`)}function yi(e,t){return[`<${e} identifier="${jt(t.identifier)}">`,`<id>${t.id}</id>`,`<title>${t.title}</title>`,...ki(t.description),`</${e}>`]}function ki(e){return e?e.includes(`
`)?["<description>",e,"</description>"]:[`<description>${e}</description>`]:[]}function ur(e){return e&&e.slice(e.lastIndexOf("/")+1)}function jt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ie=require("react/jsx-runtime"),mr={ISSUE_TITLE:"title",ISSUE_ID:"identifier",ISSUE_URL:"url",ISSUE_BRANCH_NAME:"branchName"};function pr(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function gr(e){return e.replace(/\[/g,"\\[").replace(/\]/g,"\\]")}function fr(e){return{html:`<a href="${e.url}">${pr(e.title)}</a>`,text:`[${gr(e.title)}](${e.url})`}}function is({issue:e}){let{issueCustomCopyAction:t}=(0,M.getPreferenceValues)();async function s(){let r=await(0,M.showToast)({style:M.Toast.Style.Animated,title:"Copying prompt"});try{await M.Clipboard.copy(hi(await Cs(e.id))),r.style=M.Toast.Style.Success,r.title="Copied prompt to clipboard"}catch(i){r.style=M.Toast.Style.Failure,r.title="Failed copying prompt",r.message=q(i)}}return(0,ie.jsxs)(M.ActionPanel.Section,{children:[(0,ie.jsx)(M.Action.CopyToClipboard,{content:e.identifier,title:"Copy Issue ID",shortcut:{macOS:{modifiers:["cmd"],key:"."},Windows:{modifiers:["ctrl"],key:"."}}}),(0,ie.jsx)(M.Action.CopyToClipboard,{content:{html:`<a href="${e.url}" title="${e.title}">${e.identifier}: ${e.title}</a>`,text:e.url},title:"Copy Formatted Issue URL",shortcut:M.Keyboard.Shortcut.Common.CopyPath}),(0,ie.jsx)(M.Action.CopyToClipboard,{content:e.url,title:"Copy Issue URL",shortcut:{macOS:{modifiers:["cmd","shift"],key:"u"},Windows:{modifiers:["ctrl","shift"],key:"u"}}}),(0,ie.jsx)(M.Action.CopyToClipboard,{content:e.title,title:"Copy Issue Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}}),(0,ie.jsx)(M.Action.CopyToClipboard,{content:fr(e),title:"Copy Title as Link",shortcut:{macOS:{modifiers:["cmd","shift"],key:"t"},Windows:{modifiers:["ctrl","shift"],key:"t"}}}),(0,ie.jsx)(M.Action.CopyToClipboard,{content:e.branchName,title:"Copy Git Branch Name",shortcut:M.Keyboard.Shortcut.Common.CopyName}),t&&t!==""?(0,ie.jsx)(M.Action.CopyToClipboard,{content:t?.replace(/\{(.*?)\}/g,(r,i)=>{let c=e[mr[i]];return c||r}),title:"Custom Copy",shortcut:{macOS:{modifiers:["cmd","opt"],key:"."},Windows:{modifiers:["ctrl","alt"],key:"."}}}):null,(0,ie.jsx)(M.Action,{icon:M.Icon.Clipboard,title:"Copy as Prompt",onAction:s,shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"p"},Windows:{modifiers:["ctrl","alt","shift"],key:"p"}}})]})}var re=require("@raycast/api"),Pi=require("react");var oe=require("react/jsx-runtime");function rs({issue:e,updateIssue:t}){let{linearClient:s}=k(),[r,i]=(0,Pi.useState)(!1),{cycles:c,isLoadingCycles:a}=Ue(e.team.id,{execute:r}),n=e.cycle?je(e.cycle):null,o=n?.isActive||!1,d=n?.isNext||!1;async function u(T){let $=e.cycle;t({animatedTitle:"Moving to cycle",payload:{cycleId:T?.id||null},optimisticUpdate(A){return{...A,cycle:T||void 0}},rollbackUpdate(A){return{...A,cycle:$}},successTitle:T?"Moved to cycle":"Removed from cycle",successMessage:T?.title?T.title:"",errorTitle:"Failed to move to cycle"})}async function b(){let{nodes:T}=await s.cycles({filter:{team:{id:{eq:e.team.id}}}}),$=Pe(T||[]),A=$.findIndex(D=>D.isActive),U=(A>-1?$[A]:null)?$[A+1]:null;if(U)return u(U)}async function w(){let{nodes:T}=await s.cycles({filter:{team:{id:{eq:e.team.id}}}}),A=Pe(T||[]).find(J=>J.isActive);if(A)return u(A)}return(0,oe.jsxs)(oe.Fragment,{children:[(0,oe.jsxs)(re.ActionPanel.Submenu,{title:"Move to Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:re.Keyboard.Shortcut.Common.Copy,onOpen:()=>i(!0),children:[(0,oe.jsx)(re.Action,{title:"No Cycle",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}},onAction:()=>u(null)}),!c&&a?(0,oe.jsx)(re.Action,{title:"Loading\u2026"}):Pe(c||[]).map(T=>(0,oe.jsx)(re.Action,{autoFocus:T.id===n?.id,title:T.title,icon:{source:T.icon},onAction:()=>u(T)},T.id))]}),o?null:(0,oe.jsx)(re.Action,{title:"Move to Active Cycle",icon:{source:{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}},shortcut:re.Keyboard.Shortcut.Common.Copy,onAction:()=>w()}),d?null:(0,oe.jsx)(re.Action,{title:"Move to Next Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},onAction:()=>b()})]})}var ne=require("@raycast/api"),bi=require("lodash"),Si=require("react");var fe=require("react/jsx-runtime");function os({issue:e,updateIssue:t}){let[s,r]=(0,Si.useState)(!1),{labels:i}=Fe(e.team.id,{execute:s}),[,c]=(0,bi.partition)(i||[],o=>e.labels.nodes.map(d=>d.id).includes(o.id));async function a(o){let d=e.labels.nodes.map(u=>u.id);t({animatedTitle:"Adding label",payload:{labelIds:[...d,o.id]},optimisticUpdate(u){return{...u,labels:{...u.labels,nodes:[...u.labels.nodes,o]}}},rollbackUpdate(u){return{...u,labels:{...u.labels,nodes:u.labels.nodes.filter(b=>b.id!==o.id)}}},successTitle:"Added label",successMessage:`Label "${o.name}" added to ${e.identifier}`,errorTitle:"Failed to add label"})}async function n(o){let d=e.labels.nodes.map(u=>u.id);t({animatedTitle:"Remove label",payload:{labelIds:d.filter(u=>u!==o.id)},optimisticUpdate(u){return{...u,labels:{...u.labels,nodes:u.labels.nodes.filter(b=>b.id!==o.id)}}},rollbackUpdate(u){return{...u,labels:{...u.labels,nodes:[...u.labels.nodes,o]}}},successTitle:"Removed label",successMessage:`Label "${o.name}" removed from ${e.identifier}`,errorTitle:"Failed to remove label"})}return(0,fe.jsxs)(fe.Fragment,{children:[(0,fe.jsx)(ne.ActionPanel.Submenu,{title:"Add Label",icon:ne.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},onOpen:()=>r(!0),children:c.map(o=>(0,fe.jsx)(ne.Action,{title:o.name,icon:{source:ne.Icon.Dot,tintColor:o.color},onAction:()=>a(o)},o.id))}),e.labels.nodes.length>0?(0,fe.jsx)(ne.ActionPanel.Submenu,{title:"Remove Label",icon:ne.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},children:e.labels.nodes.map(o=>(0,fe.jsx)(ne.Action,{title:o.name,icon:{source:ne.Icon.Dot,tintColor:o.color},onAction:()=>n(o)},o.id))}):null]})}var Te=require("@raycast/api"),Ci=require("react");var tt=require("react/jsx-runtime");function ns({issue:e,updateIssue:t}){let[s,r]=(0,Ci.useState)(!1),{milestones:i,isLoadingMilestones:c}=Ee(e.project?.id,{execute:s});async function a(n){let o=e.projectMilestone;t({animatedTitle:"Setting milestone",payload:{projectMilestoneId:n?n.id:null},optimisticUpdate(d){return{...d,milestone:n||void 0}},rollbackUpdate(d){return{...d,milestone:o}},successTitle:n?"Set milestone":`Removed milestone from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set milestone"})}return(0,tt.jsxs)(Te.ActionPanel.Submenu,{title:"Set Milestone",icon:{source:"linear-icons/milestone.svg",tintColor:Te.Color.PrimaryText},shortcut:{modifiers:["ctrl","shift"],key:"m"},onOpen:()=>r(!0),children:[(0,tt.jsx)(Te.Action,{title:"No Milestone",icon:{source:"linear-icons/no-milestone.svg"},onAction:()=>a(null)}),!i&&c?(0,tt.jsx)(Te.Action,{title:"Loading\u2026"}):(i||[]).map(n=>(0,tt.jsx)(Te.Action,{autoFocus:n.id===e.projectMilestone?.id,title:`${n.name}  (${n.targetDate||"No Target Date"})`,icon:Se(n),onAction:()=>a(n)},n.id))]})}var st=require("@raycast/api"),wi=require("react");var Ie=require("react/jsx-runtime");function as({issue:e,updateIssue:t}){let[s,r]=(0,wi.useState)(!1),{issues:i,isLoadingIssues:c}=ee(Xe,[],{execute:s}),a=e.parent,n=a?.id,o=!!n;async function d(u){t({animatedTitle:"Setting parent issue",payload:{parentId:u?u.id:null},optimisticUpdate(b){return{...b,parent:u||void 0}},rollbackUpdate(b){return{...b,parent:a}},successTitle:"Set parent issue",successMessage:u?`${u.identifier} set as parent issue`:`Removed parent issue from ${e.identifier}`,errorTitle:"Failed to set parent issue"})}return(0,Ie.jsxs)(Ie.Fragment,{children:[(0,Ie.jsx)(st.ActionPanel.Submenu,{title:o?"Change Parent Issue":"Set Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"i"},onOpen:()=>r(!0),children:!i&&c?(0,Ie.jsx)(st.Action,{title:"Loading\u2026"}):(i||[]).map(u=>(0,Ie.jsx)(st.Action,{autoFocus:u.id===n,title:`${u.identifier} - ${u.title}`,icon:G(u.state),onAction:()=>d(u)},u.id))}),o?(0,Ie.jsx)(st.Action,{title:"Remove Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"k"},Windows:{modifiers:["ctrl","shift"],key:"k"}},onAction:()=>d(null)}):null]})}var it=require("@raycast/api"),Ai=require("react");var rt=require("react/jsx-runtime");function ls({issue:e,updateIssue:t}){let[s,r]=(0,Ai.useState)(!1),{projects:i,isLoadingProjects:c}=Ne(e.team.id,{execute:s});async function a(n){let o=e.project;t({animatedTitle:"Setting project",payload:{projectId:n?n.id:null},optimisticUpdate(d){return{...d,project:n||void 0}},rollbackUpdate(d){return{...d,project:o}},successTitle:n?"Set project":`Removed project from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set project"})}return(0,rt.jsxs)(it.ActionPanel.Submenu,{title:"Set Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"p"},onOpen:()=>r(!0),children:[(0,rt.jsx)(it.Action,{title:"No Project",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}},onAction:()=>a(null)}),!i&&c?(0,rt.jsx)(it.Action,{title:"Loading\u2026"}):(i||[]).map(n=>(0,rt.jsx)(it.Action,{autoFocus:n.id===e.project?.id,title:`${n.name} (${n.status.name})`,icon:de(n),onAction:()=>a(n)},n.id))]})}var _e=require("@raycast/api"),Li=require("react");var Ut=require("react/jsx-runtime");function cs({issue:e,updateIssue:t}){let[s,r]=(0,Li.useState)(!1),{states:i,isLoadingStates:c}=pe(e.team.id,{execute:s}),a=Ce(i||[]);async function n(o){let d=e.state;t({animatedTitle:"Setting status",payload:{stateId:o.id},optimisticUpdate(u){return{...u,state:o}},rollbackUpdate(u){return{...u,state:d}},successTitle:"Set status",successMessage:`${e.identifier} set to ${o.name}`,errorTitle:"Failed to set status"})}return(0,Ut.jsx)(_e.ActionPanel.Submenu,{icon:_e.Icon.Circle,title:"Set Status",shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}},onOpen:()=>r(!0),children:a.length===0&&c?(0,Ut.jsx)(_e.Action,{title:"Loading\u2026"}):a.map(o=>(0,Ut.jsx)(_e.Action,{autoFocus:o.id===e.state.id,title:o.name,icon:G(o),onAction:()=>n(o)},o.id))})}var P=require("react/jsx-runtime");function et({issue:e,mutateList:t,mutateSubIssues:s,mutateDetail:r,showAttachmentsAction:i,attachments:c,priorities:a,me:n}){let{pop:o}=(0,g.useNavigation)(),{linearClient:d}=k(),u=e.assignee?.id===n?.id,b=Je({issueEstimationType:e.team.issueEstimationType,issueEstimationAllowZero:e.team.issueEstimationAllowZero,issueEstimationExtended:e.team.issueEstimationExtended});async function w({animatedTitle:I,payload:L,optimisticUpdate:R,rollbackUpdate:B,successTitle:Re,successMessage:xe,errorTitle:He}){try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:I});let Y=d.updateIssue(e.id,L);await Promise.all([Y,t?t(Y,{optimisticUpdate(E){if(E)return E.map(N=>N.id===e.id?R(N):N)},rollbackOnError(E){if(E)return E.map(N=>N.id===e.id?B(N):N)}}):Promise.resolve(),s?s(Y,{optimisticUpdate(E){if(E)return E.map(N=>N.id===e.id?R(N):N)},rollbackOnError(E){if(E)return E.map(N=>N.id===e.id?B(N):N)}}):Promise.resolve(),r?r(Y,{optimisticUpdate(E){return R(E)},rollbackOnError(E){return B(E)}}):Promise.resolve()]),await(0,g.showToast)({style:g.Toast.Style.Success,title:Re,message:xe})}catch(Y){await(0,g.showToast)({style:g.Toast.Style.Failure,title:He,message:q(Y)})}}async function T(){if(await(0,g.confirmAlert)({title:"Delete Issue",message:"Are you sure you want to delete the selected issue?",icon:{source:g.Icon.Trash,tintColor:g.Color.Red}}))try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:"Deleting issue"});let I=d.deleteIssue(e.id);r&&o(),await Promise.all([I,t?t(I,{optimisticUpdate(L){if(L)return L.filter(R=>R.id!==e.id)}}):Promise.resolve(),s?s(I,{optimisticUpdate(L){if(L)return L.filter(R=>R.id!==e.id)}}):Promise.resolve()]),await(0,g.showToast)({style:g.Toast.Style.Success,title:"Issue deleted",message:`"${e.title}" is deleted`})}catch(I){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed to delete issue",message:q(I)})}}async function $(I){let L=e.priority;w({animatedTitle:"Setting priority",payload:{priority:I.priority},optimisticUpdate(R){return{...R,priority:I.priority}},rollbackUpdate(R){return{...R,priority:L}},successTitle:"Set priority",successMessage:`${e.identifier} priority set to ${I.label}`,errorTitle:"Failed to set priority"})}async function A(I){let L=e.assignee;w({animatedTitle:"Setting assignee",payload:{assigneeId:I.id},optimisticUpdate(R){return{...R,assignee:I}},rollbackUpdate(R){return{...R,assignee:L}},successTitle:"Set assignee",successMessage:`${e.identifier} assigned to ${I.displayName}`,errorTitle:"Failed to set assignee"})}async function J(I){let L=e.assignee;w({animatedTitle:"Setting assignee",payload:{assigneeId:I?I.id:null},optimisticUpdate(R){return{...R,assignee:I||void 0}},rollbackUpdate(R){return{...R,assignee:L}},successTitle:"Set assignee",successMessage:`${e.identifier} ${I?"assigned to":"un-assigned from"} me`,errorTitle:"Failed to set assignee"})}async function U({estimate:I,label:L}){let R=e.estimate;w({animatedTitle:"Setting estimate",payload:{estimate:I},optimisticUpdate(B){return{...B,estimate:I}},rollbackUpdate(B){return{...B,estimate:R}},successTitle:"Set estimate",successMessage:`${e.identifier} estimate set to ${L}`,errorTitle:"Failed to set estimate"})}async function D(I){w({animatedTitle:I?"Setting due date":"Removing due date",payload:{dueDate:I},optimisticUpdate(L){return{...L,dueDate:I}},rollbackUpdate(L){return{...L,dueDate:L.dueDate}},successTitle:I?"Set due date":"Removed due date",successMessage:I?`${e.identifier} due date set to ${(0,ds.format)(I,"MM/dd/yyyy")}`:"",errorTitle:"Failed to set due date"})}async function v(I){if(!I){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed setting reminder"});return}try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:"Setting reminder"}),await d.issueReminder(e.id,I),r&&o(),await(0,g.showToast)({style:g.Toast.Style.Success,title:"Reminder set",message:`${e.identifier} reminder set to ${(0,ds.format)(I,"MM/dd/yyyy")}`})}catch(L){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed to set reminder",message:q(L)})}}function W(){t&&t(),s&&s(),r&&r()}let[ue,De]=(0,Ti.useState)(""),{users:_,supportsUserTypeahead:ae,isLoadingUsers:ye}=Oe(ue);return(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(ft,{title:"Open Issue",url:e.url}),(0,P.jsxs)(g.ActionPanel.Section,{children:[(0,P.jsx)(g.Action.Push,{title:"Edit Issue",icon:g.Icon.Pencil,shortcut:g.Keyboard.Shortcut.Common.Edit,target:(0,P.jsx)(Ht,{priorities:a,me:n,issue:e,mutateList:t,mutateSubIssues:s})}),(0,P.jsx)(cs,{issue:e,updateIssue:w}),a&&a.length>0?(0,P.jsx)(g.ActionPanel.Submenu,{icon:g.Icon.LevelMeter,title:"Set Priority",shortcut:{macOS:{modifiers:["cmd","opt"],key:"p"},Windows:{modifiers:["ctrl","alt"],key:"p"}},children:a.map(I=>(0,P.jsx)(g.Action,{autoFocus:I.priority===e.priority,title:I.label,icon:{source:ce[I.priority]},onAction:()=>$(I)},I.priority))}):null,(0,P.jsx)(g.ActionPanel.Submenu,{icon:g.Icon.AddPerson,title:"Assign to",shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}},...ae&&{onSearchTextChange:De,isLoading:ye,throttle:!0},children:_?.map(I=>(0,P.jsx)(g.Action,{autoFocus:I.id===e.assignee?.id,title:`${I.displayName} (${I.email})`,icon:H(I),onAction:()=>A(I)},I.id))}),n?(0,P.jsx)(g.Action,{title:u?"Un-Assign from Me":"Assign to Me",icon:H(n),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}},onAction:()=>J(u?null:n)}):null,b?(0,P.jsx)(g.ActionPanel.Submenu,{title:"Set Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}},children:b.map(({estimate:I,label:L})=>(0,P.jsx)(g.Action,{autoFocus:I===e.estimate,title:L,onAction:()=>U({estimate:I,label:L})},I))}):null,(0,P.jsx)(g.Action.PickDate,{title:"Set Due Date",shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}},onChange:D}),(0,P.jsx)(g.Action.PickDate,{title:"Set Reminder",shortcut:{macOS:{modifiers:["cmd","shift"],key:"h"},Windows:{modifiers:["ctrl","shift"],key:"h"}},onChange:v}),(0,P.jsx)(os,{issue:e,updateIssue:w}),(0,P.jsx)(rs,{issue:e,updateIssue:w}),(0,P.jsx)(ls,{issue:e,updateIssue:w}),(0,P.jsx)(ns,{issue:e,updateIssue:w}),(0,P.jsx)(as,{issue:e,updateIssue:w}),(0,P.jsx)(g.Action,{title:"Delete Issue",shortcut:g.Keyboard.Shortcut.Common.Remove,icon:g.Icon.Trash,style:g.Action.Style.Destructive,onAction:()=>T()})]}),(0,P.jsxs)(g.ActionPanel.Section,{children:[(0,P.jsx)(g.Action.Push,{title:"Show Sub-Issues",icon:g.Icon.List,target:(0,P.jsx)(ss,{issue:e,mutateList:t}),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}),(0,P.jsx)(g.Action.Push,{title:"Break Issues into Sub-Issues",icon:g.Icon.Stars,target:(0,P.jsx)(Zt,{issue:e}),shortcut:{macOS:{modifiers:["opt","shift"],key:"m"},Windows:{modifiers:["alt","shift"],key:"m"}}}),i?(0,P.jsx)(g.Action.Push,{title:"Show Issue Links",icon:g.Icon.Link,target:(0,P.jsx)(Kt,{attachments:c??[],issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}}):null,(0,P.jsx)(g.Action.Push,{title:"Add Attachments and Links",icon:g.Icon.NewDocument,target:(0,P.jsx)(vt,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,P.jsx)(g.Action.Push,{title:"Add Comment",icon:g.Icon.Plus,target:(0,P.jsx)(Qe,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"n"},Windows:{modifiers:["ctrl","alt","shift"],key:"n"}}}),(0,P.jsx)(g.Action.Push,{title:"Show Comments",icon:g.Icon.Bubble,target:(0,P.jsx)(ts,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"c"},Windows:{modifiers:["ctrl","alt","shift"],key:"c"}}})]}),(0,P.jsx)(is,{issue:e}),(0,P.jsx)(g.ActionPanel.Section,{children:(0,P.jsx)(g.Action,{title:"Refresh",icon:g.Icon.ArrowClockwise,shortcut:g.Keyboard.Shortcut.Common.Refresh,onAction:()=>W()})})]})}var F=require("react/jsx-runtime");function ht({issue:e,mutateList:t,priorities:s,me:r}){let{issue:i,isLoadingIssue:c,mutateDetail:a}=Ve(e),n=`# ${i?.title}`;i?.description&&(n+=`

${i.description}`);let o=i?.cycle?je(i.cycle):null,d=i.relations?i.relations.nodes.filter(w=>w.type=="related"):null,u=i.relations?i.relations.nodes.filter(w=>w.type=="duplicate"):null,b=i.attachments?.nodes.length??0;return(0,F.jsx)(j.Detail,{markdown:n,isLoading:c,...i?{metadata:(0,F.jsxs)(j.Detail.Metadata,{children:[(0,F.jsx)(j.Detail.Metadata.Label,{title:"Status",text:i.state.name,icon:G(i.state)}),(0,F.jsx)(j.Detail.Metadata.Label,{title:"Priority",text:i.priorityLabel,icon:{source:ce[i.priority]}}),(0,F.jsx)(j.Detail.Metadata.Label,{title:"Assignee",text:i.assignee?i.assignee.displayName:"Unassigned",icon:H(i.assignee)}),i.team.issueEstimationType!=="notUsed"?(0,F.jsx)(j.Detail.Metadata.Label,{title:"Estimate",text:At({estimate:i.estimate,issueEstimationType:i.team.issueEstimationType}),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}):null,i.labels.nodes.length>0?(0,F.jsx)(j.Detail.Metadata.TagList,{title:"Labels",children:i.labels.nodes.map(({id:w,name:T,color:$})=>(0,F.jsx)(j.Detail.Metadata.TagList.Item,{text:T,color:$},w))}):(0,F.jsx)(j.Detail.Metadata.Label,{title:"Labels",text:"No Labels"}),i.dueDate?(0,F.jsx)(j.Detail.Metadata.Label,{title:"Due Date",text:(0,$i.format)(new Date(i.dueDate),"MM/dd/yyyy"),icon:xt(new Date(i.dueDate))}):null,b>0?(0,F.jsx)(j.Detail.Metadata.Label,{title:"Links",text:`${b>1?`${b} links`:"1 link"}`,icon:j.Icon.Link}):null,(0,F.jsx)(j.Detail.Metadata.Separator,{}),(0,F.jsx)(j.Detail.Metadata.Label,{title:"Cycle",text:o?o.title:"No Cycle",icon:{source:o?o.icon:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),(0,F.jsx)(j.Detail.Metadata.Label,{title:"Project",text:i.project?i.project.name:"No Project",icon:de(i.project)}),(0,F.jsx)(j.Detail.Metadata.Label,{title:"Milestone",text:i.projectMilestone?i.projectMilestone.name:"No Milestone",icon:Se(i.projectMilestone)}),(0,F.jsx)(j.Detail.Metadata.Label,{title:"Parent Issue",text:i.parent?i.parent.title:"No Issue",icon:i.parent?G(i.parent.state):{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),d&&d.length>0?(0,F.jsx)(j.Detail.Metadata.TagList,{title:"Related",children:d.map(({id:w,relatedIssue:T})=>(0,F.jsx)(j.Detail.Metadata.TagList.Item,{text:T.identifier},w))}):null,u&&u.length>0?(0,F.jsx)(j.Detail.Metadata.TagList,{title:"Duplicates",children:u.map(({id:w,relatedIssue:T})=>(0,F.jsx)(j.Detail.Metadata.TagList.Item,{text:T.identifier},w))}):null]}),actions:(0,F.jsx)(j.ActionPanel,{children:(0,F.jsx)(et,{issue:i,mutateList:t,mutateDetail:a,priorities:s,showAttachmentsAction:b>0,attachments:i.attachments?.nodes??[],me:r})})}:{}})}var f=require("react/jsx-runtime");function Ir(e,t){return e==="url"?{title:"Copy Issue URL",onAction:()=>l.Clipboard.copy(t.url)}:e==="id-as-link"?{title:"Copy Issue ID as Link",onAction:()=>l.Clipboard.copy({text:`[${t.identifier}](${t.url})`,html:`<a href="${t.url}">${t.identifier}</a>`})}:e==="title"?{title:"Copy Issue Title",onAction:()=>l.Clipboard.copy(t.title)}:e==="title-as-link"?{title:"Copy Issue Title as Link",onAction:()=>l.Clipboard.copy({text:`[${t.title}](${t.url})`,html:`<a href="${t.url}">${t.title}</a>`})}:{title:"Copy Issue ID",onAction:()=>l.Clipboard.copy(t.identifier)}}function kt(e){let{push:t}=(0,l.useNavigation)(),{autofocusField:s,copyToastAction:r}=(0,l.getPreferenceValues)(),[i,c]=(0,$e.useState)(""),{teams:a,org:n,supportsTeamTypeahead:o,isLoadingTeams:d}=mt(i),u=a&&a.length>1,[b,w]=(0,$e.useState)(""),{users:T,supportsUserTypeahead:$,isLoadingUsers:A}=Oe(b),{handleSubmit:J,itemProps:U,values:D,setValue:v,focus:W,reset:ue,setValidationError:De}=(0,Ze.useForm)({async onSubmit(m){let x=await(0,l.showToast)({style:l.Toast.Style.Animated,title:"Creating issue"}),he=u?m.teamId:a?.[0]?.id;if(!he)return De("teamId","The team is required."),!1;try{let z={teamId:he,title:m.title,description:m.description||"",stateId:m.stateId,labelIds:m.labelIds,dueDate:m.dueDate,...N&&m.estimate?{estimate:parseInt(m.estimate)}:{},...m.assigneeId?{assigneeId:m.assigneeId}:{},...m.cycleId?{cycleId:m.cycleId}:{},...m.projectId?{projectId:m.projectId}:{},...m.milestoneId?{projectMilestoneId:m.milestoneId}:{},...m.parentId?{parentId:m.parentId}:{},priority:parseInt(m.priority)},{success:Vt,issue:Ke}=await Ts(z);if(Vt&&Ke){x.style=l.Toast.Style.Success,x.title=`Created Issue \u2022 ${Ke?.identifier}`,x.primaryAction={title:"Open Issue",shortcut:l.Keyboard.Shortcut.Common.OpenWith,onAction:async()=>{t((0,f.jsx)(ht,{issue:Ke,priorities:e.priorities,me:e.me})),await x.hide()}},x.secondaryAction={shortcut:l.Keyboard.Shortcut.Common.Copy,...Ir(r,Ke)},ue({templateId:"",title:"",description:"",estimate:"",labelIds:[],dueDate:null,parentId:"",attachments:[],links:""}),W(u&&s?s:"title");let qt=Lt(m.links);if(qt.length>0){let ve=qt.length===1?"link":"links";try{x.message=`Attaching ${ve}\u2026`,await Promise.all(qt.map(Me=>wt({issueId:Ke.id,url:Me}))),x.message=`Successfully attached ${ve}`}catch(Me){x.style=l.Toast.Style.Failure,x.title=`Failed attaching ${ve}`,x.message=q(Me)}}if(m.attachments.length>0){let ve=m.attachments.length===1?"attachment":"attachments";try{x.message=`Uploading ${ve}\u2026`,await Promise.all(m.attachments.map(Me=>Ct({issueId:Ke.id,url:Me}))),x.message=`Successfully uploaded ${ve}`}catch(Me){x.style=l.Toast.Style.Failure,x.title=`Failed uploading ${ve}`,x.message=q(Me)}}}}catch(z){x.style=l.Toast.Style.Failure,x.title="Failed to create issue",x.message=q(z)}v("teamId",he)},validation:{teamId:u?Ze.FormValidation.Required:void 0,title:Ze.FormValidation.Required,stateId:Ze.FormValidation.Required,priority:Ze.FormValidation.Required},initialValues:{templateId:e.draftValues?.templateId||"",teamId:e.draftValues?.teamId||e.teamId,title:e.draftValues?.title,description:e.draftValues?.description,priority:e.draftValues?.priority,stateId:e.draftValues?.stateId,estimate:e.draftValues?.estimate,assigneeId:e.draftValues?.assigneeId||e.assigneeId,labelIds:e.draftValues?.labelIds||[],dueDate:e.draftValues?.dueDate,cycleId:e.draftValues?.cycleId||e.cycleId,projectId:e.draftValues?.projectId||e.projectId,milestoneId:e.draftValues?.milestoneId||e.milestoneId,parentId:e.draftValues?.parentId||e.parentId,links:e.draftValues?.links||""}}),_=!!D.teamId&&D.teamId.trim().length>0,{issueTemplates:ae,isLoadingIssueTemplates:ye}=_t(D.teamId,{execute:_}),{states:I}=pe(D.teamId,{execute:_}),{labels:L}=Fe(D.teamId,{execute:_}),{cycles:R}=Ue(D.teamId,{execute:_}),{issues:B}=ee(Xe,[],{execute:_}),{projects:Re}=Ne(D.teamId,{execute:_}),{milestones:xe}=Ee(D.projectId,{execute:!!D.projectId});(0,$e.useEffect)(()=>{a?.length===1&&v("teamId",a[0].id)},[a]);let He=(0,$e.useRef)(!1);(0,$e.useEffect)(()=>{if(!He.current){He.current=!0;return}Y("")},[D.teamId]);function Y(m){v("templateId",m);let x=ae?.find(Vt=>Vt.id===m),he={assigneeId:e.assigneeId||"",cycleId:e.cycleId||"",projectId:e.projectId||"",milestoneId:e.milestoneId||""},z=x?Ms(x,he):zt(he);v("title",z.title),v("description",z.description),v("stateId",z.stateId),v("priority",z.priority),v("assigneeId",z.assigneeId),v("labelIds",z.labelIds),v("estimate",z.estimate),v("dueDate",z.dueDate),v("cycleId",z.cycleId),v("projectId",z.projectId),v("milestoneId",z.milestoneId??"")}let E=a?.find(m=>m.id===D.teamId),N=E?Je({issueEstimationType:E.issueEstimationType,issueEstimationAllowZero:E.issueEstimationAllowZero,issueEstimationExtended:E.issueEstimationExtended}):null,Nt=Ce(I||[]),Pt=I&&I.length>0,p=e.priorities&&e.priorities.length>0,Z=L&&L.length>0,me=R&&R.length>0,lt=Re&&Re.length>0,fs=xe&&xe.length>0,Ot=B&&B.length>0,Mi=ae&&ae.length>0;return(0,f.jsxs)(l.Form,{enableDrafts:e.enableDrafts,actions:(0,f.jsxs)(l.ActionPanel,{children:[(0,f.jsx)(l.Action.SubmitForm,{icon:l.Icon.Plus,onSubmit:J,title:"Create Issue"}),(0,f.jsxs)(l.ActionPanel.Section,{children:[(0,f.jsx)(l.Action,{title:"Focus Title",icon:l.Icon.TextInput,onAction:()=>W("title"),shortcut:l.Keyboard.Shortcut.Common.Edit}),(0,f.jsx)(l.Action,{title:"Focus Description",icon:l.Icon.TextInput,onAction:()=>W("description"),shortcut:{modifiers:["ctrl"],key:"e"}}),(0,f.jsx)(l.Action,{title:"Focus Status",icon:l.Icon.Circle,onAction:()=>W("stateId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}}}),(0,f.jsx)(l.Action,{title:"Focus Priority",icon:l.Icon.LevelMeter,onAction:()=>W("priority"),shortcut:l.Keyboard.Shortcut.Common.Pin}),(0,f.jsx)(l.Action,{title:"Focus Assignee",icon:l.Icon.AddPerson,onAction:()=>W("assigneeId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}}}),N?(0,f.jsx)(l.Action,{title:"Focus Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},onAction:()=>W("estimate"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}}}):null,(0,f.jsx)(l.Action,{title:"Focus Due Date",icon:l.Icon.Calendar,onAction:()=>W("dueDate"),shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}}}),(0,f.jsx)(l.Action,{title:"Focus Labels",icon:l.Icon.Tag,onAction:()=>W("labelIds"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}}}),me?(0,f.jsx)(l.Action,{title:"Focus Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},onAction:()=>W("cycleId"),shortcut:l.Keyboard.Shortcut.Common.Copy}):null,lt?(0,f.jsx)(l.Action,{title:"Focus Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},onAction:()=>W("projectId"),shortcut:{modifiers:["ctrl","shift"],key:"p"}}):null,fs?(0,f.jsx)(l.Action,{title:"Focus Milestone",icon:{source:{light:"light/milestone.svg",dark:"dark/milestone.svg"}},onAction:()=>W("milestoneId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}):null,Ot?(0,f.jsx)(l.Action,{title:"Focus Parent Issue",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}},onAction:()=>W("parentId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}}}):null,(0,f.jsx)(l.Action,{title:"Focus Attachments",icon:l.Icon.NewDocument,onAction:()=>W("attachments"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,f.jsx)(l.Action,{title:"Focus Links",icon:l.Icon.Link,onAction:()=>W("links"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}})]})]}),isLoading:d||A||e.isLoading,children:[(o||u)&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(l.Form.Dropdown,{title:"Team",storeValue:!0,...U.teamId,...o&&{onSearchTextChange:c,isLoading:d,throttle:!0},children:a?.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:$t(m,n)},m.id))}),(0,f.jsx)(l.Form.Separator,{})]}),_&&(ye||Mi)?(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(l.Form.Dropdown,{id:"templateId",title:"Template",value:D.templateId||"",onChange:Y,isLoading:ye,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Template",value:"",icon:l.Icon.Document}),ae?.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:l.Icon.Document},m.id))]}),(0,f.jsx)(l.Form.Separator,{})]}):null,(0,f.jsx)(l.Form.TextField,{title:"Title",placeholder:"Issue title",...s==="title"?{autoFocus:!0}:{},...U.title}),(0,f.jsx)(l.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",enableMarkdown:!0,...U.description}),(0,f.jsx)(l.Form.Dropdown,{title:"Status",storeValue:!0,...U.stateId,children:Pt?Nt.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:G(m)},m.id)):null}),(0,f.jsx)(l.Form.Dropdown,{title:"Priority",storeValue:!0,...U.priority,children:p?e.priorities?.map(({priority:m,label:x})=>(0,f.jsx)(l.Form.Dropdown.Item,{title:x,value:String(m),icon:{source:ce[m]}},m)):null}),(0,f.jsxs)(l.Form.Dropdown,{title:"Assignee",storeValue:!0,...U.assigneeId,...$&&{onSearchTextChange:w,isLoading:A,throttle:!0},children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:l.Icon.Person}),T?.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:H(m)},m.id))]}),(0,f.jsx)(l.Form.TagPicker,{title:"Labels",placeholder:"Add label",...U.labelIds,children:Z?L.map(({id:m,name:x,color:he})=>(0,f.jsx)(l.Form.TagPicker.Item,{title:x,value:m,icon:{source:l.Icon.Dot,tintColor:he}},m)):null}),N?(0,f.jsxs)(l.Form.Dropdown,{title:"Estimate",...U.estimate,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),N.map(({estimate:m,label:x})=>(0,f.jsx)(l.Form.Dropdown.Item,{title:x,value:String(m),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},m))]}):null,(0,f.jsx)(l.Form.DatePicker,{title:"Due Date",type:l.Form.DatePicker.Type.Date,...U.dueDate}),me||lt||Ot?(0,f.jsx)(l.Form.Separator,{}):null,me?(0,f.jsxs)(l.Form.Dropdown,{title:"Cycle",storeValue:!0,...U.cycleId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),Pe(R).map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.title,value:m.id,icon:{source:m.icon}},m.id))]}):null,lt?(0,f.jsxs)(l.Form.Dropdown,{title:"Project",storeValue:!0,...U.projectId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),Re.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${m.name} (${m.status.name})`,value:m.id,icon:de(m)},m.id))]}):null,fs?(0,f.jsxs)(l.Form.Dropdown,{title:"Milestone",storeValue:!0,...U.milestoneId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),xe.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${m.name} (${m.targetDate||"No Target Date"})`,value:m.id,icon:Se(m)},m.id))]}):null,Ot?(0,f.jsxs)(l.Form.Dropdown,{title:"Parent",...U.parentId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),B.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${m.identifier} - ${m.title}`,value:m.id,icon:G(m.state)},m.id))]}):null,(0,f.jsx)(l.Form.Separator,{}),(0,f.jsx)(l.Form.FilePicker,{title:"Attachment",...U.attachments}),(0,f.jsx)(l.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...U.links})]})}var Di=require("@raycast/api"),Ft=require("lodash");var ot=require("react/jsx-runtime");function us({mutateList:e,issues:t,priorities:s,me:r}){if(!t||t&&t.length===0)return null;let i=(0,Ft.uniqBy)(t.map(n=>n.state),n=>n.id),c=Ce(i||[],["triage","started","unstarted","backlog","completed","canceled"]),a=(0,Ft.groupBy)(t,n=>n.state.id);return(0,ot.jsx)(ot.Fragment,{children:c.map(n=>{let o=a[n.id]?.length===1?"1 issue":`${a[n.id]?.length} issues`;return(0,ot.jsx)(Di.List.Section,{title:n.name,subtitle:o,children:a[n.id]?.map(d=>(0,ot.jsx)(yt,{issue:d,mutateList:e,priorities:s,me:r},d.id))},n.id)})})}var at=require("@raycast/api"),Ri=require("@raycast/utils"),Et=ct(require("react"));var nt=require("react/jsx-runtime");function yr({children:e}){return(0,Et.useEffect)(()=>{pi()},[]),e}var ms=class extends Et.default.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}render(){let{error:t}=this.state;if(!t)return this.props.children;if(!(t.message.includes("invalid_grant")||t.message.includes("Error while fetching tokens")||t.message.includes("Could not initialize OAuth")))throw t;return(0,nt.jsx)(at.Detail,{markdown:`# Sign In Failed

Failed to authenticate with Linear:
\`\`\`
${t.message}
\`\`\`

This can happen when the network is unreliable or the authorization code has expired. Please try signing in again.`,actions:(0,nt.jsx)(at.ActionPanel,{children:(0,nt.jsx)(at.Action,{title:"Sign in Again",onAction:async()=>{await Wt.client.removeTokens(),this.setState({error:null})}})})})}},hr=(0,Ri.withAccessToken)(Wt)(yr);function ps({children:e}){return(0,nt.jsx)(ms,{children:(0,nt.jsx)(hr,{children:e})})}var X=require("react/jsx-runtime"),gs=[{id:"assigned",title:"Assigned",icon:K.Icon.Person,emptyDescription:"There are no issues assigned to you."},{id:"created",title:"Created",icon:K.Icon.PlusCircle,emptyDescription:"There are no issues created by you."},{id:"subscribed",title:"Subscribed",icon:K.Icon.Bell,emptyDescription:"There are no issues you are subscribed to."}];function kr(){let[e,t]=(0,xi.useState)("assigned"),{issues:s,isLoadingIssues:r,mutateList:i}=ee(bs,[e]),{priorities:c,isLoadingPriorities:a}=It(),{me:n,isLoadingMe:o}=Be(),d=gs.find(({id:u})=>u===e)??gs[0];return(0,X.jsxs)(K.List,{isLoading:r||a||o,searchBarPlaceholder:"Filter by ID, title, status, assignee or priority",filtering:{keepSectionOrder:!0},searchBarAccessory:(0,X.jsx)(K.List.Dropdown,{tooltip:"Change View",value:e,onChange:u=>t(u),children:gs.map(({id:u,title:b,icon:w})=>(0,X.jsx)(K.List.Dropdown.Item,{value:u,title:b,icon:w},u))}),children:[(0,X.jsx)(K.List.EmptyView,{title:"No issues",description:d.emptyDescription,actions:(0,X.jsx)(K.ActionPanel,{children:(0,X.jsx)(K.Action.Push,{title:"Create Issue",target:(0,X.jsx)(kt,{assigneeId:e==="assigned"?n?.id:void 0,priorities:c,me:n})})})}),(0,X.jsx)(us,{mutateList:i,issues:s,priorities:c,me:n})]})}function vi(){return(0,X.jsx)(ps,{children:(0,X.jsx)(kr,{})})}
